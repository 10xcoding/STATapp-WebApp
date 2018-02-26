sap.ui.define([
	"statapp/controller/BaseController",
	"statapp/model/formatter"
    ], function (BaseController, formatter) {
	"use strict";
	return BaseController.extend("statapp.controller.Home", {
        formatter: formatter,
        /**
         * This function navigates to ticketList page.
         * @private
         */
		onNavToTickets : function () {
			this.getRouter().navTo("ticketList");
		},
		/**
         * This function navigates to settingsHomePage
         * @private
         */
		onNavToSettings : function () {
			this.getRouter().navTo("settingsHome");
		},
        /**
         * Called on initialization of Home
         * @private
         */
		onInit : function () {
            this.setOpenTicketCount();
		},
        /**
         * This function sets the value of ticketCount to the open ticket count received from an AJAX call
         * @private
         */
        setOpenTicketCount: function() {
            var oView = this.getView();
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    oView.byId("ticketCount").setValue( this.responseText);
                }
            };
            xhttp.open("GET",   "https://stats0017130098trial.hanatrial.ondemand.com/dev/dev01/statapp/services/ticket.xsodata/Tickets/" + 
                                "$count?$filter=ticketStatus_value%20ne%203", true);
            xhttp.send();
        }
	});
});