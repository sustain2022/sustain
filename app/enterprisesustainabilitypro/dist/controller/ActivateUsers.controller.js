sap.ui.define(["enterprisesustainabilitypro/controller/BaseController","sap/m/MessageBox","sap/m/MessageToast"],function(t,e,s){"use strict";return t.extend("enterprisesustainabilitypro.controller.ActivateUsers",{onInit:function(){this._oModel=this.getOwnerComponent().getModel()},onActivateUsers:function(t){var e=this.byId("idEmpUser").getSelectedContexts();for(var s in e){var n=e[s].getObject();n.UserStatus="Active";this.callODataMethod(this._oModel,"/UserLogin","PATCH",[],n).then(function(t){}.bind(this)).catch(function(t){})}}})});