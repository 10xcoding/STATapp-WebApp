sap.ui.define([
    "sap/m/MessageBox"
    ,"sap/m/MessageToast"
	,"statapp/controller/BaseController"
	,"sap/ui/model/json/JSONModel"
], function (MessageBox, MessageToast, BaseController, JSONModel) {
	"use strict";
	var _aValidTabKeys = ["Details", "Comments", "Attachments"];
	var currentTicketId = "";
	return BaseController.extend("statapp.controller.ticket.TicketDetails", {
		_onRouteMatched : function (oEvent) {
			var oArgs, oView, oQuery;
			oArgs = oEvent.getParameter("arguments");
			currentTicketId = oArgs.ticketId;
			oView = this.getView();
			oView.bindElement({
				path : "/TicketsComments('" + currentTicketId + "')",
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oView.setBusy(true);
					},
					dataReceived: function () {
						oView.setBusy(false);
					}
				}
			});
// 			oView.setModel(new ODataModel(
// 			    path : "/TicketsComments('" + currentTicketId + "')",
// 				events : {
// 					change: this._onBindingChange.bind(this),
// 					dataRequested: function () {
// 						oView.setBusy(true);
// 					},
// 					dataReceived: function () {
// 						oView.setBusy(false);
// 					}
// 				}),"comments");
			// SOMETHING LIKE THIS ???
			
// 			this.getView().setModel(new JSONModel(data));
//          this.getView().setModel(new JSONModel(data), name));
			
// 			// TicketModel
//             var oTicketModel = new JSONModel({ // ODATAModel ?
// 				path : "/Tickets('" + currentTicketId + "')",
// 				events : {
// 					change: this._onBindingChange.bind(this),
// 					dataRequested: function () {
// 						oView.setBusy(true);
// 					},
// 					dataReceived: function () {
// 						oView.setBusy(false);
// 					}
// 				}
// 			});
//             this.getView().setModel(oTicketModel, "TicketModel");
//             this.getView().bindElement(oTicketModel);
//             // TicketCommentsModel
//             var oTicketCommentModel = new JSONModel({
// 				path : "/TicketsComments('" + currentTicketId + "')",
// 				events : {
// 					change: this._onBindingChange.bind(this),
// 					dataRequested: function () {
// 						oView.setBusy(true);
// 					},
// 					dataReceived: function () {
// 						oView.setBusy(false);
// 					}
// 				}
// 			});
//             this.getView().setModel(oTicketCommentModel, "TicketCommentModel");
			// SOMETHING LIKE THIS ???
			
			oQuery = oArgs["?query"];
			if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) >= 0) {
				oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
			} else {
				// the default query param should be visible at all time
				this.getRouter().navTo("ticket", {
					ticketId : oArgs.ticketId,
					query: {
						tab : _aValidTabKeys[0]
					}
				}, true /*no history*/);
			}
		},
        onInit: function () {
            // Set router
			var oRouter = this.getRouter();
			this.getView().setModel(new JSONModel(), "view");
			oRouter.getRoute("ticket").attachMatched(this._onRouteMatched, this);
			
			// Subscribe to event buses
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("ticketDetailsChannel", "setStartTicketButton", this.setStartTicketButton, this);
            oEventBus.subscribe("ticketDetailsChannel", "setCloseTicketButton", this.setCloseTicketButton, this);
            oEventBus.subscribe("ticketDetailsChannel", "updateFields", this.updateFields, this);
		},
		onTabSelect : function (oEvent){
			var oCtx = this.getView().getBindingContext();
			this.getRouter().navTo("ticket", {
				ticketId : oCtx.getProperty("ticketId"),
				query: {
					tab : oEvent.getParameter("selectedKey")
				}
			}, true /*without history*/);
		},
        setStartTicketButton : function() {
            // Check ticket status, set start ticket button as needed
            var oModel = this.getView().getModel();
            var dateStarted = oModel.dateStarted;
            if (dateStarted !== "" && dateStarted !== "?" && dateStarted !== null) {
                this.getView().byId("startTicketButton").setEnabled(true);
            }
        },
        setCloseTicketButton : function() {
            // Check ticket status, set close button as needed
            var oModel = this.getView().getModel();
            var dateClosed = oModel.dateClosed;
            if (dateClosed !== "" && dateClosed !== "?" && dateClosed !== null) {
                this.getView().byId("closeTicketButton").setEnabled(true);
            }
        },
        updateFields : function() {
            var ticketDetailsForm = this.getView().byId("ticketDetailSimpleForm");
            ticketDetailsForm.getModel().updateBindings(true);
            var ticketEditComments = this.getView().byId("ticketDetailsComments");
            ticketEditComments.getModel().updateBindings(true);
        },
		_onBindingChange : function () {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},
		onHitTimelineRefresh : function() {
		    MessageToast.show("Clicked refresh, went to controller.");
		},
		onClickEdit : function () {
			this.getRouter().navTo("ticketEdit",{
				ticketId : currentTicketId
			});
		},
		onPressStartTicket : function () {
            //Set button as unclickable
            this.getView().byId("startTicketButton").setEnabled(false);
            //Confirm selection
            if (confirm("Ticket start date cannot be changed after ticket is started. Continue?") == true) {
                //oData Service
                var oParams = {};
                oParams.success = function(){
                    MessageToast.show("Ticket Started!", {
                        closeOnBrowserNavigation: false }
                    );
                    var oEventBus = sap.ui.getCore().getEventBus();
                    oEventBus.publish("ticketListChannel", "updateTicketList");
                    oEventBus.publish("ticketDetailsChannel", "setStartTicketButton");
                    oEventBus.publish("ticketDetailsChannel", "updateFields");
                    oEventBus.publish("ticketEditChannel", "updateFields");
                };
                oParams.error = function(){
                    MessageToast.show("Error occured when updating,\nno changes saved", {
                        closeOnBrowserNavigation: false }
                    );
                    var oEventBus = sap.ui.getCore().getEventBus();
                    oEventBus.publish("ticketDetailsChannel", "setStartTicketButton", false);
                };
                oParams.bMerge = true;
                this.getView().getModel().update("/StartTicket('" + currentTicketId + "')", {}, oParams );
            }
		},
		onPressCloseTicket : function () {
            //Set button as unclickable
            this.getView().byId("closeTicketButton").setEnabled(false);
            //Confirm selection
            if (confirm("Ticket close date cannot be changed after ticket is closed. Continue?") == true) {
                //oData Service
                var oParams = {};
                oParams.success = function(){
                    MessageToast.show("Ticket Closed!", {
                        closeOnBrowserNavigation: false }
                    );
                    var oEventBus = sap.ui.getCore().getEventBus();
                    oEventBus.publish("ticketListChannel", "updateTicketList");
                    oEventBus.publish("ticketDetailsChannel", "setCloseTicketButton");
                    oEventBus.publish("ticketDetailsChannel", "updateFields");
                    oEventBus.publish("ticketEditChannel", "updateFields");
                };
                oParams.error = function(){
                    MessageToast.show("Error occured when updating,\nno changes saved", {
                        closeOnBrowserNavigation: false }
                    );
                    var oEventBus = sap.ui.getCore().getEventBus();
                    oEventBus.publish("ticketDetailsChannel", "setCloseTicketButton", false);
                };
                oParams.bMerge = true;
                this.getView().getModel().update("/CloseTicket('" + currentTicketId + "')", {}, oParams );
            }
		}
	});
});
