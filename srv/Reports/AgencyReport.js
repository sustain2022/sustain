async function _AgencyReport(req) {
    var vTemplateID = req.getUrlObject().query.split("%27")[1] || req.getUrlObject().query.split("%20")[2];
    //var filters = decodeURIComponent(decodeURI(req.getUrlObject().query));
    var filters = decodeURIComponent(decodeURI( req._.odataReq.getQueryOptions().$filter));
    var filterObj = filters.split("and");
    //var filterObj = filters.split("=").pop().split("and");

    var finalFilters = {};
    var exportID, recordNum;
    for(var filter in filterObj) {
        var tempFilter = filterObj[filter].split("eq");
        if(tempFilter[0].trim() == "RecordNumber") {
            recordNum = parseInt(tempFilter[1].replace(/['"]+/g, '').trim());
            finalFilters[tempFilter[0]] = parseInt(tempFilter[1].replace(/['"]+/g, '').trim());
        } if(tempFilter[0].trim() == "ExportID") {
            exportID = parseInt(tempFilter[1].replace(/['"]+/g, '').trim());
            finalFilters[tempFilter[0]] = parseInt(tempFilter[1].replace(/['"]+/g, '').trim());
        }else {
            finalFilters[tempFilter[0]] = tempFilter[1].replace(/['"]+/g, '').trim();
        }
        
    }
    //  var reports = await cds.run("SELECT * from SUSTAINABILITY_DB_AgencyReportHeader where TemplateID='"+ vTemplateID+"'");
    // var reports = await cds.read(`AgencyReportHeader`).where({TemplateID:{'=':vTemplateID}});
     vTemplateID = vTemplateID.replace(/['"]+/g, '');

    var reportsqry = SELECT.from('AgencyReportHeader', a => {
        a.TemplateID, a.ClientID, a.RecordNumber, a.ExportID, a.CreatedAt, a.AgencyReportDetails(b => {
            b.FieldID, b.FieldValue, b.AgencyFieldDetails(c => {
                c.FieldSRN, c.FieldName
            });
        });//.orderBy('a.RecordNumber', 'b.FieldSRN'); // check this orderby statement
    });
    
    reportsqry.SELECT.where = [{ref:["TemplateID"]}, "=", {val: vTemplateID.toString()}];
    //reportsqry.SELECT.where = [{ref:["TemplateID"]}, "=", {val: vTemplateID.toString()}, "and", {ref:["RecordNumber"]}, "=", {val: recordNum}];
    
    if(exportID) {
        reportsqry.SELECT.where.push("and", {ref:["ExportID"]}, "=", {val: exportID});
    }

    if(recordNum) {
        reportsqry.SELECT.where.push("and", {ref:["RecordNumber"]}, "=", {val: recordNum});
    }
  //  reportsqry.SELECT.where = filters.split("=").pop().replace(/eq/g,'=');
    var reports = await cds.run(reportsqry);

    var aFinalReportData = [];
    var oFinalReportData = {};

    // var repDetailsQuery = SELECT.from('AgencyReportDetails', a => {
    //     a.TemplateID, a.ClientID, a.RecordNumber, a.FieldID, a.FieldValue, a.AgencyFieldDetails(b => {
    //         b.FieldSRN, b.FieldName
    //     });//.orderBy('a.RecordNumber', 'b.FieldSRN'); // check this orderby statement
    // });

    // var agencyReportDetails = await cds.run(repDetailsQuery);
    for (let i = 0; i < reports.length; i++) {

     /*   var reportDetails = await cds.read(`AgencyReportDetails`).where({
            TemplateID: { '=': reports[i].TemplateID },
            and: { ClientID: { '=': reports[i].ClientID } },
            and: { RecordNumber: { '=': reports[i].RecordNumber } }
        }); */
        let templateID = reports[i].TemplateID || reports[i].TEMPLATEID;
        // let clientID = reports[i].ClientID || reports[i].CLIENTID;
        // let recordNum = reports[i].RecordNumber || reports[i].RECORDNUMBER;
        var reportDetails = reports[i].AgencyReportDetails;
        // agencyReportDetails.filter((item) => {
        //     return (item.TemplateID === templateID && item.ClientID === clientID && parseInt(item.RecordNumber) === recordNum)
        // });
        oFinalReportData = {};
        // oFinalReportData.SerialNo = i;
        oFinalReportData.RecordNumber = reports[i].RecordNumber || reports[i].RECORDNUMBER;
        oFinalReportData.TemplateID = templateID;
        oFinalReportData.ExportID = reports[i].ExportID;
        oFinalReportData.CreatedAt = reports[i].CreatedAt;
        for (let j = 0; j < reportDetails.length; j++) {
            try {
                var column = "Column" + reportDetails[j].AgencyFieldDetails.FieldSRN;
            } catch (error) {
                console.log(error);
                console.log(reportDetails[j]);
            }
            
            oFinalReportData[column] = reportDetails[j].FieldValue;
        }
        aFinalReportData.push(oFinalReportData);
    }

    return aFinalReportData;
}

exports._AgencyReport = _AgencyReport;