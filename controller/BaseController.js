sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";
	return Controller.extend("statapp.controller.BaseController", {
	    /**
         * This function returns the router for the baseController
         *
         * @private
         * @returns {Router} the router for this BaseController
         */
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		/**
         * This function handles navigating back (from a back button push)
         *
         * @private
         */
		onNavBack: function () {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash(); // TODO: go back one breadcrumb instead of one history
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, false /*no history*/);
			}
		}
// 		,
// 		onPressRefresh: function () {
// 			var oHistory, sPreviousHash;
// 			oHistory = History.getInstance();
// 			sPreviousHash = oHistory.getPreviousHash();
// 			if (sPreviousHash !== undefined) {
// 				window.history.go(0);
// 			} else {
// 				this.getRouter().navTo("appHome", {}, true /*no history*/);
// 			}
// 		}
	});
});