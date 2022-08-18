sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
],
function(Controller, JSONModel) {

    return Controller.extend("sustainabilitypro.controller.Analytics", {
        onInit: function() {
            var dataSet = [{
                "SupplierName": "Almex Inc",
                "GHGEmissionsTotals": "Total Scope 1 GHG Emissions",
                "Value": "4000"
            },
            {
                "SupplierName": "Almex Inc",
                "GHGEmissionsTotals": "Total Scope 2 GHG Emissions",
                "Value": "3000"
            },
            {
                "SupplierName": "Almex Inc",
                "GHGEmissionsTotals": "Total Scope 3 GHG Emissions",
                "Value": "3999"
            },
            {
                "SupplierName": "Tate&Lyle, Inc",
                "GHGEmissionsTotals": "Total Scope 1 GHG Emissions",
                "Value": "50000"
            },
            {
                "SupplierName": "Tate&Lyle, Inc",
                "GHGEmissionsTotals": "Total Scope 2 GHG Emissions",
                "Value": "2500"
            },
            {
                "SupplierName": "Tate&Lyle, Inc",
                "GHGEmissionsTotals": "Total Scope 3 GHG Emissions",
                "Value": "2100"
            },
            {
                "SupplierName": "Ingredion , Inc.",
                "GHGEmissionsTotals": "Total Scope 1 GHG Emissions",
                "Value": "45000"
            },
            {
                "SupplierName": "Ingredion , Inc.",
                "GHGEmissionsTotals": "Total Scope 2 GHG Emissions",
                "Value": "4400"
            },
            {
                "SupplierName": "Ingredion , Inc.",
                "GHGEmissionsTotals": "Total Scope 3 GHG Emissions",
                "Value": "3100"
            },
            {
                "SupplierName": "Energy Technology Savings, Inc.",
                "GHGEmissionsTotals": "Total Scope 1 GHG Emissions",
                "Value": "32000"
            },
            {
                "SupplierName": "Energy Technology Savings, Inc.",
                "GHGEmissionsTotals": "Total Scope 2 GHG Emissions",
                "Value": "1500"
            },
            {
                "SupplierName": "Energy Technology Savings, Inc.",
                "GHGEmissionsTotals": "Total Scope 3 GHG Emissions",
                "Value": "2400"
            }];

            var ghgDatModel = new JSONModel(dataSet);

            var ghtViz = this.getView().byId("ghgReport");
            ghtViz.setModel(ghgDatModel, "ghgData");

            this.setWasteMeasureTrendData();
            this.settDataForWaterUse();

        },

        setWasteMeasureTrendData: function(){

            var wasteMeaData = [{
                "SupplierName": "Almex Inc",
                "WasteMeasuredAndTrended": "Total Hazardous Waste",
                "Value": "21"
            },
            {
                "SupplierName": "Almex Inc",
                "WasteMeasuredAndTrended": "Total Non-Hazardous Waste",
                "Value": "222"
            },
            {
                "SupplierName": "Almex Inc",
                "WasteMeasuredAndTrended": "Total Waste Recycled",
                "Value": "222"
            },
            {
                "SupplierName": "Energy Technology Savings, Inc.",
                "WasteMeasuredAndTrended": "Total Hazardous Waste",
                "Value": "33"
            },
            {
                "SupplierName": "Energy Technology Savings, Inc.",
                "WasteMeasuredAndTrended": "Total Non-Hazardous Waste",
                "Value": "200"
            },
            {
                "SupplierName": "Energy Technology Savings, Inc.",
                "WasteMeasuredAndTrended": "Total Waste Recycled",
                "Value": "150"
            },
            {
                "SupplierName": "Tate&Lyle, lnc.",
                "WasteMeasuredAndTrended": "Total Hazardous Waste",
                "Value": "21"
            },
            {
                "SupplierName": "Tate&Lyle, lnc.",
                "WasteMeasuredAndTrended": "Total Non-Hazardous Waste",
                "Value": "250"
            },
            {
                "SupplierName": "Tate&Lyle, lnc.",
                "WasteMeasuredAndTrended": "Total Waste Recycled",
                "Value": "320"
            },
            {
                "SupplierName": "Ingredion, lnc.",
                "WasteMeasuredAndTrended": "Total Hazardous Waste",
                "Value": "25"
            },
            {
                "SupplierName": "Ingredion, lnc.",
                "WasteMeasuredAndTrended": "Total Non-Hazardous Waste",
                "Value": "200"
            },
            {
                "SupplierName": "Ingredion, lnc.",
                "WasteMeasuredAndTrended": "Total Waste Recycled",
                "Value": "233"
            }];

            var wasteDataModel = new JSONModel(wasteMeaData);

            this.getView().byId("wasteMeasureTrend").setModel(wasteDataModel, "wasData");

         },

         settDataForWaterUse: function() {
             var waterUseData = [{
                "SupplierName": "Almex Inc",
                "WaterUseTarget": "Set Target",
                "Value": "75",
                "Year": "2026"
            },
            {
                "SupplierName": "Almex Inc",
                "WaterUseTarget": "Set Target",
                "Value": "90",
                "Year": "2028"
            },
            {
                "SupplierName": "Ingredion, Inc.",
                "WaterUseTarget": "Set Target",
                "Value": "65",
                "Year": "2026"
            },
            {
                "SupplierName": "Ingredion, Inc.",
                "WaterUseTarget": "Set Target",
                "Value": "80",
                "Year": "2028"
            },
            {
                "SupplierName": "Energy Technology Savings, Inc.",
                "WaterUseTarget": "Set Target",
                "Value": "80",
                "Year": "2026"
            },
            {
                "SupplierName": "Energy Technology Savings, Inc.",
                "WaterUseTarget": "Set Target",
                "Value": "91",
                "Year": "2028"
            },
            {
                "SupplierName": "Tate&Lyle, Inc.",
                "WaterUseTarget": "Set Target",
                "Value": "60",
                "Year": "2026"
            },
            {
                "SupplierName": "Tate&Lyle, Inc.",
                "WaterUseTarget": "Set Target",
                "Value": "80",
                "Year": "2028"
            }];

            var waterUseModel = new JSONModel(waterUseData);
            this.getView().byId("waterUseChart").setModel(waterUseModel, "waterUse");

         }
    });

});