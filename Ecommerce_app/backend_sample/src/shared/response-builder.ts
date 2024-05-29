/**
 * Contains helper methods to generate a HTTP response.
 */
export class ResponseBuilder {
  public static custom<T>(result: T, statusCode: number) {
    return {
      statusCode: statusCode, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }, body: result
    };
  }
}