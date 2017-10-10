sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("sap.ui.demo.nav.controller.ticket.TicketDetails", {
		onInit: function () {
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
		onClickEdit : function (oEvent) {
		    var selectedPath = oEvent.getSource().getBindingContext().sPath; // selectedPath = "/Tickets('STT0001111')"
			var ticketId = selectedPath.slice(10,20);
			this.getRouter().navTo("ticketEdit",{
				ticketId : ticketId
			});
		}
	});
});
