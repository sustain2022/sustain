sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
], function (Controller, History, UIComponent) {
    "use strict";

    return Controller.extend("enterprisesustainabilitypro.controller.BaseController", {

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onNavBack: function () {
            var oHistory, sPreviousHash;

            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("Invite", {}, true /*no history*/);
            }
        },
        callODataMethod: function (oModel, sPath, method, aFilter, object) {
            return new Promise(function (resolve, reject) {
                switch (method) {
                    case "GET":
                            oModel.read(sPath, {
                                filters: aFilter,
                                success: function (resp) {
                                    resolve(resp);
                                },
                                error: function (error) {
                                    reject(error)
                                }
                            })
                        break;
                    case "POST":
                        oModel.create(sPath, object, {
                            success: function (resp) {
                                resolve(resp);
                            },
                            error: function (error) {
                                reject(error)
                            }
                        })
                        break;
                    case "PATCH":
                        oModel.update(sPath, object, {
                            success: function (resp) {
                                resolve(resp);
                            },
                            error: function (error) {
                                reject(error)
                            }
                        })
                        break;
                
                    default:
                        break;
                }
            })


        }

    });

});