// @ts-ignore
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',
    'sap/ui/table/Table',
    'sap/ui/comp/smarttable/SmartTable',
    "../utils/util"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, exportLibrary, Spreadsheet, Table, SmartTable, util) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        return Controller.extend("sustainabilitypro.controller.Reports", {
            onInit: function () {
                if(localStorage.getItem('user')){
                    this.getOwnerComponent()._clientId = localStorage.getItem('user');
                    // this.getView().getParent().getParent().getSideContent().setVisible(true);
                }
                // @ts-ignore
                this.getOwnerComponent().getRouter().getRoute("reports").attachPatternMatched(this._onRouteMatched, this);
                this.getOwnerComponent().getModel().read("/AgencyReportTemplate", {
                    urlParameters: { '$expand': 'AgencyReportTemplateDetails' }, 
                    filters: [new sap.ui.model.Filter({
                        path: "ClientID",
                        operator: 'EQ',
                        value1: this.getOwnerComponent()._clientId
                    })],
                    success: function (resp) {
                        this._templates = resp.results;
                        for (var i in this._templates) {
                            if (this._templates[i].TemplateType == "Internal") {
                                this.setReportTable(this._templates[i].TemplateID, 'Internal', this._templates[i].TemplateDescription);
                            } else {
                                this.setReportTable(this._templates[i].TemplateID, 'External', this._templates[i].TemplateDescription);
                            }
                        }
                    }.bind(this)
                });
                this._setReports = true;
            },
            _onRouteMatched: function () {
                if (this._templates && this._setReports) {
                    this.byId("panelIntReports").destroyContent();
                    this.byId("panelExtReports").destroyContent();
                    for (var i in this._templates) {
                        if (this._templates[i].TemplateType == "Internal") {
                            this.setReportTable(this._templates[i].TemplateID, 'Internal', this._templates[i].TemplateDescription);
                        } else {
                            this.setReportTable(this._templates[i].TemplateID, 'External', this._templates[i].TemplateDescription);
                        }
                    }
                    this._setReports = false;
                }

                // 
                // this.setReportTable('TID001', 'External','CDP Progress Data_AZ');
                // this.setReportTable('TID003', 'External','List of top R and D and Ops suppliers_AZ');
                // this.setReportTable('TID001', 'External','Tracking Top Suppliers_AZ');
                // this.setReportTable('TID001', 'External','EcoVadis TopSuppliers_AZ');               
            },

            setReportTable: function (sTemplate, type, header) {
                var oPanel = new sap.m.Panel({ headerText: header, expandable: true }).addStyleClass("sapUiResponsiveMargin");
                // var oTable =  new Table({selectionMode: 'Single', selectionBehavior: 'RowOnly'
                //     });
                // var index = 0;
                // var oTemplateID = new sap.ui.model.Filter("TemplateID",'EQ', sTemplate);
                // oTable.bindColumns({path:"/AgencyReportTemplateDetails", factory:function(sId, oContext) {
                //     var columnName = oContext.getObject().FieldName;
                //     index = index + 1;
                //     return new sap.ui.table.Column({
                //         width:"11rem",
                //         label: columnName,
                //         template: new sap.m.Text({text:"{Column"+index+"}"})
                //     });

                // }, filters:[oTemplateID]});

                // oTable.bindRows({path:"/AgencyReport", filters:[oTemplateID]});
                //    var initialCol = 'Column1,Column2,Column3,Column4,Column5,Column6,Column7,Column8,Column9,Column10,Column11,Column12,Column13,Column14,Column15,Column16,Column17,Column18,Column19,Column20,Column21,Column22,Column23,Column24,Column25,Column26,Column27,Column28,Column29,Column30,Column31,Column32,Column33,Column34,Column35,Column36,Column37,Column38,Column39,Column40,Column41,Column42,Column43,Column44,Column45,Column46,Column47,Column48,Column49,Column50,Column51,Column52,Column53,Column54,Column55,Column56,Column57,Column58,Column59,Column60,Column61,Column62,Column63,Column64,Column65,Column66,Column67,Column68,Column69,Column70'
                var personalizationObj = this._getInitiallyVisibleFields(sTemplate);
                // var ignoredFlds = "Column0,RecordNumber,SerialNo,TemplateID";
                var oTable = new SmartTable({
                    entitySet: "AgencyReport",
                    tableType: "Table",
                    useExportToExcel: true,
                    header: "Line Items",
                    showRowCount: true,
                    showFullScreenButton: true,
                    enableAutoBinding: true,
                    enableAutoColumnWidth: true,
                    ignoredFields: personalizationObj.ignoredFlds,
                    initiallyVisibleFields: personalizationObj.initialCol,
                    beforeRebindTable: this.onBeforeRebindTable.bind(this),
                    initialise: this.onInitialise.bind(this)
                })
                    .addStyleClass("sapUiResponsiveContentPadding")
                    .addCustomData(new sap.ui.core.CustomData({ key: sTemplate, value: sTemplate }));

                if (type === "Internal") {
                    this.byId("panelIntReports").addContent(oPanel.addContent(oTable));
                } else {
                    this.byId("panelExtReports").addContent(oPanel.addContent(oTable));
                }
            },
            onBeforeRebindTable: function (oEvent) {
                var sTemplate = oEvent.getSource().getCustomData()[0].getKey();
                var binding = oEvent.getParameter("bindingParams");
                var oFilter = new sap.ui.model.Filter("TemplateID", 'EQ', sTemplate);
                binding.filters.push(oFilter);
                var oTable = oEvent.getSource().getTable();
                this._setColumnHeaders(sTemplate, oTable.getColumns());
                oTable.setSelectionMode("None");
                // var length = oTable.getColumns().length;
                // for(let i=0; i<length;i++){
                //     oTable.autoResizeColumn(i);
                // }
            },
            onInitialise: function (oEvent) {
                oEvent.getSource().getTable().attachRowsUpdated(this._resizeColumns.bind(this));
                // var oTable = oEvent.getSource().getTable();
                // var length = oTable.getColumns().length;
                // for(let i=0; i<length;i++){
                //     oTable.autoResizeColumn(i);
                // }
            },
            _resizeColumns: function(oEvent){
                var oTable = oEvent.getSource();
                var length = oTable.getColumns().length;
                for(let i=length - 1; i >=0 ;i--){
                    oTable.autoResizeColumn(i);
                }
            },
            _setColumnHeaders: function (sTemplate, aColumns) {
                var pos = this._templates.map(function (e) {
                    return e.TemplateID;
                }).indexOf(sTemplate);
                var templtDet = this._templates[pos].AgencyReportTemplateDetails.results;
                for (var i in aColumns) {
                    if(aColumns[i].getLabel().getText() !== "ExportID" && aColumns[i].getLabel().getText() !=="CreatedAt"){
                        aColumns[i].getLabel().setText(templtDet[i].FieldName);
                    }
                }
            },
            _getInitiallyVisibleFields: function (sTemplate) {
                var pos = this._templates.map(function (e) {
                    return e.TemplateID;
                }).indexOf(sTemplate);
                var templtDet = this._templates[pos].AgencyReportTemplateDetails.results;
                let initiallyVisibleFields = "";
                let ignoredFlds = "Column0,RecordNumber,SerialNo,TemplateID,"
                for (let index = 1; index <= 70; index++) {
                    if (index <= templtDet.length) {
                        initiallyVisibleFields = initiallyVisibleFields + 'Column' + index + ",";
                    } else {
                        ignoredFlds = ignoredFlds + 'Column' + index + ",";
                    }
                }
                initiallyVisibleFields = initiallyVisibleFields + "ExportID,CreatedAt";
                return { initialCol: initiallyVisibleFields, ignoredFlds: ignoredFlds.slice(0,-1) };

            },
            createColumnConfig: function () {
                var aCols = [], index = 0;
                var aColumns = this._oTable.getColumns();

                for (var i in aColumns) {
                    index = index + 1;
                    aCols.push({
                        label: aColumns[i].getLabel().getText(),
                        property: 'Column' + index
                    });
                }
                return aCols;
            },

            onExport: function () {
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = this.byId('Report');
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding('rows');
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Table export sample.xlsx',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            onUploadRequest: function (oEvent) {
                if (!this.uploadDialog) {
                    this.uploadDialog = this.loadFragment({
                        name: "sustainabilitypro.fragments.UploadReports"
                    }).then(function (oDialog) {
                        this.uploadDialog = oDialog;
                        // this.byId('idSelectTemplate').addItem(new sap.ui.core.Item({key:"new",text:"New Template"}));
                        util.clientFilter(this,"idSelectTemplate","items");
                        oDialog.open();
                    }.bind(this));
                } else {
                    util.clientFilter(this,"idSelectTemplate","items");
                    this.uploadDialog.open();
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
                                "FieldValue": this._excelData[index][templtDet[i].FieldSRN - 1] ? this._excelData[index][templtDet[i].FieldSRN - 1].toString() : " "
                            }
                            finalData.push(nForm);

                        }
                        reportHeaderData.AgencyReportDetails = finalData;

                        tmpModel.create('/AgencyReportHeader', reportHeaderData, mParameters);
                        // tmpModel.submitChanges(mParameters);
                    }
                    tmpModel.submitChanges(mParameters);
                }
                this.uploadDialog.close();
            },
            onCloseUploadDlg: function () {
                this.byId("fileUploader").clear();
                this.uploadDialog.close();
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
                        this.getOwnerComponent().getModel().read("/AgencyReportTemplate", {
                            urlParameters: { '$expand': 'AgencyReportTemplateDetails' }, 
                            filters: [new sap.ui.model.Filter({
                                path: "ClientID",
                                operator: 'EQ',
                                value1: this.getOwnerComponent()._clientId
                            })],
                            success: function (resp) {
                                this._templates = resp.results;
                            }.bind(this)
                        });
                        sap.m.MessageToast.show("Template Created");
                    }.bind(this),
                    error: function (odata, resp) { 
                       
                        sap.m.MessageToast.show("Template Creation Failed"); 
                    }.bind(this)
                };

                var AgencyReportTemplate = {
                    "ClientID": this.getOwnerComponent()._clientId,
                    "TemplateName": this.byId('templateName').getValue(),
                    "TemplateType": this.byId('idSelectTemplateType').getSelectedKey(),
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
                tmpModel.submitChanges(mParameters);
            },
            onSelectingRBG: function (oEvent) {
                if (oEvent.getParameter('selectedIndex') === 0) {
                    this.byId('idSelectTemplate').setVisible(true);
                    this.byId('idSelectTemplateType').setVisible(false);
                    this.byId('dataStartingRow').setVisible(true);
                    this.byId('templateName').setVisible(false);
                    
                } else {
                    this.byId('idSelectTemplate').setVisible(false);
                    this.byId('idSelectTemplateType').setVisible(true);
                    this.byId('dataStartingRow').setVisible(false);
                    this.byId('templateName').setVisible(true);
                }
                this.byId("fileUploader").clear();
            },
            onTemplateSelection: function (oEvent) {
                oEvent.getSource().setValueState("None");
            }
        });
    });
