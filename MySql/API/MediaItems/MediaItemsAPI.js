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
  } else 
    res.status(450).json('Internal Server Error');
}
async function editMediaItem(req, res, next) {
  var mediaItem = await methods.editMediaItem(req, res, next);
  if (mediaItem && mediaItem.affectedRows > 0) {
    var media = await methods.getMediaItem(req, res, next);
    res.status(200).json(media[0]);
  } else {
    var serverResponse = {};
    serverResponse.errormessage = 'Failed to affect database row';
    res.status(200).json(serverResponse);
  }
}
module.exports = {
  getMediaItems,
  addMediaItem,
  editMediaItem
}