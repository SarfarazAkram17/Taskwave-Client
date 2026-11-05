export const authError = (error) => {
  const map = {
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
    "auth/weak-password": "Choose a stronger password.",
    "auth/popup-closed-by-user": null,
    "auth/cancelled-popup-request": null,
    "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  if (error?.code in map) return map[error.code];
  return error?.message || "Something went wrong. Please try again.";
};
