sap.ui.define([
    "sap/m/MessageToast",
	"sap/ui/demo/nav/controller/BaseController"
], function (MessageToast, BaseController) {
	"use strict";
	return BaseController.extend("sap.ui.demo.nav.controller.ticket.TicketEdit", {
		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("ticketEdit").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
            
			oView.bindElement({
				path : "/Tickets('" + oArgs.ticketId + "')",
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
		},
		_onBindingChange : function () {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},
		onPressSave : function () {
            //Get ticketId from context
            //var editTicketId = this.getView()
            //Get required data from input fields
            var currTicketId = window.location.href.slice(-15,-5);
            var userTicketTitle = this.getView().byId("editTicketTitle").getValue();
            var userTicketDescription = this.getView().byId("editTicketDescription").getValue();
            var userFunctionalAreaValue = this.getView().byId("editFuncAreaSelect").getProperty("selectedKey");
            var userTicketAssigneeId = this.getView().byId("editAssigneeInput").getProperty("selectedKey");
            var userTicketStatusValue = this.getView().byId("editTicketStatusSelect").getProperty("selectedKey");
            var userTicketPriorityValue = this.getView().byId("editTicketPrioritySelect").getProperty("selectedKey");
            
            if (userTicketTitle === "" || userTicketDescription === "" || userTicketAssigneeId === "") {
                MessageToast.show("Please fill in all required fields!", {
                    closeOnBrowserNavigation: false }
                );
            } else {
                //Create json object
                var ticketsJSO =
                    {
                        "ticketId":  currTicketId,
                        "ticketTitle":  userTicketTitle  ,
                        "ticketDescription":  userTicketDescription  ,
                        "functionalArea.value":  userFunctionalAreaValue  ,
                        "assignee.userId":  userTicketAssigneeId  ,
                        "ticketStatus.value":  userTicketStatusValue ,
                        "ticketPriority.value":  userTicketPriorityValue
                    };
                //oData create call
                this.updateTicket(ticketsJSO);
                
                //Nav back
                this.onNavBack();
            }
		},
		onPressCancel : function () {
			this.onNavBack();
		},
        updateTicket : function(ticketJSO) {
            var oParams = {};
            oParams.success = function(){
                MessageToast.show("Changes saved!", {
                    closeOnBrowserNavigation: false }
                );
                this.onNavBack();
            };
            oParams.error = function(){
                MessageToast.show("Error occured when updating ticket,\nno changes saved", {
                    closeOnBrowserNavigation: false }
                );
            };
            oParams.bMerge = true;
            this.getView().getModel().update("/UpdateTicket('" + ticketJSO.ticketId + "')", ticketJSO, oParams );
        }
	});
});