var queries = require('./Queries');
const db = require('../../dbConfig');

function fixArrays(rows) {
  for (var i = 0; i < rows.length; i++) {
    var ti = JSON.parse(rows[i].tabsInfo);
    var t2 = '[' + ti + ']';
    rows[i].tabsInfo = JSON.parse(t2);

    rows[i].tabs = '';
    for (var j = 0; j < rows[i].tabsInfo.length; j++) {
      if (rows[i].tabsInfo) {
        if (rows[i].tabsInfo[j].tabtitle)
          rows[i].tabs += rows[i].tabsInfo[j].tabtitle + (j < rows[i].tabsInfo.length - 1 ? ',' : '');
      }
    }

    if (rows[i].comments) {
      var c1 = JSON.parse(rows[i].comments);
      var c2 = '[' + c1 + ']';
      var pageComments = JSON.parse(c2);
      pageComments.sort((a, b) => {
        let da = new Date(a.created),
          db = new Date(b.created);
        return db - da;
      });
      if (pageComments.length > 0) {
        var c = 1;
      }
      rows[i].comments = pageComments;
    }
  }
  return rows;
}
async function getPageItems(req, res, next) {

  try {
    // var y = json.parse(s);
    const [rows] = await db.query(queries.query_getpageitems(req));
    // for (var i = 0; i < rows.length; i++) {
    //   var ti = JSON.parse(rows[i].tabsInfo);
    //   var t2 = '[' + ti + ']';
    //   rows[i].tabsInfo = JSON.parse(t2);

    //   rows[i].tabs = '';
    //   for (var j = 0; j < rows[i].tabsInfo.length; j++) {
    //     if (rows[i].tabsInfo) {
    //       if (rows[i].tabsInfo[j].tabtitle)
    //         rows[i].tabs += rows[i].tabsInfo[j].tabtitle + (j < rows[i].tabsInfo.length - 1 ? ',' : '');
    //     }
    //   }

    //   if (rows[i].comments) {
    //     var c1 = JSON.parse(rows[i].comments);
    //     var c2 = '[' + c1 + ']';
    //     var pageComments = JSON.parse(c2);
    //     pageComments.sort((a, b) => {
    //       let da = new Date(a.created),
    //         db = new Date(b.created);
    //       return db - da;
    //     });
    //     if (pageComments.length > 0) {
    //       var c = 1;
    //     }
    //     rows[i].comments = pageComments;
    //   }
    // }
    fixArrays(rows);
    return rows;
  } catch (error) {
    next(error);
  }
}
async function getPageItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getpageitem(req));
    fixArrays(rows);
    return rows;
  } catch (error) {
    next(error);
  }
}
async function addPageTabs(req, res, next, pageItem) {
  try {
    await db.query(queries.query_deletepageitemtabs(pageItem));
    if (req.body && req.body.Tabs && req.body.Tabs.length > 0)
      await db.query(queries.query_addpageitemtabs(req, pageItem));
  } catch (error) {
    next(error);
  }
}
async function addPageItem(req, res, next) {

  try {
    await db.query(queries.query_addpageitem(req));
    const [rows] = await db.query(queries.query_selectlastinserteditem('pages'));
    return rows[0];
  } catch (error) {
    next(error);
  }
}
async function editPageItem(req, res, next) {

  try {
    await db.query(queries.query_editpageitem(req));
    const [rows] = await db.query(queries.query_getpageitem(req));
    return rows[0];
  } catch (error) {
    next(error);
  }
}
async function approveOrRejectComment(req, res, next) {

  try {
    await db.query(queries.query_approveorrejectcomment(req));
    const pageItem = await getPageInfo(req);
    return pageItem;
  } catch (error) {
    next(error);
  }
}
async function getPageInfo(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_getpageitem(req));
    for (var i = 0; i < rows.length; i++) {

      var ti = JSON.parse(rows[i].tabsInfo);
      var t2 = '[' + ti + ']';
      rows[i].tabsInfo = JSON.parse(t2);
      rows[i].tabs = '';
      for (var j = 0; j < rows[i].tabsInfo.length; j++) {
        if (rows[i].tabsInfo) {
          if (rows[i].tabsInfo[j].tabtitle)
            rows[i].tabs += rows[i].tabsInfo[j].tabtitle + (j < rows[i].tabsInfo.length - 1 ? ',' : '');
        }
      }

      var c1 = JSON.parse(rows[i].comments);
      var c2 = '[' + c1 + ']';
      var pageComments = JSON.parse(c2);
      pageComments.sort((a, b) => {
        let da = new Date(a.created),
          db = new Date(b.created);
        return db - da;
      });
      rows[i].comments = pageComments;
    }

    await db.query(queries.query_updatepagehit(rows[0]));
    return rows[0];
  } catch (error) {
    next(error);
  }
}
async function fixPageTitleIfIsTab(req) {
  try {
    await db.query(queries.query_fixpagetitleifistab(req));
  } catch (error) {
    next(error);
  }
}
async function deleteItem(req, res, next) {

  try {
    const [rows] = await db.query(queries.query_deleteitem(req));
    return rows;
  } catch (error) {
    next(error);
  }
}
async function addPageComment(req, res, next) {

  try {
    await db.query(queries.query_addpagecomment(req));
    const pageInfo = await getPageInfo(req, res, next);
    return pageInfo;
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPageItems,
  getPageItem,
  addPageItem,
  editPageItem,
  getPageInfo,
  addPageTabs,
  fixPageTitleIfIsTab,
  deleteItem,
  addPageComment,
  approveOrRejectComment
}