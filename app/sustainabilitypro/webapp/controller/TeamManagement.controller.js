// @ts-ignore
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "../utils/util"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, util) {
        "use strict";

        return Controller.extend("sustainabilitypro.controller.TeamManagement", {
            onInit: function () {
                if(localStorage.getItem('user')){
                    this.getOwnerComponent()._clientId = localStorage.getItem('user');
                    // this.getView().getParent().getParent().getSideContent().setVisible(true);
                }
                this.getOwnerComponent().getRouter().getRoute("teammgmnt").attachPatternMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function(oEvent){
                // this.getView().getParent().getParent().setMode("HideMode");
                var aSections = this.byId("ObjectPageLayout").getSections();
                if(this.getOwnerComponent()._setSection == 'Internal Team'){
                    this.byId("ObjectPageLayout").setSelectedSection(aSections[1]);
                }
                if(this.getOwnerComponent()._setSection == 'External Team'){
                    this.byId("ObjectPageLayout").setSelectedSection(aSections[2]);
                }
                // util.clientFilter(this,"EmpUser","items");
                // util.clientFilter(this,"addDptCB","items");
                // util.clientFilter(this,"addSupDptCB","items");
                // util.clientFilter(this,"addTeamDptCB","items");
                util.clientFilter(this,"dptTbl","items");
                util.clientFilter(this,"teamTbl","items");
                util.clientFilter(this,"teamTbl1","items");
                util.clientFilter(this,"empTbl","items");
                util.clientFilter(this,"supTbl","items");
            },
            onDeptAddRequest: function(oEvent){
                if (!this.deptDialog) {
                    this.deptDialog = this.loadFragment({
                        name: "sustainabilitypro.fragments.AddDepartment"
                    }).then(function(oDialog) {
                        this.deptDialog = oDialog;
                        oDialog.open();
                    }.bind(this));
                }else{
                    this.deptDialog.open();
                }
            },
            onTeamAddRequest: function(oEvent){
                this._teamType = oEvent.getSource().getCustomData()[0].getKey();
                if (!this.teamDialog) {
                    this.teamDialog = this.loadFragment({
                        name: "sustainabilitypro.fragments.AddTeam"
                    }).then(function(oDialog) {
                        this.teamDialog = oDialog;
                        util.clientFilter(this,"addTeamDptCB","items");
                        oDialog.open();
                    }.bind(this));
                }else{
                    this.byId("addTeamForm").getFormContainers()[0].getFormElements()[0].getFields()[0].setValue();
                    this.byId("addTeamForm").getFormContainers()[0].getFormElements()[1].getFields()[0].setValue();
                    this.byId("addTeamForm").getFormContainers()[0].getFormElements()[2].getFields()[0].setValue();
                    this.teamDialog.open();
                }
            },
            onEmpAddRequest: function(oEvent){
                if (!this.empDialog) {
                    this.empDialog = this.loadFragment({
                        name: "sustainabilitypro.fragments.AddEmployee"
                    }).then(function(oDialog) {
                        this.empDialog = oDialog;
                        util.clientFilter(this,"addDptCB","items");
                        oDialog.open();
                    }.bind(this));
                }else{
                    this.empDialog.open();
                }
            },
            onSupAddRequest: function(oEvent){
                if (!this.supDialog) {
                    this.supDialog = this.loadFragment({
                        name: "sustainabilitypro.fragments.AddSupplier"
                    }).then(function(oDialog) {
                        this.supDialog = oDialog;
                        util.clientFilter(this,"addSupDptCB","items");
                        oDialog.open();
                    }.bind(this));
                }else{
                    this.supDialog.open();
                }
            },
            onDeptSave: function (oEvent) {
                //var oModel = new sap.ui.model.json.JSONModel();
                var tmpModel = this.getOwnerComponent().getModel();
                // tmpModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                tmpModel.setUseBatch(true);
                tmpModel.setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo",
                    success: function (odata, resp) { sap.m.MessageToast.show("Department Created"); },
                    error: function (odata, resp) { sap.m.MessageToast.show("Department Creation Failed"); }
                };

                var deptHeaderData = {
                    "ClientID": this.getOwnerComponent()._clientId
                }
                var aFormElem = this.byId("addDptForm").getFormContainers()[0].getFormElements();
               
                deptHeaderData.DepartmentName = aFormElem[0].getFields()[0].getValue();
                deptHeaderData.DepartmentDescription = aFormElem[1].getFields()[0].getValue();
                deptHeaderData.HOD = aFormElem[2].getFields()[0].getSelectedItem().getText();
                deptHeaderData.DepartmentType = aFormElem[3].getFields()[0].getSelectedKey();
                deptHeaderData.DepartmentStatus = aFormElem[4].getFields()[0].getSelectedKey();
                
                tmpModel.create('/DepartmentHeader', deptHeaderData, mParameters);
                tmpModel.submitChanges(mParameters);
                this.deptDialog.close();
            },
            onTeamSave: function (oEvent) {
                //var oModel = new sap.ui.model.json.JSONModel();
                var tmpModel = this.getOwnerComponent().getModel();
                // tmpModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                tmpModel.setUseBatch(true);
                tmpModel.setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo",
                    success: function (odata, resp) { sap.m.MessageToast.show("Team Created"); },
                    error: function (odata, resp) { sap.m.MessageToast.show("Team Creation Failed"); }
                };

                var teamHeaderData = {
                    "ClientID": this.getOwnerComponent()._clientId
                }
                var aFormElem = this.byId("addTeamForm").getFormContainers()[0].getFormElements();
               
                teamHeaderData.TeamName = aFormElem[0].getFields()[0].getValue();
                teamHeaderData.TeamDescription = aFormElem[1].getFields()[0].getValue();
                teamHeaderData.DepartmentID = aFormElem[2].getFields()[0].getSelectedKey();
                teamHeaderData.TeamType = this._teamType;
                
                tmpModel.create('/TeamHeader', teamHeaderData, mParameters);
                tmpModel.submitChanges(mParameters);
                this.teamDialog.close();
            },
            onEmpSave: function (oEvent) {
                //var oModel = new sap.ui.model.json.JSONModel();
                var tmpModel = this.getOwnerComponent().getModel();
                // tmpModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                tmpModel.setUseBatch(true);
                tmpModel.setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo",
                    success: function (odata, resp) { sap.m.MessageToast.show("Employee Created"); },
                    error: function (odata, resp) { sap.m.MessageToast.show("Employee Creation Failed"); }
                };

                var empHeaderData = {
                    "ClientID": this.getOwnerComponent()._clientId
                }
                var aFormElem = this.byId("addEmpForm").getFormContainers()[0].getFormElements();
               
                empHeaderData.EmployeeName = aFormElem[0].getFields()[0].getValue();
                empHeaderData.UserID = aFormElem[1].getFields()[0].getValue();
                empHeaderData.Email = aFormElem[2].getFields()[0].getValue();
                empHeaderData.ContactNumber = parseInt(aFormElem[3].getFields()[0].getValue());
                empHeaderData.DepartmentID = aFormElem[4].getFields()[0].getSelectedKey();
                empHeaderData.ValidFrom = aFormElem[5].getFields()[0].getDateValue();
                empHeaderData.ValidTo = aFormElem[6].getFields()[0].getDateValue();
                empHeaderData.EmployeeType = aFormElem[7].getFields()[0].getSelectedKey();
                empHeaderData.UserStatus = aFormElem[8].getFields()[0].getSelectedKey();

                tmpModel.create('/EmployeeUser', empHeaderData, mParameters);
                tmpModel.submitChanges(mParameters);
                this.empDialog.close();
            },
            onSupSave: function (oEvent) {
                //var oModel = new sap.ui.model.json.JSONModel();
                var tmpModel = this.getOwnerComponent().getModel();
                // tmpModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                tmpModel.setUseBatch(true);
                tmpModel.setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo",
                    success: function (odata, resp) { sap.m.MessageToast.show("Supplier Created"); },
                    error: function (odata, resp) { sap.m.MessageToast.show("Supplier Creation Failed"); }
                };

                var supHeaderData = {
                    "ClientID": this.getOwnerComponent()._clientId
                }
                var aFormElem = this.byId("addSupForm").getFormContainers()[0].getFormElements();
               
                supHeaderData.SupplierName = aFormElem[0].getFields()[0].getValue();
                supHeaderData.Email = aFormElem[1].getFields()[0].getValue();
                supHeaderData.ContactNumber = aFormElem[2].getFields()[0].getValue();
                supHeaderData.DepartmentID = aFormElem[3].getFields()[0].getSelectedKey();
                supHeaderData.Address = aFormElem[4].getFields()[0].getValue();
                supHeaderData.Country = aFormElem[5].getFields()[0].getValue();
                supHeaderData.SupplierStatus = aFormElem[6].getFields()[0].getSelectedKey();
                
                tmpModel.create('/SupplierHeader', supHeaderData, mParameters);
                tmpModel.submitChanges(mParameters);
                this.supDialog.close();
            },
            onCloseAddDeptDlg: function (oEvent) {
                oEvent.getSource().getParent().close();   
            },
            onCloseAddTeamDlg: function (oEvent) {
                oEvent.getSource().getParent().close();   
            },
            onCloseAddEmpDlg: function (oEvent) {
                oEvent.getSource().getParent().close();   
            },
            onCloseAddSupDlg: function (oEvent) {
                oEvent.getSource().getParent().close();   
            },
            onNavback: function(){
                var aSections = this.byId("ObjectPageLayout").getSections();
                this.byId("ObjectPageLayout").setSelectedSection(aSections[0]);
                this.getView().getParent().getParent().setMode("ShowHideMode");
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
    
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("detailsd1", {}, true);
                }
                
            }
        });
    });
