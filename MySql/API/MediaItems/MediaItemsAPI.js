const methods = require('./Methods');

async function getMediaItems(req, res, next) {
  var mediaItems = await methods.getMediaItems(req, res, next);
  res.status(200).json(mediaItems);
}

async function addMediaItem(req, res, next) {
  var ret = await methods.addMediaToDirectory(req, res, next);
  if (ret && ret.startsWith('ERROR') === false) {
    var url = ret;
    var mediaItems = await methods.addMediaItem(req, res, next, url);
    if (mediaItems)
      await methods.addMediaCategories(req, next, mediaItems.Id);

    res.status(200).json(mediaItems);
  } else {
    res.status(450).json('Internal Server Error');
  }
}

module.exports = {
  getMediaItems,
  addMediaItem
}