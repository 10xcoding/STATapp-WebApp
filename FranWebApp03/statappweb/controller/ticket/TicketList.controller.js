sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController",
	"sap/ui/demo/nav/model/formatter"
], function (BaseController, formatter) {
    
	"use strict";

	return BaseController.extend("sap.ui.demo.nav.controller.ticket.TicketList", {
        formatter: formatter,
		onInit : function () {
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
		    var ticketTable = this.getView().byId("ticketsTable");
		    var tableItems = ticketTable.getBinding("items");
		    tableItems.filter(aFilters, "Application");
		},
		onTicketListItemPress : function(oEvent){
			var selectedPath = oEvent.getSource()._aSelectedPaths[0]; // selectedPath = "/Tickets('STT0001111')"
			var ticketId = selectedPath.slice(10,20);
			this.getRouter().navTo("ticket",{
				ticketId : ticketId
			});
		}
	});
});