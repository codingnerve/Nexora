import type { ErrorCode } from "../utils/apiResponse";
import { STATUS_FOR_CODE } from "../utils/apiResponse";

export type {
  ApiFailure,
  ApiResponse,
  ApiSuccess,
  ErrorCode,
} from "../utils/apiResponse";
export { fail, ok, STATUS_FOR_CODE } from "../utils/apiResponse";

/**
 * An error that is safe to show a customer.
 *
 * Anything thrown that is *not* an `AppError` is treated as unexpected by the
 * error middleware: it is logged in full and replaced with a generic message,
 * so an internal stack trace or database detail can never reach the browser.
 */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details: Record<string, string>;
  readonly isOperational = true;

  constructor(
    code: ErrorCode,
    message: string,
    details: Record<string, string> = {}
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = STATUS_FOR_CODE[code];
    this.details = details;
    Error.captureStackTrace?.(this, AppError);
  }

  static validation(
    message = "Please check your submitted details.",
    details: Record<string, string> = {}
  ): AppError {
    return new AppError("VALIDATION_ERROR", message, details);
  }

  static badRequest(message: string): AppError {
    return new AppError("BAD_REQUEST", message);
  }

  static notFound(message = "The requested resource was not found."): AppError {
    return new AppError("NOT_FOUND", message);
  }

  static conflict(message: string): AppError {
    return new AppError("CONFLICT", message);
  }

  static rateLimited(message: string): AppError {
    return new AppError("RATE_LIMITED", message);
  }

  static internal(message: string): AppError {
    return new AppError("INTERNAL_ERROR", message);
  }
}
