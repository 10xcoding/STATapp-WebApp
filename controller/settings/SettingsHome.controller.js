sap.ui.define([
	"statapp/controller/BaseController",
	"statapp/model/formatter"
    ], function (BaseController, formatter) {
	"use strict";
	return BaseController.extend("statapp.controller.settings.SettingsHome", {
	    formatter: formatter,
	    
	    /**
         * This function navigates to accountSettings page.
         * @private
         */
		onNavToAccountSettings : function () {
			this.getRouter().navTo("accountSettings");
		},
		
		/**
         * This function navigates to userSettings page
         * @private
         */
		onNavToUserSettings : function () {
			this.getRouter().navTo("userSettings");
		},
		
		/**
         * This function navigates to funcAreaSettings page
         * @private
         */
		onNavToFuncAreaSettings : function () {
			this.getRouter().navTo("funcAreaSettings");
		},
		
		/**
         * This function navigates to ticketStatusSettings page
         * @private
         */
		onNavToTicketStatusSettings : function () {
			this.getRouter().navTo("ticketStatusSettings");
		},
		
		/**
         * This function navigates to ticketPrioritySettings page
         * @private
         */
		onNavToTicketPrioritySettings : function () {
			this.getRouter().navTo("ticketPrioritySettings");
		}
	});
});