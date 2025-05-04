import { Request, Response } from 'express';
import { GetMeasuresController } from '../../../controllers/measures/get_measures.controller';
import { listMeasuresService } from '../../../services/measures/list_measures.service';
import { MeasureType } from '../../../enums/measures.enum';

jest.mock('../../../services/measures/list_measures.service');

describe('GetMeasuresController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = {
      params: {},
      query: {},
    };
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    jest.clearAllMocks();
  });

  it('should successfully fetch measures for a customer', async () => {
    const customerCode = 'CUST001';
    const mockMeasures = [
      {
        id: 'uuid1',
        customer_code: customerCode,
        measure_type: MeasureType.WATER,
        measure_value: 123.45,
        measure_datetime: new Date('2025-04-01'),
        image_url: 'http://localhost.com/images/uuid1'
      }
    ];

    mockRequest.params = { customer_code: customerCode };
    (listMeasuresService as jest.Mock).mockResolvedValue(mockMeasures);

    await GetMeasuresController(mockRequest as Request, mockResponse as Response);

    expect(listMeasuresService).toHaveBeenCalledWith(customerCode, undefined);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockMeasures);
  });

  it('should successfully fetch measures with measure_type filter', async () => {
    const customerCode = 'CUST001';
    const measureType = MeasureType.WATER;
    const mockMeasures = [
      {
        id: 'uuid1',
        customer_code: customerCode,
        measure_type: measureType,
        measure_value: 123.45,
        measure_datetime: new Date('2025-04-01'),
        image_url: 'http://localhost.com/images/uuid1'
      }
    ];

    mockRequest.params = { customer_code: customerCode };
    mockRequest.query = { measure_type: measureType };
    (listMeasuresService as jest.Mock).mockResolvedValue(mockMeasures);

    await GetMeasuresController(mockRequest as Request, mockResponse as Response);

    expect(listMeasuresService).toHaveBeenCalledWith(customerCode, measureType);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockMeasures);
  });

  it('should return 400 if customer_code is missing', async () => {
    mockRequest.params = {}; 

    await GetMeasuresController(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error_code: 'INVALID_DTA',
      error_description: 'customer_code é obrigatório',
    });
    expect(listMeasuresService).not.toHaveBeenCalled();
  });

  it('should return 400 if measure_type is invalid', async () => {
    mockRequest.params = { customer_code: 'CUST001' };
    mockRequest.query = { measure_type: 'INVALID_TYPE' };

    await GetMeasuresController(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error_code: 'INVALID_TYPE',
      error_description: 'Tipo de medição não permitida',
    });
    expect(listMeasuresService).not.toHaveBeenCalled();
  });

  it('should return 404 if service returns not found error', async () => {
    const mockError = {
      status: 404,
      error_code: 'CUSTOMER_NOT_FOUND',
      error_description: 'Cliente não encontrado',
    };

    mockRequest.params = { customer_code: 'INVALID_CUSTOMER' };
    (listMeasuresService as jest.Mock).mockRejectedValue(mockError);

    await GetMeasuresController(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({
      error_code: 'CUSTOMER_NOT_FOUND',
      error_description: 'Cliente não encontrado',
    });
  });

  it('should return 500 if an unexpected error occurs', async () => {
    mockRequest.params = { customer_code: 'CUST001' };
    (listMeasuresService as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    await GetMeasuresController(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'Erro interno do servidor'
    });
  });
});