sap.ui.define([], function () {
	"use strict";
	return {
		priorityText: function (sPriority) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sPriority) {
				case "1":
					return resourceBundle.getText("TicketPriority1");
				case "2":
					return resourceBundle.getText("TicketPriority2");
				case "3":
					return resourceBundle.getText("TicketPriority3");
				default:
					return sPriority;
			}
		}
	};
});