sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/demo/wt/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, formatter, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("sap.ui.demo.wt.controller.TicketList", {
        formatter: formatter,
		onInit : function () {
		},
		onFilterTickets : function(oEvent) {
		    //build filter array
		    var aFilter = [];
		    var sQuery = oEvent.getParameter("query");
		    if (sQuery) {
		        aFilter.push(new Filter("ticketTitle", FilterOperator.Contains, sQuery));
		    }
		    //filter binding
		    var oList = this.getView().byId("ticketList");
		    var oBinding = oList.getBinding("items");
		    oBinding.filter(aFilter);
		}

	});
});