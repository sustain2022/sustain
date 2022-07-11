// @ts-ignore
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (Controller, JSONModel, History) {
        "use strict";
       
        return Controller.extend("susproapp.controller.login", {
            onInit: function () {
                if(localStorage.getItem('user')){
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
                
                if (localStorage.getItem('user') != undefined) {
                    this.getOwnerComponent().getModel().read("/UserLogin", {
                        urlParameters: {
                            '$filter': "Email eq '" + localStorage.getItem('Email') + "' and Password eq '" + localStorage.getItem('Password') + "'"
                        },
                        success: function (resp) {
                            localStorage.setItem('user', resp.results[0].ClientID);
                            localStorage.setItem('Email', resp.results[0].Email);
                            localStorage.setItem('Password', resp.results[0].Password);
                            // this.getView().getParent().getParent().setMode("ShowHideMode");
                            this.getView().getParent().getParent().getSideContent().setVisible(true);
                            this.getOwnerComponent()._clientId = resp.results[0].ClientID;
                            oRouter.navTo("detailsd1");
                        }.bind(this)
                    });
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
                
                this.getOwnerComponent().getModel().read("/UserLogin", {
                    urlParameters: {
                        '$filter': "Email eq '" + lForm.uname + "' and Password eq '" + lForm.pwd + "'"
                    },
                    success: function (resp) {
                        localStorage.setItem('user', resp.results[0].ClientID);
                        localStorage.setItem('Email', resp.results[0].Email);
                        localStorage.setItem('Password', resp.results[0].Password);
                        // this.getView().getParent().getParent().setMode("ShowHideMode");
                        this.getView().getParent().getParent().getSideContent().setVisible(true);
                        this.getOwnerComponent()._clientId = resp.results[0].ClientID;
                        oRouter.navTo("detailsd1");
                    }.bind(this)
                });
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