sap.ui.define([
    "sap/ui/model/Filter",
    "sap/m/Select",
    "sap/m/TextArea",
    "sap/m/DatePicker",
    "sap/m/Input",
    "sap/ui/core/CustomData"],

    function (Filter, Select, TextArea, DatePicker, Input, CustomData) {
        return {
            getEditField: function (oFld) {
                if (oFld.FInputType == "DROPDOWN") {
                    var aFilters = [];
                    var vGoalFilter = new Filter("GoalTemplateID",
                        sap.ui.model.FilterOperator.EQ,
                        oFld.GoalTemplateID);
                    var vFieldFilter = new Filter("FieldID",
                        sap.ui.model.FilterOperator.EQ,
                        oFld.FieldID);

                    aFilters.push(vGoalFilter);
                    aFilters.push(vFieldFilter);
                    var oSelect = new Select({ customData: [new CustomData({ key: "FldId", value: oFld.FieldID }), new CustomData({ key: "FldName", value: oFld.FieldName })] });
                    oSelect.bindAggregation("items", {
                        path: "/GoalDropdownValues",
                        template: new sap.ui.core.Item({ text: "{Value}" }),
                        filters: aFilters
                    });
                    return oSelect;
                }
                else if (oFld.FInputType == "VARCHAR 255") {
                    return new TextArea({ required: oFld.IsMandatory, growing: true, width: "100%", customData: [new CustomData({ key: "FldId", value: oFld.FieldID }), new CustomData({ key: "FldName", value: oFld.FieldName }) ]});
                }
                else if (oFld.FInputType == "DATE") {
                    return new DatePicker({ required: oFld.IsMandatory, customData: [new CustomData({ key: "FldId", value: oFld.FieldID }), new CustomData({ key: "FldName", value: oFld.FieldName })] });
                }
                else {
                    return new Input({ required: oFld.IsMandatory, customData: [new CustomData({ key: "FldId", value: oFld.FieldID }), new CustomData({ key: "FldName", value: oFld.FieldName })] });
                }
            },
            clientFilter: function(Controller, Id, Aggr){
                var ClientID = Controller.getOwnerComponent()._clientId;
                Controller.byId(Id).getBinding(Aggr).
                filter([new Filter("ClientID","EQ", ClientID)]);
            }

        }


    })