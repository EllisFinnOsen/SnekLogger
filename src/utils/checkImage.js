export const checkImageURL = (url) => {
  if (!url) {
    return false;
  } else {
    // Check for http, https or file protocols
    const pattern = /^(https?:\/\/|file:\/\/)/i;
    return pattern.test(url);
  }
};
