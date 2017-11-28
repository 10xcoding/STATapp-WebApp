sap.ui.define([
//   "sap/ui/model/resource/ResourceModel"
   ], function (/*ResourceModel*/) {
	"use strict";
	return {
	    /**
         * This function returns the open ticket count to display on the tickets tile.
         *
         * @private
         * @returns {int} the count of open tickets
         */
        getOpenTicketCount: function() {
            var url = "https://stats0017130098trial.hanatrial.ondemand.com/dev/dev01/statapp/services/ticket.xsodata/Tickets/$count?$filter=ticketStatus_value%20ne%204";
            var count = 0;
            // TODO: change to asyncronous request with loading indicator
            count = $.ajax({type: "GET", url: url, async: false}).responseText;
            // /TODO
            return count;
        }
        // ,
        // getTranslation: function(text, args) {
        //     // set i18n model on view
        //     var i18nModel = new ResourceModel({
        //         bundleName: "statapp.i18n.i18n"
        //     });
        //     this.getView().setModel(i18nModel, "i18n");
        //     // read msg from i18n model
        //     var oBundle = i18nModel.getResourceBundle();
        //     return oBundle.getText(text, args);
        // }
    };
});