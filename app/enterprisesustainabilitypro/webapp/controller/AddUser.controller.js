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
        return BaseController.extend("enterprisesustainabilitypro.controller.AddUser", {
            onInit: function () {
                this._oModel = this.getOwnerComponent().getModel();
                var sPath = this.getOwnerComponent().getModel().createEntry("/EmployeeUser").getPath();
                this.byId("FormAddUser").bindElement(sPath);
            },
            onAddUserAction: function(oEvent){
                var obj = this.byId("FormAddUser").getBindingContext().getObject();
                this.callODataMethod(this._oModel, "/EmployeeUser", "POST", [], obj)
                .then(function(resp){
                    MessageBox.success("User Created Successfully");
                }.bind(this)).catch(function(oError){
                    MessageBox.error("User Creation failed");
                })
            }
        })
    })