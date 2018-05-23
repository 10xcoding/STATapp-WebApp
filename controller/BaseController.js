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
		},
		/**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
		getModel: function(sName) {
			return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
		},
		/**
         * Convenience method for refreshing the view model in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         */
		refreshModel: function(oModel, sName) {
			this.getView().setModel(oModel, sName).refresh();
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