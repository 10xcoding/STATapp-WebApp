sap.ui.define([
	"statapp/controller/BaseController",
	"statapp/model/formatter",
	"sap/ui/model/Filter"
], function (BaseController, formatter, Filter) {
	"use strict";
	var sortOrderInverted;
	var aFilters = [];
	return BaseController.extend("statapp.controller.ticket.TicketList", {
        formatter: formatter,
        /**
         * This function is a wrapper function for filters, which allows for case-insensitive search (sets everything to lowercase)
         * @private
         * @param {key} the list item key to filter using
         * @param {value} the list item key to filter using
         * @param {operator} the list item key to filter using
         * @param {useToLower} the list item key to filter using
         */
        createFilter: function(key, value, operator, useToLower) {
            return new Filter(
                useToLower ? "tolower(" + key + ")" : key,
                operator,
                useToLower ? "'" + value.toLowerCase() + "'" : value);
        },
        /**
         * This function is the initialization function (called on initialization of the view)
         * @private
         */
        onInit : function() {
		    // Subscribe to event buses
		    sortOrderInverted = false;
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("ticketListChannel", "updateTicketList", this.updateTicketList, this);
        },
        /**
         * This function is a callback (eventbus) function which updates the open ticket ticket list if any changes have been made.
         * @private
         */
        updateTicketList : function () {
            //build filter array
            aFilters.push(new Filter("ticketStatus_description", sap.ui.model.FilterOperator.NE, 'Closed'));
            //bind filter
            var ticketList = this.getView().byId("ticketsList");
            ticketList.setProperty();
            var tableItems = ticketList.getBinding("items");
            ticketList.getModel().updateBindings(true);
            tableItems.filter(aFilters, "Application");
		},
		/**
         * This function handles the liveChange filter of the tickets (shows closed tickets also on search).
         * @private
         * @param {oEvent} the event of the search box
         */
		onFilterTickets : function(oEvent) {
            //build filter array
            var sQuery = oEvent.getSource().getValue().toLowerCase();
            if (sQuery && sQuery.length > 0) {
                var filters = [
                    this.createFilter("ticketTitle", sQuery, "Contains", true),
                    this.createFilter("ticketId", sQuery, "Contains", true),
                    this.createFilter("creator_firstName", sQuery, "Contains", true),
                    this.createFilter("creator_lastName", sQuery, "Contains", true),
                    this.createFilter("assignee_firstName", sQuery, "Contains", true),
                    this.createFilter("assignee_lastName", sQuery, "Contains", true),
                    this.createFilter("ticketDescription", sQuery, "Contains", true)
                ]; 
                var orFilter = new Filter(filters, false);
                aFilters.push(orFilter);
            }
            if (sQuery.length === 0) {
                aFilters.push(new Filter("ticketStatus_description", sap.ui.model.FilterOperator.NE, 'Closed'));
            }
            //bind filter
            var ticketList = this.getView().byId("ticketsList");
            var tableItems = ticketList.getBinding("items");
            ticketList.getModel().updateBindings(true);
            tableItems.filter(aFilters, "Application");
		},
		/**
         * This function handles navigation to ticket details page of a specific ticket
         * @private
         * @param {oEvent} the listItem being clicked (determines which ticketId to use)
         */
		onTicketListItemPress : function(oEvent) {
			var selectedPath = oEvent.getSource().getBindingContext().sPath; // selectedPath = "/Tickets('STT0001111')"
			var ticketId = selectedPath.slice(-12,-2); //TODO: get without slice
			this.getRouter().navTo("ticket",{
				ticketId : ticketId
			});
		},
		/**
         * This function handles the sort button press, and reverses the order of the list
         * @private
         */
		onPressSortList : function() {
            sortOrderInverted = !sortOrderInverted;
            // Open the sort dialog fragment
            this._oDialog = sap.ui.xmlfragment("statapp.view.ticket.ticketListFragments.SortDialog", this);
            this._oDialog.open();
		},
		/**
         * This function handles the filter button press, and reverses the order of the list
         * @private
         */
		onPressFilterList : function() {
            // Open the filter dialog fragment
            this._oDialog = sap.ui.xmlfragment("statapp.view.ticket.ticketListFragments.FilterDialog", this);
            this._oDialog.open();
		},
		/**
         * This function handles the group button press, and reverses the order of the list
         * @private
         */
		onPressGroupList : function() {
            // Open the group dialog fragment
            this._oDialog = sap.ui.xmlfragment("statapp.view.ticket.ticketListFragments.GroupDialog", this);
            this._oDialog.open();
		},
		/**
         * This function handles navigation to new ticket page (from button click)
         * @private
         */
		onNavToNewTicket : function() {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("newTicketChannel", "clearFields");
			this.getRouter().navTo("newTicket"); 
		}
	});
});

// THIS IS THE FUNCTIONAL AREA ICON/DESCRIPTION PREVIOUSLY USED IN THE TICKET LIST
/*

<VBox
    class="sapUiSmallMarginBegin sapUiSmallMarginTopBottom"
    span="L4 M3 S2" >
    <core:Icon
        size="2rem"
        src="{
            parts:[{
                path:'functionalArea_description'
            }],
            formatter: '.formatter.getFuncAreaIcon'
        }" />
    <Label
        class="sapUiResponsiveContentPadding"
        text="{functionalArea_description}" />
</VBox>

*/
