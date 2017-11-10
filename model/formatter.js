sap.ui.define([], function () {
	"use strict";
	return {
        // getOpenTicketCount : function () {
        //     var sPath = this.getBindingContext().getPath() + '/Tickets';
        //     var oBindings = this.getModel().bindList(sPath);
        //     return oBindings.getLength();
        // }
        // ,
        getOpenTicketCount: function() {
            // var countPage = jQuery.get("https://stats0017130098trial.hanatrial.ondemand.com/dev/dev01/statapp/services/ticket.xsodata/Tickets/$count?$filter=ticketStatus_value%20ne%204");
            // var count = parseInt(countPage.responseText,10);
            // "/$count?$filter=ticketStatus_value%20ne%204";
            return 5;
        }
    };
});