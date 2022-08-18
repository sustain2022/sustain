// @ts-ignore
sap.ui.define([
    "sustainabilitypro/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sustainabilitypro/controller/oDataHelper"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (BaseController, JSONModel, History, Filter, oDataHelper) {
        "use strict";

        return BaseController.extend("susproapp.controller.login", {
            onInit: function () {
                this._oModel = this.getModel();
                if (localStorage.getItem('user')) {
                    this.getOwnerComponent()._clientId = localStorage.getItem('user');
                }
                // @ts-ignore

                var oRouter = this.getRouter();
                oRouter.getRoute("login").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function () {
                var oModel = new JSONModel();
                this.getOwnerComponent().setModel(oModel, "Login");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // this.getView().getParent().getParent().setMode("HideMode");
                var aFilters = [new Filter("Email", "EQ", localStorage.getItem('Email')),
                                new Filter("Password", "EQ", localStorage.getItem('Password'))
                               ];

                if (localStorage.getItem('user') != undefined) {
                    this.openBusyDialog();
                    oDataHelper.callGETOData(this._oModel, "/UserLogin", aFilters).then(function (resp) {
                        localStorage.setItem('user', resp.results[0].ClientID);
                        localStorage.setItem('Email', resp.results[0].Email);
                        localStorage.setItem('Password', resp.results[0].Password);
                        // this.getView().getParent().getParent().setMode("ShowHideMode");
                        this.getView().getParent().getParent().getSideContent().setVisible(true);
                        this.getOwnerComponent()._clientId = resp.results[0].ClientID;
                        // oRouter.navTo("detailsd1");
                        this._loadOrgChart();
                        // this._loadPermissions(resp.results[0].UserID);
                    }.bind(this))
                        .catch(function (oError) {
                            this.openMessageBox(JSON.parse(oError.responseText).error.message.value);
                            this.closeBusyDialog();
                        }.bind(this));
                }
            },
            onSubmit: function () {
                let requiredInputs = ['txtUserId', 'txtPwd'];
                var passedValidation = this.validateEventFeedbackForm(requiredInputs);

                if (passedValidation === false) {
                    //show an error message, rest of code will not execute.
                    return false;
                }

                var lForm = this.getView().getModel("Login").getData();
                // @ts-ignore
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.openBusyDialog();
                var aFilters = [new Filter("Email", "EQ", lForm.uname),
                                new Filter("Password", "EQ", lForm.pwd)];
                oDataHelper.callGETOData(this._oModel, "/UserLogin", aFilters).then(function (resp) {
                    localStorage.setItem('user', resp.results[0].ClientID);
                    localStorage.setItem('Email', resp.results[0].Email);
                    localStorage.setItem('Password', resp.results[0].Password);
                    // this.getView().getParent().getParent().setMode("ShowHideMode");
                    this.getView().getParent().getParent().getSideContent().setVisible(true);
                    this.getOwnerComponent()._clientId = resp.results[0].ClientID;
                    // oRouter.navTo("detailsd1");
                    this._loadOrgChart();
                    // this._loadPermissions(resp.results[0].UserID);
                   
                }.bind(this))
                .catch(function (oError) {
                    this.openMessageBox(JSON.parse(oError.responseText).error.message.value);
                    this.closeBusyDialog();
                }.bind(this));
            },
            _loadPermissions: function(UserID){
                let aFilters = [new Filter("UserID", "EQ", UserID)];
                let urlParameters = {"$expand": "RoleDettails/RolePermissions"};
                oDataHelper.callGETOData(this._oModel, "/UserAssignedRoles", aFilters, urlParameters)
                .then(function (resp){
                    var aPermissions = [];
                    for(let i in resp.results){
                        aPermissions = resp.results[i].RoleDettails.RolePermissions.PermissionByObject;
                        for(let j in aPermissions){
                            this.getOwnerComponent().getModel("auth").setProperty("/"+aPermissions[j].ObjectID,aPermissions[j]);
                        }
                    }
                    this.byId("BusyDialog").close();
                }.bind(this))
                .catch(function(oError){
                    this.openMessageBox(JSON.parse(oError.responseText).error.message.value);
                    this.closeBusyDialog();
                }.bind(this));
                
            },
            _loadOrgChart: function () {
                // this.getView().setBusy(true);
                this.openBusyDialog();
                oDataHelper.callGETOData(this._oModel,"/orgChart('" + this.getOwnerComponent()._clientId + "')")
                .then(function (resp) {
                        this.getModel("orgChart").setData(resp);
                        this.getRouter().navTo("detailsd1");
                        this.closeBusyDialog();
                    }.bind(this)
                ).catch(function(oError){
                    this.openMessageBox(JSON.parse(oError.responseText).error.message.value);
                    this.closeBusyDialog();
                }.bind(this))
            },
            validateEventFeedbackForm: function (requiredInputs) {
                var _self = this;
                var valid = true;
                requiredInputs.forEach(function (input) {
                    var sInput = _self.getView().byId(input);
                    if (sInput.getValue() == "" || sInput.getValue() == undefined) {
                        valid = false;
                        sInput.setValueState("Error");
                    } else {
                        sInput.setValueState("None");
                    }
                });
                return valid;
            },
            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined && sPreviousHash !== "") {
                    window.history.go(-1);
                }
            },
            onForgetPassword: function () {
                // @ts-ignore
                var oRouter = this.getRouter();
                oRouter.navTo("Targetforgotpassword");
            },

        });
    });