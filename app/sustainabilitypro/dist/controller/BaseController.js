sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/UIComponent","sap/m/MessageBox"],function(e,o,t){"use strict";return e.extend("sustainabilitypro.controller.BaseController",{getModel:function(e){if(e){return this.getOwnerComponent().getModel(e)}else{return this.getOwnerComponent().getModel()}},getRouter:function(){return o.getRouterFor(this)},openBusyDialog:function(){this.byId("BusyDialog").open()},closeBusyDialog:function(){this.byId("BusyDialog").close()},openMessageBox:function(e,o){o=o||"E";switch(o){case"E":t.error(e);break;default:break}}})});