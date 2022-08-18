sap.ui.define(["enterprisesustainabilitypro/controller/BaseController","sap/m/MessageBox","sap/m/MessageToast"],function(e,t,i){"use strict";return e.extend("enterprisesustainabilitypro.controller.RoleMaintain",{onInit:function(){this._oModel=this.getOwnerComponent().getModel()},onInitialise:function(e){e.getSource().getAllFilterItems()[2].setVisibleInFilterBar(true);e.getSource().getAllFilterItems()[3].setVisibleInFilterBar(true);e.getSource().getAllFilterItems()[4].setVisibleInFilterBar(true);e.getSource().getAllFilterItems()[5].setVisibleInFilterBar(true)},onBeforeRebindTable:function(e){var t=e.getParameter("bindingParams");t.parameters["expand"]="RolePermissions";e.getSource().getToolbar().insertContent(new sap.m.Button({text:"Add",press:this.onAddRoleDialog.bind(this)}),4)},onAddRoleDialog:function(e){if(!this._oAddDialog){this._oAddDialog=sap.ui.xmlfragment("roleFragment","enterprisesustainabilitypro.fragments.AddRole",this);this.getView().addDependent(this._oAddDialog)}var t=this.getOwnerComponent().getModel().createEntry("/RoleMaster");this._oAddDialog.getContent()[0].bindElement(t.getPath());this._oAddDialog.open()},onDialogClose:function(e){this._oAddDialog.close()},onItemPressed:function(e){this.getRouter().navTo("RoleDetails",{RoleID:"34"})},onRoleSave:function(e){},onActivateUsers:function(e){var t=this.byId("idEmpUser").getSelectedContexts();for(var i in t){var o=t[i].getObject();o.UserStatus="Active";this.callODataMethod(this._oModel,"/UserLogin","PATCH",[],o).then(function(e){}.bind(this)).catch(function(e){})}}})});