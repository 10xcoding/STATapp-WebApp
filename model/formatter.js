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
            var url = "https://stats0017130098trial.hanatrial.ondemand.com/dev/dev01/statapp/services/ticket.xsodata/Tickets/" + 
                        "$count?$filter=ticketStatus_value%20ne%204";
            var count = 0;
            // TODO: change to asyncronous request with loading indicator
            count = $.ajax({type: "GET", url: url, async: false}).responseText;
            // /TODO
            return count;
        }
        ,
        getPriorityState: function(ticketPriority) {
            switch(ticketPriority) {
                case 'Low':
                    return "Success";
                case 'Medium':
                    return "Warning";
                case 'High':
                    return "Error";
                default:
                    return "Error";
            }
        }
        ,
        getFuncAreaIcon: function(funcArea) {
            switch(funcArea) {
                case 'Unknown':
                    return "sap-icon://question-mark";
                case 'Shipping/Receiving':
                    return "sap-icon://offsite-work";
                case 'HR':
                    return "sap-icon://group";
                case 'Finance':
                    return "sap-icon://customer-financial-fact-sheet";
                case 'Internal':
                    return "sap-icon://idea-wall";
                default:
                    return "sap-icon://question-mark";
            }
        }
        // ,
        // getStatusState: function(ticketStatus) {
        //     switch(ticketStatus) {
        //         case 'New':
        //             return "Success";
        //         case 'In Progress':
        //             return "Warning";
        //         case 'Closed':
        //             return "Error";
        //         default:
        //             return "Error";
        //     }
        // }
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