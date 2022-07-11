sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Input",
    "sap/m/TextArea",
    "sap/m/DatePicker",
    "sap/ui/layout/form/FormElement",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Input, TextArea, DatePicker, FormElement, JSONModel,History) {
        "use strict";

        return Controller.extend("susproapp.controller.SD2previewdata", {
            onInit: function () {
                if(localStorage.getItem('user')){
                    this.getOwnerComponent()._clientId = localStorage.getItem('user');
                    // this.getView().getParent().getParent().getSideContent().setVisible(true);
                }
                this.getOwnerComponent().getRouter().getRoute("detailsd2").attachPatternMatched(this._onRouteMatched, this);                    
              },
            
           
            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
    
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("overview", true);
                }
            }
            

              
        });
    });
