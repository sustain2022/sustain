sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("susproapp.controller.S1", {
            onInit: function () {
                if(localStorage.getItem('user')){
                    this.getOwnerComponent()._clientId = localStorage.getItem('user');
                    // this.getView().getParent().getParent().getSideContent().setVisible(true);
                }
                this.getOwnerComponent().getRouter().getRoute("masters1").attachPatternMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function(oEvent) {
                /*
                * Navigate to the first item by default only on desktop and tablet (but not phone).
                * Note that item selection is not handled as it is
                * out of scope of this sample
                */

                    // this.getOwnerComponent().getRouter()
                    //     .navTo("detailsd1");
                    this.getView().getParent().getParent().setMode("HideMode");
                    this.getOwnerComponent().getRouter()
                        .navTo("login");
        
            },
            onItemPress: function(oEvent) {
                switch (oEvent.getSource().getTitle()) {
                    case "Dashboard":
                        this.getOwnerComponent().getRouter().navTo("detailsd1");
                        break;
                    case "Team Management":
                        this.getOwnerComponent().getRouter().navTo("teammgmnt");
                        break;
                    case "Reports":
                        this.getOwnerComponent().getRouter().navTo("reports");
                        break;
                
                    default:
                        break;
                }
            },
            handleGoals: function() {
                    
                    this.getOwnerComponent().getRouter().navTo("goals");
            }

        });
    });
