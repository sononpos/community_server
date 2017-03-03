var express = require('express');
var request = require("request");
var cheerio = require("cheerio");

var app = express();


app.listen(process.env.PORT || 5000, function () {
  console.log('start!');
});

var community = {
  clien : {
    name : "클리앙",
    server_url : "https://communityall.herokuapp.com/clien/1",
    site_url : "http://www.clien.net/cs2/bbs/board.php?bo_table=park"
  },
  ruliweb : {
    name : "루리웹",
    server_url : "https://communityall.herokuapp.com/ruliweb/1",
    site_url : "http://bbs.ruliweb.com/best"
  },
  slr : {
    name : "SLR",
    server_url : "https://communityall.herokuapp.com/slr/1",
    site_url : "http://www.slrclub.com/bbs/zboard.php?id=hot_article"
  }
};

app.get('/', function (req, res) {
  res.send('community!');
});

// 커뮤니티 리스트 호출
app.get('/list', function(req, res) {
  res.contentType('application/json');
  res.send(JSON.stringify(community));
});

// 모든 요청
app.get('/:key/:page', function(req, res) {
  var key = req.params.key;
  var page = req.params.page;

  // 보내줄 리스트 데이터
  getListData(key, page, function(result) {
    res.send(result);
  });
});

var getListData = function(key, page, callback) {

  // 페이지가 1로 들어오면 가장 최신리스트를 가져옴
  if(page == 1) {
    recent_url = community[key].site_url;
  } else {
    recent_url = community[key].site_url + "&page="+page;
  }

  // URL 호출부
  request(recent_url, function(error, response, body) {
    var $ = cheerio.load(body);

    var result = eval(key)($, key, page, recent_url);

    callback(result);
  });
};

// 클리앙 모두의 공원
function clien($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tbody .mytr").each(function() {

    var title = $(this).find("td").eq(1).find("a").text().trim();
    var link = $(this).find("td").eq(1).find("a").attr("href").trim();
    var username = $(this).find("td").eq(2).find(".member").text().trim();
    var regdate = $(this).find("td").eq(3).find("span").attr("title").trim();
    var viewcnt = $(this).find("td").eq(4).text().trim();
    var commentcnt = $(this).find("td").eq(1).find("span").text().trim();

    list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
  });

  var next_url = community[key].site_url + "&page="+(parseInt(page)+1);

  result.push({recent_url:recent_url, next_url:next_url, list:list});

  return result;
}

// 루리웹 베스트
function ruliweb($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tbody .table_body").each(function() {

    var title = $(this).find(".subject a").text().trim();
    var link = $(this).find(".subject a").attr("href").trim();
    var username = $(this).find(".writer").text().trim();
    var regdate = $(this).find(".time").text().trim();
    var viewcnt = $(this).find(".hit").text().trim();
    var commentcnt = $(this).find(".recomd").text().trim();

    list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
  });

  var next_url = community[key].site_url + "&page="+(parseInt(page)+1);

  result.push({recent_url:recent_url, next_url:next_url, list:list});

  return result;
}

// 루리웹 베스트
function slr($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tbody tr").each(function() {

    var title = $(this).find(".sbj a").text().trim();
    var link = $(this).find(".sbj a").attr("href").trim();
    var username = $(this).find(".list_name").text().trim();
    var regdate = $(this).find(".list_date").text().trim();
    var viewcnt = $(this).find(".list_click").text().trim();
    var commentcnt = $(this).find(".sbj").text().replace($(this).find(".sbj a").text(), "").trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
  });

  var next_page_num = $(".pageN tr td").find("a").eq(9).text();
  var next_url = null;

  if(page == 1) {
    next_url = community[key].site_url + "&page=" + (parseInt(next_page_num)-1);
  } else {
    next_url = community[key].site_url + "&page=" + (parseInt(page)-1);
  }

  result.push({recent_url:recent_url, next_url:next_url, list:list});

  return result;
}
