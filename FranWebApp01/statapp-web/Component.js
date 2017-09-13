sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/demo/wt/controller/TicketDialog"
], function (UIComponent, JSONModel, TicketDialog) {
    "use strict";
    return UIComponent.extend("sap.ui.demo.wt.Component", {
        metadata : {
            manifest: "json"
        },
        init : function () {
            //call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            //set data model
            var oData = {
                ticketItem : {
                    ticketTitle : "Default Ticket Name"
                }
            };
            var oModel = new JSONModel(oData);
            this.setModel(oModel);
            
            //set Dialog
            this._ticketDialog = new TicketDialog(this.getRootControl());
        },
        
        openTicketDialog : function() {
            this._ticketDialog.open();
        }
    });
});