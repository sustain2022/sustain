const cds = require('@sap/cds')
module.exports = (req,res,next) => {
  req.user = new cds.User('Dummy')
  next()
}