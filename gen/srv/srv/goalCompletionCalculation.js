async function _goalCompletionCalculation(goals) {
    //     let requestedData = req.data;
    //     let goalID = req.data.GoalID;
    //     let clientID = req.data.ClientID;
    //     //var employeeGoalAchieved = cds.read(`EmployeeGoal`).where({ GoalID: {'=': goalID } , and: ClientID: {'=':clientID }  } });
    //     var supplierGoalAchieved = cds.read(`SupplierGoal`).where({ GoalID: {'=': goalID } , and: ClientID: {'=':clientID }  } });
    //     var goalCompletion = employeeGoalAchieved + supplierGoalAchieved;
    var goalsData = goals;
   // if (Object.entries(goalsData).length != 0) {
        var employeeGoalAchieved = await cds.read(`EmployeeGoal_Update`);
        var supplierGoalAchieved = await cds.read(`SupplierGoal_Update`);
        if (Array.isArray(goalsData)) {
            for (var goalsIndex in goals) {
                let goalID = goals[goalsIndex].GoalID;
                let clientID = goals[goalsIndex].ClientID;
               // let goalTemplateID = goals[goalsIndex].GoalTemplateID;
                var filteredEmpGoals = employeeGoalAchieved.filter((item) => { return (item.GoalID == goalID && item.ClientID == clientID ) });
                var empTargetAch = filteredEmpGoals.reduce((total, currElement) => total + parseInt(currElement.TargetAchieved), 0);
                var filteredSupGoals = supplierGoalAchieved.filter((item) => { return (item.GoalID == goalID && item.ClientID == clientID ) });
                var supTargetAch = filteredSupGoals.reduce((total, currElement) => total + parseInt(currElement.TargetAchieved), 0);
                goals[goalsIndex].GoalCompletion = empTargetAch + supTargetAch;
            }
        }
}

exports._goalCompletionCalculation = _goalCompletionCalculation;
// async function goalCompletionCalculation(goals) {
//     let requestedData = req.data;
//     let goalID = req.data.GoalID;
//     let clientID = req.data.ClientID;
//     //var employeeGoalAchieved = cds.read(`EmployeeGoal`).where({ GoalID: {'=': goalID } , and: ClientID: {'=':clientID }  } });
//     var supplierGoalAchieved = cds.read(`SupplierGoal`).where({ GoalID: {'=': goalID } , and: ClientID: {'=':clientID }  } });
//     var goalCompletion = employeeGoalAchieved + supplierGoalAchieved;
        // var employeeGoalAchieved = cds.read(`EmployeeGoal`);
        // var supplierGoalAchieved = cds.read(`SupplierGoal`);
        // if (Array.isArray(goals)) {
        //     for (var goalsIndex in goals) {
        //         var empGoals = employeeGoalAchieved.filter((item)=> { return (item.GoalID === goalID && item.ClientID === clientID) });
        //     }
        // }
// }