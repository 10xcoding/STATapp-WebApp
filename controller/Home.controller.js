sap.ui.define([
	"statapp/controller/BaseController",
	"statapp/model/formatter"
    ], function (BaseController, formatter) {
	"use strict";
	return BaseController.extend("statapp.controller.Home", {
	    formatter: formatter,
        onInit : function () {
            // Subscribe to event buses
            // var oEventBus = sap.ui.getCore().getEventBus();
            // oEventBus.subscribe("homeChannel", "updateCount", this.updateCount, this);
		},
		onAfterRendering : function() {
            // var oEventBus = sap.ui.getCore().getEventBus();
            // oEventBus.publish("homeChannel", "updateCount");
		},
		updateCount : function() {
            // var openTicketCountPage = "https://stats0017130098trial.hanatrial.ondemand.com/dev/dev01/statapp/services/ticket.xsodata/Tickets/$count?$filter=ticketStatus_value%20ne%204";
            // var pageResponse = $.get(openTicketCountPage).responseText;
            // this.getView().byId("ticketCount").bindProperty("value", String(pageResponse));
		},
		onNavToTickets : function () {
			this.getRouter().navTo("ticketList");
		},
		onNavToSettings : function () {
			this.getRouter().navTo("settingsHome");
		}
	});
});