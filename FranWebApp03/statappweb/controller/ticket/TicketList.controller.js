sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController",
	"sap/ui/demo/nav/model/formatter"
], function (BaseController, formatter) {
    
	"use strict";

	return BaseController.extend("sap.ui.demo.nav.controller.ticket.TicketList", {
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
		onTicketListItemPress : function(oEvent){
			var oItem;//, oCtx; //per tutorial
			oItem = oEvent.getSource();
// 			oCtx = oItem.getBindingContext(); //per tutorial
			var ticketLink = oItem.getSelectedContextPaths()[0];
			this.getRouter().navTo("ticket",{
				// ticketId : oCtx.getProperty("ticketId") //per routing/nav tutorial
				ticketId : ticketLink.slice(10,20)
				// ticketId : "STT0001114" //hard-code
			});
		}
	});
});