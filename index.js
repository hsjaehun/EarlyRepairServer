const express = require('express')
const app = express()
const mssql = require('mssql')
const config = require('./dbconfig')
const bodyParser = require('body-parser')
const prettyjson = require('prettyjson')

app.use(bodyParser.json())
app.listen(1234)

app.get('/',(req, res)=>{
  const sqlQuery = "SELECT * FROM dbo.location"
  mssql.connect(config, (err)=>{
    if(err) console.log(err)

    var request = new mssql.Request();
    request.query(sqlQuery, (err, recordsets)=>{
      if(err) console.log(err)
        res.send(recordsets)
    })
  })
})

app.post('/insert',(req, res)=>{
  const { time, lat, lng, os, osVersion, companyId, userId, firstName, lastName, userType, technicianId} = req.body;
  const sqlQuery = `INSERT dbo.location (time, lat, lng, os, osVersion, companyId, userId, firstName, lastName, userType, technicianId) VALUES ('${time}', ${lat}, ${lng}, '${os}', '${osVersion}', ${companyId}, ${userId}, '${technicianId}', '${firstName}', '${lastName}', '${userType}' )`

  mssql.connect(config, (err)=>{
    if(err) console.log(err)

    var request = new mssql.Request();
    request.query(sqlQuery, (err, recordsets)=>{
      if(err) 
        //console.log(err)
        res.send(err)
      res.send(JSON.stringify(recordsets))
      //  res.send(recordsets)
    })
  })
})

