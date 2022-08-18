// @ts-ignore
sap.ui.define([
    "sustainabilitypro/controller/BaseController",
    "sap/ui/model/Filter",
    "../utils/util",
    "sustainabilitypro/controller/oDataHelper"    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Filter,util,oDataHelper) {
        "use strict";

        return BaseController.extend("sustainabilitypro.controller.SD1", {
            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel({client:"CL0001"});
                this.getOwnerComponent().setModel(oModel,"prop");
                if(localStorage.getItem('user')){
                    this.getOwnerComponent()._clientId = localStorage.getItem('user');
                    // this.getView().getParent().getParent().getSideContent().setVisible(true);
                }
                this.getRouter().getRoute("detailsd1").attachPatternMatched(this._onRouteMatched, this);
                this._readTemplates();
                
            },
            // @ts-ignore
            _onRouteMatched: function (oEvent) {
                //Checking if user is logged in
                // var logged_id = this.getOwnerComponent().getModel('appProp').getProperty('/clientId');
                // @ts-ignore
                // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                // if (logged_id == undefined) {
                //    // oRouter.navTo("login");
                // }else{
                    // @ts-ignore
                  //  var oModel = new sap.ui.model.json.JSONModel("/sustainability/GoalTemplate");
                  var aFilters = [new Filter({
                    path: "ClientID",
                    operator: 'EQ',
                    value1: this.getOwnerComponent()._clientId
                })];
                this.openBusyDialog();
                  oDataHelper.callGETOData(this.getModel(),'/GoalHeader/$count', aFilters)
                  .then(function (count) {
                        this.byId("idGoalTile").getTileContent()[0].getContent().setValue(count);
                        this.closeBusyDialog();
                }.bind(this))
                .catch(function(oError){
                    this.openMessageBox(JSON.parse(oError.responseText).error.message.value);
                    this.closeBusyDialog();
                }.bind(this))
                aFilters = [new Filter({
                    path: "ClientID",
                    operator: 'EQ',
                    value1: this.getOwnerComponent()._clientId
                }), new Filter({
                    path: "TeamType",
                    operator: 'EQ',
                    value1: "Internal"
                })];
                this.openBusyDialog();
                oDataHelper.callGETOData(this.getModel(),'/TeamHeader/$count',aFilters)
                .then(function (count) {
                    this.closeBusyDialog();
                        this.byId("idInternalTeamTile").getTileContent()[0].getContent().setValue(count);
                }.bind(this))
                .catch(function(oError){
                    this.openMessageBox(JSON.parse(oError.responseText).error.message.value);
                    this.closeBusyDialog();
                });

                aFilters = [new Filter({
                    path: "ClientID",
                    operator: 'EQ',
                    value1: this.getOwnerComponent()._clientId
                }), new Filter({
                    path: "TeamType",
                    operator: 'EQ',
                    value1: "External"
                })];
                this.openBusyDialog();
                oDataHelper.callGETOData(this.getModel(),'/TeamHeader/$count',aFilters)
                .then(function (count) {
                    this.closeBusyDialog();
                        this.byId("idExternalTeamTile").getTileContent()[0].getContent().setValue(count);
                }.bind(this))
                .catch(function(oError){
                    this.openMessageBox(JSON.parse(oError.responseText).error.message.value);
                    this.closeBusyDialog();
                });
               
            // }
            util.clientFilter(this,"GoalMenu","items");
            util.clientFilter(this,"idGoalsTable","items");
            },
            _readTemplates: function(){
                var aFilters = [new Filter({
                    path: "ClientID",
                    operator: 'EQ',
                    value1: this.getOwnerComponent()._clientId
                })];
                this.openBusyDialog();
                oDataHelper.callGETOData(this.getModel(),"/AgencyReportTemplate", aFilters, { '$expand': 'AgencyReportTemplateDetails' })
                 .then(function (resp) {
                     this.closeBusyDialog();
                        this._templates = resp.results;
                    }.bind(this))
                    .catch(function(oError){
                        this.openMessageBox(JSON.parse(oError.responseText).error.message.value);
                        this.closeBusyDialog();
                    }.bind(this))
            },
            openLogout: function () {
                localStorage.removeItem('user');
                localStorage.removeItem('Email');
                localStorage.removeItem('Password');
                this.getView().getParent().getParent().getSideContent().setVisible(false);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    
                this.getOwnerComponent().getModel('appProp').setData({});

                oRouter.navTo("login");
            },
            onMenuAction: function (oEvent) {
                this.getOwnerComponent().getRouter()
                    .navTo("detailsd2", { templateid: oEvent.getParameter('item').getKey() });
            },
            showGoalDetails: function(oEvent){
                this.getOwnerComponent()._sGoalDetPath = oEvent.getSource().getBindingContext().getPath();
                var obj = oEvent.getSource().getModel().getProperty(oEvent.getSource().getBindingContext().getPath());
                this.getOwnerComponent().getRouter()
                    .navTo("goaldet",{path:obj.GoalTemplateID+";"+obj.ClientID+";"+obj.GoalID});
            },
            onTilePress: function(oEvent){
                var sHeader = oEvent.getSource().getHeader();
                switch (sHeader) {
                    case "Total Goals Created":
                        this.getOwnerComponent().getRouter().navTo("goals");
                        break;
                    case "Internal Teams":
                        this.getOwnerComponent()._setSection = 'Internal Team';
                        this.getOwnerComponent().getRouter().navTo("teammgmnt");
                        break;
                    case "External Teams":
                        this.getOwnerComponent()._setSection = 'External Team';
                        this.getOwnerComponent().getRouter().navTo("teammgmnt");
                        break;                        
                
                    default:
                        break;
                }
                
            },
            onUploadRequest: function (oEvent) {
                if (!this.uploadDialog) {
                    this.uploadDialog = this.loadFragment({
                        name: "sustainabilitypro.fragments.UploadReports"
                    }).then(function (oDialog) {
                        this.uploadDialog = oDialog;
                        // this.byId('idSelectTemplate').addItem(new sap.ui.core.Item({key:"new",text:"New Template"}));
                        oDialog.open();
                    }.bind(this));
                } else {
                    this.uploadDialog.open();
                }
            },
            onSelectingRBG: function (oEvent) {
                if (oEvent.getParameter('selectedIndex') === 0) {
                    this.byId('idSelectTemplate').setVisible(true);
                    this.byId('dataStartingRow').setVisible(true);
                    this.byId('templateName').setVisible(false);
                    
                } else {
                    this.byId('idSelectTemplate').setVisible(false);
                    this.byId('dataStartingRow').setVisible(false);
                    this.byId('templateName').setVisible(true);
                }
            },
            onTemplateSelection: function (oEvent) {
                oEvent.getSource().setValueState("None");
            },
            onUpload: function (e) {
                this._import(e.getParameter("files") && e.getParameter("files")[0]);
            },

            _import: function (file) {
                var that = this;
                var excelData = {};
                if (file && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        workbook.SheetNames.forEach(function (sheetName) {
                            // Here is your object for every sheet in workbook
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], { header: 1 });

                        });
                        that._excelData = excelData;
                    };
                    reader.onerror = function (ex) {
                        console.log(ex);
                    };
                    reader.readAsBinaryString(file);
                }
            },
            onUploadReport: function () {
                var sTemplate = this.byId("idSelectTemplate").getSelectedKey();
                if (sTemplate == '' && this.byId("rbgUpload").getSelectedIndex() == 0) {
                    this.byId("idSelectTemplate").setValueState("Error");
                    return;
                }
                if (this.byId("rbgUpload").getSelectedIndex() == 1) {
                    this.createTemplate();
                } else {
                    var sDataRow = this.byId("dataStartingRow").getValue();

                    var pos = this._templates.map(function (e) {
                        return e.TemplateID;
                    }).indexOf(sTemplate);
                    var templtDet = this._templates[pos].AgencyReportTemplateDetails.results;

                    var tmpModel = this.getOwnerComponent().getModel();
                    // tmpModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                    tmpModel.setUseBatch(true);
                    tmpModel.setDeferredGroups(["foo"]);
                    var mParameters = {
                        groupId: "foo",
                        success: function (odata, resp) {
                            sap.m.MessageToast.show("Uploaded");
                            this._setReports = true;
                            this._onRouteMatched();
                        }.bind(this),
                        error: function () { }
                    }


                    for (var index in this._excelData) {
                        if (index < sDataRow) {
                            continue;
                        }
                        var reportHeaderData = {
                            "TemplateID": sTemplate,
                            "ClientID": this.getOwnerComponent()._clientId
                        }
                        var finalData = [];
                        for (var i in templtDet) {

                            var nForm = {
                                "TemplateID": sTemplate,
                                "ClientID": this.getOwnerComponent()._clientId,
                                "FieldID": templtDet[i].FieldID,
                                "FieldValue": this._excelData[index][templtDet[i].FieldSRN - 1].toString()
                            }
                            finalData.push(nForm);

                        }
                        reportHeaderData.AgencyReportDetails = finalData;

                        tmpModel.create('/AgencyReportHeader', reportHeaderData, mParameters);
                        // tmpModel.submitChanges(mParameters);
                    }
                    // tmpModel.submitChanges(mParameters);
                }
                this.uploadDialog.close();
            },
            createTemplate: function(){
                var finalData = [];
                var tmpModel = this.getOwnerComponent().getModel();
                var goalModel = this.getOwnerComponent().getModel("goals");
                // tmpModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                tmpModel.setUseBatch(true);
                tmpModel.setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo",
                    success: function (odata, resp) {
                        
                        sap.m.MessageToast.show("Template Created");
                    }.bind(this),
                    error: function (odata, resp) { 
                       
                        sap.m.MessageToast.show("Template Creation Failed"); 
                    }.bind(this)
                };

                var AgencyReportTemplate = {
                    "ClientID": this.getOwnerComponent()._clientId,
                    "TemplateName": this.byId('templateName').getValue(),
                    "TemplateDescription": this.byId('templateName').getValue()
                }
                

                var aFormElem = this._excelData[0];
                for (var i in aFormElem) {                  
                        // var fldType = aFormElem[i].getFields()[0].getMetadata().getName();

                        var nForm = {
                            "ClientID": this.getOwnerComponent()._clientId,
                            "FieldID": parseInt(i) + 1,
                            "FieldSRN": parseInt(i) + 1,
                            "FieldName": aFormElem[i],
                            "FieldDescription": aFormElem[i]
                        }
                        finalData.push(nForm);
                    

                }

                AgencyReportTemplate.AgencyReportTemplateDetails = finalData;

                tmpModel.create('/AgencyReportTemplate', AgencyReportTemplate, mParameters);
                // tmpModel.submitChanges(mParameters);
            },
            onCloseUploadDlg: function () {
                this.uploadDialog.close();
            },
            handleGoalFilter: function () {
                if (!this.goalFilterDialog) {
                        this.goalFilterDialog = this.loadFragment({
                            name: "sustainabilitypro.fragments.GoalFilter"
                        }).then(function (oDialog) {
                            this.goalFilterDialog = oDialog;
                            // this.byId('idSelectTemplate').addItem(new sap.ui.core.Item({key:"new",text:"New Template"}));
                            oDialog.open();
                        }.bind(this));
                    } else {
                        this.goalFilterDialog.open();
                    }
            },
            handleFilterConfirm:function(oEvent){
                
                var oBinding = this.byId("idGoalsTable").getBinding("items"), sQuery;
                if(oEvent.getParameter("filterCompoundKeys")[1]){
                    var aKeys = Object.keys(oEvent.getParameter("filterCompoundKeys")[1]);
                    for(var i in aKeys){
                        if(i == 0){
                            sQuery = "DepartmentAssignment/any(d:d/DepartmentID eq '"+aKeys[i]+"')";
                        }else{
                            sQuery = sQuery + " or DepartmentAssignment/any(d:d/DepartmentID eq '"+aKeys[i]+"')";
                        }
                    }
                    oBinding.sFilterParams = oBinding.sFilterParams + " and ("+sQuery+")";
                    oBinding.refresh();
                }
                // if(oEvent.getParameter("filterCompoundKeys")[2]){
                //     var aKeys = Object.keys(oEvent.getParameter("filterCompoundKeys")[2]);
                //     for(var i in aKeys){
                //         if(i == 0){
                //             sQuery = "EmployeeAssignment/any(e:e/DepartmentID eq '"+aKeys[i]+"')";
                //         }else{
                //             sQuery = sQuery + " or DepartmentAssignment/any(d:d/DepartmentID eq '"+aKeys[i]+"')";
                //         }
                //     }
                //     oBinding.sFilterParams = oBinding.sFilterParams + " and ("+sQuery+")";
                //     oBinding.refresh();
                // }        
            else{
                oBinding.sFilterParams = "$filter=ClientID eq '"+this.getOwnerComponent()._clientId+"'";
                oBinding.refresh();
            }
                
            }
        });
    });
