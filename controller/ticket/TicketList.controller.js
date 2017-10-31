sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController"
], function (BaseController) {
    
	"use strict";
	
	return BaseController.extend("sap.ui.demo.nav.controller.ticket.TicketList", {
		onInit : function () {
            // var ticketList = this.getView().byId("ticketsList");
            // ticketList.getBinding("items").refresh();
		},
		onAfterRendering : function() {
		},
		onFilterTickets : function(oEvent) {
            //build filter array
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
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
			this.getRouter().navTo("newTicket");
		}
	});
});