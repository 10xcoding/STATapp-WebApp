sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
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
        }
    });
});