const express = require('express');
const router = express.Router();
var sf = require('node-salesforce');
    

const employee = require('../controllers/employee.controller');
const oauth2 = new sf.OAuth2({
    loginUrl : 'https://bspoke-dev-ed.my.salesforce.com',
    //clientId and Secret will be provided when you create a new connected app in your SF developer account
    clientId : '3MVG9szVa2RxsqBZjh_k.RvJXDUONto6617zQuwcaGLwh_E8jSnT2Vw8u1Trf3.gqNNP44UmnGDdDDtSQDhGs',
    clientSecret : '73500702797681914',
    //redirectUri : 'http://localhost:' + port +'/token'
    redirectUri : 'http://localhost:3000/token'
});

router.get('/', employee.getEmployees);
router.get('/placetopay', employee.placetopay);
router.post('/', employee.createEmployee);
router.get('/:id', employee.getEmployee);
router.put('/:id', employee.editEmployee);
router.delete('/:id', employee.deleteEmployee);
router.get('/oauth2/auth', function(req, res) {
    res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web' }));
});
router.get('/token', function(req, res) {

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

module.exports = router;