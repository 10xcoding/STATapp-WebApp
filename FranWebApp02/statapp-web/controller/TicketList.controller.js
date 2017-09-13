sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/demo/wt/model/formatter"
], function (Controller, formatter) {
	"use strict";

	return Controller.extend("sap.ui.demo.wt.controller.TicketList", {
        formatter: formatter,
		onInit : function () {
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
                      new sap.ui.model.Filter("ticketDesciption",sap.ui.model.FilterOperator.Contains, sQuery)
                      ]; 
                var oFilter = new sap.ui.model.Filter(filters, false);
                aFilters.push(oFilter);
                //aFilters.push(new sap.ui.model.Filter("openShipmentFlg", sap.ui.model.FilterOperator.EQ, 'X'));
                //^^for add'l filter
            }
		    //filter binding
		    var oList = this.getView().byId("ticketsTable");
		    var oBinding = oList.getBinding("items");
		    oBinding.filter(aFilters, "Application");
		},
        onTicketListItemPress: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var bindingContext = oSelectedItem.getBindingContext();
            var ticketNumber = bindingContext.getProperty('ticketId');
            if (ticketNumber) { //Ticket selected
                return new sap.m.Page("sap.ui.demo.wt.view.TicketDetails");
            }
        }
	});
});