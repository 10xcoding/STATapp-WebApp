sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/ui/demo/nav/controller/BaseController"
], function (MessageBox, MessageToast, BaseController) {
    
	"use strict";
	
	return BaseController.extend("sap.ui.demo.nav.controller.ticket.TicketDetails", {
        onInit: function () {
            //set router
			var oRouter = this.getRouter();
			oRouter.getRoute("ticket").attachMatched(this._onRouteMatched, this);
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
            //Check ticket status, set buttons as needed //TODO
            var oModel = this.getView().getModel();
            var dateStarted = oModel.dateStarted;
            var dateClosed = oModel.dateClosed;
            if (dateStarted !== "" && dateStarted !== "?" && dateStarted !== null) {
                this.getView().byId("startTicketButton").setEnabled(true);
            }
            if (dateClosed !== "" && dateClosed !== "?" && dateClosed !== null) {
                this.getView().byId("closeTicketButton").setEnabled(true);
            }
		},
		onClickEdit : function (oEvent) {
            var selectedPath = oEvent.getSource().getBindingContext().sPath;
            var ticketId = selectedPath.slice(10,-2); //TODO: check
			this.getRouter().navTo("ticketEdit",{
				ticketId : ticketId
			});
		}
		,
		onPressStartTicket : function (oEvent) {
            //Set button as unclickable
            this.getView().byId("startTicketButton").setEnabled(false);
            //Confirm selection
            if (confirm("Ticket start date cannot be changed after ticket is started. Are you sure you want to start this ticket?") == true) {
                //oData Service
                var oParams = {};
                oParams.success = function(){
                    MessageToast.show("Ticket Started! Hit refresh to see changes.", {
                        closeOnBrowserNavigation: false }
                    );
                };
                oParams.error = function(){
                    MessageToast.show("Error occured when updating ticket,\nno changes saved", {
                        closeOnBrowserNavigation: false }
                    );
                };
                oParams.bMerge = true;
                var currTicketId = window.location.href.slice(-10);
                this.getView().getModel().update("/StartTicket('" + currTicketId + "')", {}, oParams );
            }
		}
		,
		onPressCloseTicket : function () {
		    //Set button as unclickable
            this.getView().byId("closeTicketButton").setEnabled(false);
            //Confirm selection
            if (confirm("Ticket close date cannot be changed after ticket is closed. Are you sure you want to close this ticket?") == true) {
                //oData Service
                var oParams = {};
                oParams.success = function(){
                    MessageToast.show("Ticket Closed! Hit refresh to see changes.", {
                        closeOnBrowserNavigation: false }
                    );
                    return true;
                };
                oParams.error = function(){
                    MessageToast.show("Error occured when updating ticket,\nno changes saved", {
                        closeOnBrowserNavigation: false }
                    );
                    return false;
                };
                oParams.bMerge = true;
                var currTicketId = window.location.href.slice(-10);
                var isSuccess = this.getView().getModel().update("/CloseTicket('" + currTicketId + "')", {}, oParams );
                //Set button as clickable if fails
                if (!isSuccess) {
                    this.getView().byId("closeTicketButton").setEnabled(true);
                }
            }
		}
	});
});
