sap.ui.define([
	"statapp/controller/BaseController",
	"statapp/model/formatter"
], function (BaseController, formatter) {
	"use strict";
	return BaseController.extend("statapp.controller.ticket.TicketList", {
	    formatter: formatter,
        onInit : function() {
		    // Subscribe to event buses
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("ticketListChannel", "updateTicketList", this.updateTicketList, this);
        },
        /**
         * This function is a callback (eventbus) function which updates the open ticket ticket list if any changes have been made.
         */
        updateTicketList : function () {
            //build filter array
            var aFilters = [];
            aFilters.push(new sap.ui.model.Filter("ticketStatus_description", sap.ui.model.FilterOperator.NE, 'Closed'));
            //bind filter
            var ticketList = this.getView().byId("ticketsList");
            var tableItems = ticketList.getBinding("items");
            ticketList.getModel().updateBindings(true);
            tableItems.filter(aFilters, "Application");
		},
		/**
         * This function handles the liveChange filter of the tickets (shows closed tickets also on search).
         *
         * @private
         * @param {oEvent} the event of the search box
         */
		onFilterTickets : function(oEvent) {
            //build filter array
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();//.toLowerCase();
            if (sQuery && sQuery.length > 0) {
                var filters = [new sap.ui.model.Filter("ticketTitle", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("ticketId", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("firstName_creator", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("lastName_creator", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("firstName_assignee", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("lastName_assignee", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("ticketDescription",sap.ui.model.FilterOperator.Contains, sQuery)
                ]; 
                var orFilter = new sap.ui.model.Filter(filters, false);
                aFilters.push(orFilter);
            }
            if (sQuery.length === 0) {
                aFilters.push(new sap.ui.model.Filter("ticketStatus_description", sap.ui.model.FilterOperator.NE, 'Closed'));
            }
            //bind filter
            var ticketList = this.getView().byId("ticketsList");
            var tableItems = ticketList.getBinding("items");
            ticketList.getModel().updateBindings(true);
            tableItems.filter(aFilters, "Application");
		},
		/**
         * This function handles navigation to ticket details page of a specific ticket
         *
         * @private
         * @param {oEvent} the listItem being clicked (determines which ticketId to use)
         */
		onTicketListItemPress : function(oEvent){
			var selectedPath = oEvent.getSource().getBindingContext().sPath; // selectedPath = "/Tickets('STT0001111')"
			var ticketId = selectedPath.slice(-12,-2); //TODO: get without slice
			this.getRouter().navTo("ticket",{
				ticketId : ticketId
			});
		},
		/**
         * This function handles navigation to new ticket page (from button click)
         *
         * @private
         */
		onNavToNewTicket : function(){
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("newTicketChannel", "clearFields");
			this.getRouter().navTo("newTicket"); 
		}
	});
});