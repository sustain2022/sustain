sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History","../utils/util"],function(e,t,s){"use strict";return e.extend("sustainabilitypro.controller.TeamManagement",{onInit:function(){if(localStorage.getItem("user")){this.getOwnerComponent()._clientId=localStorage.getItem("user")}this.getOwnerComponent().getRouter().getRoute("teammgmnt").attachPatternMatched(this._onRouteMatched,this)},_onRouteMatched:function(e){var t=this.byId("ObjectPageLayout").getSections();if(this.getOwnerComponent()._setSection=="Internal Team"){this.byId("ObjectPageLayout").setSelectedSection(t[1])}if(this.getOwnerComponent()._setSection=="External Team"){this.byId("ObjectPageLayout").setSelectedSection(t[2])}s.clientFilter(this,"dptTbl","items");s.clientFilter(this,"teamTbl","items");s.clientFilter(this,"teamTbl1","items");s.clientFilter(this,"empTbl","items");s.clientFilter(this,"supTbl","items")},onDeptAddRequest:function(e){if(!this.deptDialog){this.deptDialog=this.loadFragment({name:"sustainabilitypro.fragments.AddDepartment"}).then(function(e){this.deptDialog=e;e.open()}.bind(this))}else{this.deptDialog.open()}},onTeamAddRequest:function(e){this._teamType=e.getSource().getCustomData()[0].getKey();if(!this.teamDialog){this.teamDialog=this.loadFragment({name:"sustainabilitypro.fragments.AddTeam"}).then(function(e){this.teamDialog=e;s.clientFilter(this,"addTeamDptCB","items");e.open()}.bind(this))}else{this.byId("addTeamForm").getFormContainers()[0].getFormElements()[0].getFields()[0].setValue();this.byId("addTeamForm").getFormContainers()[0].getFormElements()[1].getFields()[0].setValue();this.byId("addTeamForm").getFormContainers()[0].getFormElements()[2].getFields()[0].setValue();this.teamDialog.open()}},onEmpAddRequest:function(e){if(!this.empDialog){this.empDialog=this.loadFragment({name:"sustainabilitypro.fragments.AddEmployee"}).then(function(e){this.empDialog=e;s.clientFilter(this,"addDptCB","items");e.open()}.bind(this))}else{this.empDialog.open()}},onSupAddRequest:function(e){if(!this.supDialog){this.supDialog=this.loadFragment({name:"sustainabilitypro.fragments.AddSupplier"}).then(function(e){this.supDialog=e;s.clientFilter(this,"addSupDptCB","items");e.open()}.bind(this))}else{this.supDialog.open()}},onDeptSave:function(e){var t=this.getOwnerComponent().getModel();t.setUseBatch(true);t.setDeferredGroups(["foo"]);var s={groupId:"foo",success:function(e,t){sap.m.MessageToast.show("Department Created")},error:function(e,t){sap.m.MessageToast.show("Department Creation Failed")}};var i={ClientID:this.getOwnerComponent()._clientId};var o=this.byId("addDptForm").getFormContainers()[0].getFormElements();i.DepartmentName=o[0].getFields()[0].getValue();i.DepartmentDescription=o[1].getFields()[0].getValue();i.HOD=o[2].getFields()[0].getSelectedItem().getText();i.DepartmentType=o[3].getFields()[0].getSelectedKey();i.DepartmentStatus=o[4].getFields()[0].getSelectedKey();t.create("/DepartmentHeader",i,s);t.submitChanges(s);this.deptDialog.close()},onTeamSave:function(e){var t=this.getOwnerComponent().getModel();t.setUseBatch(true);t.setDeferredGroups(["foo"]);var s={groupId:"foo",success:function(e,t){sap.m.MessageToast.show("Team Created")},error:function(e,t){sap.m.MessageToast.show("Team Creation Failed")}};var i={ClientID:this.getOwnerComponent()._clientId};var o=this.byId("addTeamForm").getFormContainers()[0].getFormElements();i.TeamName=o[0].getFields()[0].getValue();i.TeamDescription=o[1].getFields()[0].getValue();i.DepartmentID=o[2].getFields()[0].getSelectedKey();i.TeamType=this._teamType;t.create("/TeamHeader",i,s);t.submitChanges(s);this.teamDialog.close()},onEmpSave:function(e){var t=this.getOwnerComponent().getModel();t.setUseBatch(true);t.setDeferredGroups(["foo"]);var s={groupId:"foo",success:function(e,t){sap.m.MessageToast.show("Employee Created")},error:function(e,t){sap.m.MessageToast.show("Employee Creation Failed")}};var i={ClientID:this.getOwnerComponent()._clientId};var o=this.byId("addEmpForm").getFormContainers()[0].getFormElements();i.EmployeeName=o[0].getFields()[0].getValue();i.UserID=o[1].getFields()[0].getValue();i.Email=o[2].getFields()[0].getValue();i.ContactNumber=parseInt(o[3].getFields()[0].getValue());i.DepartmentID=o[4].getFields()[0].getSelectedKey();i.ValidFrom=o[5].getFields()[0].getDateValue();i.ValidTo=o[6].getFields()[0].getDateValue();i.EmployeeType=o[7].getFields()[0].getSelectedKey();i.UserStatus=o[8].getFields()[0].getSelectedKey();t.create("/EmployeeUser",i,s);t.submitChanges(s);this.empDialog.close()},onSupSave:function(e){var t=this.getOwnerComponent().getModel();t.setUseBatch(true);t.setDeferredGroups(["foo"]);var s={groupId:"foo",success:function(e,t){sap.m.MessageToast.show("Supplier Created")},error:function(e,t){sap.m.MessageToast.show("Supplier Creation Failed")}};var i={ClientID:this.getOwnerComponent()._clientId};var o=this.byId("addSupForm").getFormContainers()[0].getFormElements();i.SupplierName=o[0].getFields()[0].getValue();i.Email=o[1].getFields()[0].getValue();i.ContactNumber=o[2].getFields()[0].getValue();i.DepartmentID=o[3].getFields()[0].getSelectedKey();i.Address=o[4].getFields()[0].getValue();i.Country=o[5].getFields()[0].getValue();i.SupplierStatus=o[6].getFields()[0].getSelectedKey();t.create("/SupplierHeader",i,s);t.submitChanges(s);this.supDialog.close()},onCloseAddDeptDlg:function(e){e.getSource().getParent().close()},onCloseAddTeamDlg:function(e){e.getSource().getParent().close()},onCloseAddEmpDlg:function(e){e.getSource().getParent().close()},onCloseAddSupDlg:function(e){e.getSource().getParent().close()},onNavback:function(){var e=this.byId("ObjectPageLayout").getSections();this.byId("ObjectPageLayout").setSelectedSection(e[0]);this.getView().getParent().getParent().setMode("ShowHideMode");var s=t.getInstance();var i=s.getPreviousHash();if(i!==undefined){window.history.go(-1)}else{var o=this.getOwnerComponent().getRouter();o.navTo("detailsd1",{},true)}}})});