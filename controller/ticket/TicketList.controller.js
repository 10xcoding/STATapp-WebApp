sap.ui.define([
	"statapp/controller/BaseController",
	"statapp/model/formatter",
	"sap/ui/model/Filter"
], function (BaseController, formatter, Filter) {
	"use strict";
	var sortOrderInverted;
	var aFilters = [];
	var oTicketListItemsBinding;
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
            oTicketListItemsBinding = ticketList.getBinding("items");
            ticketList.getModel().updateBindings(true);
            oTicketListItemsBinding.filter(aFilters, "Application");
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
            oTicketListItemsBinding = ticketList.getBinding("items");
            ticketList.getModel().updateBindings(true);
            oTicketListItemsBinding.filter(aFilters, "Application");
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
                    aFilters.push(oFilter);
                }
            }
            oTicketListItemsBinding.filter(aFilters);
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
         * This function handles confirming a grouping selection, and updates the list to reflect this choice
         * @private
         */
		onConfirmGroup : function(oEvent) {
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
            if (mParams.groupItem) {
                var sGroupPath = mParams.groupItem.getKey();
                var bGroupDescending = mParams.groupDescending;
                var vGroup = function(oContext) {
                    var name = oContext.getProperty("Address/City");
                    return {
                        key: name,
                        text: name
                    };
                };
                aSorters.push(new sap.ui.model.Sorter(sGroupPath, bGroupDescending, vGroup));
            }
            oTicketListItemsBinding.sort(aSorters);
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

// For all three at once: (use if individual sort/filter/group runs into problems)

// onConfirm : function(oEvent) {
// 		    // get list/items
//             var oView = this.getView();
//             var oList = oView.byId("ticketsList");
//             var oBinding = oList.getBinding("items");
//             // get sort parameters
//             var mParams = oEvent.getParameters();
            
//             // apply grouping
//             var aSorters = [];
//             if (mParams.groupItem) {
//                 var sGroupPath = mParams.groupItem.getKey();
//                 var bGroupDescending = mParams.groupDescending;
//                 var vGroup = function(oContext) {
//                     var name = oContext.getProperty("Address/City");
//                     return {
//                         key: name,
//                         text: name
//                     };
//                 };
//                 aSorters.push(new sap.ui.model.Sorter(sGroupPath, bGroupDescending, vGroup));
//             }
            
//             // apply sorter
//             var sSortPath = mParams.sortItem.getKey();
//             var bSortDescending = mParams.sortDescending;
//             aSorters.push(new sap.ui.model.Sorter(sSortPath, bSortDescending));
//             oBinding.sort(aSorters);
            
//             // apply filters
//             var aFilters = [];
//             var oFilterItem, aSplit, sFilterPath, vOperator, vValue1, vValue2, oFilter;
//             for (var i = 0, l = mParams.filterItems.length; i < l; i++) {
//                 oFilterItem = mParams.filterItems[i];
//                 aSplit = oFilterItem.getKey().split("___");
//                 sFilterPath = aSplit[0];
//                 vOperator = aSplit[1];
//                 vValue1 = aSplit[2];
//                 vValue2 = aSplit[3];
//                 oFilter = new sap.ui.model.Filter(sFilterPath, vOperator, vValue1, vValue2);
//                 aFilters.push(oFilter);
//             }
//             oBinding.filter(aFilters);
// 		},



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
