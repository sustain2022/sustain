sap.ui.define([
    "enterprisesustainabilitypro/controller/BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MessageBox, MessageToast, Filter) {
        "use strict";
        var _propModel = {};
        return BaseController.extend("enterprisesustainabilitypro.controller.Login", {

            onInit: function () {
                _propModel = this.getOwnerComponent().getModel("prop");
                this.byId("idSimpleLogin").setModel(new sap.ui.model.json.JSONModel());
            },
            onAction: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                if (oEvent.getSource().getText() == "Login") {
                    _propModel.setProperty("/vRegister", false);
                } else {
                    _propModel.setProperty("/vRegister", true);
                }
                // if(oEvent.getParameter("key") !== "Cancel"){
                //     // oEvent.getSource().setType("Emphasized");    
                // }
                // if(oEvent.getParameter("key") === "Register"){
                //     this.byId("logButton").setType("Default");
                //     _propModel.setProperty("/vRegister", true);
                // }
                // if(oEvent.getParameter("key") === "Login"){
                //     this.byId("regButton").setType("Default");

                //     if(!_propModel.getProperty("/vRegister")){   
                //         oRouter.navTo("Invite");
                //     }else{
                //         _propModel.setProperty("/vRegister", false);
                //     }
                // }
            },
            onLogin: function (oEvent) {
                var aFilter = [];
                var Email = this.byId("idSimpleLogin").getModel().getProperty("/Email");
                var Password = this.byId("idSimpleLogin").getModel().getProperty("/Password");
                aFilter.push(new Filter("Email", "EQ", Email));
                aFilter.push(new Filter("Password", "EQ", Password));
                this.callODataMethod(this.getOwnerComponent().getModel(), "/UserLogin", "GET", aFilter).then(function (resp) {
                    if (resp.results.length !== 0) {
                        MessageToast.show("Login Successful",{duration:3000});
                        this.getRouter().navTo("Invite");
                    }
                    else{
                        MessageBox.error("Login Failed");
                    }
                }.bind(this)).catch(function (error) {
                    MessageBox.error(JSON.parse(error.responseText).error.innererror.errordetails[0].message);
                })
            },
            onRegister: function (oEvent) {
                this.getOwnerComponent().getMoldel().createEntry("/")
            }

        })
    })