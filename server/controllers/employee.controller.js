const Employee = require('../models/employee');

const employeeCtrl = {};

employeeCtrl.placetopay = (req, res, next) => {
    var ClientOAuth2 = require('client-oauth2');
    const axios= require('axios');
    var sf = require('node-salesforce');
    var express = require ('express'); 
    var app = express (); 
    // OAuth2 client information can be shared with multiple connections.
    //
    /*var oauth2 = new sf.OAuth2({
    clientId : '3MVG9PerJEe9i8iJajYnbsQpGoNgrqca5ODreLGwLopqYHIyEtQSBaApE9Ou.T4GK4dP0EUhEr7CPBV4uztvj',
    clientSecret : '6258796024106708386',
    redirectUri : 'https://getpostman.com/oauth2/callback'
    });

    app.get('/oauth2/auth', function(req, res) {
        res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web' }));
    });
    app.get('/oauth2/callback', function(req, res) {
        var conn = new sf.Connection({ oauth2 : oauth2 });
        var code = req.param('code');
        conn.authorize(code, function(err, userInfo) {
          if (err) { return console.error(err); }
          // Now you can get the access token, refresh token, and instance URL information.
          // Save them to establish connection next time.
          console.log(conn.accessToken);
          console.log(conn.refreshToken);
          console.log(conn.instanceUrl);
          console.log("User ID: " + userInfo.id);
          console.log("Org ID: " + userInfo.organizationId);
          // ...
        });
      });
    */
   var sf = require('node-salesforce');
    var conn = new sf.Connection({
    oauth2 : {
        // you can change loginUrl to connect to sandbox or prerelease env.
        // loginUrl : 'https://test.salesforce.com',
        clientId : '3MVG9PerJEe9i8iJajYnbsQpGoNgrqca5ODreLGwLopqYHIyEtQSBaApE9Ou.T4GK4dP0EUhEr7CPBV4uztvj',
        clientSecret : '6258796024106708386',
        redirectUri : 'https://getpostman.com/oauth2/callback'
    }
    });
    conn.login(username, password, function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);
    // logged in user property
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // ...
    });
};


employeeCtrl.getEmployees = async (req, res, next) => {

    var fecha = new Date();
    fecha = fecha.toISOString();
    var val = req.body.valor;
    console.log(val);
    const crypto = require('crypto');
    const base64 = require('base-64');
    var nonce = makeid();
    var noncebase64 = base64.encode(nonce);
    var secretkey="024h1IlD";
    const trankey = crypto.createHash('sha1').update(nonce+fecha+secretkey).digest('base64');
    
    var exp = new Date();
    var request = require('request');
    var json1 = {  
        "auth":{  
           "login":"6dd490faf9cb87a9862245da41170ff2",
           "seed":fecha,    
           "nonce":noncebase64,
           "tranKey":trankey
        },
        "buyer":{  
           "name":"John",
           "surname":"Doe",
           "email":"john.doe@example.com",
           "address":{  
              "city":"Bogota",
              "street":"Calle 14 # 13b - 03"
           }
        },
        "payment":{  
           "reference":"587548758",
           "description":"Testing payment",
           "amount":{  
              "currency":"COP",
              "total": val
           }
        },
        "expiration":new Date(exp.getTime() + (30 * 60 * 1000)),
        "returnUrl":"http://localhost:4200/#/respuesta/587548758",
        "ipAddress":"127.0.0.1",
        "userAgent":"Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/52.0.2743.116 Safari\/537.36"
     }
     return new Promise(function (resolve, reject) {
     request.post({url:'https://test.placetopay.com/redirection/api/session', form: json1},
      function(err,httpResponse,body)
        { 
            var jsonrespuesta=httpResponse.body;
            res.json(body);
            resolve();
        })
    });

}
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 32; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }

updateStatus = async (req, res, next) => {
var fecha = new Date();
fecha = fecha.toISOString();
const crypto = require('crypto');
const base64 = require('base-64');
var nonce = makeid();
var noncebase64 = base64.encode(nonce);
var secretkey = "klKJYNJ5dQr7XJjJ";
const trankey = crypto.createHash('sha1').update(nonce + fecha + secretkey).digest('base64');
var request = require('request');
var json1 = {
    "auth": {
        "login": "9bd885a2f0a6f4bb6aac98fdc178baf8",
        "seed": fecha,
        "nonce": noncebase64,
        "tranKey": trankey
    }
}
request.post({ url: 'https://test.placetopay.com/redirection/api/session/157067' , form: json1 },
    function (err, httpResponse, body) {  
        if (err) {
            res.json(err);
            console.log("error");
        }
        resolve();
        var jsonrespuesta = JSON.parse(httpResponse.body);
        console.log(httpResponse.body);
        res.json({processURL: jsonrespuesta.processUrl});

    });
}
      
employeeCtrl.createEmployee = async (req, res, next) => {
    const employee = new Employee({
        name: req.body.name,
        position: req.body.position,
        office: req.body.office,
        salary: req.body.salary
    });
    await employee.save();
    res.json({status: 'Employee created'});
};


employeeCtrl.getEmployee = async (req, res, next) => {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    res.json(employee);
};

employeeCtrl.editEmployee = async (req, res, next) => {
    const { id } = req.params;
    const employee = {
        name: req.body.name,
        position: req.body.position,
        office: req.body.office,
        salary: req.body.salary
    };
    await Employee.findByIdAndUpdate(id, {$set: employee}, {new: true});
    res.json({status: 'Employee Updated'});
};

employeeCtrl.deleteEmployee = async (req, res, next) => {
    await Employee.findByIdAndRemove(req.params.id);
    res.json({status: 'Employee Deleted'});
};

module.exports = employeeCtrl;