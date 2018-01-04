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
		
		// TRY? : init count at "...", set tile busy dialog, call odata query, remove busy dialog
		
		/**
         * This function navigates to settingsHomePage
         * @private
         */
		onNavToSettings : function () {
			this.getRouter().navTo("settingsHome");
		}
	});
});