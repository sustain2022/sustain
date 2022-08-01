sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("enterprisesustainabilitypro.controller.App", {
            onInit: function () {

                this.getView().getModel("prop").setData({vRegister:true});
                this.getView().getModel("util").setData({GoalAction:"Delete"});

                var toolPage = this.byId("toolPage");
    
                toolPage.setSideExpanded(!toolPage.getSideExpanded());
                toolPage.getSideContent().setVisible(false);
                // @ts-ignore

                if (localStorage.getItem('user') != undefined) {
                    //this.getOwnerComponent().byId('app').setBusy(true);
                   // oRouter.navTo("login");
                }
                this.getOwnerComponent()._clientId = 'CL0001';
                this.getOwnerComponent().getModel().read("/orgChart('CL0001')",{success: function(resp){
                    this.getOwnerComponent().getModel("orgChart").setData(resp);
                }.bind(this)
            })
            },
            onMenuButtonPress : function() {
                var toolPage = this.byId("toolPage");
    
                toolPage.setSideExpanded(!toolPage.getSideExpanded());
            },
            onItemSelect: function(oEvent){
                switch (oEvent.getSource().getSelectedKey()) {
                    case "rootItem1":
                        this.getOwnerComponent().getRouter().navTo("detailsd1");
                        break;
                    case "rootItem2":
                        this.getOwnerComponent().getRouter().navTo("goals");
                        break;
                    case "rootItem2-1":
                        this.getOwnerComponent().getRouter().navTo("AddUser");
                        break;
                    case "rootItem2-2":
                        this.getOwnerComponent().getRouter().navTo("Invite");
                        break;    
                    case "rootItem2-3":
                        this.getOwnerComponent().getRouter().navTo("ActivateUsers");
                        break;                                                                                         
                    case "rootItem3":
                        this.getOwnerComponent().getRouter().navTo("teammgmnt");
                        break;
                    case "rootItem3-1":
                        this.getOwnerComponent().getRouter().navTo("RoleMaintain");
                        break;
                    case "rootItem3-2":
                        this.getOwnerComponent().getRouter().navTo("OrgStructure");
                        break;
                    case "rootItem3-3":
                        this.getOwnerComponent().getRouter().navTo("MaintainDepartment");
                        break;                        
                    case "rootItem4-1":
                        this.getOwnerComponent().getRouter().navTo("AddSupplier");
                        break;
                    case "rootItem4-3":
                        this.getOwnerComponent().getRouter().navTo("ActivateSuppliers");
                        break;                        
                    case "rootItem5-1":
                        this.getView().getModel("util").setProperty("/GoalAction","Delete");
                        this.getOwnerComponent().getRouter().navTo("MaintainGoal");
                        break;
                    case "rootItem5-2":
                        this.getView().getModel("util").setProperty("/GoalAction","Deactivate");
                        this.getOwnerComponent().getRouter().navTo("MaintainGoal");
                        break; 
                    case "rootItem6":
                        this.getOwnerComponent().getRouter().navTo("EnhancementReq");
                        break;                                                                        
                    default:
                        break;
                }
            }
        });
    });
