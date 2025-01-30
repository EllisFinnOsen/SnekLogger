export const checkImageURL = (url) => {
  if (!url) {
    //console.log("No URL!");
    return false;
  } else {
    const pattern = new RegExp("^https?:\\/\\/", "i");

    const result = pattern.test(url);
    //console.log("URL: " + url, "Match:", result);
    return result;
  }
};
