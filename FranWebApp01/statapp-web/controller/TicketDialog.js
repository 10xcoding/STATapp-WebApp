sap.ui.define([
    "sap/ui/base/Object"
], function (UI5Object) {
    "use strict";
    
    return UI5Object.extend("sap.ui.demo.wt.controller.TicketDialog", {
        
        constructor : function (oView) {
            this._oView = oView;
        },
        
        open : function () {
            var oView = this._oView;
            var oDialog = oView.byId("ticketDialog");
            
            //Create dialog
            if (!oDialog) {
                var oFragmentController = {
                    onCloseDialog : function () {
                        oDialog.close();
                    }
                };
                //create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.wt.view.TicketDialog", oFragmentController);
                //connect dialog to the root view of this component (models, lifecycle)
                oView.addDependent(oDialog);
            }
            oDialog.open();
        }
    });
});