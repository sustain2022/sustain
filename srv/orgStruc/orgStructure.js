async function orgStruc(requestedData) {

    var data = {};
    var linesDataObj = {};
    var employees;
    var client = await cds.read(`Client`).where({ ClientID: { '=': requestedData.data.ClientID } });

    if (client.length > 0) {
        var employeeData = await cds.read(`EmployeeUser`).where({ ClientID: { '=': requestedData.data.ClientID } });
        var goalData = await cds.read(`EmployeeGoal`).where({ ClientID: { '=': requestedData.data.ClientID } });

        employeeData.forEach(emp => {

            var empGoal = goalData.filter((item => { return item.EmployeeID == emp.EmployeeID}));
            var teamGoals;
            if(emp.isSupervisor == true) {
                var teamMem = employeeData.filter((item) => { return item.Supervisor == emp.EmployeeID });
                teamGoals = 0;
                for(var t =0; t<teamMem.length; t++) {
                    var empGoals = empGoal.filter((empItem) => {
                        return empItem.EmployeeID == emp.EmployeeID
                    });
                    teamGoals = teamGoals + empGoals.length;
                }

                emp.TeamMembers = teamMem.length;
                emp.GoalsAssigned = empGoal.length;
                emp.TeamGoals = teamGoals;
            } else {
                emp.TeamMembers = 0;
                emp.GoalsAssigned = empGoal.length;
                emp.TeamGoals = 0;
            }
            
        });
        data.ClientID = requestedData.data.ClientID;
        data.nodes = employeeData;
        data.lines = [];

        var managers = employeeData.filter((item) => { return item.isSupervisor == true });
        for (var i = 0; i < managers.length; i++) {
            employees = employeeData.filter((item) => { return item.Supervisor == managers[i].EmployeeID });
            employees.forEach(emp => {
                linesDataObj = {};
                linesDataObj.supervisor = emp.Supervisor;
                linesDataObj.employee = emp.EmployeeID;
                data.lines.push(linesDataObj);
            });
        }
        return data;
    } else {
        return data;
    }

}
exports._orgStruc = orgStruc; 