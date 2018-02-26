sap.ui.define([
    "sap/m/MessageToast"
	, "statapp/controller/BaseController"
], function(MessageToast, BaseController) {
	"use strict";
	var currentTicketId = "";
	var oEventBus;
	return BaseController.extend("statapp.controller.ticket.TicketEdit", {
		_onRouteMatched: function(oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			currentTicketId = oArgs.ticketId;
			oView = this.getView();
			oView.bindElement({
				path: "/Tickets('" + currentTicketId + "')",
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oView.setBusy(true);
					},
					dataReceived: function() {
						oView.setBusy(false);
					}
				}
			});
		},
		onInit: function() {
			// Router
			var oRouter = this.getRouter();
			oRouter.getRoute("ticketEdit").attachMatched(this._onRouteMatched, this);

			// Subscribe to event buses
			if (!oEventBus) {
				oEventBus = sap.ui.getCore().getEventBus();
			}
			oEventBus.subscribe("ticketEditChannel", "updateFields", this.updateFields, this);
			oEventBus.subscribe("ticketEditChannel", "lockForm", this.lockForm, this);
		},
		onBeforeRendering: function() {
			var ticketEditEditForm = this.getView().byId("ticketEditEditForm");
			ticketEditEditForm.getModel().updateBindings(true);
		},
		onExit: function() {
			this.getView().byId("allowEditBtn").setPressed(false);
		},
		updateFields: function() {
			var ticketEditFixedForm = this.getView().byId("ticketEditFixedForm");
			ticketEditFixedForm.getModel().updateBindings(true);
			var ticketEditEditForm = this.getView().byId("ticketEditEditForm");
			ticketEditEditForm.getModel().updateBindings(true);
		},
		_onBindingChange: function() {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},
		onPressSave: function() {
			//Get ticketId from context
			var userTicketTitle = this.getView().byId("editTicketTitle").getValue();
			var userTicketDescription = this.getView().byId("editTicketDescription").getValue();
			var userFunctionalAreaValue = this.getView().byId("editFuncAreaSelect").getProperty("selectedKey");
			var userTicketAssigneeId = this.getView().byId("editAssigneeInput").getProperty("selectedKey");
			var userTicketStatusValue = this.getView().byId("editTicketStatusSelect").getProperty("selectedKey");
			var userTicketPriorityValue = this.getView().byId("editTicketPrioritySelect").getProperty("selectedKey");

			if (userTicketTitle === "" || userTicketDescription === "" || userTicketAssigneeId === "") {
				MessageToast.show("Please fill in all required fields!", {
					closeOnBrowserNavigation: false
				});
			} else {
				//Create JS object
				var ticketsJSO = {
					"ticketId": currentTicketId,
					"ticketTitle": userTicketTitle,
					"ticketDescription": userTicketDescription,
					"functionalArea.value": userFunctionalAreaValue,
					"assignee.userId": userTicketAssigneeId,
					"ticketStatus.value": userTicketStatusValue,
					"ticketPriority.value": userTicketPriorityValue
				};
				//oData create call
				this.updateTicket(ticketsJSO);

				//Nav back
				this.lockForm();
				this.onNavBack();
			}
		},
		onPressCancel: function() {
			this.lockForm();
			this.onNavBack();
		},
		onPressEditForm: function(pressEvent) {
			// Toggle edit on/off
			var isEditable = pressEvent.getSource().getPressed();
			this.getView().byId("editTicketTitle").setProperty("editable", isEditable);
			this.getView().byId("editTicketDescription").setProperty("editable", isEditable);
			this.getView().byId("editFuncAreaSelect").setProperty("enabled", isEditable);
			this.getView().byId("editAssigneeInput").setProperty("editable", isEditable);
			this.getView().byId("editTicketStatusSelect").setProperty("enabled", isEditable);
			this.getView().byId("editTicketPrioritySelect").setProperty("enabled", isEditable);
		},
		lockForm: function() {
			this.getView().byId("allowEditBtn").setPressed(false);
			this.getView().byId("editTicketTitle").setProperty("editable", false);
			this.getView().byId("editTicketDescription").setProperty("editable", false);
			this.getView().byId("editFuncAreaSelect").setProperty("enabled", false);
			this.getView().byId("editAssigneeInput").setProperty("editable", false);
			this.getView().byId("editTicketStatusSelect").setProperty("enabled", false);
			this.getView().byId("editTicketPrioritySelect").setProperty("enabled", false);
		},
		updateTicket: function(ticketJSO) {
			var oParams = {};
			oParams.success = function() {
				MessageToast.show("Changes saved!", {
					closeOnBrowserNavigation: false
				});
				if (!oEventBus) {
					oEventBus = sap.ui.getCore().getEventBus();
				}
				oEventBus.publish("ticketEditChannel", "updateFields");
				oEventBus.publish("ticketListChannel", "updateTicketList");
				oEventBus.publish("ticketDetailsChannel", "updateFields");
				oEventBus.publish("ticketDetailsChannel", "setStartTicketButton");
				oEventBus.publish("ticketDetailsChannel", "setCloseTicketButton");
			};
			oParams.error = function() {
				MessageToast.show("Error occured when updating ticket,\nno changes saved", {
					closeOnBrowserNavigation: false
				});
			};
			oParams.bMerge = true;
			this.getView().getModel().update("/UpdateTicket('" + currentTicketId + "')", ticketJSO, oParams);
		}
	});
});