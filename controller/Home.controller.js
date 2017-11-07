sap.ui.define([
	"statapp/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("statapp.controller.Home", {
	    onInit : function () {
            // // sOrigin = "https://stats0017130098trial.hanatrial.ondemand.com"
            // var sOrigin = window.location.protocol + "//" + window.location.hostname
            //                 + (window.location.port ? ":" + window.location.port : "");
            // // ticketListOdataServiceUrl = "https://stats0017130098trial.hanatrial.ondemand.com/dev/dev01/statapp/services/ticket.xsodata"
            // var ticketListOdataServiceUrl = sOrigin
            //                 + "/dev/dev01/statapp/services/ticket.xsodata";
            // // oDataModel
            // var oDataModel = new sap.ui.model.odata.v2.ODataModel(ticketListOdataServiceUrl);
            // this.getView().setModel(oDataModel);
		},
		onAfterRendering : function() {
		  //  this.getView().byId("ticketCount").setText(oDataModel.get);
		},
		onNavToTickets : function (){
			this.getRouter().navTo("ticketList");
		},
		onNavToSettings : function (){
			this.getRouter().navTo("settingsHome");
		}
	});
});