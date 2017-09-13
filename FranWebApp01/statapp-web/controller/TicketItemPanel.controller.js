sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";
    return Controller.extend("sap.ui.demo.wt.controller.TicketItemPanel", {
        onShowTestResult : function() {
            //read message from i18n model
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sTicketTitle = this.getView().getModel().getProperty("/ticketItem/ticketTitle");
            var sMsg = oBundle.getText("contentMsg", [sTicketTitle]);
            // show a toast message
            MessageToast.show(sMsg);
        },
        onOpenDialog : function() {
            this.getOwnerComponent().openTicketDialog();
        }
    });
});