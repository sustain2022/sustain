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