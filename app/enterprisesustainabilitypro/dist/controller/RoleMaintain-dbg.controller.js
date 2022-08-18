sap.ui.define([
    "enterprisesustainabilitypro/controller/BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MessageBox, MessageToast) {
        "use strict";

        return BaseController.extend("enterprisesustainabilitypro.controller.RoleMaintain", {
            onInit: function () {
                this._oModel = this.getOwnerComponent().getModel();
            },
            onInitialise: function(oEvent){
                oEvent.getSource().getAllFilterItems()[2].setVisibleInFilterBar(true);
                oEvent.getSource().getAllFilterItems()[3].setVisibleInFilterBar(true);
                oEvent.getSource().getAllFilterItems()[4].setVisibleInFilterBar(true);
                oEvent.getSource().getAllFilterItems()[5].setVisibleInFilterBar(true);
                
            },
            onBeforeRebindTable: function(oEvent) {
                var mBindingParams = oEvent.getParameter( "bindingParams" );
                    mBindingParams.parameters[ "expand" ] = "RolePermissions" //  the search text itself!
              
                    oEvent.getSource().getToolbar().insertContent(new sap.m.Button({text:"Add", press:this.onAddRoleDialog.bind(this)}), 4);

            },
            onAddRoleDialog: function(oEvent) {
                if(!this._oAddDialog){
                        this._oAddDialog = sap.ui.xmlfragment("roleFragment", "enterprisesustainabilitypro.fragments.AddRole", this);
                        this.getView().addDependent(this._oAddDialog);
                }
                var oEntry = this.getOwnerComponent().getModel().createEntry("/RoleMaster");
                this._oAddDialog.getContent()[0].bindElement(oEntry.getPath());
                // var sPathToBind = oEvent.getSource().getBindingContext().getPath();
                // sap.ui.core.Fragment.byId("roleFragment","AddRoleForm").bindElement(sPathToBind);
            
                this._oAddDialog.open();
            },
            onDialogClose:function(oEvent){
                this._oAddDialog.close();
            },
            onItemPressed: function(oEvent){
                this.getRouter().navTo("RoleDetails",{RoleID:"34"});
            },
            onRoleSave: function(oEvent) {
                
            },
            onActivateUsers: function(oEvent){
                var aContexts = this.byId("idEmpUser").getSelectedContexts();
                for(var i in aContexts){
                    var obj = aContexts[i].getObject();
                    obj.UserStatus = "Active";
                    this.callODataMethod(this._oModel, "/UserLogin", "PATCH", [], obj)
                    .then(function(resp){
                        // MessageBox.success("Users Activated Successfully");
                    }.bind(this)).catch(function(oError){
                        // MessageBox.error("Users Activation failed");
                    })
                }
            }
        })
    })