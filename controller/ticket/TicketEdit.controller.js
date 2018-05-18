sap.ui.define([
    "sap/m/MessageToast"
	, "statapp/controller/BaseController"
], function(MessageToast, BaseController) {
	"use strict";
	var currentTicketId = "";   // ticket Id of ticket being edited
	var oEventBus;              // EventBus object (handles response to actions on other pages)
	var ticketEditForm;         // form object
	return BaseController.extend("statapp.controller.ticket.TicketEdit", {
// 		/**
// 		 * TODO: overload onNavBack to verify (if edit button is selected)
//          * This function handles navigating back (from a back button push)
//          * @private
//          */
// 		onNavBack: function () {
// 			var oHistory, sPreviousHash;
// 			oHistory = BaseController.History.getInstance();
// 			sPreviousHash = oHistory.getPreviousHash(); // TODO: go back one breadcrumb instead of one history
// 			if (sPreviousHash !== undefined) {
// 				window.history.go(-1);
// 			} else {
// 				this.getRouter().navTo("appHome", {}, false /*no history*/);
// 			}
// 		},
        /**
         * This function is the initialization function (called on initialization of the view)
         * @private
         */
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
        /**
         * This function is used for route matching and tab movement
         * @private
         */
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
        /**
         * This function is used if the router cannot match the generated route
         * @private
         */
		_onBindingChange: function() {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},
        /**
         * This function is called after rendering the page
         * @private
         */
		onAfterRendering: function() {
            this.updateFields();
		},
        /**
         * This function is upon exiting the page
         * @private
         */
		onExit: function() {
			this.getView().byId("allowEditBtn").setPressed(false);
			this.lockForm();
		},
        /**
         * This function is a callback function (refreshes model if changes are made elsewhere)
         * @private
         */
		updateFields: function() {
            if (!ticketEditForm) {
                ticketEditForm = this.getView().byId("ticketEditForm");
            }
			ticketEditForm.getModel().updateBindings(true);
			ticketEditForm.getModel().updateBindings(true);
		},
        /**
         * This function handles save button presses - generates API object, passes to another function
         * @private
         */
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
        /**
         * This function sends an API object call, and handles response
         * @private
         */
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
		},
        /**
         * This function handles cancel button presses - navs back with no changes
         * @private
         */
		onPressCancel: function() {
		    this.updateFields();
			this.lockForm();
			this.onNavBack();
		},
        /**
         * This function handles edit button presses - sets form items to be editable
         * @private
         */
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
        /**
         * This function sets form items to not be editable
         * @private
         */
		lockForm: function() {
			this.getView().byId("allowEditBtn").setPressed(false);
			this.getView().byId("editTicketTitle").setProperty("editable", false);
			this.getView().byId("editTicketDescription").setProperty("editable", false);
			this.getView().byId("editFuncAreaSelect").setProperty("enabled", false);
			this.getView().byId("editAssigneeInput").setProperty("editable", false);
			this.getView().byId("editTicketStatusSelect").setProperty("enabled", false);
			this.getView().byId("editTicketPrioritySelect").setProperty("enabled", false);
		}
	});
});