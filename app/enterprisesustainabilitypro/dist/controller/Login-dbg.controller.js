sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        var _propModel = {};
        return Controller.extend("enterprisesustainabilitypro.controller.Login", {
            
            onInit: function () {
                _propModel = this.getOwnerComponent().getModel("prop");
                this.byId("idSimpleRegistration").setModel(new sap.ui.model.json.JSONModel());
            },
            onAction: function(oEvent){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                if(oEvent.getSource().getText() !== "Cancel"){
                    oEvent.getSource().setType("Emphasized");    
                }
                if(oEvent.getSource().getText() === "Register"){
                    this.byId("logButton").setType("Default");
                    _propModel.setProperty("/vRegister", true);
                }
                if(oEvent.getSource().getText() === "Login"){
                    this.byId("regButton").setType("Default");
                    
                    if(!_propModel.getProperty("/vRegister")){   
                        oRouter.navTo("Invite");
                    }else{
                        _propModel.setProperty("/vRegister", false);
                    }
                }
            }

        })
    })