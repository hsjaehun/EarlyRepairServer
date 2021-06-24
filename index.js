const express = require("express");
const app = express();
const mssql = require("mssql");
const config = require("./dbconfig");
const bodyParser = require("body-parser");
const prettyjson = require("prettyjson");

app.use(bodyParser.json());
app.listen(process.env.PORT || 1234);

app.get("/", (req, res) => {
  const sqlQuery = "SELECT * FROM dbo.location";
  mssql.connect(config, (err) => {
    if (err) console.log(err);

    var request = new mssql.Request();
    request.query(sqlQuery, (err, recordsets) => {
      if (err) console.log(err);
      res.send(recordsets);
    });
  });
});

app.post("/insert", (req, res) => {
  const {
    time,
    lat,
    lng,
    os,
    osVersion,
    companyId,
    userId,
    firstName,
    lastName,
    userType,
    technicianId,
  } = req.body;
  const sqlQuery = `INSERT dbo.location (time, lat, lng, os, osVersion, companyId, userId, firstName, lastName, userType, technicianId) VALUES ('${time}', ${lat}, ${lng}, '${os}', '${osVersion}', ${companyId}, ${userId}, '${technicianId}', '${firstName}', '${lastName}', '${userType}' )`;

  mssql.connect(config, (err) => {
    if (err) console.log(err);

    var request = new mssql.Request();
    request.query(sqlQuery, (err, recordsets) => {
      if (err)
        //console.log(err)
        res.send(err);
      res.send(JSON.stringify(recordsets));
      //  res.send(recordsets)
    });
  });
});

app.get("/WTR", (req, res) => {
  const html = `<body style="display:flex; justify-content:center;flex-direction:column;align-items:center">
      <h2>React native webview</h2>
      <h2>React native webview data transfer between webview to native</h2>
      <button style="color:green; height:100;width:300;font-size:30px" onclick="myFunction()">Send data to Native</button>
      <p id="demo"></p>
      <script>
        const data = [
          'Javascript',
          'React',
          'React Native',
          'graphql',
          'Typescript',
          'Webpack',
          'Node js',
          ];
        function myFunction() {
          window.ReactNativeWebView.postMessage(JSON.stringify(data))
        }
        var i, len, text;
        for (i = 0, len = data.length, text = ""; i < len; i++) {
          text += data[i] + "<br>";
        }
        document.getElementById("demo").innerHTML = text;
      </script>
    </body>`;

  res.send(html);
});

app.get("/RTW", (req, res) => {
  const html2 = `<body style="display:flex;justify-content:center;flex-direction:column;align-items:center">
      <h2>React native webview</h2>
      <h2>React native webview data transfer between Native to web</h2>
      <button style="color:green; height:100;width:300;font-size:30px" onclick="myFunction()">Close webview</button>
      <p id="demo"></p>
      <script>
        var newData = [];
        document.addEventListener("message", function(data) {
          newData.push(data.data)
          alert(data.data)
          var i, len, text;
          for (i = 0, len = newData.length, text = ""; i < len; i++) {
            text += newData[i] + "<br>";
          }
          document.getElementById("demo").innerHTML = text;
        });
        function myFunction() {
          window.ReactNativeWebView.postMessage('Hello')
        }
      </script>
    </body>`;
  res.send(html2);
});

app.get("/ablyPublish", (req, res) => {
  const ablyPublishHtml = `
  <!DOCTYPE html>
  <html>
      <head>
          <meta charset="utf-8" />
          <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>Ably 테스트 input</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
          <script lang="text/javascript" src="https://cdn.ably.io/lib/ably.min-1.js"></script>
          <link rel="stylesheet" href="style.css" />
      </head>
      <body>
          <div style="text-align: center; padding: 6%;">
              <div class="card text-white bg-dark mb-3 voting-card">
                <div class="card-header">Ably 실시간 통신 테스트</div>
                <div class="card-body">
                  <h5 class="card-title">점심 여론 조사</h5>
                  <p class="card-text">지금 이 밑에서 선택한 버튼들은 누르면 <a href="https://ertestwebsite.herokuapp.com/ablySubscribe" target="_blank">이 웹페이지</a>에 있는 결과값을 실시간으로 변화시켜줍니다.</p>
                      <button id="cc-btn" type="button" class="btn btn-light btn-vote-option" onclick="castVote('1')">1. 한식</button>
                      <button id="tt-btn" type="button" class="btn btn-light btn-vote-option" onclick="castVote('2')">2. 양식</button>
                      <button id="mm-btn" type="button" class="btn btn-light btn-vote-option" onclick="castVote('3')">3. 중식</button>
                      <button id="gg-btn" type="button" class="btn btn-light btn-vote-option" onclick="castVote('4')">4. 일식</button>
                </div>
              </div>
          </div>
      </body>
      <script type="text/javascript">
        const realtime = new Ably.Realtime({ key: "0BaVrg.FPCCkg:Bi_JOu2bl5MuCDZ5" });
        const myVotingChannel = realtime.channels.get("voting-channel");

        function castVote(choice) {
          myVotingChannel.publish("vote", choice, (err) => {
            console.log(choice);
          });
        }
      </script>
  </html>
    `;
  res.send(ablyPublishHtml);
});

app.get("/ablySubscribe", (req, res) => {
  const ablySubscribeHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <title>Ably 테스트 result</title>
      <script
        type="text/javascript"
        src="https://cdn.fusioncharts.com/fusioncharts/latest/fusioncharts.js"
      ></script>
      <script
        type="text/javascript"
        src="https://cdn.fusioncharts.com/fusioncharts/latest/themes/fusioncharts.theme.fusion.js"
      ></script>
      <script
        lang="text/javascript"
        src="https://cdn.ably.io/lib/ably.min-1.js"
      ></script>
    </head>
    <body>
      <div id="chart-container">FusionCharts XT will load here!</div>
    </body>
    <script type="text/javascript">
      const realtime = new Ably.Realtime({ key: "0BaVrg.FPCCkg:Bi_JOu2bl5MuCDZ5" });
      const myVotingChannel = realtime.channels.get("voting-channel");
      let choiceOne = 0, choiceTwo = 0, choiceThree = 0, choiceFour = 0;
      myVotingChannel.subscribe("vote", (msg) => {
        console.log(msg)
        switch (msg.data) {
          case "1":
            choiceOne++;
            break;
          case "2":
            choiceTwo++;
            break;
          case "3":
            choiceThree++;
            break;
          case "4":
            choiceFour++;
            break;
          default:
            console.log("something broke");
        }
        updateChartData();
      });

      function updateChartData() {
        FusionCharts.items["vote-chart"].setJSONData({
          chart: {
            caption: "점심 조사",
            subCaption: "어떤 음식을 드시고 싶습니까?",
            theme: "fusion",
          },
          data: [
            { label: "한식", value: choiceOne, },
            { label: "양식", value: choiceTwo,},
            { label: "중식", value: choiceThree,},
            { label: "일식", value: choiceFour, },
          ],
        });
      }

      // Preparing the chart data
      const chartData = [
        {label: "한식",value: choiceOne,},
        {label: "양식",value: choiceTwo,},
        {label: "중식",value: choiceThree,},
        {label: "일식",value: choiceFour,},
      ];

      // Chart Configuration
      const chartConfig = {
        type: "pie2d",
        renderAt: "chart-container",
        id: "vote-chart",
        width: "100%",
        height: "400",
        dataFormat: "json",
        dataSource: {
          chart: {
            caption: "If age is only a state of mind",
            subCaption: "Which category best describes YOUR state of mind right now?",
            theme: "fusion",
          },
          // Chart Data from Step 2
          data: chartData,
        },
      };

      FusionCharts.ready(() => {
        let fusioncharts = new FusionCharts(chartConfig);
        fusioncharts.render();
      });

    </script>
  </html>
    `;
  res.send(ablySubscribeHtml);
});
