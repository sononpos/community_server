var express = require('express');
var request = require("request");
var cheerio = require("cheerio");
var iconv  = require('iconv-lite');
var morgan = require('morgan')

var app = express();

//app.use(morgan('combined'))
app.use('/static', express.static('public'));

app.listen(process.env.PORT || 3000, function () {
  console.log('start!');
});

var community = {
  nodame : {
    name : "커뮤니티 이슈(종합)",
    site_url : "http://noda.me/pyserv.py?mode=article_api&hourWithin=6&bmf=bobaedreamBest2|clienPark|dogdripFree|eightTwoCook15|humorunivPds|mlbparkBullpen|pgr21Humor|ppomppuFreeboard|ruliwebG005|todayhumorBOB&sortKey=read",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  beobe : {
    name : "베오베(종합)",
    site_url : "http://beobe.us/",
    page_param : "",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  /*
  dailybest : {
    name : "데일리베스트(종합)",
    site_url : "http://best.mingoon.com/best/?offset=",
    page_param : "",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  */
  clien : {
    name : "클리앙(모두의공원)",
    site_url : "https://www.clien.net/service/board/park?&od=T31",
    page_param : "&po=",
    encoding : "UTF-8",
    iphone_view : "app",
    android_view : "web",
  },
  clienall : {
    name : "클리앙(공감)",
    site_url : "https://new.clien.net/service/group/board_all?&od=T33",
    page_param : "&po=",
    encoding : "UTF-8",
    iphone_view : "app",
    android_view : "web",
  },
  ruliweb : {
    name : "루리웹(NOW)",
    site_url : "http://bbs.ruliweb.com/best",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "app",
    android_view : "web",
  },
  ruliwebhit : {
    name : "루리웹(힛갤)",
    site_url : "http://bbs.ruliweb.com/best?type=hit",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "app",
    android_view : "web",
  },
  slr : {
    name : "SLR(HOT)",
    site_url : "http://www.slrclub.com/bbs/zboard.php?id=hot_article",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  slrbest : {
    name : "SLR(BEST)",
    site_url : "http://www.slrclub.com/bbs/zboard.php?id=best_article",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  bullpen : {
    name : "엠팍(불펜)",
    site_url : "http://mlbpark.donga.com/mp/b.php?b=bullpen",
    page_param : "&p=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  kbotown : {
    name : "엠팍(한야타)",
    site_url : "http://mlbpark.donga.com/mp/b.php?b=kbotown",
    page_param : "&p=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  todayhumor : {
    name : "오유(최신)",
    site_url : "http://www.todayhumor.co.kr/board/list.php?kind=total",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  todayhumorbob : {
    name : "오유(베오베)",
    site_url : "http://www.todayhumor.co.kr/board/list.php?table=bestofbest",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  bobaedream : {
    name : "보배드림",
    site_url : "http://m.bobaedream.co.kr/board/new_writing/best",
    page_param : "/",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  /*
  rgr : {
    name : "알지롱(호기심해결)",
    site_url : "http://server6.kproxy.com/servlet/redirect.srv/sruj/s13pf/p1/rgr/zboard.php?id=rgrong",
    page_param : "&page=",
    encoding : "EUC-KR",
    iphone_view : "web",
    android_view : "web",
  },
  rgrrare : {
    name : "알지롱(레어/유머)",
    site_url : "http://server6.kproxy.com/servlet/redirect.srv/sruj/s13pf/p1/rgr/zboard.php?id=rare2014",
    page_param : "&page=",
    encoding : "EUC-KR",
    iphone_view : "web",
    android_view : "web",
  },
  */
  bestizjd : {
    name : "베스티즈(게천잡담)",
    site_url : "http://bestjd.cafe24.com/zboard/zboard.php?id=bestgj",
    page_param : "&page=",
    encoding : "EUC-KR",
    iphone_view : "web",
    android_view : "web",
  },
  bestiz : {
    name : "베스티즈(게스트천국)",
    site_url : "http://besthgc.cafe24.com/zboard/zboard.php?id=ghm2b",
    page_param : "&page=",
    encoding : "EUC-KR",
    iphone_view : "web",
    android_view : "web",
  },
  humoruniv : {
    name : "웃대(최신)",
    site_url : "http://web.humoruniv.com/board/humor/list.html?table=pds",
    page_param : "&pg=",
    encoding : "EUC-KR",
    iphone_view : "app",
    android_view : "web",
  },
  humorunivbest : {
    name : "웃대(BEST)",
    site_url : "http://web.humoruniv.com/board/humor/list.html?table=pds&st=day",
    page_param : "&pg=",
    encoding : "EUC-KR",
    iphone_view : "app",
    android_view : "web",
  },
  /*
  ygosu : {
    name : "와이고수",
    site_url : "http://www.ygosu.com/community/real_article",
    page_param : "/?page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  */
  ppomppu : {
    name : "뽐뿌(유머/감동)",
    site_url : "http://www.ppomppu.co.kr/zboard/zboard.php?id=humor",
    page_param : "&page=",
    encoding : "EUC-KR",
    iphone_view : "web",
    android_view : "web",
  },
  ppomppufree : {
    name : "뽐뿌(자유게시판)",
    site_url : "http://www.ppomppu.co.kr/zboard/zboard.php?id=freeboard",
    page_param : "&page=",
    encoding : "EUC-KR",
    iphone_view : "web",
    android_view : "web",
  },
  bboom : {
    name : "네이버뿜",
    site_url : "http://m.bboom.naver.com/best/moreList.json?likeBandNo=&&viewTypeNo=2&length=100&limit=0",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  pann : {
    name : "네이트판(실시간)",
    site_url : "http://m.pann.nate.com/talk/talker",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  pannbest : {
    name : "네이트판(BEST)",
    site_url : "http://m.pann.nate.com/talk/talker?order=REC",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  dcinside : {
    name : "디씨(초개념)",
    site_url : "http://m.dcinside.com/list.php?id=superidea",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  dcinsidehit : {
    name : "디씨(HIT)",
    site_url : "http://m.dcinside.com/list.php?id=hit",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  instiz : {
    name : "인스티즈(최신)",
    site_url : "https://www.instiz.net/bbs/list.php?id=pt",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  instizhot : {
    name : "인스티즈(인기)",
    site_url : "https://www.instiz.net/bbs/list.php?id=pt&srt=3&k=&srd=1",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  inven : {
    name : "인벤",
    site_url : "http://m.inven.co.kr/board/powerbbs.php?come_idx=2097&my=chu",
    page_param : "&p=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  // soccerline : {
  //   name : "사커라인(라커룸)",
  //   site_url : "http://m.soccerline.co.kr/bbs/locker/list.html?&code=locker&keyfield=&key=&period=",
  //   page_param : "&page=",
  //   encoding : "UTF-8",
  // },
  fmkorea : {
    name : "펨코(포텐)",
    site_url : "http://m.fmkorea.com/index.php?mid=best",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  ddanzi : {
    name : "딴지(최신)",
    site_url : "http://www.ddanzi.com/index.php?mid=free",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  ddanzihot : {
    name : "딴지(HOT)",
    site_url : "http://www.ddanzi.com/index.php?mid=free&bm=hot",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  theqoosquare : {
    name : "더쿠(스퀘어)",
    site_url : "http://theqoo.net/index.php?mid=square&filter_mode=normal",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  theqoobest : {
    name : "더쿠(베스트)",
    site_url : "http://theqoo.net/index.php?mid=tbest&filter_mode=normal",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  dvdprime : {
    name : "DVD프라임(프라임차한잔)",
    site_url : "https://dvdprime.com/g2/bbs/board.php?bo_table=comm",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  dvdprimehumor : {
    name : "DVD프라임(유머)",
    site_url : "https://dvdprime.com/g2/bbs/board.php?bo_table=humor",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  dogdripuser : {
    name : "개드립(최신)",
    site_url : "http://www.dogdrip.net/index.php?mid=userdog&m=1",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  dogdrip : {
    name : "개드립(베스트)",
    site_url : "http://www.dogdrip.net/index.php?mid=dogdrip&m=1",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  /*
  games : {
    name : "게임",
    site_url : "http://4seasonpension.com:3000/list",
    page_param : "&page=",
    encoding : "UTF-8",
    iphone_view : "web",
    android_view : "web",
  },
  */
};

var bestiz_list = {
  ghm2b : {
    name : "게스트천국",
    site_url : "http://besthgc.cafe24.com/zboard/zboard.php?id=ghm2b",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  bestgj : {
    name : "게천잡담",
    site_url : "http://bestjd.cafe24.com/zboard/zboard.php?id=bestgj",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  gmsb : {
    name : "게천뮤직",
    site_url : "http://bestgm.cafe24.com/zboard/zboard.php?id=gmsb",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  sing : {
    name : "회원노래",
    site_url : "http://bestgm.cafe24.com/zboard/zboard.php?id=sing",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  jding : {
    name : "게잡직딩반",
    site_url : "http://bestjd.cafe24.com/zboard/zboard.php?id=jding",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  gjbom : {
    name : "게잡의봄",
    site_url : "http://bestjd.cafe24.com/zboard/zboard.php?id=gjbom",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  jdalk : {
    name : "게잡알콩",
    site_url : "http://bestjd.cafe24.com/zboard/zboard.php?id=jdalk",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  gjhy : {
    name : "게잡해연",
    site_url : "http://bestjd.cafe24.com/zboard/zboard.php?&id=gjhy",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  drb13 : {
    name : "드라마방",
    site_url : "http://bestizsky.cafe24.com/zboard/zboard.php?id=drb13",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  movieb : {
    name : "영화감상",
    site_url : "http://bestizsky.cafe24.com/zboard/zboard.php?id=movieb",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  gjkm : {
    name : "게잡의기묘",
    site_url : "http://bestjd.cafe24.com/zboard/zboard.php?id=gjkm",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
  gjjp : {
    name : "게잡JPStar",
    site_url : "http://bestjd.cafe24.com/zboard/zboard.php?id=gjjp",
    page_param : "&page=",
    encoding : "EUC-KR",
  },
}

app.get('/', function (req, res) {
  res.redirect('/static/mobile/index.html');
});

// 베스티즈 리스트 호출
app.get('/bestiz_list', function(req, res) {
  var comm = {};

  var index = 1;
  for(var data in bestiz_list) {
    comm[data] = {name:bestiz_list[data].name, index:index};
    index++;
  }
  res.contentType('application/json');
  res.send(JSON.stringify(comm));
});

// 커뮤니티 리스트 호출
app.get('/list', function(req, res) {
  var comm = {};

  var index = 1;
  for(var data in community) {
    //console.log(index + " : " + community[data].name);
    comm[data] = {name:community[data].name, index:index};
    index++;
  }
  res.contentType('application/json');
  res.send(JSON.stringify(comm));
});

// 커뮤니티 리스트 호출
app.get('/list_iphone', function(req, res) {

  var ver = req.query.ver;
  var comm = {};

  var index = 1;

  if(ver == "8") {
      for(var data in community) {
        if(community[data].iphone_view == "app") {
            comm[data] = {name:community[data].name, index:index, viewtype:community[data].iphone_view};
            index++;
        }
      }
  } else {
      for(var data in community) {
        comm[data] = {name:community[data].name, index:index, viewtype:"web"};
        index++;
      }
  }

  res.contentType('application/json');
  res.send(JSON.stringify(comm));
});


// 아이폰 뷰
app.get('/iphone/:key/:linkencoding', function(req, res) {
  var key = req.params.key;
  var linkencoding = req.params.linkencoding;

  var url = decodeURIComponent(linkencoding);

  /* 가자 불교로 */
  var bul_num = 1;
  var bul_min_num = 1;
  var bul_max_num = 270;

  bul_num = Math.floor(Math.random() * (bul_max_num - bul_min_num)) + bul_min_num;
  url = "http://www.sambobuddha.org/bbs/board.php?bo_table=notice&wr_id="+bul_num
  /* 가자 불교로 */

  var requestOptions  = {
    method: "GET"
    ,uri: url
    ,headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
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

      //var $ = cheerio.load(iconv.decode(strContents, community[key].encoding).toString());
      //var result = eval(key+"_view")($, key);

      /* 가자 불교로 */
      var $ = cheerio.load(iconv.decode(strContents, "EUC-KR").toString());
      result = eval("bul_view")($, key);
      /* 가자 불교로 */

      res.send(result);
    } catch(err) {
      console.log(err);
      res.send(err);
    }
  });
});

// 베스티즈 앱
app.get('/bestiz/:key/:page', function(req, res) {
  var key = req.params.key;
  var page = req.params.page;

  try {
    // 호출할 커뮤니티 URL
    if(page == 1) {
      url = bestiz_list[key].site_url;
    } else {
      url = bestiz_list[key].site_url + bestiz_list[key].page_param + page;
    }

    var requestOptions  = {
      method: "GET",
  		uri: url,
  		headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
      },
  		encoding: null,
      timeout:5000,
  	};

    // URL 호출부
    request(requestOptions, function(error, response, body) {
      try {

        if (error) {
          console.log(err);
          callback(err);
        }

        var strContents = new Buffer(body);
     	  //console.log(iconv.decode(strContents, bestiz_list[key].encoding).toString());

        var $ = cheerio.load(iconv.decode(strContents, bestiz_list[key].encoding).toString());

        var result = bestiz($, key, page, url);

        res.send(result);
      } catch(err) {
        console.log(err);
        res.send(err);
      }
    });

  } catch(err) {
    console.log(err);
    res.end(err);
  }
});

// 베스티즈 뷰
app.get('/bestizView/:ser/:id/:no', function(req, res) {
  var ser = req.params.ser;
  var id = req.params.id;
  var no = req.params.no;

  var url = "http://"+ser+".cafe24.com/zboard/view.php?id="+id+"&no="+no;

  var requestOptions  = {
    method: "GET"
    ,uri: url
    ,headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    }
    ,encoding: null
  };

  request(requestOptions, function(error, response, body) {
    try {
      var strContents = new Buffer(body);
      var $ = cheerio.load(iconv.decode(strContents, community["bestiz"].encoding).toString());

      var html = null;

      $("table").eq(3).find("tr").find("td").each(function() {

        if($(this).attr("align") == "right" && $(this).attr("width") == "100%") {
          html = $(this).html();
        }
      });

      res.send(html);
    } catch(err) {
      console.log(err);
    }
  });
});

// 모든 요청
app.get('/:key/:page', function(req, res) {
  var key = req.params.key;
  var page = req.params.page;

  try {
    // 보내줄 리스트 데이터
    getListData(key, page, function(result) {

      //리스트가 없으면 점검중으로 나오게 하자
      try {
        if(result[0].list.length == 0) {
          result = [];
          list = [];

          for(var i=0; i<20; i++) {
            list.push({title:"점검중 입니다.", link:"#", username:"관리자", regdate:"", viewcnt:"0", commentcnt:""});
          }
          result.push({next_url:"1", list:list});
          res.send(result);
        } else {
          // 이거이 정상
          res.send(result);
        }
      } catch(err) {

        result = [];
        list = [];

        for(var i=0; i<20; i++) {
          list.push({title:"점검중 입니다.", link:"#", username:"관리자", regdate:"", viewcnt:"0", commentcnt:""});
        }
        result.push({next_url:"1", list:list});
        res.send(result);
      }
    });
  } catch(err) {
    console.log(err);
    res.end(err);
  }
});

// 광고여부 체크
app.get('/check_ad', function(req, res) {
  var ipaddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (ipaddr && ipaddr.startsWith("::ffff:")) {
    ipaddr = ipaddr.replace("::ffff:", "");
  }

  var url = "http://whois.kisa.or.kr/openapi/ipascc.jsp?query="+ipaddr+"&key=2017120116222166628759&answer=json"

  var requestOptions  = {
    method: "GET"
    ,uri: url
    ,headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    }
    ,encoding: null
  };

  // URL 호출부
  request(requestOptions, function(error, response, body) {

    var ad_result = [];
    var ret = -1;
    var access = "N";

    try {
      if (error) {
        console.log(err);
        ad_result.push({ret:ret, access:access});
        res.send(ad_result);
      }

      var strContents = new Buffer(body);
      var result_json = JSON.parse(strContents.toString());
      var countryCode = result_json.whois.countryCode.toUpperCase();

      if(countryCode == "KR") {
        ret = 1;
        access = "Y";
      }

      ad_result.push({ret:ret, access:access});
      res.send(ad_result);

    } catch(err) {
      console.log(err);
      ad_result.push({ret:ret, access:access});
      res.send(ad_result);
    }

  });
});

var getListData = function(key, page, callback) {

  // 호출할 커뮤니티 URL
  if(page == 1) {
    url = community[key].site_url;
  } else {
    url = community[key].site_url + community[key].page_param + page;

    if(key == "clien" || key == "clienall") {
      url = community[key].site_url + community[key].page_param + (page-1);
    }
  }

  // 모바일로 호출인지 지정?
  var user_agent = "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36";
  var cookie = "";
  if(key == "dailybest") {
    user_agent = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Mobile Safari/537.36";
    url = community[key].site_url + (page-1);
    cookie = "hour=9; _ga=GA1.2.2127292808.1489202866; _gat=1; comm=CLN%2CTHR%2CSLR%2CPMP%2CC82%2CMLB%2CBDM%2CRLW%2CHUV%2CDNZ%2CPKZ%2CITZ%2CYGS%2CIVN%2CDCS%2CDGD%2CTQO%2CEXM%2CDPR%2CDBD%2CSCC%2CFMK";
} else if(key == "dcinside" || key == "dcinsidehit" || key == "bobaedream") {
    user_agent = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Mobile Safari/537.36";
}

  var requestOptions  = {
    method: "GET",
		uri: url,
		headers: {
      "User-Agent": user_agent,
      "Cookie": cookie,
    },
		encoding: null,
    timeout:5000,
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

// 커뮤니티 이슈
function nodame($, key, page, recent_url) {
  var result = [];
  var list = [];

  var all_text = $.text();

  var noda_split1 = all_text.split("\"title\": \"");


  // 0번째 말고 1번째부터로 하자
  for(var i=1; i<noda_split1.length; i++) {
      var noda_title = noda_split1[i].split("\",")[0];

      noda_title_replace = noda_title.replace( /\"/gi, "");
      noda_title_replace = noda_title_replace.replace( /\'/gi, "");

      all_text = all_text.replace(noda_title, noda_title_replace);
  }

  var json_data = eval(all_text);

  var nameList = {};
  nameList['bobaedreamBest2'] = {"name":"보배","color":"#0066CC"};
  nameList['clienPark'] = {"name":"클량","color":"#08298A"};
  nameList['dogdripFree'] = {"name":"갣립","color":"#364277"};
  nameList['eightTwoCook15'] = {"name":"82쿡","color":"#009900"};
  nameList['humorunivPds'] = {"name":"웃대","color":"#FE2E64"};
  nameList['mlbparkBullpen'] = {"name":"엠팍","color":"#FF6600"};
  nameList['pgr21Humor'] = {"name":"PGR","color":"#C14647"};
  nameList['ppomppuFreeboard'] = {"name":"뽐뿌","color":"#666677"};
  nameList['ruliwebG005'] = {"name":"루리","color":"#0101DF"};
  nameList['todayhumorBOB'] = {"name":"오유","color":"#0489B1"};



  for(key in json_data) {
    var title = "[" + nameList[json_data[key].siteDomain].name + "] " + json_data[key].title;
	var link = json_data[key].address;
    var username = json_data[key].writer;

    if(username.indexOf("hongboInfo") > -1) {
        username = "hotcommunity";
    }
    var regdate = json_data[key].time;
    var viewcnt = json_data[key].read;
    var commentcnt = json_data[key].replyCount;

    list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
  }

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 베오베
function beobe($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".list-group a").each(function(i) {
    if(i < 200) {
      var all_text = $(this).find(".col-xs-10").text().trim();
      var sub_text = $(this).find(".col-xs-12").eq(0).text().trim();
      var comm_name = $(this).find(".col-xs-12").eq(1).text().trim();

      var title = "[" + comm_name + "] " + all_text.replace(sub_text, "");
      var link = $(this).attr("href");
      link = getParameterByName("href", link);

      var username = "베오베";
      var regdate = sub_text.split(",")[0] + " " + sub_text.split(",")[1];
      var viewcnt = $(this).find(".text-right small").text().trim();
      var commentcnt = sub_text.split(",")[2] + "";
      commentcnt = commentcnt.replace(" 댓글:", "");


      if(title != "" && username != "" && comm_name != "") {
        list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
      }
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 커뮤니티 인기글 모음
function dailybest($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".articles li").each(function(i) {

    var comm_name = $(this).find(".label_comm").text().trim();

    var title = $(this).find(".title").text().trim();
    var rank = title.split(" ")[0];

    title = "[" + comm_name + "] " + title.replace(rank, "").trim();

    var link = $(this).find("a").attr("href") + "";
    link = link.replace("≀", "&wr_");

    if(link.indexOf("soccerline.co.kr") > 0) {
      var id = getParameterByName("uid", link);
      var code = getParameterByName("code", link);
      link = "http://m.soccerline.co.kr/bbs/"+code+"/view.html?uid=" + id;
    }

    var username = $(this).find(".source").text().trim();
    username = username.replace("|", "").trim();

    var regdate = $(this).find(".source .date").text().trim();

    var viewcomment = $(this).find(".cmt").text().trim();


    var viewcnt = viewcomment.split(" ")[1];
    var commentcnt = viewcomment.split(" ")[0];

    if(title != "" && username != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }

  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 클리앙 모두의 공원
function clien($, key, page, url) {
  var result = [];
  var list = [];

  $(".item").each(function() {

    //console.log($(this).html());

    var title = $(this).find(".list-subject").text().trim();
    var link = $(this).find(".list-subject").attr("href");

    var notice = $(this).find(".list-symph").text().trim();

    link = "https://new.clien.net" + link;

    var username = $(this).find(".list-author").text().trim();
    var regdate = $(this).find(".timestamp").text().trim();
    var viewcnt = "";
    var commentcnt = $(this).find(".badge-reply").text().trim();

    if(title != "" && notice != "공지") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 클리앙 공감게시물
function clienall($, key, page, url) {
  var result = [];
  var list = [];

  $(".item").each(function() {

    //console.log($(this).html());

    var title = $(this).find(".list-subject").text().trim();

    title = "[" + title.replace("\n", "] ");

    title = title.replace(/\n/gi, "");
    title = title.replace(/\t/gi, "");


    var link = $(this).find(".list-subject").attr("href");

    var notice = $(this).find(".list-symph").text().trim();


    link = "https://new.clien.net" + link;
    var username = $(this).find(".list-author").text().trim();
    var regdate = $(this).find(".timestamp").text().trim();
    var viewcnt = "";
    var commentcnt = $(this).find(".badge-reply").text().trim();

    if(title != "" && notice != "공지") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

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

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 루리웹 베스트(힛갤)
function ruliwebhit($, key, page, recent_url) {
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

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// SLR (HOT)
function slr($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tbody tr").each(function() {

    var title = $(this).find(".sbj a").text().trim();
    var link = $(this).find(".sbj a").attr("href").trim();
    var id = getParameterByName("no", link);
    link =  "http://m.slrclub.com/bbs/vx2.php?id=hot_article&no=" + id;
    var username = $(this).find(".list_name").text().trim();
    var regdate = $(this).find(".list_date").text().trim();
    var viewcnt = $(this).find(".list_click").text().trim();
    var commentcnt = $(this).find(".sbj").text().replace($(this).find(".sbj a").text(), "").trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_page_num = $(".pageN tr td").find("a").eq(9).text();
  var next_url = null;

  if(page == 1) {
    next_url = parseInt(next_page_num)-1;
  } else {
    next_url = parseInt(page)-1;
  }

  result.push({next_url:next_url, list:list});

  return result;
}

// SLR (BEST)
function slrbest($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tbody tr").each(function() {

    var title = $(this).find(".sbj a").text().trim();
    var link = $(this).find(".sbj a").attr("href").trim();
    var id = getParameterByName("no", link);
    link =  "http://m.slrclub.com/bbs/vx2.php?id=best_article&no=" + id;
    var username = $(this).find(".list_name").text().trim();
    var regdate = $(this).find(".list_date").text().trim();
    var viewcnt = $(this).find(".list_click").text().trim();
    var commentcnt = $(this).find(".sbj").text().replace($(this).find(".sbj a").text(), "").trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_page_num = $(".pageN tr td").find("a").eq(9).text();
  var next_url = null;

  if(page == 1) {
    next_url = parseInt(next_page_num)-1;
  } else {
    next_url = parseInt(page)-1;
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

    if(title != "" && username != "담당자" && username != "엠팍제휴팀") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }

  });

  var next_url = parseInt(page)+30;

  result.push({next_url:next_url, list:list});

  return result;
}

// 엠팍 한국야구타운
function kbotown($, key, page, recent_url) {
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

    if(title != "" && username != "담당자" && username != "엠팍제휴팀") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }

  });

  var next_url = parseInt(page)+30;

  result.push({next_url:next_url, list:list});

  return result;
}

// 오늘의 유머(최신글)
function todayhumor($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tbody tr").each(function(i) {

    var title = $(this).find(".subject a").text().trim();
    var link = $(this).find(".subject a").attr("href");
    var id = getParameterByName("no", link);
    var table = getParameterByName("table", link);
    link =  "http://m.todayhumor.co.kr/view.php?table="+table+"&no=" + id;

    var username = $(this).find(".name").text().trim();
    var regdate = $(this).find(".date").text().trim();
    var viewcnt = $(this).find(".hits").text().trim();
    var commentcnt = $(this).find(".list_memo_count_span").text().trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 오늘의 유머(베오베)
function todayhumorbob($, key, page, recent_url) {
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
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

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

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 알지롱 (호기심해결)
function rgr($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("#revolution_main_table tr").each(function(i) {

    var title = $(this).find(".title a").text().trim();
    var link = $(this).find(".title a").attr("href");
    var id = getParameterByName("no", link);
    link =  "http://te31.com/m/view.php?id=rgrong&no=" + id;

    var username = $(this).find(".list_name").text().trim();
    var regdate = $(this).find("td").eq(1).text().trim();
    var viewcnt = $(this).find("td").eq(2).text().trim();
    var commentcnt = $(this).find("td").eq(3).text().trim();

    if(title != "" && username != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 알지롱 (레어/유머)
function rgrrare($, key, page, recent_url) {
  var result = [];
  var list = [];
console.log($.html());
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
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 베스티즈 게천잡담
function bestizjd($, key, page, recent_url) {
  var result = [];
  var list = [];
  var ser;
  if(key == "bestizjd") {
    ser = "bestjd";
  } else {
    ser = (bestiz_list["key"].site_url).split(".")[0].replace("http://", "");
  }

  $("tr").each(function(i) {

    var title = $(this).find("td").eq(1).find("a").text().trim();
    var link = $(this).find("td").eq(1).find("a").attr("href");
    var id = getParameterByName("id", link);
    var no = getParameterByName("no", link);
    link =  "http://www.4seasonpension.com:3000/static/bestiz_view.html?ser="+ser+"&id="+id+"&no="+no;

    var username = $(this).find("td").eq(2).find("span").text().trim();
    var regdate = $(this).find("td").eq(3).find("span").text().trim();
    var viewcnt = $(this).find("td").eq(4).text().trim();
    var commentcnt = $(this).find(".commentnum").text().trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    if(title != "" && username != "Best" && username != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 베스티즈 게스트천국
function bestiz($, key, page, recent_url) {
  var result = [];
  var list = [];

  var ser;
  if(key == "bestiz") {
    ser = "besthgc";
  } else {
    ser = (bestiz_list["key"].site_url).split(".")[0].replace("http://", "");
  }

  $("tr").each(function(i) {

    var title = $(this).find("td").eq(1).find("a").text().trim();
    var link = $(this).find("td").eq(1).find("a").attr("href");
    var id = getParameterByName("id", link);
    var no = getParameterByName("no", link);
    link =  "http://www.4seasonpension.com:3000/static/bestiz_view.html?ser="+ser+"&id="+id+"&no="+no;

    var username = $(this).find("td").eq(2).find("span").text().trim();
    var regdate = $(this).find("td").eq(3).find("span").text().trim();
    var viewcnt = $(this).find("td").eq(4).text().trim();
    var commentcnt = $(this).find(".commentnum").text().trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    if(title != "" && username != "Best" && username != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

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
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 웃대 웃긴자료
function humorunivbest($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tr").each(function(i) {

    var title = $(this).find(".li_sbj a").text();
    title = title.substring(0, title.indexOf("\r\n\t\t\t\t"));

    var link = $(this).find(".li_sbj a").attr("href");
    var id = getParameterByName("number", link);
    link =  "http://m.humoruniv.com/board/read.html?table=pds&st=day&pg=0&number=" + id;

    var username = $(this).find(".hu_nick_txt").text().trim();
    var regdate = $(this).find(".w_date").text().trim() + " " + $(this).find(".w_time").text().trim();
    var viewcnt = $(this).find(".li_und").eq(0).text().trim();
    var commentcnt = $(this).find(".list_comment_num").text().trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    if(title != "" && username != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

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
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 뽐뿌 유머/감동
function ppomppu($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tr").each(function(i) {

    var title = $(this).find("td").eq(3).find("a").text().trim();
    var link = $(this).find("td").eq(3).find("a").attr("href");
    var id = getParameterByName("no", link);
    link = "http://m.ppomppu.co.kr/new/bbs_view.php?id=humor&no=" + id;

    var username = $(this).find("td").eq(2).text().trim();
    if(username == "") {
        username = $(this).find("td").eq(2).find("img").attr("alt");
    }
    var regdate = $(this).find("td").eq(4).text().trim();
    var viewcnt = $(this).find("td").eq(6).text().trim();
    var commentcnt = $(this).find(".list_comment2").text().trim();

    if(title != "" && username != "관리자" && viewcnt != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 뽐뿌 자유게시판
function ppomppufree($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tr").each(function(i) {

    var title = $(this).find("td").eq(2).find("a").text().trim();
    var link = $(this).find("td").eq(2).find("a").attr("href");
    var id = getParameterByName("no", link);
    link = "http://m.ppomppu.co.kr/new/bbs_view.php?id=freeboard&no=" + id;

    var username = $(this).find("td").eq(1).text().trim();
    if(username == "") {
        username = $(this).find("td").eq(1).find("img").attr("alt");
    }
    var regdate = $(this).find("td").eq(3).text().trim();
    var viewcnt = $(this).find("td").eq(5).text().trim();
    var commentcnt = $(this).find(".list_comment2").text().trim();

    if(title != "" && username != "관리자" && viewcnt != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

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
    var regdate = $(this).attr("data-sort-date").toString();
    regdate = regdate.replace("T", " ");
    regdate = regdate.replace("+0900", "");
    var viewcnt = ""; // 추천수가 존재
    var commentcnt = $(this).find(".btn_cmnt").text().replace("댓글 수", "").trim();

    if(title != "" && username != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = 1;
  // 뿜은 100개까지만 가져오자

  result.push({next_url:next_url, list:list});

  return result;
}

// 네이트 판(실시간)
function pann($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".list_type2 li").each(function(i) {

    var title = $(this).find("span.tit").text().trim();
    var link = $(this).find("a").attr("href");
    link = "http://m.pann.nate.com" + link;

    var username = ""; //$(this).find(".nick").text().trim();
    var regdate = ""; //$(this).attr("data-sort-date");
    var viewcnt = $(this).find(".sub").find("span").eq(0).text().trim();
    var commentcnt = $(this).find(".count").text().trim();
    commentcnt = commentcnt.replace("(", "");
    commentcnt = commentcnt.replace(")", "");

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 네이트 판(BEST)
function pannbest($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".list_type2 li").each(function(i) {

    var title = $(this).find("span.tit").text().trim();
    var link = $(this).find("a").attr("href");
    link = "http://m.pann.nate.com" + link;

    var username = ""; //$(this).find(".nick").text().trim();
    var regdate = ""; //$(this).attr("data-sort-date");
    var viewcnt = $(this).find(".sub").find("span").eq(0).text().trim();
    var commentcnt = $(this).find(".count").text().trim();
    commentcnt = commentcnt.replace("(", "");
    commentcnt = commentcnt.replace(")", "");

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 디씨인사이드 초개념 갤러리
function dcinside($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".article_list li").each(function(i) {

      var title = $(this).find(".title .txt").eq(0).text().trim();
      var link = $(this).find("span a").eq(0).attr("href");
      var username = $(this).find(".info span").eq(0).text().trim();
      var regdate = $(this).find(".info span").eq(2).text().trim();
      var viewcnt = $(this).find(".info span").eq(4).text().trim();
      var commentcnt = $(this).find(".title .txt_num").text().trim();
      commentcnt = commentcnt.replace("[", "");
      commentcnt = commentcnt.replace("]", "");
      viewcnt = viewcnt.replace("조회", "");

      if(title != "") {
        list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
      }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 디씨인사이드 HIT 갤러리
function dcinsidehit($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".article_list li").each(function(i) {

      var title = $(this).find(".title .txt").eq(0).text().trim();
      var link = $(this).find("span a").eq(0).attr("href");
      var username = $(this).find(".info span").eq(0).text().trim();
      var regdate = $(this).find(".info span").eq(2).text().trim();
      var viewcnt = $(this).find(".info span").eq(4).text().trim();
      var commentcnt = $(this).find(".title .txt_num").text().trim();
      commentcnt = commentcnt.replace("[", "");
      commentcnt = commentcnt.replace("]", "");
      viewcnt = viewcnt.replace("조회", "");

      if(title != "") {
        list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
      }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 인스티즈 인티포털 최신글
function instiz($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tr").each(function(i) {

    var title = $(this).find(".listsubject a").eq(0).text().trim();
    var link = $(this).find(".listsubject a").eq(0).attr("href");

    var id = getParameterByName("no", link);
    link = "http://www.instiz.net/pt?no=" + id;
    var username = $(this).find(".minitext2").text().trim();
    var regdate = $(this).find(".listno").eq(1).text().trim();
    var viewcnt = $(this).find(".listno").eq(2).text().trim();
    var commentcnt = $(this).find(".cmt").text().trim();

    if(title != "" && id != null) {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 인스티즈 인티포털 인기글
function instizhot($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("tr").each(function(i) {

    var title = $(this).find(".listsubject a").eq(0).text().trim();
    var link = $(this).find(".listsubject a").eq(0).attr("href");

    var id = getParameterByName("no", link);
    link = "http://www.instiz.net/pt?id=pt&srt=3&k=&srd=1&no=" + id;
    var username = $(this).find(".minitext2").text().trim();
    var regdate = $(this).find(".listno").eq(1).text().trim();
    var viewcnt = $(this).find(".listno").eq(2).text().trim();
    var commentcnt = $(this).find(".cmt").text().trim();

    if(title != "" && id != null) {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 인벤 오늘의 이슈 갤러리 3추
function inven($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("#boardList li").each(function(i) {
    var title = $(this).find(".title").text().trim();
    var link = $(this).find(".subject").attr("href");

    var id = getParameterByName("l", link);
    link = "http://m.inven.co.kr/board/powerbbs.php?come_idx=2097&my=chu&l=" + id;
    var username = $(this).find(".writer").text().trim();
    var regdate = $(this).find(".postdate").text().trim();
    var viewcnt = $(this).find(".hit").text().trim();
    viewcnt = viewcnt.replace("조회:", "");
    var commentcnt = $(this).find(".cmtWrapForList").text().trim();

    if(title != "" && id != null) {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 사커라인 락커룸
function soccerline($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("ul li").each(function(i) {

    if($(this).find("h3").text() != "") {
      var title = $(this).find("h3").text().trim();
      var link = $(this).find("a").attr("href");
      var id = getParameterByName("uid", link);
      link = "http://m.soccerline.co.kr/bbs/locker/view.html?uid=" + id;

      var totaldata = $(this).find("p").eq(0).text().trim();
      var username = totaldata.split(",")[0].trim();
      var regdate = "";
      var viewcnt = totaldata.split(",")[1].trim();
      viewcnt = viewcnt.replace("읽음:", "").trim();

      var commentcnt = $(this).find("p").eq(1).text().trim();

      if(title != "") {
        list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
      }
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 에펨코리아 (포텐)
function fmkorea($, key, page, recent_url) {
  var result = [];
  var list = [];

  $("div.fm_best_widget li").each(function(i) {

    var title = $(this).find(".read_more").text().trim();
    var title_comment = $(this).find(".title").text().trim();

    var link = $(this).find(".title a").attr("href");
    link = "http://m.fmkorea.com" + link;

    var username = $(this).find(".author").text().trim();
    username = username.replace("/", "").trim();
    var regdate = $(this).find(".regdate").text().trim();
    var viewcnt = "";
    var commentcnt = title_comment.replace(title, "").trim();
    commentcnt = commentcnt.replace("[", "");
    commentcnt = commentcnt.replace("]", "");

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 딴지일보 자유게시판 (최신)
function ddanzi($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".board_list tr").each(function(i) {
    if($(this).attr("class") != "notice") {
      var title = $(this).find(".title a").eq(0).text().trim();
      var link = $(this).find(".title a").eq(0).attr("href");
      link = link + "";
      //var id = getParameterByName("document_srl", link);
      var id = link.replace("http://www.ddanzi.com/free/", "");
      link = "http://www.ddanzi.com/index.php?mid=free&document_srl=" + id;

      var username = $(this).find(".author").text().trim();
      if(username.length > 8) {
        username = username.substring(0, 7) + "..";
      }
      var regdate = $(this).find(".time").text().trim();
      var viewcnt = $(this).find(".readNum").text().trim();
      var commentcnt = $(this).find(".replyNum").text().trim();
      commentcnt = commentcnt.replace("[", "");
      commentcnt = commentcnt.replace("]", "");

      if(title != "") {
        list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
      }
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 딴지일보 자유게시판 (HOT)
function ddanzihot($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".board_list tr").each(function(i) {
    if($(this).attr("class") != "notice") {
      var title = $(this).find(".title a").eq(0).text().trim();
      var link = $(this).find(".title a").eq(0).attr("href");

      var id = getParameterByName("document_srl", link);
      link = "http://www.ddanzi.com/index.php?mid=free&bm=hot&document_srl=" + id;
      var username = $(this).find(".author").text().trim();
      if(username.length > 8) {
        username = username.substring(0, 7) + "..";
      }
      var regdate = $(this).find(".time").text().trim();
      var viewcnt = $(this).find(".readNum").text().trim();
      var commentcnt = $(this).find(".replyNum").text().trim();
      commentcnt = commentcnt.replace("[", "");
      commentcnt = commentcnt.replace("]", "");

      if(title != "") {
        list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
      }
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 더쿠 (스퀘어)
function theqoosquare($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".bd_lst_wrp tbody tr").each(function(i) {

    var notice_class = $(this).attr("class");

    if(notice_class == undefined) {
      var title = $(this).find(".title a").eq(0).text().trim();

      var link = $(this).find(".title a").eq(0).attr("href");
      link = "http://theqoo.net" + link;

      var username = "";
      var regdate = $(this).find(".time").text().trim();
      var viewcnt = $(this).find(".m_no").eq(0).text().trim();
      var commentcnt = $(this).find(".replyNum").text().trim();

      if(title != "") {
        list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
      }
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 더쿠 (베스트)
function theqoobest($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".bd_lst_wrp tbody tr").each(function(i) {

    var notice_class = $(this).attr("class");

    if(notice_class == undefined) {
      var title = $(this).find(".title a").eq(0).text().trim();

      var link = $(this).find(".title a").eq(0).attr("href");
      link = "http://theqoo.net" + link;

      var username = "";
      var regdate = $(this).find(".time").text().trim();
      var viewcnt = $(this).find(".m_no").eq(0).text().trim();
      var commentcnt = $(this).find(".replyNum").text().trim();

      if(title != "") {
        list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
      }
    }

  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// DVD프라임 (프라임차한잔)
function dvdprime($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".list_table_row").each(function(i) {

    var title = $(this).find(".list_subject_a .mobile_hide span").eq(0).text().trim();
    var link = $(this).find(".list_subject_a").attr("href");
    link = link.replace("≀", "&wr_");
    var id = getParameterByName("wr_id", link);
    link = "https://dvdprime.com/g2/bbs/board.php?bo_table=comm&wr_id=" + id

    var username = $(this).find(".member").text().trim();
    var regdate = $(this).find(".list_table_dates").text().trim();
    var viewcnt = $(this).find(".list_table_col_hit").text().trim();
    var commentcnt = $(this).find(".list_comment_num_a").eq(0).text().trim();

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }

  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// DVD프라임 (못웃기면맞는다)
function dvdprimehumor($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".list_table_row").each(function(i) {

    var title = $(this).find(".list_subject_a .mobile_hide span").eq(0).text().trim();
    var link = $(this).find(".list_subject_a").attr("href");
    link = link.replace("≀", "&wr_");
    var id = getParameterByName("wr_id", link);
    link = "https://dvdprime.com/g2/bbs/board.php?bo_table=humor&wr_id=" + id

    var username = $(this).find(".member").text().trim();
    var regdate = $(this).find(".list_table_dates").text().trim();
    var viewcnt = $(this).find(".list_table_col_hit").text().trim();
    var commentcnt = $(this).find(".list_comment_num_a").eq(0).text().trim();

    if(title != "") {
      list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
    }

  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 개드립(최신)
function dogdripuser($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".lt li").each(function(i) {
    var notice = $(this).find(".notice").text().trim();

    if(notice != "공지") {
      var title = $(this).find(".title").text().trim();
      var link = $(this).find("a").attr("href");
      var username = $(this).find("span[class^=member_]").text().trim();

      var regdate = $(this).find(".time").eq(0).text().trim();
      var viewcnt = "";
      var commentcnt = $(this).find(".title em").text().trim();
      title = title.replace(commentcnt, "");
      commentcnt = commentcnt.replace("[", "");
      commentcnt = commentcnt.replace("]", "");

      if(title != "") {
        list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
      }
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 개드립(베스트)
function dogdrip($, key, page, recent_url) {
  var result = [];
  var list = [];

  $(".lt li").each(function(i) {
    var notice = $(this).find(".notice").text().trim();

    if(notice != "공지") {
      var title = $(this).find(".title").text().trim();
      var link = $(this).find("a").attr("href");
      var username = $(this).find("span[class^=member_]").text().trim();

      var regdate = $(this).find(".time").eq(0).text().trim();
      var viewcnt = "";
      var commentcnt = $(this).find(".title em").text().trim();
      title = title.replace(commentcnt, "");
      commentcnt = commentcnt.replace("[", "");
      commentcnt = commentcnt.replace("]", "");

      if(title != "") {
        list.push({title:title, link:link, username:username, regdate:regdate, viewcnt:viewcnt, commentcnt:commentcnt, linkencoding:encodeURIComponent(link)});
      }
    }
  });

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

// 게임
function games($, key, page, recent_url) {
  var result = [];
  var list = [];

  list.push({title:"fishy-rush", link:"http://m.myrealgames.com/fishy-rush/game/index.html", username:"관리자", regdate:"", viewcnt:"0", commentcnt:""});
  list.push({title:"mini-race-rush", link:"http://m.myrealgames.com/mini-race-rush/game/index.html", username:"관리자", regdate:"", viewcnt:"0", commentcnt:""});

  for(var i=0; i<20; i++) {
    list.push({title:" ", link:"#", username:"관리자", regdate:"", viewcnt:"0", commentcnt:""});
  }

  var next_url = parseInt(page)+1;

  result.push({next_url:next_url, list:list});

  return result;
}

/**********************************************************************
    뷰 페이지 구현부
***********************************************************************/


// 클리앙(모두의 공원) 뷰
function clien_view($, key) {
  var result = [];

  var title = $(".title-subject").html();
  var contents = $(".post-content").html();
  contents = contents + "<style>img {display:none;} <style>";

  result.push({title:title, contents:contents});

  return result;
}

// 클리앙(공감게시물) 뷰
function clienall_view($, key) {
  var result = [];

  var title = $(".title-subject").html();
  var contents = $(".post-content").html();
  contents = contents + "<style>img {display:none;} <style>";

  result.push({title:title, contents:contents});

  return result;
}

// 루리웹(NOW) 뷰
function ruliweb_view($, key) {
  var result = [];

  var title = $(".subject_text").html();
  var contents = $(".view_content").html();
  contents = contents + "<style>img {display:none;} <style>";

  result.push({title:title, contents:contents});

  return result;
}

// 루리웹(HIT) 뷰
function ruliwebhit_view($, key) {
  var result = [];

  var title = $(".subject_text").html();
  var contents = $(".view_content").html();
  contents = contents + "<style>img {display:none;} <style>";

  result.push({title:title, contents:contents});

  return result;
}

// 웃대 뷰
function humoruniv_view($, key) {
  var result = [];

  var title = $(".read_subject h2").html();
  var contents = $("#wrap_copy").html();
  contents = contents + "<style>img {display:none;} <style>";

  result.push({title:title, contents:contents});

  return result;
}

// 웃대 뷰
function humorunivbest_view($, key) {
  var result = [];

  var title = $(".read_subject h2").html();
  var contents = $("#wrap_copy").html();
  contents = contents + "<style>img {display:none;} <style>";

  result.push({title:title, contents:contents});

  return result;
}

// 딴지 뷰
function ddanzi_view($, key) {
  var result = [];

  var title = $(".read_header a").eq(0).html();
  var contents = $(".read_body").html();
  contents = contents + "<style>img {display:none;} <style>";

  result.push({title:title, contents:contents});

  return result;
}

// 딴지 뷰
function ddanzihot_view($, key) {
  var result = [];

  var title = $(".read_header a").eq(0).html();
  var contents = $(".read_body").html();
  contents = contents + "<style>img {display:none;} <style>";

  result.push({title:title, contents:contents});

  return result;
}

// 딴지 뷰
function bul_view($, key) {
  var result = [];

  var title = $(".mw_basic_view_subject").html();
  var contents = $(".mw_basic_view_content").html();
  contents = contents + "<style>img {display:none;} <style>";

  result.push({title:title, contents:contents});

  return result;
}
