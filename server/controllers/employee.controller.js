const Employee = require('../models/employee');

const employeeCtrl = {};

employeeCtrl.placetopay = async (req, res, next) => {
    var request = require('request');
    request('http://www.google.com', function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
    });
};
employeeCtrl.getEmployees = async (req, res, next) => {
    var fecha = new Date();
    console.log(fecha);
    const crypto = require('crypto');
    const base64 = require('base-64');
    var nonce = makeid();
    var noncebase64 = base64.encode(nonce);
    var secretkey="024h1IlD";
    const trankey = crypto.createHash('sha1').update(nonce+fecha+secretkey).digest('base64');
    console.log(nonce);
    console.log(noncebase64);
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
              "city":"Bogot\u00e1",
              "street":"Calle 14 # 13b - 03"
           }
        },
        "payment":{  
           "reference":"587548758",
           "description":"Testing payment",
           "amount":{  
              "currency":"COP",
              "total":10000
           }
        },
        "expiration":"2018-10-21T15:20:05+00:00",
        "returnUrl":"http:\/\/example.com\/response?reference=",
        "ipAddress":"127.0.0.1",
        "userAgent":"Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/52.0.2743.116 Safari\/537.36"
     }
    
     request.post({url:'https://test.placetopay.com/redirection/api/session', form: json1},
      function(err,httpResponse,body)
        { 
            var jsonrespuesta=httpResponse.body;
            res.json();
            console.log(body);
        })

    }
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 32; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
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