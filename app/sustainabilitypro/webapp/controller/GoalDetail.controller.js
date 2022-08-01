// @ts-ignore
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/DatePicker",
    "sap/m/Input",
    "sap/m/Text",
    "sap/ui/core/routing/History",
    "../utils/util"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Fragment,Filter,FilterOperator, DatePicker, Input, Text, History, util) {
        "use strict";

        return Controller.extend("sustainabilitypro.controller.GoalDetail", {
            onInit: function () {
                if(localStorage.getItem('user')){
                    this.getOwnerComponent()._clientId = localStorage.getItem('user');
                    // this.getView().getParent().getParent().getSideContent().setVisible(true);
                }
                this.getOwnerComponent().getRouter().getRoute("goaldet").attachPatternMatched(this._onRouteMatched, this);
                
            },
            _onRouteMatched : function (oEvent) {
                // this.getView().getParent().getParent().setMode("HideMode");
                var aGoal = oEvent.getParameter("arguments").path.split(';');
                this._GoalID = aGoal[2];
                var sPath = "/GoalHeader(GoalTemplateID='"+aGoal[0]+"',ClientID='"+aGoal[1]+"',GoalID="+aGoal[2]+")"
                this.byId('ObjectPageLayout').getHeaderTitle().bindContext(sPath);
                this.byId('ObjectPageLayout').getHeaderContent()[0].bindContext(sPath);

                if(!this._GoalDet){
                    this.loadFragment({
                        name: "sustainabilitypro.fragments.GoalDetDisplay"
                    }).then(function(details){
                        this._GoalDet = details;
                        this.byId("GoalDet").addBlock(details);
                        this._generateGoalFields(sPath);
                        // this._onRouteMatched();
                        // this.getOwnerComponent().getRouter().getRoute("goaldet").attachPatternMatched(this._onRouteMatched, this);
                    }.bind(this));
                }else{
                    this._generateGoalFields(sPath);
            }
                this._filterTablesWithGoalID(aGoal[2]);

                // util.clientFilter(this,"dptGoalTbl","items");
                // util.clientFilter(this,"empGoalTbl","items");
                // util.clientFilter(this,"empUpdGoalTbl","items");
                // util.clientFilter(this,"supGoalTbl","items");
                // util.clientFilter(this,"supUpdGoalTbl","items");
            },
            _generateGoalFields: function(sPath){
                var goalDet = this.getView().byId("GoalDetDisplay");
                // goalDet.bindElement({
                
                goalDet.getFormContainers()[0].bindAggregation("formElements",{
                    path : sPath+"/GoalDetails",//this.getOwnerComponent()._sGoalDetPath + "/GoalDetails",
                    parameters: {
                        expand: "GoalFields"
                     },
                    template: new sap.ui.layout.form.FormElement({label:"{GoalFields/FieldName}",
                    fields:[new Text({text:"{FieldValue}"})]}),
                    events : {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function (oEvent) {
                            goalDet.setBusy(true);
                        },
                        dataReceived: function (oEvent) {
                            goalDet.setBusy(false);
                        }
                    }
                });
            },
            _onBindingChange : function (oEvent) {
                // No data for the binding
                // if (!this.getView().getBindingContext()) {
                //     this.getRouter().getTargets().display("notFound");
                // }
            },
            _generateFields: function (aFields) {
                var oFormCont = this.byId("FormGoal").getFormContainers()[0];
                oFormCont.destroyFormElements();
                aFields.sort(function (a, b) {
                    return a.FieldSRN - b.FieldSRN;
                });

                for (var i in aFields) {
                    if (aFields[i].FieldSRN % 2 == 1) {
                        oFormCont.addFormElement(new FormElement({ label: aFields[i].FieldName, fields: [util.getEditField(aFields[i])] }));
                    }
                }
                for (var i in aFields) {
                    if (aFields[i].FieldSRN % 2 == 0) {
                        oFormCont.addFormElement(new FormElement({ label: aFields[i].FieldName, fields: [util.getEditField(aFields[i])] }));
                    }
                }
            },
            _filterTablesWithGoalID:function(GoalId){
                
                this.byId("dptGoalTbl").getBinding("items")
                .filter([new Filter("GoalID","EQ", GoalId)]);                
                this.byId("empGoalTbl").getBinding("items")
                .filter([new Filter("GoalID","EQ", GoalId)]);
                this.byId("empUpdGoalTbl").getBinding("items")
                .filter([new Filter("GoalID","EQ", GoalId)]);
                this.byId("supGoalTbl").getBinding("items")
                .filter([new Filter("GoalID","EQ", GoalId)]);
                this.byId("supUpdGoalTbl").getBinding("items")
                .filter([new Filter("GoalID","EQ", GoalId)]);                                                
                
            },
            onValueHelpDeptsRequested: function() {
                if(!this._oValueHelpDialogForDepts){
                    Fragment.load({
                        name: "sustainabilitypro.fragments.Departments",
                        controller: this
                    }).then(function name(oFragment) {
                        this._oValueHelpDialogForDepts = oFragment;
                        this.getView().addDependent(this._oValueHelpDialogForDepts);
                        oFragment.removeButton(0);
                        oFragment.removeButton(0);
        
                        this._oValueHelpDialogForDepts.getTableAsync().then(function (oTable) {
                            // oTable.setModel(this.oProductsModel);
                            // oTable.setModel(this.oColModel, "columns");
        
                            if (oTable.bindRows) {
                                // oTable.bindAggregation("rows", "/DepartmentHeader");
                                oTable.bindRows({path: "/DepartmentHeader",filters:[new Filter("ClientID","EQ", this.getOwnerComponent()._clientId)]});
                                this._addDeptColumns(oTable);
                                
                            }
        
                            if (oTable.bindItems) {
                                oTable.bindAggregation("items", "/DepartmentHeader", function () {
                                    return new sap.m.ColumnListItem({
                                        cells: [new Text({text:"{DepartmentID}"})
                                        ]
                                    });
                                });
                            }
        
                            this._oValueHelpDialogForDepts.update();
                        }.bind(this));
                        this._oValueHelpDialogForDepts.open();
                    }.bind(this));
                }else{
                    this._oValueHelpDialogForDepts.open();
                }
            },
            onValueHelpEmpRequested: function() {
                if(!this._oValueHelpDialogForEmp){
                    Fragment.load({
                        name: "sustainabilitypro.fragments.EmployeeGoal",
                        controller: this
                    }).then(function name(oFragment) {
                        this._oValueHelpDialogForEmp = oFragment;
                        this.getView().addDependent(this._oValueHelpDialogForEmp);
                        oFragment.removeButton(0);
                        oFragment.removeButton(0);
        
                        this._oValueHelpDialogForEmp.getTableAsync().then(function (oTable) {
                            // oTable.setModel(this.oProductsModel);
                            // oTable.setModel(this.oColModel, "columns");
        
                            if (oTable.bindRows) {
                                // oTable.bindAggregation("rows", "/EmployeeUser");
                                oTable.bindRows({path: "/EmployeeUser",filters:[new Filter("ClientID","EQ", this.getOwnerComponent()._clientId)]});
                                this._addEmpColumns(oTable);
                                
                            }
        
                            if (oTable.bindItems) {
                                oTable.bindAggregation("items", "/EmployeeUser", function () {
                                    return new sap.m.ColumnListItem({
                                        cells: [new Text({text:"{EmployeeID}"})
                                        ]
                                    });
                                });
                            }
        
                            this._oValueHelpDialogForEmp.update();
                        }.bind(this));
                        this._oValueHelpDialogForEmp.open();
                    }.bind(this));
                }else{
                    this._oValueHelpDialogForEmp.open();
                }
            },
            onValueHelpSupRequested: function() {
                if(!this._oValueHelpDialogForSup){
                    Fragment.load({
                        name: "sustainabilitypro.fragments.SupplierGoal",
                        controller: this
                    }).then(function name(oFragment) {
                        this._oValueHelpDialogForSup = oFragment;
                        this.getView().addDependent(this._oValueHelpDialogForSup);
                        oFragment.removeButton(0);
                        oFragment.removeButton(0);
        
                        this._oValueHelpDialogForSup.getTableAsync().then(function (oTable) {
                            // oTable.setModel(this.oProductsModel);
                            // oTable.setModel(this.oColModel, "columns");
        
                            if (oTable.bindRows) {
                                // oTable.bindAggregation("rows", "/SupplierHeader");
                                oTable.bindRows({path: "/SupplierHeader",filters:[new Filter("ClientID","EQ", this.getOwnerComponent()._clientId)]});
                                this._addSupColumns(oTable);
                                
                            }
        
                            if (oTable.bindItems) {
                                oTable.bindAggregation("items", "/SupplierHeader", function () {
                                    return new sap.m.ColumnListItem({
                                        cells: [new Text({text:"{SupplierID}"})
                                        ]
                                    });
                                });
                            }
        
                            this._oValueHelpDialogForSup.update();
                        }.bind(this));
                        this._oValueHelpDialogForSup.open();
                    }.bind(this));
                }else{
                    this._oValueHelpDialogForSup.open();
                }
            },
            _addDeptColumns: function(oTable){
                oTable.addColumn(new sap.ui.table.Column({label:"Department Name",
                    template: new Text({text:"{DepartmentName}"})
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"HOD",
                    template: new Text({text:"{HOD}"})
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"Department Type",
                    template: new Text({text:"{DepartmentType}"})
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"Begin Date",
                    template: new DatePicker()
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"End Date",
                    template: new DatePicker()
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"Target Assigned",
                    template: new Input()
                }));                
            },
            _addEmpColumns: function(oTable){
                oTable.addColumn(new sap.ui.table.Column({label:"User ID",
                    template: new Text({text:"{UserID}"})
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"Employee Name",
                    template: new Text({text:"{EmployeeName}"})
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"Begin Date",
                    template: new DatePicker()
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"End Date",
                    template: new DatePicker()
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"Target Assigned",
                    template: new Input()
                }));                
            },
            _addSupColumns: function(oTable){
                oTable.addColumn(new sap.ui.table.Column({label:"Supplier Name",
                    template: new Text({text:"{SupplierName}"})
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"Contact Name",
                    template: new Text({text:"{ContactName}"})
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"Begin Date",
                    template: new DatePicker()
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"End Date",
                    template: new DatePicker()
                }));
                oTable.addColumn(new sap.ui.table.Column({label:"Target Assigned",
                    template: new Input()
                }));                
            },
            onFilterBarSearch: function (oEvent) {
                // var sSearchQuery = oEvent.getSource().getBasicSearchControl().getValue();
                var aFilters = oEvent.getSource().getFilters();
                var dialog;
                switch (oEvent.getSource().getEntitySet()) {
                    case "DepartmentHeader":
                        dialog =  this._oValueHelpDialogForDepts
                        break;
                    case "EmployeeGoal":
                        dialog =  this._oValueHelpDialogForEmp
                        break;  
                    case "SupplierHeader":
                        dialog =  this._oValueHelpDialogForSup
                        break;                                                
                    default:
                        break;
                }
                this._filterTable(new Filter({
                    filters: aFilters,
                    and: true
                }), dialog);
            },
    
            _filterTable: function (oFilter, dialog) {
                var oValueHelpDialog = dialog;
    
                oValueHelpDialog.getTableAsync().then(function (oTable) {
                    if (oTable.bindRows) {
                        oTable.getBinding("rows").filter(oFilter);
                    }
    
                    if (oTable.bindItems) {
                        oTable.getBinding("items").filter(oFilter);
                    }
    
                    oValueHelpDialog.update();
                });
            },
            onDepartmentAssign: function(oEvent){
                var tmpModel = this.getOwnerComponent().getModel();
                // tmpModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                tmpModel.setUseBatch(true);
                tmpModel.setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo",
                    success: function (odata, resp) { sap.m.MessageToast.show("Assignment Done"); },
                    error: function (odata, resp) { sap.m.MessageToast.show("Assignment Failed"); }
                };
                var assignmentData = {};
                var aRows = oEvent.getSource().getParent().getTable().getRows();
                var aIndex = oEvent.getSource().getParent().getTable().getSelectedIndices();
                var sPath, oRowObj;
                // goalHeaderData.GoalDetails = finalData;
                for(var i in aIndex){
                    sPath = aRows[aIndex[i]].getBindingContext().getPath();
                    oRowObj = oEvent.getSource().getModel().getProperty(sPath);
                    assignmentData =  {
                        "ClientID": this.getOwnerComponent()._clientId,
                        "GoalID": this._GoalID,
                        "DepartmentID": oRowObj.DepartmentID,
                        "BeginDate": aRows[aIndex[i]].getCells()[3].getDateValue(),
                        "EndDate": aRows[aIndex[i]].getCells()[4].getDateValue(),
                        "Status_Biz": 10,
                        "TargetAssigned": parseInt(aRows[aIndex[i]].getCells()[5].getValue())
                    }
                    tmpModel.create('/DepartmentGoal', assignmentData, mParameters);
                }
                tmpModel.submitChanges(mParameters);
                this._oValueHelpDialogForDepts.close();
            },
            onEmployeeAssign: function(oEvent){
                var tmpModel = this.getOwnerComponent().getModel();
                // tmpModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                tmpModel.setUseBatch(true);
                tmpModel.setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo",
                    success: function (odata, resp) { sap.m.MessageToast.show("Assignment Done"); },
                    error: function (odata, resp) { sap.m.MessageToast.show("Assignment Failed"); }
                };
                var assignmentData = {};
                var aRows = oEvent.getSource().getParent().getTable().getRows();
                var aIndex = oEvent.getSource().getParent().getTable().getSelectedIndices();
                var sPath, oRowObj;
                // goalHeaderData.GoalDetails = finalData;
                for(var i in aIndex){
                    sPath = aRows[aIndex[i]].getBindingContext().getPath();
                    oRowObj = oEvent.getSource().getModel().getProperty(sPath);
                    assignmentData =  {
                        "ClientID": this.getOwnerComponent()._clientId,
                        "GoalID": this._GoalID,
                        "EmployeeID": oRowObj.EmployeeID,
                        "BeginDate": aRows[aIndex[i]].getCells()[2].getDateValue(),
                        "EndDate": aRows[aIndex[i]].getCells()[3].getDateValue(),
                        "TargetAssigned": parseInt(aRows[aIndex[i]].getCells()[4].getValue())
                    }
                    tmpModel.create('/EmployeeGoal', assignmentData, mParameters);
                }
                tmpModel.submitChanges(mParameters);
                this._oValueHelpDialogForEmp.close();
            },
            onSupplierAssign: function(oEvent){
                var tmpModel = this.getOwnerComponent().getModel();
                // tmpModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                tmpModel.setUseBatch(true);
                tmpModel.setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo",
                    success: function (odata, resp) { sap.m.MessageToast.show("Assignment Done"); },
                    error: function (odata, resp) { sap.m.MessageToast.show("Assignment Failed"); }
                };
                var assignmentData = {};
                var aRows = oEvent.getSource().getParent().getTable().getRows();
                var aIndex = oEvent.getSource().getParent().getTable().getSelectedIndices();
                var sPath, oRowObj;
                // goalHeaderData.GoalDetails = finalData;
                for(var i in aIndex){
                    sPath = aRows[aIndex[i]].getBindingContext().getPath();
                    oRowObj = oEvent.getSource().getModel().getProperty(sPath);
                    assignmentData =  {
                        "ClientID": this.getOwnerComponent()._clientId,
                        "GoalID": this._GoalID,
                        "SupplierID": oRowObj.SupplierID,
                        "BeginDate": aRows[aIndex[i]].getCells()[2].getDateValue(),
                        "EndDate": aRows[aIndex[i]].getCells()[3].getDateValue(),
                        "TargetAssigned": parseInt(aRows[aIndex[i]].getCells()[4].getValue())
                    }
                    tmpModel.create('/SupplierGoal', assignmentData, mParameters);
                }
                tmpModel.submitChanges(mParameters);
                this._oValueHelpDialogForSup.close();
            },            
            onDepartmentDialogClose: function(){
                this._oValueHelpDialogForDepts.close();
            },
            onEmployeeDialogClose: function(){
                this._oValueHelpDialogForEmp.close();
            },
            onSupplierDialogClose: function(){
                this._oValueHelpDialogForSup.close();
            },
            onEmpAddUpdRequest: function(oEvent){
                if (!this.empGoalUpdDialog) {
                    this.empGoalUpdDialog = this.loadFragment({
                        name: "sustainabilitypro.fragments.EmployeeGoalUpdate"
                    }).then(function(oDialog) {
                        this.empGoalUpdDialog = oDialog;
                        oDialog.open();
                    }.bind(this));
                }else{
                    this.empGoalUpdDialog.open();
                }
            },
            onSupAddUpdRequest: function(oEvent){
                if (!this.supGoalUpdDialog) {
                    this.supGoalUpdDialog = this.loadFragment({
                        name: "sustainabilitypro.fragments.SupplierGoalUpdate"
                    }).then(function(oDialog) {
                        this.supGoalUpdDialog = oDialog;
                        oDialog.open();
                    }.bind(this));
                }else{
                    this.supGoalUpdDialog.open();
                }
            },
            onEmpUpdSave: function (oEvent) {
                //var oModel = new sap.ui.model.json.JSONModel();
                var tmpModel = this.getOwnerComponent().getModel();
                // tmpModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                tmpModel.setUseBatch(true);
                tmpModel.setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo",
                    success: function (odata, resp) { sap.m.MessageToast.show("Target Updated"); },
                    error: function (odata, resp) { sap.m.MessageToast.show("Target Update Failed"); }
                };

                var empUpdData = {
                    "ClientID": this.getOwnerComponent()._clientId
                }
                var aFormElem = this.byId("addEmpGoalUpdateForm").getFormContainers()[0].getFormElements();
                var empId = aFormElem[0].getFields()[0].getSelectedKey();
                var aItems = this.byId('empGoalTbl').getItems();
                for(var i in aItems){
                    if(aItems[i].getCells()[7].getText() == empId){
                        empUpdData.AssignmentID = aItems[i].getCells()[8].getText();
                        empUpdData.Status_Biz = aItems[i].getCells()[6].getText();
                        break;
                    }
                }
                empUpdData.GoalID = this._GoalID;
                empUpdData.EmployeeID = empId;
                empUpdData.TargetAssigned = parseInt(aFormElem[0].getFields()[0].getSelectedItem().getCustomData()[0].getValue());
                empUpdData.TargetAchieved = parseInt(aFormElem[1].getFields()[0].getValue());
                empUpdData.AdditionalInfo = aFormElem[2].getFields()[0].getValue();
                
                tmpModel.create('/EmployeeGoalUpdate', empUpdData, mParameters);
                tmpModel.submitChanges(mParameters);
                this.empGoalUpdDialog.close();
            },
            onSupUpdSave: function (oEvent) {
                //var oModel = new sap.ui.model.json.JSONModel();
                var tmpModel = this.getOwnerComponent().getModel();
                // tmpModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                tmpModel.setUseBatch(true);
                tmpModel.setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo",
                    success: function (odata, resp) { sap.m.MessageToast.show("Target Updated"); },
                    error: function (odata, resp) { sap.m.MessageToast.show("Target Update Failed"); }
                };

                var supUpdData = {
                    "ClientID": this.getOwnerComponent()._clientId
                }
                var aFormElem = this.byId("addSupGoalUpdateForm").getFormContainers()[0].getFormElements();
                var supId = aFormElem[0].getFields()[0].getSelectedKey();
                var aItems = this.byId('supGoalTbl').getItems();
                for(var i in aItems){
                    if(aItems[i].getCells()[7].getText() == supId){
                        supUpdData.AssignmentID = aItems[i].getCells()[8].getText();
                        supUpdData.Status_Biz = aItems[i].getCells()[6].getText();
                        break;
                    }
                }
                supUpdData.GoalID = this._GoalID;
                supUpdData.SupplierID = supId;
                supUpdData.EmployeeID = aFormElem[1].getFields()[0].getSelectedKey();
                supUpdData.TargetAssigned = parseInt(aFormElem[0].getFields()[0].getSelectedItem().getCustomData()[0].getValue());
                supUpdData.TargetAchieved = parseInt(aFormElem[2].getFields()[0].getValue());
                supUpdData.AdditionalInfo = aFormElem[3].getFields()[0].getValue();
                
                tmpModel.create('/SupplierGoalUpdate', supUpdData, mParameters);
                tmpModel.submitChanges(mParameters);
                this.supGoalUpdDialog.close();
            },
            onCloseAddEmpUpdDlg: function (oEvent) {
                oEvent.getSource().getParent().close();   
            },
            onCloseAddSupUpdDlg: function (oEvent) {
                oEvent.getSource().getParent().close();   
            },
            onNavback: function(){
                // this.getView().getParent().getParent().setMode("ShowHideMode");
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
