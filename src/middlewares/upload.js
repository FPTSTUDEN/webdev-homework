import sharp from 'sharp';

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  const thumbnailPath = `_thumb_${req.file.path}.png`;

  try {
    await sharp(req.file.path)
      .resize(160, 160)
      .png()
      .toFile(thumbnailPath);
    // req.file.thumbnailPath = thumbnailPath; // Store the thumbnail path in the request object for later use
    next();
  } catch (error) {
    next(error);
  }
};

export {createThumbnail};