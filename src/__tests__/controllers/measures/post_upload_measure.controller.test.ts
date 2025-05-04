import { Request, Response } from 'express';
import { PostUploadMeasureController } from '../../../controllers/measures/post_upload_measure.controller';
import { createMeasureService } from '../../../services/measures/create_measure.service';
import { uploadMeasureValidationSchema } from '../../../schemas/measures/upload_measure_validation.schema';

// Mock dependencies
jest.mock('../../../services/measures/create_measure.service');
jest.mock('../../../schemas/measures/upload_measure_validation.schema');

describe('PostUploadMeasureController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    // Reset all mocks
    jest.clearAllMocks();
    
    // Default mock implementation for schema validation
    (uploadMeasureValidationSchema.parse as jest.Mock).mockImplementation((data) => data);
  });

  it('should successfully process a valid measure upload', async () => {
    // Arrange
    const mockRequestData = {
      image: 'data:image/png;base64,abc123',
      customer_code: 'CUST001',
      measure_datetime: '2025-04-01T12:00:00Z',
      measure_type: 'WATER',
    };

    const expectedResult = {
      image_url: 'http://localhost.com/images/uuid',
      measure_value: 123.45,
      measure_uuid: 'test-uuid',
    };

    mockRequest.body = mockRequestData;
    (createMeasureService as jest.Mock).mockResolvedValue(expectedResult);

    // Act
    await PostUploadMeasureController(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(uploadMeasureValidationSchema.parse).toHaveBeenCalledWith(mockRequestData);
    expect(createMeasureService).toHaveBeenCalledWith(mockRequestData);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(expectedResult);
  });

  it('should return 409 error when trying to upload duplicate measure', async () => {
    // Arrange
    const mockError = {
      status: 409,
      error_code: 'DOUBLE_REPORT',
      error_description: 'Leitura do mês já realizada',
    };

    mockRequest.body = {
      image: 'data:image/png;base64,abc123',
      customer_code: 'CUST001',
      measure_datetime: '2025-04-01T12:00:00Z',
      measure_type: 'WATER',
    };

    (createMeasureService as jest.Mock).mockRejectedValue(mockError);

    // Act
    await PostUploadMeasureController(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(409);
    expect(mockJson).toHaveBeenCalledWith({
      error_code: 'DOUBLE_REPORT',
      error_description: 'Leitura do mês já realizada',
    });
  });

  it('should return 400 error when validation fails', async () => {
    // Arrange
    const mockZodError = {
      name: 'ZodError',
      errors: [
        { message: 'Invalid base64 image' },
        { message: 'Customer code is required' }
      ],
    };

    mockRequest.body = {
      image: 'invalid-image',
      measure_type: 'WATER',
    };

    (uploadMeasureValidationSchema.parse as jest.Mock).mockImplementation(() => {
      throw mockZodError;
    });

    // Act
    await PostUploadMeasureController(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error_code: 'INVALID_DATA',
      error_description: 'Invalid base64 image, Customer code is required',
    });
  });

  it('should return 500 error when an unexpected error occurs', async () => {
    // Arrange
    mockRequest.body = {
      image: 'data:image/png;base64,abc123',
      customer_code: 'CUST001',
      measure_datetime: '2025-04-01T12:00:00Z',
      measure_type: 'WATER',
    };

    (createMeasureService as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    // Act
    await PostUploadMeasureController(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});