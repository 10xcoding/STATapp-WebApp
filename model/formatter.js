sap.ui.define([
//   "sap/ui/model/resource/ResourceModel"
   ], function (/*ResourceModel*/) {
	"use strict";
	return {
	    /**
         * This function returns, for the given ticketPriority, an sap state (Success, Warning, or Error) which corresponds to a
         * UI color/design.
         *
         * @private
         * @param {ticketPriority} a priority description as defined in the database (currently Low, Medium, or High)
         * @returns {str} an sap state
         */
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
	    /**
         * This function returns, for the given ticketPriority and ticketStatus, an empty string if a ticket is closed,
         * or the ticketPriority otherwise
         *
         * @private
         * @param {ticketPriority} a priority description as defined in the database (currently Low, Medium, or High)
         * @param {ticketStatus} a status description as defined in the database (currently New, In Progress, or Closed)
         * @returns {str} a ticketPriority string to print
         */
        getPriorityOpenClose: function(ticketPriority, ticketStatus) {
            switch(ticketStatus) {
                case 'Closed':
                    return "";
                default:
                    return ticketPriority;
            }
        },
        /**
         * This function returns, for the given ticketStatus, true if the status is new, false otherwise
         *
         * @private
         * @param {ticketStatus} a status description as defined in the database (currently New, In Progress, or Closed)
         * @returns {boolean} true or false
         */
        /*isNew: function(ticketStatus) {
            switch(ticketStatus) {
                case 'New':
                    return true;
                default:
                    return false;
            }
        }*/
        /**
         * This function returns a starred version of the title if the ticket is new
         *
         * @private
         * @param {ticketTitle} a title
         * @param {ticketStatus} a status description as defined in the database (currently New, In Progress, or Closed)
         * @returns {boolean} true or false
         */
        starNew: function(ticketTitle, ticketStatus) {
            switch(ticketStatus) {
                case 'New':
                    return "*" + ticketTitle;
                default:
                    return ticketTitle;
            }
        }
        ,
	    /**
         * This function returns an sapui5 icon corresponding to the functional area 
         *
         * @private
         * @param {funcArea} a functional area description as defined in the database (currently, one of the values listed below)
         * @returns {int} the count of open tickets
         */
        getFuncAreaIcon: function(funcArea) {
            switch(funcArea) {
                case 'Unknown':
                    return "sap-icon://question-mark";
                case 'Shipping/Receiving':
                    return "sap-icon://shipping-status";
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