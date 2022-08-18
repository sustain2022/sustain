sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/suite/ui/commons/networkgraph/layout/LayeredLayout",
    "sap/suite/ui/commons/networkgraph/layout/ForceBasedLayout",
    "sap/suite/ui/commons/networkgraph/ActionButton",
    "sap/suite/ui/commons/networkgraph/Node",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (JSONModel, Controller, LayeredLayout, ForceBasedLayout, ActionButton, Node, Fragment) {
        "use strict";
        var STARTING_PROFILE;
return Controller.extend("sustainabilitypro.controller.OrgStructure",{	

		onInit : function () {
            // this.getOwnerComponent().getModel().read("/orgChart",{success: function(){
            let aNodes = this.getOwnerComponent().getModel("orgChart").getProperty("/nodes");
            let aEmp = aNodes.filter(item=>{
                    if(item.Supervisor =="INT_"){
                        return item;
                    }
                });
                STARTING_PROFILE = aEmp[0]?aEmp[0].EmployeeID : null;
            this.getOwnerComponent().getRouter().getRoute("OrgStructure").attachPatternMatched(this._onRouteMatched, this);
            // }.bind(this)})
			this._oModel = new JSONModel(this.getOwnerComponent().getModel('orgChart').getData());
			this._oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);

			this._sTopSupervisor = STARTING_PROFILE;
			this._mExplored = [this._sTopSupervisor];

			this._graph = this.byId("graph");
			this.getView().setModel(this._oModel);

			this._setFilter();

			this._graph.attachEvent("beforeLayouting", function (oEvent) {
				// nodes are not rendered yet (bOutput === false) so their invalidation triggers parent (graph) invalidation
				// which results in multiple unnecessary loading
				this._graph.preventInvalidation(true);
				this._graph.getNodes().forEach(function (oNode) {
					var oExpandButton, oDetailButton, oUpOneLevelButton,
						sTeamSize = 1,//this._getCustomDataValue(oNode, "team"),
						sSupervisor;

					oNode.removeAllActionButtons();

					if (!sTeamSize) {
						// employees without team - hide expand buttons
						oNode.setShowExpandButton(false);
					} else {
						if (this._mExplored.indexOf(oNode.getKey()) === -1) {
							// managers with team but not yet expanded
							// we create custom expand button with dynamic loading
							oNode.setShowExpandButton(false);

							// this renders icon marking collapse status
							oNode.setCollapsed(true);
							oExpandButton = new ActionButton({
								title: "Expand",
								icon: "sap-icon://sys-add",
								press: function () {
									oNode.setCollapsed(false);
									this._loadMore(oNode.getKey());
								}.bind(this)
							});
							oNode.addActionButton(oExpandButton);
						} else {
							// manager with already loaded data - default expand button
							oNode.setShowExpandButton(true);
						}
					}

					// add detail link -> custom popover
					oDetailButton = new ActionButton({
						title: "Detail",
						icon: "sap-icon://person-placeholder",
						press: function (oEvent) {
							this._openDetail(oNode, oEvent.getParameter("buttonElement"));
						}.bind(this)
					});
					oNode.addActionButton(oDetailButton);

					// if current user is root we can add 'up one level'
					if (oNode.getKey() === this._sTopSupervisor) {
						sSupervisor = this._getCustomDataValue(oNode, "supervisor");
						if (sSupervisor) {
							oUpOneLevelButton = new ActionButton({
								title: "Up one level",
								icon: "sap-icon://arrow-top",
								press: function () {
									var aSuperVisors = oNode.getCustomData().filter(function (oData) {
											return oData.getKey() === "supervisor";
										}),
										sSupervisor = aSuperVisors.length > 0 && aSuperVisors[0].getValue();

									this._loadMore(sSupervisor);
									this._sTopSupervisor = sSupervisor;
								}.bind(this)
							});
							oNode.addActionButton(oUpOneLevelButton);
						}
					}
				}, this);
				this._graph.preventInvalidation(false);
			}.bind(this));
		},
        _onRouteMatched : function (oEvent) {
            this.getView().byId("graph").rerender();
        },
	    search: function (oEvent) {
			var sKey = oEvent.getParameter("key");

			if (sKey) {
				this._mExplored = [sKey];
				this._sTopSupervisor = sKey;
				this._graph.destroyAllElements();
				this._setFilter();

				oEvent.bPreventDefault = true;
			}
		},

		suggest : function (oEvent) {
			var aSuggestionItems = [],
				aItems = this._oModel.getData().nodes,
				aFilteredItems = [],
				sTerm = oEvent.getParameter("term");

			sTerm = sTerm ? sTerm : "";

			aFilteredItems = aItems.filter(function (oItem) {
				var sTitle = oItem.EmployeeName ? oItem.EmployeeName : "";
				return sTitle.toLowerCase().indexOf(sTerm.toLowerCase()) !== -1;
			});

			aFilteredItems.sort(function (oItem1, oItem2) {
				var sTitle = oItem1.title ? oItem1.title : "";
				return sTitle.localeCompare(oItem2.title);
			}).forEach(function (oItem) {
				aSuggestionItems.push(new sap.m.SuggestionItem({
					key: oItem.EmployeeID,
					text: oItem.EmployeeName
				}));
			});

			this._graph.setSearchSuggestionItems(aSuggestionItems);
			oEvent.bPreventDefault = true;
		},

		onExit : function() {
			if (this._oQuickView) {
				this._oQuickView.destroy();
			}
		},

		_setFilter : function () {
			var aNodesCond = [],
				aLinesCond = [];
			var fnAddBossCondition = function (sBoss) {
				aNodesCond.push(new sap.ui.model.Filter({
					path: 'EmployeeID',
					operator: sap.ui.model.FilterOperator.EQ,
					value1: sBoss
				}));

				aNodesCond.push(new sap.ui.model.Filter({
					path: 'Supervisor',
					operator: sap.ui.model.FilterOperator.EQ,
					value1: sBoss
				}));
			};

			var fnAddLineCondition = function (sLine) {
				aLinesCond.push(new sap.ui.model.Filter({
					path: "supervisor",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: sLine
				}));
			};

			this._mExplored.forEach(function (oItem) {
				fnAddBossCondition(oItem);
				fnAddLineCondition(oItem);
			});

			this._graph.getBinding("nodes").filter(new sap.ui.model.Filter({
				filters: aNodesCond,
				and: false
			}));

			this._graph.getBinding("lines").filter(new sap.ui.model.Filter({
				filters: aLinesCond,
				and: false
			}));
		},

		_loadMore : function (sName) {
			this._graph.deselect();
			this._mExplored.push(sName);
			this._graph.destroyAllElements();
			this._setFilter();
		},

		_getCustomDataValue : function (oNode, sName) {
			var aItems = oNode.getCustomData().filter(function (oData) {
				return oData.getKey() === sName;
			});

			return aItems.length > 0 && aItems[0].getValue();
		},

		_openDetail : function (oNode, oButton) {
			var sTeamSize = this._getCustomDataValue(oNode, "team");

			if (!this._oQuickView) {
				Fragment.load({
					name: "sustainabilitypro.fragments.TooltipFragment",
					type: "XML"
				}).then(function(oFragment) {
					this._oQuickView = oFragment;
					this._oQuickView.setModel(new JSONModel({
						icon: oNode.getImage() && oNode.getImage().getProperty("src"),
						EmployeeName: oNode.getTitle(),
						Position: this._getCustomDataValue(oNode, "Position"),
						CountryID: this._getCustomDataValue(oNode, "CountryID"),
						
						TeamMembers: this._getCustomDataValue(oNode, "TeamMembers"),
                        GoalsAssigned: this._getCustomDataValue(oNode, "GoalsAssigned"),
                        TeamGoals: this._getCustomDataValue(oNode, "TeamGoals"),
						Email: this._getCustomDataValue(oNode, "Email"),
						ContactNumber: this._getCustomDataValue(oNode, "ContactNumber")
					}));

					setTimeout(function () {
						this._oQuickView.openBy(oButton);
					}.bind(this), 0);
				}.bind(this));
			} else {
				this._oQuickView.setModel(new JSONModel({
					icon: oNode.getImage() && oNode.getImage().getProperty("src"),
                    EmployeeName: oNode.getTitle(),
                    Position: this._getCustomDataValue(oNode, "Position"),
                    CountryID: this._getCustomDataValue(oNode, "CountryID"),
                    
                    TeamMembers: this._getCustomDataValue(oNode, "TeamMembers"),
                    GoalsAssigned: this._getCustomDataValue(oNode, "GoalsAssigned"),
                    TeamGoals: this._getCustomDataValue(oNode, "TeamGoals"),
                    Email: this._getCustomDataValue(oNode, "Email"),
                    ContactNumber: this._getCustomDataValue(oNode, "ContactNumber")
				}));

				setTimeout(function () {
					this._oQuickView.openBy(oButton);
				}.bind(this), 0);
			}
		},

		linePress : function (oEvent) {
			oEvent.bPreventDefault = true;
		}
    })
		// return GraphController;
    })