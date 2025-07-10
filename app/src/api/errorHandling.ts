// Helper functions for error handling
export const handleApiError = (error: any, defaultMessage: string = "An error occurred"): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return defaultMessage;
};

// Error messages for common issues
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Unauthorized. Please log in again.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Validation error. Please check your input.",
  FILE_SIZE_EXCEEDED: "File size exceeded. Maximum file size is 10MB.",
  UNSUPPORTED_FORMAT: "Unsupported file format.",
  DEFAULT: "An error occurred. Please try again.",
  MISSING_FILE: 'No file provided'
};