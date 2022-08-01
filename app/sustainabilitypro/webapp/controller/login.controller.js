// @ts-ignore
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sustainabilitypro/controller/oDataHelper"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (Controller, JSONModel, History, Filter, oDataHelper) {
        "use strict";

        return Controller.extend("susproapp.controller.login", {
            onInit: function () {
                this._oModel = this.getOwnerComponent().getModel();
                if (localStorage.getItem('user')) {
                    this.getOwnerComponent()._clientId = localStorage.getItem('user');
                }
                // @ts-ignore

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
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
                    this.byId("BusyDialog").open();
                    oDataHelper.callGETOData(this._oModel, "/UserLogin", aFilters).then(function (resp) {
                        localStorage.setItem('user', resp.results[0].ClientID);
                        localStorage.setItem('Email', resp.results[0].Email);
                        localStorage.setItem('Password', resp.results[0].Password);
                        // this.getView().getParent().getParent().setMode("ShowHideMode");
                        this.getView().getParent().getParent().getSideContent().setVisible(true);
                        this.getOwnerComponent()._clientId = resp.results[0].ClientID;
                        // oRouter.navTo("detailsd1");
                        this._loadOrgChart();
                        this._loadPermissions("Max12345");
                    }.bind(this))
                        .catch(function (oError) {
                            this.byId("BusyDialog").close();
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
                this.byId("BusyDialog").open();
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
                    this._loadPermissions("Max12345");
                   
                }.bind(this))
                .catch(function (oError) {
                    this.byId("BusyDialog").close();
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
                }.bind(this));
                
            },
            _loadOrgChart: function () {
                // this.getView().setBusy(true);
                this.getOwnerComponent().getModel().read("/orgChart('" + this.getOwnerComponent()._clientId + "')", {
                    success: function (resp) {
                        this.getOwnerComponent().getModel("orgChart").setData(resp);
                        sap.ui.core.UIComponent.getRouterFor(this).navTo("detailsd1");

                    }.bind(this)
                })
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
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Targetforgotpassword");
            },

        });
    });