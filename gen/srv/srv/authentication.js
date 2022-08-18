const cds = require('@sap/cds');
module.exports = async (req,res,next) => {
  req.user = new cds.User('Dummy')
  //var user =  await cds.read(`EmployeeUser`);
  next()
}