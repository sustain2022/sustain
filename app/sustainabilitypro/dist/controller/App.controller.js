sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("sustainabilitypro.controller.App",{onInit:function(){if(localStorage.getItem("user")){this.getOwnerComponent()._clientId=localStorage.getItem("user")}var e=this.byId("toolPage");e.setSideExpanded(!e.getSideExpanded());e.getSideContent().setVisible(false);var t=new sap.ui.model.json.JSONModel;var o=sap.ui.core.UIComponent.getRouterFor(this);t.setProperty("/regMsg",false);this.getOwnerComponent().setModel(t,"appProp");if(localStorage.getItem("user")!=undefined){}this.getOwnerComponent()._clientId="CL0001"},_onRouteMatched:function(){if(localStorage.getItem("user")!=undefined){var e=sap.ui.core.UIComponent.getRouterFor(this)}},onMenuButtonPress:function(){var e=this.byId("toolPage");e.setSideExpanded(!e.getSideExpanded())},onItemSelect:function(e){switch(e.getSource().getSelectedKey()){case"rootItem1":this.getOwnerComponent().getRouter().navTo("detailsd1");break;case"rootItem2":this.getOwnerComponent().getRouter().navTo("goals");break;case"rootItem3":this.getOwnerComponent().getRouter().navTo("teammgmnt");break;case"rootItem4":this.getOwnerComponent().getRouter().navTo("reports");break;case"rootItem5":this.getOwnerComponent().getRouter().navTo("analytics");default:break}}})});