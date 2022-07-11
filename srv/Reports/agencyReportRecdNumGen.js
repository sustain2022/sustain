async function recordNumberGeneration(req) {
    const sub = req.data;
    var subcount = await cds.run(`SELECT max(RecordNumber) as count from SUSTAINABILITY_DB_AgencyReportHeader`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        sub.RecordNumber = ++subcount;
    }
    else {
        subcount = 0;
        sub.RecordNumber = 1;
    }

}


exports._recordNumberGeneration = recordNumberGeneration;