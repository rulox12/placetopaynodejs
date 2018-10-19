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
    var request = require('request');
    var json1 = {"auth":{"login":"6dd490faf9cb87a9862245da41170ff2","seed":"2018-10-19T03:38:46+00:00","nonce":"OGFhN2VlMTk2Mjk4ZjA1M2NjN2RjOWE3YTE4MDU0ZTY=","tranKey":"UEye0xxHYsS\/wJ0krwbonZrJoR8="},"buyer":{"name":"John","surname":"Doe","email":"john.doe@example.com","address":{"city":"Bogot\u00e1","street":"Calle 14 # 13b - 03"}},"payment":{"reference":"587548758","description":"Testing payment","amount":{"currency":"COP","total":10000}},"expiration":"2018-10-21T03:38:46+00:00","returnUrl":"http:\/\/example.com\/response?reference=","ipAddress":"127.0.0.1","userAgent":"Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/52.0.2743.116 Safari\/537.36"}
     request.post('https://test.placetopay.com/redirection/api/session', {"auth":{"login":"6dd490faf9cb87a9862245da41170ff2","seed":"2018-10-19T03:38:46+00:00","nonce":"OGFhN2VlMTk2Mjk4ZjA1M2NjN2RjOWE3YTE4MDU0ZTY=","tranKey":"UEye0xxHYsS\/wJ0krwbonZrJoR8="},"buyer":{"name":"John","surname":"Doe","email":"john.doe@example.com","address":{"city":"Bogot\u00e1","street":"Calle 14 # 13b - 03"}},"payment":{"reference":"587548758","description":"Testing payment","amount":{"currency":"COP","total":10000}},"expiration":"2018-10-21T03:38:46+00:00","returnUrl":"http:\/\/example.com\/response?reference=","ipAddress":"127.0.0.1","userAgent":"Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/52.0.2743.116 Safari\/537.36"}
    , function (err, res1, body) {

     res.json(res1);
     console.log(body);
   })


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