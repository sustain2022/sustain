// @ts-ignore
sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sustainabilitypro.controller.App", {
            onInit: function () {

                if(localStorage.getItem('user')){
                    this.getOwnerComponent()._clientId = localStorage.getItem('user');
                    // this.getView().getParent().getParent().getSideContent().setVisible(true);
                }
                var toolPage = this.byId("toolPage");
    
                toolPage.setSideExpanded(!toolPage.getSideExpanded());
                toolPage.getSideContent().setVisible(false);
                // @ts-ignore
                var oModel = new sap.ui.model.json.JSONModel();
                // @ts-ignore
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                
                oModel.setProperty("/regMsg", false);
                
                this.getOwnerComponent().setModel(oModel, "appProp");

                if (localStorage.getItem('user') != undefined) {
                    //this.getOwnerComponent().byId('app').setBusy(true);
                   // oRouter.navTo("login");
                }
                this.getOwnerComponent()._clientId = 'CL0001';
                
            },
            _onRouteMatched: function () {
                if (localStorage.getItem('user') != undefined) {
                    // @ts-ignore
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                  //  oRouter.navTo("login");
                }
            },
            onMenuButtonPress : function() {
                var toolPage = this.byId("toolPage");
    
                toolPage.setSideExpanded(!toolPage.getSideExpanded());
            },
            onItemSelect: function(oEvent){
                switch (oEvent.getSource().getSelectedKey()) {
                    case "rootItem1":
                        this.getOwnerComponent().getRouter().navTo("detailsd1");
                        break;
                    case "rootItem2":
                        this.getOwnerComponent().getRouter().navTo("goals");
                        break;                        
                    case "rootItem3":
                        this.getOwnerComponent().getRouter().navTo("teammgmnt");
                        break;
                    case "rootItem4":
                        this.getOwnerComponent().getRouter().navTo("reports");
                        break;
                    case "rootItem5":
                        this.getOwnerComponent().getRouter().navTo("analytics");
                    case "rootItem6":
                        this.getOwnerComponent().getRouter().navTo("OrgStructure");                        
                    default:
                        break;
                }
            }
        });
    });
