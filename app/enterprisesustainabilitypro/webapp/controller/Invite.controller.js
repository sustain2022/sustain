sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("enterprisesustainabilitypro.controller.Invite", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Invite").attachPatternMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function(oEvent){
                this.getView().getParent().getParent().getSideContent().setVisible(true);                
            }
        })
    })