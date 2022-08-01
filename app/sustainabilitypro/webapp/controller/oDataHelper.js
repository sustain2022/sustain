sap.ui.define([], function () {
    return {
        callGETOData: function (oModel, sPath, aFilters, urlParameters) {
            return new Promise(function (resolve, reject) {
                aFilters = aFilters || [];
                urlParameters = urlParameters || {};
                oModel.read(sPath, {
                    filters: aFilters,
                    urlParameters: urlParameters,
                    success: function (oData) {
                        resolve(oData);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                })
            })
        },
        callPOSTOData: function (oModel, sPath, oData) {
            return new Promise(function (resolve, reject) {
                oModel.create(sPath, oData, {
                    success: function (oDataReturn) {
                        resolve(oDataReturn);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                })
            })
        }
    }
})