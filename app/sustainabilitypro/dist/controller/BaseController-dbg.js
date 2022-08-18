// @ts-ignore
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function (Controller, UIComponent, MessageBox) {
    "use strict";

    return Controller.extend("sustainabilitypro.controller.BaseController",{
        getModel: function(sName) {
            if(sName){
                return this.getOwnerComponent().getModel(sName);
            }else{
                return this.getOwnerComponent().getModel();
            }
        },
        getRouter: function() {
            return UIComponent.getRouterFor(this);
        
        },
        openBusyDialog: function(){
            this.byId("BusyDialog").open();
        },
        closeBusyDialog: function(){
            this.byId("BusyDialog").close();
        },
        openMessageBox: function(sMsg,sType){
            sType = sType || "E";
            switch (sType) {
                case "E":
                    MessageBox.error(sMsg);
                    break;
                default:
                    break;
            }
        }
    })
})
