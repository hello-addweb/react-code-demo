import { ApiCallback, ApiResponse, ErrorResponseBody } from './api.interfaces';
import { ErrorCode } from './error-codes';
import { BadRequestResult, ConfigurationErrorResult, ErrorResult, ForbiddenResult, InternalServerErrorResult, NotFoundResult } from './errors';
import { HttpStatusCode } from './http-status-codes';

/**
 * Contains helper methods to generate a HTTP response.
 */
export class ResponseBuilder {
  public static custom<T>(result: T, statusCode: number) {
    return { statusCode: statusCode, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(result) };
  }
}
