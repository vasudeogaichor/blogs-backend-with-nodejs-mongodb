function isStrongPassword(password) {
    // Check if the password meets the minimum length requirement
    if (password.length < 8) {
      return false;
    }
  
    // Check if the password contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }
  
    // Check if the password contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return false;
    }
  
    // Check if the password contains at least one digit
    if (!/\d/.test(password)) {
      return false;
    }
  
    // Check if the password contains at least one special character
    if (!/[@$!%*?&]/.test(password)) {
      return false;
    }
  
    return true;
  }

  module.exports = {
    isStrongPassword
  }