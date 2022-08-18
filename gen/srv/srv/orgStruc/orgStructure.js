async function orgStruc(requestedData) {

    var data = {};
    var linesDataObj = {};
    var employees;
    var client = await cds.read(`Client`).where({ ClientID: { '=': requestedData.data.ClientID } });

    if (client.length > 0) {
        var employeeData = await cds.read(`EmployeeUser`).where({ ClientID: { '=': requestedData.data.ClientID } });
        var goalData = await cds.read(`EmployeeGoal`).where({ ClientID: { '=': requestedData.data.ClientID } });

        //var mgr = employeeData.filter((item) => { return item.isSupervisor == true });

        //var managers = JSON.parse(JSON.stringify(mgr));

        employeeData.forEach(emp => {

            var empGoal = goalData.filter((item => { return item.EmployeeID == emp.EmployeeID }));
            var teamGoals;
            if (emp.isSupervisor == true) {
                var teamMem = employeeData.filter((item) => { return item.Supervisor == emp.EmployeeID });
                teamGoals = 0;
                for (var t = 0; t < teamMem.length; t++) {
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

            if (emp.EmployeeType === "Internal") {
                emp.Supervisor = "INT_" + emp.Supervisor;
            } else {
                emp.Supervisor = "EXT_" + emp.Supervisor;
            }

        });
        data.ClientID = requestedData.data.ClientID;
        //data.nodes = employeeData;
        data.lines = [];

        var managers = employeeData.filter((item) => { return item.isSupervisor == true });
        var intExtNodes = [];
        for (var i = 0; i < managers.length; i++) {
            employees = employeeData.filter((item) => {
                return item.Supervisor.split("_")[1] == managers[i].EmployeeID
            });
            if (employees.length) {
               // var mgrSup;
                // start code for internal and external
                /*if (managers[i].EmployeeType === "Internal") {
                    mgrSup = "INT_" + managers.Supervisor;
                } else {
                    mgrSup = "EXT_" + managers.Supervisor;
                }*/

              //  if (managers[i].EmployeeID == mgrSup || managers[i].Supervisor == "") {
                    var lineInt = {};
                    lineInt.supervisor = managers[i].EmployeeID;
                    lineInt.employee = "INT_" + managers[i].EmployeeID;
                    data.lines.push(lineInt);

                    var lineExt = {};
                    lineExt.supervisor = managers[i].EmployeeID;
                    lineExt.employee = "EXT_" + managers[i].EmployeeID;
                    data.lines.push(lineExt);

                    var intNode = {};
                    intNode.EmployeeID = "INT_" + managers[i].EmployeeID;
                    intNode.EmployeeName = "Internal(within Org";
                    intNode.Supervisor = managers[i].EmployeeID;
                    var extNode = {};
                    extNode.EmployeeID = "EXT_" + managers[i].EmployeeID;
                    extNode.EmployeeName = "External(Supplier)";
                    extNode.Supervisor = managers[i].EmployeeID;
                    intExtNodes.push(intNode);
                    intExtNodes.push(extNode);
             //   }

                //end code for internal external
                employees.forEach(emp => {

                    if (emp.EmployeeID !== emp.Supervisor.split("_")[1]) {
                        linesDataObj = {};
                        linesDataObj.supervisor = emp.Supervisor;
                        linesDataObj.employee = emp.EmployeeID;
                        data.lines.push(linesDataObj);
                    }
                });
            }
        }
        employeeData = [...employeeData, ...intExtNodes];
        data.nodes = employeeData;
        return data;
    } else {
        return data;
    }

}
exports._orgStruc = orgStruc; 