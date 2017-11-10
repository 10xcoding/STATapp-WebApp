sap.ui.define([
	"statapp/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("statapp.controller.ticket.TicketList", {
        _onRouteMatched : function() {
		},
		onInit : function() {
		    // Subscribe to event buses
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("ticketListChannel", "updateTicketList", this.updateTicketList, this);
        },
		onBeforeRendering : function() {
		},
		onAfterRendering : function() {
		},
        onExit: function() {
        },
        updateTicketList : function () {
            //build filter array
            var aFilters = [];
            aFilters.push(new sap.ui.model.Filter("description_status", sap.ui.model.FilterOperator.NE, 'Closed'));
            //bind filter
            var ticketList = this.getView().byId("ticketsList");
            var tableItems = ticketList.getBinding("items");
            ticketList.getModel().updateBindings(true);
            tableItems.filter(aFilters, "Application");
		},
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
                aFilters.push(new sap.ui.model.Filter("description_status", sap.ui.model.FilterOperator.NE, 'Closed'));
            }
            //bind filter
            var ticketList = this.getView().byId("ticketsList");
            var tableItems = ticketList.getBinding("items");
            ticketList.getModel().updateBindings(true);
            tableItems.filter(aFilters, "Application");
		},
		onTicketListItemPress : function(oEvent){
			var selectedPath = oEvent.getSource().getBindingContext().sPath; // selectedPath = "/Tickets('STT0001111')"
			var ticketId = selectedPath.slice(10,-2);
			this.getRouter().navTo("ticket",{
				ticketId : ticketId
			});
		},
		onNavToNewTicket : function(){
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("newTicketChannel", "clearFields");
			this.getRouter().navTo("newTicket"); 
		}
	});
});