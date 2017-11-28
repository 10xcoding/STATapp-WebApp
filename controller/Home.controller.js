sap.ui.define([
	"statapp/controller/BaseController",
	"statapp/model/formatter"
    ], function (BaseController, formatter) {
	"use strict";
	return BaseController.extend("statapp.controller.Home", {
	    formatter: formatter,
	    /**
         * This function navigates to ticketList page.
         *
         * @private
         */
		onNavToTickets : function () {
			this.getRouter().navTo("ticketList");
		},
		/**
         * This function navigates to settingsHomePage
         *
         * @private
         */
		onNavToSettings : function () {
			this.getRouter().navTo("settingsHome");
		}
	});
});