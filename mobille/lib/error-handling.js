/**
 * Parses errors from Clerk or other API responses and returns a user-friendly message.
 * @param {any} error - The error object caught in the try-catch block.
 * @returns {string} - A human-readable error message.
 */
export const getUserFriendlyErrorMessage = (error) => {
  // console.log("Error caught:", JSON.stringify(error, null, 2));

  // 1. Handle Clerk API specific errors (array of errors)
  if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    const firstError = error.errors[0];
    const code = firstError.code;
    const message = firstError.message;

    switch (code) {
      case "form_identifier_exists":
        return "This email is already registered. Please sign in instead.";
      case "form_password_incorrect":
        return "The password you entered is incorrect.";
      case "form_identifier_not_found":
        return "No account found with this email. Please sign up.";
      case "form_password_length":
        return "Password must be at least 8 characters long.";
      case "form_param_format_invalid":
        return "Please enter a valid email address.";
      case "incorrect_code":
        return "The verification code is incorrect. Please try again.";
      case "verification_expired":
        return "Verification code has expired. Please request a new one.";
      case "too_many_attempts":
      case "too_many_requests":
        return "Too many attempts. Please try again later.";
      default:
        // Use the message from Clerk if it looks readable, otherwise fallback
        return message || "An unexpected validation error occurred.";
    }
  }

  // 2. Handle Cloudflare/Network/CAPTCHA styling errors
  if (error?.message) {
    if (error.message.includes("clerk-captcha") || error.message.includes("CAPTCHA")) {
      return "Unable to verify you are human. Please refresh the page/app and try again.";
    }
    if (error.message.includes("Network")) {
      return "Network error. Please check your internet connection.";
    }
  }

  // 3. Fallback for generic objects or strings
  return "Something went wrong. Please try again.";
};
