export const checkImageURL = (url) => {
  if (!url) {
    ////feeding//console.log("No URL!");
    return false;
  } else {
    const pattern = new RegExp("^https?:\\/\\/", "i");

    const result = pattern.test(url);
    ////feeding//console.log("URL: " + url, "Match:", result);
    return result;
  }
};
