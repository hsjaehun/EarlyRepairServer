const express = require("express");
const app = express();
const mssql = require("mssql");
const config = require("./dbconfig");
const bodyParser = require("body-parser");
const prettyjson = require("prettyjson");

app.use(bodyParser.json());
app.listen(1234);

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
  const nothing;
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
