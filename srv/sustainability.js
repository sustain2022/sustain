const cds = require('@sap/cds');
const { _goalBuffer } = require("./goalBuffer");

const { _goalCompletionCalculation } = require("./goalCompletionCalculation");
const { _AgencyReport } = require("./Reports/AgencyReport");
const { _goalStatusReport } = require("./Reports/goalStatusReport");
const { _recordNumberGeneration } = require("./Reports/agencyReportRecdNumGen");
const { _ARTemplateIDGen } = require("./Reports/ARTemplateIDGen");
const { _orgStruc } = require("./orgStruc/orgStructure");

const { _roleMasterIDGen } = require("./IDGeneration/roleMasterIDGen");
const { _rolePermission } = require("./IDGeneration/rolePermissionIDGen");

module.exports = cds.service.impl(
    srv => {
        srv.before('CREATE', 'GoalHeader', generateGoalID);
        //  srv.before('CREATE', 'GoalDetails',generateGoalID generateGoalID);
        // srv.before('READ', 'GoalHeader', _goalHeaderRead);
        srv.after('READ', 'GoalHeader', _goalCompletionCalculation);
        // srv.on('CREATE', 'GoalHeader', saveGoals);
        srv.after('READ', 'EmployeeGoal', goalEmpTargetAchievedCal);
        srv.after('READ', 'SupplierGoal', goalSupTargetAchievedCal);
        srv.before('CREATE', 'SupplierGoal', generateSupplierGoalAssgn);

        srv.before('CREATE', 'DepartmentGoal', generateDepartmentGoalAssgn);
      //  srv.after('READ', 'DepartmentGoal', goalDepTargetAchievedCal);

        srv.before('CREATE', 'EmployeeGoal', generateEmployeeGoalAssgn);
        srv.before('CREATE', 'EmployeeUser', generateEmployeeID);
        srv.before('CREATE', 'SupplierHeader', generateSupplierID);
        srv.before('CREATE', 'DepartmentHeader', generateDepartmentID);
        srv.before('CREATE', 'TeamHeader', generateTeamID);

        srv.on('READ', 'AgencyReport', _AgencyReport);

        srv.before('CREATE', 'SupplierGoalUpdate', generateSupGoalUpdateSRN);
        srv.before('CREATE', 'EmployeeGoalUpdate', generateEmployeeGoalUpdateSRN);

        //Reports
        srv.on('READ', 'GoalStatusRep', _goalStatusReport);
        srv.before('CREATE', 'AgencyReportHeader', _exportIDGeneration);
        srv.before('CREATE', 'AgencyReportTemplate', _ARTemplateIDGen);

        //org structure
        srv.on('READ', 'orgChart', _orgStruc);

        //role management
        srv.before('CREATE', 'RoleMaster', _roleMasterIDGen);
        srv.before('CREATE', 'RolePermission', _rolePermission);
    }
)

/*async function saveGoals(req, res) {
    const data = req;
}*/
async function _exportIDGeneration(req) {
    const sub = req.data;
    var subcount = await cds.run(`SELECT max(ExportID) as count from SUSTAINABILITY_DB_AgencyReportHeader`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        sub.ExportID = ++subcount;
    }
    else {
        subcount = 0;
        sub.ExportID = 1;
    }
}

async function generateGoalID(req) {
    const sub = req.data;
    var subcount = await cds.run(`SELECT max(GoalID) as count from SUSTAINABILITY_DB_GOALHEADER`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        sub.GoalID = ++subcount;
    }
    else {
        subcount = 0;
        sub.GoalID = 1;
    }

}

//Employee goal target achieved calculation
async function goalEmpTargetAchievedCal(requestedData) {

    var EmployeeUpdatedData = await cds.read(`EmployeeGoal_Update`);//.where({GoalID: {'=': goalID}, and:{ ClientID: {'=': clientID }}});
    if (Array.isArray(requestedData)) {
        for (requestedDataIndex in requestedData) {
            let clientID = requestedData[requestedDataIndex].ClientID;
            let goalID = requestedData[requestedDataIndex].GoalID;
            let empID = requestedData[requestedDataIndex].EmployeeID;
            let filteredEmpUpdatedData = EmployeeUpdatedData.filter((item) => { return (item.GoalID == goalID && item.ClientID == clientID && item.EmployeeID == empID) });
            let targetAch = filteredEmpUpdatedData.reduce((total, currElement) => total + parseInt(currElement.TargetAchieved), 0);

            requestedData[requestedDataIndex].TargetAchieved = targetAch;
        }
    } else {
        let clientID = requestedData.ClientID;
        let goalID = requestedData.GoalID;
        let empID = requestedData[requestedDataIndex].EmployeeID;
        let filteredEmpUpdatedData = EmployeeUpdatedData.filter((item) => { return (item.GoalID == goalID && item.ClientID == clientID && item.EmployeeID == empID) });
        let targetAch = filteredEmpUpdatedData.reduce((total, currElement) => total + parseInt(currElement.TargetAchieved), 0);

        requestedData.TargetAchieved = targetAch;
    }

}

//Supplier goal target achieved calculation
async function goalSupTargetAchievedCal(requestedData) {

    var SupplierUpdatedData = await cds.read(`SupplierGoal_Update`);//.where({GoalID: {'=': goalID}, and:{ ClientID: {'=': clientID }}});
    if (Array.isArray(requestedData)) {
        for (requestedDataIndex in requestedData) {
            let clientID = requestedData[requestedDataIndex].ClientID;
            let goalID = requestedData[requestedDataIndex].GoalID;
            let supID = requestedData[requestedDataIndex].SupplierID;
            let filteredEmpUpdatedData = SupplierUpdatedData.filter((item) => { return (item.GoalID == goalID && item.ClientID == clientID && item.SupplierID == supID) });
            let targetAch = filteredEmpUpdatedData.reduce((total, currElement) => total + parseInt(currElement.TargetAchieved), 0);

            requestedData[requestedDataIndex].TargetAchieved = targetAch;
        }
    } else {
        let clientID = requestedData.ClientID;
        let goalID = requestedData.GoalID;
        let supID = requestedData[requestedDataIndex].SupplierID;
        let filteredEmpUpdatedData = SupplierUpdatedData.filter((item) => { return (item.GoalID == goalID && item.ClientID == clientID && item.SupplierID == supID) });
        let targetAch = filteredEmpUpdatedData.reduce((total, currElement) => total + parseInt(currElement.TargetAchieved), 0);

        requestedData.TargetAchieved = targetAch;
    }

}

async function goalDepTargetAchievedCal(requestedData) {
    var depID = requestedData[0].DepartmentID;
    var SupplierUpdatedData = await cds.read(`SupplierGoal_Update`); //.where({GoalID: {'=': goalID}, and:{ ClientID: {'=': clientID }}});
    var EmployeeUpdatedData = await cds.read(`EmployeeGoal_Update`);//.where({GoalID: {'=': goalID}, and:{ ClientID: {'=': clientID }}});
    
}

async function generateSupplierGoalAssgn(requestData) {
    const sub = requestData.data;
    var subcount = await cds.run(`SELECT max(AssignmentID) as count from SUSTAINABILITY_DB_SupplierGoal`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        sub.AssignmentID = ++subcount;
    }
    else {
        subcount = 0;
        sub.AssignmentID = 1;
    }
}

async function generateDepartmentGoalAssgn(requestData) {
    const sub = requestData.data;
    var subcount = await cds.run(`SELECT max(AssignmentID) as count from SUSTAINABILITY_DB_DepartmentGoal`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        sub.AssignmentID = ++subcount;
    }
    else {
        subcount = 0;
        sub.AssignmentID = 1;
    }
}

async function generateEmployeeGoalAssgn(requestData) {
    const sub = requestData.data;
    var subcount = await cds.run(`SELECT max(AssignmentID) as count from SUSTAINABILITY_DB_EmployeeGoal`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        sub.AssignmentID = ++subcount;
    }
    else {
        subcount = 0;
        sub.AssignmentID = 1;
    }
}

async function generateEmployeeID(requestData) {
    const sub = requestData.data;
    var EMPID;
    var subcount = await cds.run(`SELECT MAX(CAST(REPLACE(REPLACE(EmployeeID , 'EID', ''), '', '') as int)) as count from SUSTAINABILITY_DB_EmployeeUser`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        EMPID = ++subcount;
        EMPID = EMPID.toString();
        if (EMPID.length === 1) {
            EMPID = "000" + EMPID;
        } else if (EMPID.length === 2) {
            EMPID = "00" + EMPID;
        } else if (EMPID.length === 3) {
            EMPID = "0" + EMPID;
        }
        sub.EmployeeID = "EID" + EMPID;
    }
    else {
        subcount = 0;
        sub.EmployeeID = "EID" + "0001";
    }
}

async function generateSupplierID(requestData) {
    const sub = requestData.data;
    var SID;
    var subcount = await cds.run(`SELECT MAX(CAST(REPLACE(REPLACE(SupplierID , 'SID', ''), '', '') as int)) as count from SUSTAINABILITY_DB_SupplierHeader`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        SID = ++subcount;
        SID = SID.toString();
        if (SID.length === 1) {
            SID = "000" + SID;
        } else if (SID.length === 2) {
            SID = "00" + SID;
        } else if (SID.length === 3) {
            SID = "0" + SID;
        }
        sub.SupplierID = "SID" + SID;
    }
    else {
        subcount = 0;
        sub.SupplierID = "SID" + "0001";
    }
}

async function generateDepartmentID(requestData) {
    const sub = requestData.data;
    var DEPID;
    var subcount = await cds.run(`select MAX(CAST(REPLACE(REPLACE(DepartmentID , 'DT', ''), '', '') as int)) as count from SUSTAINABILITY_DB_DepartmentHeader`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        DEPID = ++subcount;
        DEPID = DEPID.toString();
        if (DEPID.length === 1) {
            DEPID = "000" + DEPID;
        } else if (DEPID.length === 2) {
            DEPID = "00" + DEPID;
        } else if (DEPID.length === 3) {
            DEPID = "0" + DEPID;
        }
        sub.DepartmentID = "DT" + DEPID;
    }
    else {
        subcount = 0;
        sub.DepartmentID = "DT" + "0001";
    }
}

async function generateTeamID(requestData) {
    const sub = requestData.data;
    var TeamID;
    var subcount = await cds.run(`SELECT MAX(CAST(REPLACE(REPLACE(TeamID , 'TM', ''), '', '') as int)) as count from SUSTAINABILITY_DB_TeamHeader`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        TeamID = ++subcount;
        TeamID = TeamID.toString();
        if (TeamID.length === 1) {
            TeamID = "00" + TeamID;
        } else if (TeamID.length === 2) {
            TeamID = "0" + TeamID;
        }
        sub.TeamID = "TM" + TeamID;
    }
    else {
        subcount = 0;
        sub.TeamID = "TM" + "0001";
    }
}

async function generateEmployeeGoalUpdateSRN(requestData) {
    const sub = requestData.data;
    var subcount = await cds.run(`SELECT max(UpdateSRN) as count from SUSTAINABILITY_DB_EmployeeGoal_Update`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        sub.UpdateSRN = ++subcount;
    }
    else {
        subcount = 0;
        sub.UpdateSRN = 1;
    }
}

async function generateSupGoalUpdateSRN(requestData) {
    const sub = requestData.data;
    var subcount = await cds.run(`SELECT max(UpdateSRN) as count from SUSTAINABILITY_DB_SupplierGoal_Update`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        sub.UpdateSRN = ++subcount;
    }
    else {
        subcount = 0;
        sub.UpdateSRN = 1;
    }
}