async function _ARTemplateIDGen(reqData) {

    const requestedData = reqData.data;
    var TemplateID;
    var subcount = await cds.run(`SELECT MAX(CAST(REPLACE(REPLACE(TemplateID , 'TID', ''), '', '') as int)) as count from SUSTAINABILITY_DB_AgencyReportTemplate`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        TemplateID = ++subcount;
        TemplateID = TemplateID.toString();
        if (TemplateID.length === 1) {
            TemplateID = "00" + TemplateID;
        } else if (TemplateID.length === 2) {
            TemplateID = "0" + TemplateID;
        }
        requestedData.TemplateID = "TID" + TemplateID;
    }
    else {
        subcount = 0;
        requestedData.TemplateID = "TID" + "001";
    }
}
exports._ARTemplateIDGen = _ARTemplateIDGen;