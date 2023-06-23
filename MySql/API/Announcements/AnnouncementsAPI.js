const methods = require('./Methods');

async function getAnnouncements(req, res, next) {
  var announcements = await methods.getAnnouncements(req, res, next);
  res.status(200).json(announcements);
}
async function addAnnouncement(req, res, next) {
  var announcements = await methods.addAnnouncement(req, res, next);
  res.status(200).json(announcements);
}
async function editAnnouncement(req, res, next) {
  var announcements = await methods.editAnnouncement(req, res, next);
  if (announcements && announcements.affectedRows > 0) {
    var announcement = await methods.getAnnouncement(req, res, next);

    if (announcement && announcement.length > 0) {
      await methods.addCategories(req, res, next, announcement[0].Id);
      var finalAnnouncement = await methods.getAnnouncement(req, res, next);
      res.status(200).json(finalAnnouncement[0]);
    } else {
      await methods.addCategories(req, res, next, announcement.id);
      res.status(200).json(announcement);
    }
  } else {
    var serverResponse = {};
    serverResponse.errormessage = 'Failed to affect database row';
    res.status(200).json(serverResponse);
  }
}
async function deleteAnnouncement(req, res, next) {
  var serverRespoonse = await methods.deleteAnnouncement(req, res, next);
  if (serverRespoonse.affectedRows === 1)
    res.status(200).json(req.body);
  else
    res.status(205).json(undefined);
}

module.exports = {
  getAnnouncements,
  addAnnouncement,
  editAnnouncement,
  deleteAnnouncement
}