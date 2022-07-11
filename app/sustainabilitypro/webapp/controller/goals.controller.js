// @ts-nocheck
sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "../utils/util"
], function (Controller, Filter, JSONModel,util) {
    'use strict';

    return Controller.extend("susproapp.controller.goals", {
        onInit: function () {
            if(localStorage.getItem('user')){
                this.getOwnerComponent()._clientId = localStorage.getItem('user');
                // this.getView().getParent().getParent().getSideContent().setVisible(true);
            }
            // this.getOwnerComponent().getModel().read("/GoalDetails", {
            //     urlParameters: {
            //         '$expand': 'GoalFields',
            //         '$select': '*,GoalFields/FieldName'
            //     },
            //     success: function (response) {
            //         this._generateGoalDetails(response.results);
            //     }.bind(this)
            // });
            this.getOwnerComponent().getRouter().getRoute("goals").attachPatternMatched(this._onRouteMatched, this);

            
        },
        _onRouteMatched: function(oEvent){
            util.clientFilter(this,"GoalsTable1","items");
            util.clientFilter(this,"GoalsTable2","items");
            util.clientFilter(this,"GoalsTable3","items");
        },
        _generateGoalDetails: function (goalDetails) {
            // // this.goalDetails = [];
            // //var goalDetails = {};
            // const uniqueGoals = [... new Set(goalDetails.map(function (item) {
            //     return item.GoalID
            // }))];
            // var oGoal = {};
            // var finalGoals = [];
            // for (var i = 0; i < uniqueGoals.length; i++) {
            //     var goalFilter = goalDetails.filter(function (item) { return item.GoalID == uniqueGoals[i] });
            //     oGoal = {};
            //     oGoal.GoalID = uniqueGoals[i];
            //     for (var m = 0; m < goalFilter.length; m++) {
            //         oGoal[goalFilter[m].GoalFields.FieldName.replace(/ /g, '')] = goalFilter[m].FieldValue;
            //     }
            //     finalGoals.push(oGoal);
            // }
            // console.log(finalGoals);
            // var json = new JSONModel(finalGoals);
            // this.byId("goalsTable").setModel(json);
        },
        showGoalDetails: function (oEvent) {
            // this.getOwnerComponent()._sGoalDetPath = oEvent.getSource().getBindingContext().getPath();
            var obj = oEvent.getSource().getModel().getProperty(oEvent.getSource().getBindingContext().getPath());
            this.getOwnerComponent().getRouter()
                .navTo("goaldet", { path: obj.GoalTemplateID + ";" + obj.ClientID + ";" + obj.GoalID });
        },
        setGoalStatus: function (sValue) {
            switch (sValue) {
                case 1:
                    return "Draft"
                    break;
                case 2:
                    return "Submitted"
                    break;
                case 3:
                    return "Active"
                    break;
                case 4:
                    return "Deleted"
                    break;
                default:
                    return "";
                    break;
            }
        }
    });
});