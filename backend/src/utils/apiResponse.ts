/**
 * The API envelope.
 *
 * Every response — success or failure — uses one of these two shapes, so a
 * client only ever branches on `success`.
 *
 *   success: { success: true,  message, data }
 *   failure: { success: false, error: { code, message, details? } }
 *
 * `details` carries per-field validation messages so a form can highlight the
 * exact inputs that failed. It is only ever populated for VALIDATION_ERROR.
 */

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, string>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export const ok = <T>(data: T, message = "OK"): ApiSuccess<T> => ({
  success: true,
  message,
  data,
});

export const fail = (
  code: ErrorCode,
  message: string,
  details?: Record<string, string>
): ApiFailure => ({
  success: false,
  error: {
    code,
    message,
    ...(details && Object.keys(details).length > 0 ? { details } : {}),
  },
});

/** Maps an error code to the HTTP status it should be sent with. */
export const STATUS_FOR_CODE: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};
