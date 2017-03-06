var express = require('express');
var request = require("request");
var cheerio = require("cheerio");
var iconv  = require('iconv-lite');

var app = express();

app.listen(process.env.PORT || 3000, function () {
  console.log('start!');
});

var community = {
  clien : {
    name : "클리앙",
    server_url : "http://www.4seasonpension.com:3000/clien/1",
    site_url : "http://www.clien.net/cs2/bbs/board.php?bo_table=park",
    page_param : "&page=",
    encoding : "UTF-8",
  },
  ruliweb : {
    name : "루리웹",
    server_url : "http://www.4seasonpension.com:3000/ruliweb/1",
    site_url : "http://bbs.ruliweb.com/best",
    page_param : "&page=",
    encoding : "UTF-8",
  },
  slr : {
    name : "SLR",
    server_url : "http://www.4seasonpension.com:3000/slr/1",
    site_url : "http://www.slrclub.com/bbs/zboard.php?id=hot_article",
    page_param : "&page=",
    encoding : "UTF-8",
  },
  bullpen : {
    name : "불펜",
    server_url : "http://www.4seasonpension.com:3000/bullpen/1",
    site_url : "http://mlbpark.donga.com/mp/b.php?b=bullpen",
    page_param : "&p=",
    encoding : "UTF-8",
  },
  todayhumor : {
    name : "오유",
    server_url : "http://www.4seasonpension.com:3000/todayhumor/1",
    site_url : "http://www.todayhumor.co.kr/board/list.php?table=bestofbest",
    page_param : "&page=",
    encoding : "UTF-8",
  },
  bobaedream : {
    name : "보배드림",
    server_url : "http://www.4seasonpension.com:3000/bobaedream/1",
    site_url : "http://m.bobaedream.co.kr/board/new_writing/best",
    page_param : "/",
    encoding : "UTF-8",
  },
  rgr : {
    name : "알지롱",
    server_url : "http://www.4seasonpension.com:3000/rgr/1",
    site_url : "http://te31.com/rgr/zboard.php?id=rare2014",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  bestiz : {
    name : "베스티즈",
    server_url : "http://www.4seasonpension.com:3000/bestiz/1",
    site_url : "http://besthgc.cafe24.com/zboard/zboard.php?id=ghm2b",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  humoruniv : {
    name : "웃대",
    server_url : "http://www.4seasonpension.com:3000/humoruniv/1",
    site_url : "http://web.humoruniv.com/board/humor/list.html?table=pds",
    page_param : "&pg=",
    encoding : "EUC-KR",
  },
  ygosu : {
    name : "와이고수",
    server_url : "http://www.4seasonpension.com:3000/ygosu/1",
    site_url : "http://www.ygosu.com/community/real_article",
    page_param : "/?page=",
    encoding : "UTF-8",
  },
  ppomppu : {
    name : "뽐뿌",
    server_url : "http://www.4seasonpension.com:3000/ppomppu/1",
    site_url : "http://www.ppomppu.co.kr/hot.php?category=2&id=humor",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  bboom : {
    name : "네이버뿜",
    server_url : "http://www.4seasonpension.com:3000/bboom/1",
    site_url : "http://m.bboom.naver.com/best/moreList.json?likeBandNo=&&viewTypeNo=2&length=100&limit=0",
    page_param : "&page=",
    encoding : "UTF-8",
  },
  pann : {
    name : "네이트판",
    server_url : "http://www.4seasonpension.com:3000/pann/1",
    site_url : "http://m.pann.nate.com/talk/talker",
    page_param : "&page=",
    encoding : "UTF-8",
  },
  // dcinside : {
  //   name : "디씨",
  //   server_url : "http://www.4seasonpension.com:3000/dcinside/1",
  //   site_url : "http://gall.dcinside.com/board/lists/?id=superidea",
  //   page_param : "&page=",
  //   encoding : "UTF-8",
  // },
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

  try {
    // 보내줄 리스트 데이터
    getListData(key, page, function(result) {
      res.send(result);
    });
  } catch(err) {
    console.log(err);
    res.end(err);
  }
});

var getListData = function(key, page, callback) {

  // 호출할 커뮤니티 URL
  if(page == 1) {
    url = community[key].site_url;
  } else {
    url = community[key].site_url + community[key].page_param + page;
  }

  console.log(url);

  var requestOptions  = {
    method: "GET"
		,uri: url
		,headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
      //"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Mobile Safari/537.36",
    }
		,encoding: null
	};

  // URL 호출부
  request(requestOptions, function(error, response, body) {
    try {

      if (error) {
        console.log(err);
        callback(err);
      }

      var strContents = new Buffer(body);
   	  //console.log(iconv.decode(strContents, community[key].encoding).toString());

      var $ = cheerio.load(iconv.decode(strContents, community[key].encoding).toString());

      var result = eval(key)($, key, page, url);

      callback(result);
    } catch(err) {
      console.log(err);
      callback(err);
    }
  });
};

// URL 스트링 파라메터 추출
function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// 클리앙 모두의 공원
function clien($, key, page, url) {
  var result = [];
  var list = [];

  $("tbody .mytr").each(function() {
    var id = $(this).find("td").eq(0).text().trim();
    var title = $(this).find("td").eq(1).find("a").text().trim();
    var link = "http://m.clien.net/cs3/board?bo_table=park&bo_style=view&wr_id=" + id;
    var username = $(this).find("td").eq(2).find(".member").text().trim();
    var regdate = $(this).find("td").eq(3).find("span").attr("title");
    var viewcnt = $(this).find("td").eq(4).text().trim();
    var commentcnt = $(this).find("td").eq(1).find("span").text().trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
  });

  var next_url = community[key].server_url.replace("1", parseInt(page)+1);

  result.push({next_url:next_url, list:list});

  return result;
}

// 루리웹 베스트
function ruliweb($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tbody .table_body").each(function() {

    var title = $(this).find(".subject a").text().trim();
    var link = $(this).find(".subject a").attr("href").trim();
    link = link.replace("http://bbs.ruliweb.com/", "http://m.ruliweb.com/");
    var username = $(this).find(".writer").text().trim();
    var regdate = $(this).find(".time").text().trim();
    var viewcnt = $(this).find(".hit").text().trim();
    var commentcnt = $(this).find(".recomd").text().trim();


    list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
  });

  var next_url = community[key].server_url.replace("1", parseInt(page)+1);

  result.push({next_url:next_url, list:list});

  return result;
}

// SLR 베스트
function slr($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tbody tr").each(function() {

    var title = $(this).find(".sbj a").text().trim();
    var link = $(this).find(".sbj a").attr("href").trim();
    link = link.replace("/bbs/vx2.php?id=hot_article&no=", "http://m.slrclub.com/bbs/vx2.php?id=hot_article&no=");
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

  var next_url = community[key].server_url.replace("1", parseInt(page)+1);



  if(page == 1) {
    next_url = community[key].server_url.replace("1", parseInt(next_page_num)-1);
  } else {
    next_url = community[key].server_url.replace("1", parseInt(page)-1);
  }

  result.push({next_url:next_url, list:list});

  return result;
}

// 엠팍 불펜
function bullpen($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".tbl_type01 tbody tr").each(function(i) {

    var title = $(this).find("td").eq(1).find("a").attr("title");
    var link = $(this).find("td").eq(1).find("a").attr("href");
    var id = getParameterByName("id", link);
    link =  "http://mlbpark.donga.com/mp/b.php?p=1&b=bullpen&id=" + id;

    var username = $(this).find(".nick").text().trim();
    var regdate = $(this).find(".date").text().trim();
    var viewcnt = $(this).find(".viewV").text().trim();
    var commentcnt = $(this).find(".replycnt").text().trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    if(username != "담당자") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
    }

  });

  var next_url = community[key].server_url.replace("1", parseInt(page)+30);

  result.push({next_url:next_url, list:list});

  return result;
}

// 오늘의 유머 베오베
function todayhumor($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tbody tr").each(function(i) {

    var title = $(this).find(".subject a").text().trim();
    var link = $(this).find(".subject a").attr("href");
    var id = getParameterByName("no", link);
    link =  "http://m.todayhumor.co.kr/view.php?table=bestofbest&no=" + id;

    var username = $(this).find(".name").text().trim();
    var regdate = $(this).find(".date").text().trim();
    var viewcnt = $(this).find(".hits").text().trim();
    var commentcnt = $(this).find(".list_memo_count_span").text().trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
    }
  });

  var next_url = community[key].server_url.replace("1", parseInt(page)+1);

  result.push({next_url:next_url, list:list});

  return result;
}

// 보배드림 베스트글
function bobaedream($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".content .rank li").each(function(i) {

    var title = $(this).find(".txt .cont").text().trim();
    var link = $(this).find(".info a").attr("href");
    link =  "http://m.bobaedream.co.kr" + link;

    var username = $(this).find(".txt2 span").eq(0).text().trim();
    var regdate = $(this).find(".txt2 span").eq(1).text().trim();
    var viewcnt = $(this).find(".txt2 span").eq(2).text().trim();
    viewcnt = viewcnt.replace("조회", "").trim();
    var commentcnt = $(this).find(".txt5 .num").text().trim();

    list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});

  });

  var next_url = community[key].server_url.replace("1", parseInt(page)+1);

  result.push({next_url:next_url, list:list});

  return result;
}

// 알지롱 레어 유머
function rgr($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("#revolution_main_table tr").each(function(i) {

    var title = $(this).find(".title a").text().trim();
    var link = $(this).find(".title a").attr("href");
    var id = getParameterByName("no", link);
    link =  "http://te31.com/m/view.php?id=rare2014&no=" + id;

    var username = $(this).find(".list_name").text().trim();
    var regdate = $(this).find("td").eq(1).text().trim();
    var viewcnt = $(this).find("td").eq(2).text().trim();
    var commentcnt = $(this).find("td").eq(3).text().trim();

    if(title != "" && username != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
    }
  });

  var next_url = community[key].server_url.replace("1", parseInt(page)+1);

  result.push({next_url:next_url, list:list});

  return result;
}

// 베스티즈 게스트천국
function bestiz($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tr").each(function(i) {

    var title = $(this).find("td").eq(1).find("a").text().trim();
    var link = $(this).find("td").eq(1).find("a").attr("href");
    var id = getParameterByName("no", link);
    link =  "http://besthgc.cafe24.com/zboard/view.php?id=ghm2b&no=" + id;

    var username = $(this).find("td").eq(2).find("span").text().trim();
    var regdate = $(this).find("td").eq(3).find("span").text().trim();
    var viewcnt = $(this).find("td").eq(4).text().trim();
    var commentcnt = $(this).find(".commentnum").text().trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    if(title != "" && username != "Best" && username != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
    }
  });

  var next_url = community[key].server_url.replace("1", parseInt(page)+1);

  result.push({next_url:next_url, list:list});

  return result;
}

// 웃대 웃긴자료
function humoruniv($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tr").each(function(i) {

    var title = $(this).find(".li_sbj a").text();
    title = title.substring(0, title.indexOf("\r\n\t\t\t\t"));

    var link = $(this).find(".li_sbj a").attr("href");
    var id = getParameterByName("number", link);
    link =  "http://m.humoruniv.com/board/read.html?table=pds&pg=0&number=" + id;

    var username = $(this).find(".hu_nick_txt").text().trim();
    var regdate = $(this).find(".w_date").text().trim() + " " + $(this).find(".w_time").text().trim();
    var viewcnt = $(this).find(".li_und").eq(0).text().trim();
    var commentcnt = $(this).find(".list_comment_num").text().trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    if(title != "" && username != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
    }
  });

  var next_url = community[key].server_url.replace("1", parseInt(page)+1);

  result.push({next_url:next_url, list:list});

  return result;
}

// 와이고수 실시간 인기게시물
function ygosu($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".bd_list tbody tr").each(function(i) {

    var title = $(this).find(".tit a").text().trim();
    var link = $(this).find(".tit a").attr("href");
    var category = link.replace("http://www.ygosu.com/community/real_article/", "").split("/")[0];
    var id = link.replace("http://www.ygosu.com/community/real_article/", "").split("/")[1];
    link = "http://m.ygosu.com/board/?bid="+category+"&idx="+id+"&m3=real_article&frombest=Y&page=";

    var username = $(this).find(".name a").text().trim();
    var regdate = $(this).find(".date").text().trim() + " " + $(this).find(".w_time").text().trim();
    var viewcnt = $(this).find(".read").text().trim();
    var commentcnt = $(this).find(".tit span strong").text().trim();

    if(title != "" && username != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
    }
  });

  var next_url = community[key].server_url.replace("1", parseInt(page)+1);

  result.push({next_url:next_url, list:list});

  return result;
}

// 뽐뿌 유저 HOT게시글
function ppomppu($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tr").each(function(i) {

    var title = $(this).find("td").eq(3).find("a").text().trim();
    var link = $(this).find("td").eq(3).find("a").attr("href");
    var id = getParameterByName("no", link);
    link = "http://m.ppomppu.co.kr/new/bbs_view.php?id=humor&no=" + id;

    var username = $(this).find("td").eq(1).text().trim();
    var regdate = $(this).find("td").eq(4).text().trim();
    var viewcnt = ""; // 추천수가 존재
    var commentcnt = $(this).find(".list_comment2").text().trim();

    if(title != "" && username != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
    }
  });

  var next_url = community[key].server_url.replace("1", parseInt(page)+1);

  result.push({next_url:next_url, list:list});

  return result;
}

// 네이버 뿜
function bboom($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("li").each(function(i) {

    var title = $(this).find("strong.tit").text().trim();
    var link = $(this).find("td").eq(3).find("a").attr("href");
    var id = $(this).attr("data-post-no");
    link = "http://m.bboom.naver.com/best/get.nhn?boardNo=9&entrance=&postNo=" + id;

    var username = $(this).find(".nick").text().trim();
    var regdate = $(this).attr("data-sort-date");
    var viewcnt = ""; // 추천수가 존재
    var commentcnt = $(this).find(".btn_cmnt").text().replace("댓글 수", "").trim();

    if(title != "" && username != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
    }
  });

  var next_url = "" //community[key].server_url.replace("1", parseInt(page)+1);
  // 뿜은 100개까지만 가져오자

  result.push({next_url:next_url, list:list});

  return result;
}

// 네이트 판
function pann($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".list_type2 li").each(function(i) {

    var title = $(this).find("span.tit").text().trim();
    var link = $(this).find("a").attr("href");
    link = "http://m.pann.nate.com" + link;

    var username = "" //$(this).find(".nick").text().trim();
    var regdate = "" //$(this).attr("data-sort-date");
    var viewcnt = $(this).find(".sub").find("span").eq(0).text().trim();
    var commentcnt = $(this).find(".count").text().trim();
    commentcnt = commentcnt.replace("(", "");
    commentcnt = commentcnt.replace(")", "");

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
    }
  });

  var next_url = community[key].server_url.replace("1", parseInt(page)+1);

  result.push({next_url:next_url, list:list});

  return result;
}

// 디씨인사이드 초개념 갤러리
function dcinside($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".list_tbody tr").each(function(i) {

    var title = $(this).find(".t_subject a").eq(0).text().trim();
    var link = $(this).find(".t_subject a").attr("href");
    var id = getParameterByName("no", link);
    link = "http://m.dcinside.com/view.php?id=superidea&no=101298" + id;

    var username = $(this).find(".user_nick_nm").text().trim();
    var regdate = $(this).attr(".t_date");
    var viewcnt = $(this).find(".t_hits").eq(0).text().trim();
    var commentcnt = $(this).find(".t_subject a em").text().trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt});
    }
  });

  var next_url = community[key].server_url.replace("1", parseInt(page)+1);

  result.push({next_url:next_url, list:list});

  return result;
}
