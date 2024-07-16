import { ForbiddenError } from "./Errors";
import { CustomError } from "./interfaces/CustomError";

export class ForbiddenException extends Error implements CustomError {
  public status: number;

  public code: string;

  public message: string;

  public data: Record<string, unknown> | null;

  constructor(properties?: {
    status: 403;
    code: string;
    data: Record<string, unknown> | null;
  }) {
    const {
      status = 403,
      code = ForbiddenError.code,
      data = null,
    } = properties ?? {};
    super(ForbiddenError.code);
    this.status = status;
    this.code = code;
    this.message = ForbiddenError.message;
    this.data = data;
  }
}
