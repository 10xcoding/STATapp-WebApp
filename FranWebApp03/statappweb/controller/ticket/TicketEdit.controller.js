sap.ui.define([
    "sap/m/MessageToast",
	"sap/ui/demo/nav/controller/BaseController"
], function (MessageToast, BaseController) {
	"use strict";
	return BaseController.extend("sap.ui.demo.nav.controller.ticket.TicketEdit", {
		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("ticketEdit").attachMatched(this._onRouteMatched, this);
			
// 			var funcAreaSelectModel = new sap.ui.model.odata.ODataModel(
// 			    "https://stats0017130098trial.hanatrial.ondemand.com/dev/dev01/statapp/services/functionalArea.xsodata");
// 			var funcAreaSelectMenu = this.getView().byId("funcAreaSelect");
// 			funcAreaSelectMenu.setModel(funcAreaSelectModel);
//             sap.ui.getCore().setModel(funcAreaSelectModel, "funcAreaSelectModel");
//             var oFuncAreaSelectTemplate = new sap.ui.core.Item({
//                 key : "{value}",
//                 text : "{description}"
//             });
//             funcAreaSelectMenu.setModel(sap.ui.getCore().getModel("funcAreaSelectModel"));
//             funcAreaSelectMenu.bindAggregation("items","/", oFuncAreaSelectTemplate);

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
			MessageToast.show("Changes saved!");
			this.onNavBack();
		},
		onPressCancel : function () {
			this.onNavBack();
		}
	});
});