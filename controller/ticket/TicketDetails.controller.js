sap.ui.define([
    "sap/m/MessageBox"
    ,"sap/m/MessageToast"
	,"statapp/controller/BaseController"
], function (MessageBox, MessageToast, BaseController) {
	"use strict";
	return BaseController.extend("statapp.controller.ticket.TicketDetails", {
        onInit: function () {
            // Set router
			var oRouter = this.getRouter();
			oRouter.getRoute("ticket").attachMatched(this._onRouteMatched, this);
			
			// Subscribe to event buses
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("ticketDetailsChannel", "setStartTicketButton", this.setStartTicketButton, this);
            oEventBus.subscribe("ticketDetailsChannel", "setCloseTicketButton", this.setCloseTicketButton, this);
            oEventBus.subscribe("ticketDetailsChannel", "updateFields", this.updateFields, this);
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
        },
		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			oView.bindElement({
				path : "/Tickets('" + oArgs.ticketId + "')",
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});
		},
		_onBindingChange : function () {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},
		onAfterRendering : function(oEvent) {
		},
		onClickEdit : function (oEvent) {
            var selectedPath = oEvent.getSource().getBindingContext().sPath;
            var ticketId = selectedPath.slice(10,-2); //TODO: check
			this.getRouter().navTo("ticketEdit",{
				ticketId : ticketId
			});
		},
		onPressStartTicket : function (oEvent) {
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
                var currTicketId = window.location.href.slice(-10);
                this.getView().getModel().update("/StartTicket('" + currTicketId + "')", {}, oParams );
            }
		},
		onPressCloseTicket : function (oEvent) {
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
                var currTicketId = window.location.href.slice(-10);
                this.getView().getModel().update("/CloseTicket('" + currTicketId + "')", {}, oParams );
            }
		}
	});
});
