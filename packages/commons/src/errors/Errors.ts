export const ValidationError = {
  message: "Parameters sent are invalid",
  code: "VALIDATION_ERROR_400",
};

export const UnauthorizedError = {
  message: "Unauthorized",
  code: "UNAUTHORIZED_ERROR_401",
};

export const ForbiddenError = {
  message: "You are not allowed to perform this action",
  code: "FORBIDDEN_ERROR_403",
};

export const ResourceNotFoundError = {
  message: "Resource Not Found",
  code: "RESOURCE_NOT_FOUND_404",
};

export const NotNullError = {
  message: "Columns {{columns}} of table {{table}} should not be null",
  code: "NOT_NULL_ERROR_400",
};

export const InternalServerError = {
  message: "Internal Server Error",
  code: "INTERNAL_SERVER_ERROR_500",
};

export const UniqueViolatedError = {
  message: "Unique violation {{constraint}} on table {{table}} violated. Columns involved {{columns}}",
  code: "UNIQUE_VIOLATION_ERROR_400",
};

export const EncryptionError = ValidationError;
