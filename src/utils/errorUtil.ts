interface ErrorDetails {
  code: string;
  message: string;
  status?: number;
  raw?: any;
}

export const getErrorMessage = (
  error: ErrorDetails,
  translate: (key: string) => string
): string => {
  switch (error.code) {
    case "UNAUTHORIZED":
      return translate("login.invalidCredentials");
    case "TIMEOUT":
      return translate("error.requestTimeout");
    case "NETWORK":
      return translate("error.network");
    case "VALIDATION_FAILED":
      return error.message;
    case "SERVER_ERROR":
      return translate("error.tryAgainLater");
    case "FORBIDDEN":
      return translate("error.noPermission");
    case "NOT_FOUND":
      return translate("error.resourceMissing");
    case "BAD_REQUEST":
      return translate("error.invalidInput");
    default:
      return error.message ?? translate("error.default");
  }
};