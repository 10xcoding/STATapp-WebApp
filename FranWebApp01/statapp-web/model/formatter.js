sap.ui.define([], function () {
	"use strict";
	return {
		priorityText: function (sPriority) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sPriority) {
				case "1":
					return resourceBundle.getText("High");
				case "2":
					return resourceBundle.getText("Medium");
				case "3":
					return resourceBundle.getText("Low");
				default:
					return sPriority;
			}
		}
	};
});