async function _goalStatusReport() {

    let goalData = await cds.read(`GoalHeader`);
    let goalStatusData = {
        Behind: 0,
        NotStarted: 0,
        OnTrack: 0,
        Completed: 0,
        Escalated: 0
    };
    var statuses = ["Behind", "NotStarted", "OnTrack", "Completed", "Escalated"];
    var finalData = {};
    var date = new Date();

    for(let i=0; i<goalData.length; i++) {

        var beginDate = new Date(goalData[i].BeginDate).getTime();
        var endDate = new Date(goalData[i].EndDate).getTime();
        var currDate = new Date().getTime();
        if(goalData[i].GoalStaus_Biz == 3) { // Completed
            goalStatusData.Completed = goalStatusData.Completed + 1;
        } else {
            if((currDate >= beginDate && currDate <= endDate) && // On Track
                (goalData[i].GoalStaus_Biz == 2)) {

                goalStatusData.OnTrack = goalStatusData.OnTrack + 1;

            } else if((currDate >= beginDate && currDate <= endDate) && // Not Started
                (goalData[i].GoalStaus_Biz == 1)) {
                    
                goalStatusData.NotStarted = goalStatusData.NotStarted + 1;

            } else {
                    if((currDate >= endDate)) {
                    goalStatusData.Behind = goalStatusData.Behind + 1; 
                }
            } if(goalData[i].GoalStaus_Biz == 4) {
                goalStatusData.Escalated = goalStatusData.Escalated + 1;
            }
        }
    }
    var data = [];

    for(let j=0; j<statuses.length; j++) {
        finalData.SerialNo = j;
        finalData.GoalStatus = statuses[j];
        finalData.NumberOfGoals = goalStatusData[statuses[j]];
        data.push(finalData);
        finalData = {};
    }

    //data.push(goalStatusData);
    //return goalStatusData;
    return data;
}
exports._goalStatusReport = _goalStatusReport;