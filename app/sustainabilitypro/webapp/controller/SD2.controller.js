sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Input",
    "sap/m/TextArea",
    "sap/m/DatePicker",
    "sap/ui/layout/form/FormElement",
    "sap/ui/core/Fragment",
    "../utils/util"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Input, TextArea, DatePicker, FormElement, Fragment, util) {
        "use strict";

        return Controller.extend("susproapp.controller.SD2", {
            onInit: function () {
                if(localStorage.getItem('user')){
                    this.getOwnerComponent()._clientId = localStorage.getItem('user');
                    // this.getView().getParent().getParent().getSideContent().setVisible(true);
                }
                this.getOwnerComponent().getRouter().getRoute("detailsd2").attachPatternMatched(this._onRouteMatched, this);

                this._formFragments = {};

                // Set the initial form to be the display one
                this._showFormFragment("/Change");

            },
            _onRouteMatched: function (oEvent) {
                this._templateid = oEvent.getParameter("arguments").templateid;

                this.getOwnerComponent().getModel().read("/GoaTemplateFields", {
                    filters: [new sap.ui.model.Filter({
                        path: "GoalTemplateID",
                        operator: 'EQ',
                        value1: this._templateid
                    }), new sap.ui.model.Filter({
                        path: "ClientID",
                        operator: 'EQ',
                        value1: this.getOwnerComponent()._clientId
                    })],
                    success: function (resp) {
                        this._aFields = resp.results;
                        this._generateFields(resp.results);
                    }.bind(this)
                });
            },
            _generateFields: function (aFields) {
                var oFormCont = this.byId("FormGoal").getFormContainers()[0];
                oFormCont.destroyFormElements();
                aFields.sort(function (a, b) {
                    return a.FieldSRN - b.FieldSRN;
                });
                
                for (var i in aFields) {
                    // if (aFields[i].FieldSRN % 2 == 1) {
                        oFormCont.addFormElement(new FormElement({ label: aFields[i].FieldName, fields: [util.getEditField(aFields[i])] }));
                    // }
                }
                // for (var i in aFields) {
                //     if (aFields[i].FieldSRN % 2 == 0) {
                //         oFormCont.addFormElement(new FormElement({ label: aFields[i].FieldName, fields: [util.getEditField(aFields[i])] }));
                //     }
                // }
                oFormCont.addFormElement(new FormElement({ label: "Impact Category", fields: [new sap.m.Select({items:[new sap.ui.core.Item({ key:"Environmental", text:"Environmental" }),
                                                                                                new sap.ui.core.Item({ key:"Social", text:"Social" }),
                                                                                                new sap.ui.core.Item({ key:"Economical", text:"Economical" })
                                                                                                ], customData: [new sap.ui.core.CustomData({ key: "FldId", value: "IC" }), 
                                                                                                                new sap.ui.core.CustomData({ key: "FldName", value: "Impact Category" })]})]
                                                                                                }));
            },
            onBeforeRendering: function (oEvent) {

            },
            onNavPress: function () {
                this._toggleButtonsAndView(true);
                this.getOwnerComponent().getRouter()
                    .navTo("detailsd1");
            },
            // onPreview: function () {
            //     this.getOwnerComponent().getRouter()
            //         .navTo("previewsd2");
            // },
            onSaveSubmit: function(oEvent){
                if(oEvent.getSource().getText() == "Save"){
                    this._onSave();
                }else{
                    this._onSubmit();
                }
            },
            _onSave: function () {
                //var oModel = new sap.ui.model.json.JSONModel();
                var finalData = [];
                var tmpModel = this.getOwnerComponent().getModel();
                var goalModel = this.getOwnerComponent().getModel("goals");
                // tmpModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                tmpModel.setUseBatch(true);
                tmpModel.setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo",
                    success: function (odata, resp) {
                        var oTemplate =  new sap.ui.layout.form.FormElement({label:"{GoalFields/FieldName}",fields:[new sap.m.Text({text:"{FieldValue}"})]});
                        if(odata.GoalID != undefined){
                            this._savedGoal = odata;
                            this.byId('FormDisplay354').getFormContainers()[0].destroyFormElements();
                            this.byId('FormDisplay354').getFormContainers()[0].addFormElement(new sap.ui.layout.form.FormElement({label:"Goal Name",
                                fields:[new sap.m.Text({text:odata.GoalName})]})
                                );
                            this.byId('FormDisplay354').getFormContainers()[0].addFormElement(new sap.ui.layout.form.FormElement({label:"Visibility",
                            fields:[new sap.m.Text({text:odata.Visibility})]})
                            );
                            this.byId('FormDisplay354').getFormContainers()[0].addFormElement(new sap.ui.layout.form.FormElement({label:"Impact Category",
                            fields:[new sap.m.Text({text:odata.ImpactCategory})]})
                            );
                            this.byId('FormDisplay354').getFormContainers()[0].addFormElement(new sap.ui.layout.form.FormElement({label:"Metric",
                            fields:[new sap.m.Text({text:odata.Metric})]})
                            );
                            this.byId('FormDisplay354').getFormContainers()[0].addFormElement(new sap.ui.layout.form.FormElement({label:"Begin Date",
                            fields:[new sap.m.Text({text:odata.BeginDate})]})
                            );
                            this.byId('FormDisplay354').getFormContainers()[0].addFormElement(new sap.ui.layout.form.FormElement({label:"End Date",
                            fields:[new sap.m.Text({text:odata.EndDate})]})
                            );      
                            this.byId('FormDisplay354').getFormContainers()[1].destroyFormElements();                                                                             
                            this.byId('FormDisplay354').getFormContainers()[1].bindAggregation("formElements",{path:"/GoalHeader(GoalTemplateID='"+odata.GoalTemplateID+"',ClientID='"+odata.ClientID+"',GoalID="+parseInt(odata.GoalID)+")/GoalDetails",parameters:{'expand':'GoalFields'},template:oTemplate});
                        }
                        sap.m.MessageToast.show("Goal Saved");
                    }.bind(this),
                    error: function (odata, resp) { 
                        var oTemplate =  new sap.ui.layout.form.FormElement({label:"{GoalFields/FieldName}",fields:[new sap.m.Text({text:"{FieldValue}"})]});
                        sap.m.MessageToast.show("Goal Saving Failed"); 
                    }.bind(this)
                };

                var goalHeaderData = {
                    "GoalTemplateID": this._templateid,
                    "ClientID": this.getOwnerComponent()._clientId
                }
                
                goalHeaderData.GoalStatus_Sys = "1";

                var aFormElem = this.byId("FormGoal").getFormContainers()[0].getFormElements();
                for (var i in aFormElem) {
                    var fldId = aFormElem[i].getFields()[0].getCustomData()[0].getValue();
                    var fldName = aFormElem[i].getFields()[0].getCustomData()[1].getValue();
                    if (fldName == "Visibility") {
                        goalHeaderData.Visibility = this._getFieldValue(aFormElem[i].getFields()[0]);
                    }
                    else if(fldName == "Goal Name"){
                        goalHeaderData.GoalName = this._getFieldValue(aFormElem[i].getFields()[0]);
                    }
                    else if(fldName == "Status"){
                        goalHeaderData.GoalStaus_Biz = this._getFieldValue(aFormElem[i].getFields()[0]);
                    }
                    else if(fldName == "Metric"){
                        goalHeaderData.Metric = this._getFieldValue(aFormElem[i].getFields()[0]);
                    }
                    else if(fldName == "%Complete"){
                        goalHeaderData.GoalCompletion = this._getFieldValue(aFormElem[i].getFields()[0]);
                    }
                    else if(fldName == "Begin date"){
                        goalHeaderData.BeginDate = this._getFieldValue(aFormElem[i].getFields()[0]);
                    }
                    else if(fldName == "End Date"){
                        goalHeaderData.EndDate = this._getFieldValue(aFormElem[i].getFields()[0]);
                    }
                    else if(fldName == "Impact Category"){
                        goalHeaderData.ImpactCategory = this._getFieldValue(aFormElem[i].getFields()[0]);
                    }
                    else {
                        // var fldType = aFormElem[i].getFields()[0].getMetadata().getName();

                        var nForm = {
                            "GoalTemplateID": this._templateid,
                            "ClientID": this.getOwnerComponent()._clientId,
                            "FieldID": fldId,
                            "FieldValue": this._getFieldValue(aFormElem[i].getFields()[0])
                        }
                        finalData.push(nForm);
                    }

                }

                goalHeaderData.GoalDetails = finalData;
                goalModel.setProperty("/displayFields",goalHeaderData);
                tmpModel.create('/GoalHeader', goalHeaderData, mParameters);
                tmpModel.submitChanges(mParameters);
                this._toggleButtonsAndView(false);
            },
            _onSubmit:function(){
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(true);
                oModel.setDeferredGroups(["foo"]);
                var mParameters = {
                    groupId: "foo",
                    success: function (odata, resp) {
                        this.getOwnerComponent().getRouter().navTo("detailsd1");
                        sap.m.MessageToast.show("Goal Submitted");
                    }.bind(this),
                    error: function(resp){
                        sap.m.MessageToast.show("Goal Submit Failed");
                    }.bind(this)
                }
                    
                oModel.update("/GoalHeader(GoalTemplateID='"+this._savedGoal.GoalTemplateID+"',ClientID='"+this._savedGoal.ClientID+"',GoalID="+parseInt(this._savedGoal.GoalID)+")",{GoalStatus_Sys: "2"}, mParameters);

                oModel.submitChanges(mParameters);
            },
            _getFieldValue: function (oControl) {
                var sControlName = oControl.getMetadata().getName();

                switch (sControlName) {
                    case 'sap.m.Select':
                        return oControl.getSelectedItem().getText();
                        break;
                    case 'sap.m.Input':
                        return oControl.getValue();
                        break;
                    case 'sap.m.TextArea':
                        return oControl.getValue();
                        break;
                    case 'sap.m.DatePicker':
                        return oControl.getDateValue();
                        break;
                    default:
                        break;
                }
            },
            /* fragment code */


            handleEditPress: function () {

                //Clone the data
                // this._oSupplier = Object.assign({}, this.getView().getModel().getData().SupplierCollection[0]);
                this._toggleButtonsAndView(true);

            },

            handleCancelPress: function () {

                this.getOwnerComponent().getRouter()
                    .navTo("detailsd1");

            },

            _toggleButtonsAndView: function (bEdit) {
                var oView = this.getView();

                // Show the appropriate action buttons
                oView.byId("edit").setVisible(!bEdit);
                oView.byId("save").setVisible(bEdit);
                oView.byId("submit").setVisible(!bEdit);
                oView.byId("cancel").setVisible(bEdit);

                // Set the right form type
                this._showFormFragment(bEdit ? "/Change" : "/Display");
            },

            _getFormFragment: function (sFragmentName) {
                var pFormFragment = this._formFragments[sFragmentName],
                    oView = this.getView();

                if (!pFormFragment) {
                    pFormFragment = Fragment.load({
                        id: oView.getId(),
                        name: "sustainabilitypro.fragments." + sFragmentName
                    });
                    this._formFragments[sFragmentName] = pFormFragment;
                }

                return pFormFragment;
            },

            _showFormFragment: function (sFragmentName) {
                var oPage = this.byId("sd2fragments");

                oPage.removeAllContent();
                this._getFormFragment(sFragmentName).then(function (oVBox) {
                    oPage.insertContent(oVBox);
                });
            }
            // onAddFragment: function(){
            //     var oFragment = sap.ui.xmlfragment(this.getView().getId(), "sustainabilitypro/fragments/Change", this);
            //     this.byId("sd2fragments").addContent(oFragment);
            // }         
        });
    });