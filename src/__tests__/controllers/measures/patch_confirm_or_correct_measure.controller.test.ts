import { Request, Response } from 'express';
import { PatchConfirmOrCorrectMeasureController } from '../../../controllers/measures/patch_confirm_or_correct_measure.controller';
import { confirmOrCorrectMeasureSchema } from '../../../schemas/measures/confirm_or_correct_validation.schema';
import { confirmOrCorrectMeasureService } from '../../../services/measures/confirm_or_correct_measure.service';

// Mock dependencies
jest.mock('../../../schemas/measures/confirm_or_correct_validation.schema');
jest.mock('../../../services/measures/confirm_or_correct_measure.service');

describe('PatchConfirmOrCorrectMeasureController', () => {
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
    (confirmOrCorrectMeasureSchema.parse as jest.Mock).mockImplementation((data) => data);
  });

  it('should successfully confirm a measure', async () => {
    // Arrange
    const mockRequestData = {
      measure_uuid: 'test-uuid',
      is_correct: true,
    };

    const expectedResult = {
      id: 'test-uuid',
      customer_code: 'CUST001',
      measure_type: 'WATER',
      measure_value: 123.45,
      measure_datetime: new Date('2025-04-01'),
      image_url: 'http://localhost.com/images/uuid',
      confirmed_at: new Date(),
      is_correct: true,
      corrected_value: null
    };

    mockRequest.body = mockRequestData;
    (confirmOrCorrectMeasureService as jest.Mock).mockResolvedValue(expectedResult);

    // Act
    await PatchConfirmOrCorrectMeasureController(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(confirmOrCorrectMeasureSchema.parse).toHaveBeenCalledWith(mockRequestData);
    expect(confirmOrCorrectMeasureService).toHaveBeenCalledWith(mockRequestData);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(expectedResult);
  });

  it('should successfully correct a measure', async () => {
    // Arrange
    const mockRequestData = {
      measure_uuid: 'test-uuid',
      is_correct: false,
      corrected_value: 145.67
    };

    const expectedResult = {
      id: 'test-uuid',
      customer_code: 'CUST001',
      measure_type: 'WATER',
      measure_value: 123.45,
      measure_datetime: new Date('2025-04-01'),
      image_url: 'http://localhost.com/images/uuid',
      confirmed_at: new Date(),
      is_correct: false,
      corrected_value: 145.67
    };

    mockRequest.body = mockRequestData;
    (confirmOrCorrectMeasureService as jest.Mock).mockResolvedValue(expectedResult);

    // Act
    await PatchConfirmOrCorrectMeasureController(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(confirmOrCorrectMeasureSchema.parse).toHaveBeenCalledWith(mockRequestData);
    expect(confirmOrCorrectMeasureService).toHaveBeenCalledWith(mockRequestData);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(expectedResult);
  });

  it('should return 404 when measure is not found', async () => {
    // Arrange
    const mockError = {
      status: '404'
    };

    mockRequest.body = {
      measure_uuid: 'non-existent-uuid',
      is_correct: true
    };

    (confirmOrCorrectMeasureService as jest.Mock).mockRejectedValue(mockError);

    // Act
    await PatchConfirmOrCorrectMeasureController(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({
      error_code: 'MEASURE_NOT_FOUND',
      error_description: 'Leitura não encontrada'
    });
  });

  it('should return 409 when measure is already confirmed', async () => {
    // Arrange
    const mockError = {
      status: '409'
    };

    mockRequest.body = {
      measure_uuid: 'already-confirmed-uuid',
      is_correct: true
    };

    (confirmOrCorrectMeasureService as jest.Mock).mockRejectedValue(mockError);

    // Act
    await PatchConfirmOrCorrectMeasureController(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(409);
    expect(mockJson).toHaveBeenCalledWith({
      error_code: 'CONFIRMATION_DUPLICATE',
      error_description: 'Leitura já confirmada'
    });
  });

  it('should return 400 when validation fails', async () => {
    // Arrange
    const mockZodError = {
      name: 'ZodError',
      errors: [
        { message: 'Measure UUID is required' },
        { message: 'is_correct must be a boolean' }
      ]
    };

    mockRequest.body = {
      is_correct: 'not-a-boolean'
    };

    (confirmOrCorrectMeasureSchema.parse as jest.Mock).mockImplementation(() => {
      throw mockZodError;
    });

    // Act
    await PatchConfirmOrCorrectMeasureController(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error_code: 'INVALID_DATA',
      error_description: 'Measure UUID is required, is_correct must be a boolean'
    });
  });

  it('should return 500 when an unexpected error occurs', async () => {
    // Arrange
    mockRequest.body = {
      measure_uuid: 'test-uuid',
      is_correct: true
    };

    (confirmOrCorrectMeasureService as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    // Act
    await PatchConfirmOrCorrectMeasureController(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});