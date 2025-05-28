const getFullImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  const correctedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${req.protocol}://${req.get("host")}${correctedPath}`;
};