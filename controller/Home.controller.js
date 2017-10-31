sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("sap.ui.demo.nav.controller.Home", {
	    onInit : function () {
		},
		onNavToTickets : function (){
			this.getRouter().navTo("ticketList");
		},
		onNavToSettings : function (){
			this.getRouter().navTo("settingsHome");
		}
	});
});