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
        return BaseController.extend("enterprisesustainabilitypro.controller.MaintainDepartment", {
            onInit: function () {
                this._oModel = this.getOwnerComponent().getModel();
                var sPath = this.getOwnerComponent().getModel().createEntry("/EmployeeUser").getPath();
                this.byId("FormAddDepartment").bindElement(sPath);
            },
            onAddDepAction: function(oEvent){
                var obj = this.byId("FormAddDepartment").getBindingContext().getObject();
                this.callODataMethod(this._oModel, "/DepartmentHeader", "POST", [], obj)
                .then(function(resp){
                    MessageBox.success("Department Created Successfully");
                }.bind(this)).catch(function(oError){
                    MessageBox.error("Department Creation failed");
                })
            }
        })
    })