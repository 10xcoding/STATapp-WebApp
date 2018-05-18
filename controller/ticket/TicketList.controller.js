sap.ui.define([
	"statapp/controller/BaseController",
	"statapp/model/formatter",
	"sap/ui/model/Filter"
], function (BaseController, formatter, Filter) {
	"use strict";
	var aFilters = [];              // Filter list for ticketList filtering
	var ticketList;                 // ticketList object
	var oTicketListItemsBinding;    // ticketList item binding object
	var oEventBus;                  // EventBus object (handles response to actions on other pages)
	return BaseController.extend("statapp.controller.ticket.TicketList", {
        formatter: formatter,       // Formatter to be used by view
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
            oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("ticketListChannel", "updateTicketList", this.updateTicketList, this);
            aFilters = [new Filter("ticketStatus_description", sap.ui.model.FilterOperator.NE, 'Closed')];
        },
        /**
         * This function is a callback (eventbus) function which updates the open ticket ticket list if any changes have been made.
         * @private
         */
        updateTicketList : function () {
            //build filter array
            aFilters = this.getDefaultFilter();
            //update filter
            oTicketListItemsBinding.filter(aFilters, "Application");
		},
		/**
         * This function returns the default filter to avoid (and keeps it in one place within this controller)
         * @private
         * @returns {sap.ui.model.Filter} the default filter for the ticketList
         */
		getDefaultFilter : function() {
            return [new Filter("ticketStatus_description", sap.ui.model.FilterOperator.NE, 'Closed')];
		},
		/**
         * This function handles the liveChange filter of the tickets (shows closed tickets also on search).
         * @private
         * @param {oEvent} the event of the search box
         */
		onFilterTickets : function(oEvent) {
            //build filter array
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filters = [
                    this.createFilter("ticketTitle", sQuery, sap.ui.model.FilterOperator.Contains, true),
                    this.createFilter("ticketId", sQuery, sap.ui.model.FilterOperator.Contains, true),
                    this.createFilter("creator_firstName", sQuery, sap.ui.model.FilterOperator.Contains, true),
                    this.createFilter("creator_lastName", sQuery, sap.ui.model.FilterOperator.Contains, true),
                    this.createFilter("assignee_firstName", sQuery, sap.ui.model.FilterOperator.Contains, true),
                    this.createFilter("assignee_lastName", sQuery, sap.ui.model.FilterOperator.Contains, true),
                    this.createFilter("ticketDescription", sQuery, sap.ui.model.FilterOperator.Contains, true)
                ]; 
                var orFilter = new Filter(filters, false);
                aFilters = [orFilter];
            }
            if (sQuery.length === 0) {
                aFilters = this.getDefaultFilter();
            }
            //bind filter
            if (!ticketList) {
                this.saveTicketListBinding();
            }
            // ticketList.getModel().updateBindings(true);
            oTicketListItemsBinding.filter(aFilters, "Application");
		},
		/**
         * This function handles navigation to ticket details page of a specific ticket
         * @private
         * @param {oEvent} the listItem being clicked (determines which ticketId to use)
         */
		onTicketListItemPress : function(oEvent) {
            this.saveTicketListBinding();
			var selectedPath = oEvent.getSource().getBindingContext().sPath; // selectedPath = "/Tickets('STT0001111')"
			var ticketId = selectedPath.slice(-12,-2); //TODO: get without slice?
			this.getRouter().navTo("ticket", {
				ticketId : ticketId
			});
		},
        /**
         * This function saves the binding to the ticket list, which is needed for the eventbus
         * @private
         */
        saveTicketListBinding : function() {
            ticketList = this.getView().byId("ticketsList");
            oTicketListItemsBinding = ticketList.getBinding("items");
        },
		/**
         * This function handles the sort button press, and reverses the order of the list
         * @private
         */
		onPressSortList : function() {
            // Open the sort dialog fragment
            this._oDialog = sap.ui.xmlfragment("statapp.view.ticket.ticketListFragments.SortDialog", this);
            this._oDialog.open();
		},
		/**
         * This function handles confirming sort selection, and updates the list to reflect this choice
         * @private
         */
		onConfirmSort : function(oEvent) {
            // get list/items
            if (oTicketListItemsBinding === undefined) {
                var oView = this.getView();
                var oList = oView.byId("ticketsList");
                oTicketListItemsBinding = oList.getBinding("items");
            }
            // get sort parameters
            var mParams = oEvent.getParameters();
            
            // apply grouping
            var aSorters = [];
            
            // apply sorter
            var sSortPath = mParams.sortItem.getKey();
            var bSortDescending = mParams.sortDescending;
            aSorters.push(new sap.ui.model.Sorter(sSortPath, bSortDescending));
            oTicketListItemsBinding.sort(aSorters);
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
         * This function handles confirming filter selection, and updates the list to reflect these choices
         * @private
         */
		onConfirmFilter : function(oEvent) {
            // get list/items
            if (oTicketListItemsBinding === undefined) {
                var oView = this.getView();
                var oList = oView.byId("ticketsList");
                oTicketListItemsBinding = oList.getBinding("items");
            }
            // get sort parameters
            var mParams = oEvent.getParameters();
            
            // apply filters
            aFilters = [];
            var oFilterItem, vKey, vKeyPath, vKeyValue, vIsSelected, sFilterPath, oFilter;
            for (var i = 0; i < mParams.filterItems.length; i++) {
                oFilterItem = mParams.filterItems[i];
                vKey = oFilterItem.getKey("key"); // value of key
                vKeyPath = vKey.slice(0,1);
                vKeyValue = vKey.slice(1,2);
                vIsSelected = oFilterItem.getKey("selected"); //boolean
                if (vIsSelected) {
                    switch(vKeyPath) {
                        case "s": //status
                            sFilterPath = "ticketStatus_value";
                            break;
                        case "p": //priority
                            sFilterPath = "ticketPriority_value";
                            break;
                        default:
                            continue;
                    }
                    oFilter = new sap.ui.model.Filter(sFilterPath, "EQ", vKeyValue);
                    aFilters.push(oFilter);// = [oFilter];
                }
            }
            oTicketListItemsBinding.filter(aFilters, "Application");
		},
		/**
         * This function handles navigation to new ticket page (from button click)
         * @private
         */
		onNavToNewTicket : function() {
            if (!oEventBus) {
                oEventBus = sap.ui.getCore().getEventBus();
            }
            oEventBus.publish("newTicketChannel", "clearFields");
			this.getRouter().navTo("newTicket"); 
		}
	});
});
