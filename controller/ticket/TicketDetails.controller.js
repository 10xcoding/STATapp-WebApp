sap.ui.define([
	"statapp/controller/BaseController"
	,"sap/ui/model/json/JSONModel"
	,"sap/ui/core/Fragment"
	,"jquery.sap.global"
	,"statapp/model/formatter"
], function (BaseController, JSONModel, Fragment, jQuery, formatter) {
	"use strict";
	var _aValidTabKeys = ["Details", "Comments", "Attachments"];    // Tab list
	var oViews;                                                     // Page view object
	var currentTicketId = "";                                       // ticket id
    var oModel;                                                     // data model object
    var dateStarted, dateClosed;                                    // date objects
	var oStartTicketButton, oCloseTicketButton;                     // start/close button objects
	var oEventBus;                                                  // EventBus object (handles response to actions on other pages)
	return BaseController.extend("statapp.controller.ticket.TicketDetails", {
	    formatter : formatter,
        /*******************************/
        /***  ROUTE/BINDING/LOADING  ***/
        /*******************************/
        /**
         * This function is the initialization function (called on initialization of the view)
         * @private
         */
        onInit : function () {
            // Set router
			var oRouter = this.getRouter();
			this.getView().setModel(new JSONModel(), "view");
			oRouter.getRoute("ticket").attachMatched(this._onRouteMatched, this);
			
			// Subscribe to event buses
			if (!oEventBus) {
                oEventBus = sap.ui.getCore().getEventBus();
			}
            oEventBus.subscribe("ticketDetailsChannel", "setStartTicketButton", this.setStartTicketButton, this);
            oEventBus.subscribe("ticketDetailsChannel", "setCloseTicketButton", this.setCloseTicketButton, this);
            oEventBus.subscribe("ticketDetailsChannel", "updateFields", this.updateFields, this);
		},
        /**
         * This function is used for route matching and tab movement
         * @private
         */
		_onRouteMatched : function (oEvent) {
			var oArgs, oQuery;
			oArgs = oEvent.getParameter("arguments");
			currentTicketId = oArgs.ticketId;
			oViews = this.getView();
			oViews.bindElement({
				path : "/Tickets('" + currentTicketId + "')",
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViews.setBusy(true);
					},
					dataReceived: function () {
						oViews.setBusy(false);
					}
				}
			});
			oQuery = oArgs["?query"];
			if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) >= 0) { 
				oViews.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
			} else {
				// the default query param should be visible at all time
				this.getRouter().navTo("ticket", {
					ticketId : oArgs.ticketId,
					query: {
						tab : _aValidTabKeys[0]
					}
				}, true /*no history*/);
			}
		},
        /**
         * This function is used if the router cannot match the generated route
         * @private
         */
		_onBindingChange : function () {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},
		/**
         * This function handles actions immediatelty after the view is rendered
         */
		onAfterRendering : function() {
            // this.setStartTicketButton();
            // this.setCloseTicketButton();
		},
        /**
         * This function is used for navigation between tabs
         * @private
         */
		onTabSelect : function (oEvent){
			var oCtx = this.getView().getBindingContext();
			this.getRouter().navTo("ticket", {
				ticketId : oCtx.getProperty("ticketId"),
				query: {
					tab : oEvent.getParameter("selectedKey")
				}
			}, true /*without history*/);
		},
		/**********************/
        /***  DETAILS PAGE  ***/
        /**********************/
        /**
         * This function is a callback (eventbus) function which updates the start ticket button if any changes have been made.
         * @private
         */
        setStartTicketButton : function() {
            // Check ticket status, set start ticket button as needed
            if (!oStartTicketButton) {
                oStartTicketButton = this.getView().byId("startTicketButton");
            }
            if (!dateStarted) {
                if (!oModel) {
                    oModel = this.getView().getModel();
                }
                dateStarted = oModel.dateStarted;
            }
            if (dateStarted !== "" && dateStarted !== "?" && dateStarted !== null && dateStarted !== undefined) {
                oStartTicketButton.setEnabled(true);
            } else {
                oStartTicketButton.setEnabled(false);
            }
        },
        /**
         * This function is a callback (eventbus) function which updates the close ticket button if any changes have been made.
         * @private
         */
        setCloseTicketButton : function() {
            // Check ticket status, set close button as needed
            if (!oCloseTicketButton) {
                oCloseTicketButton = this.getView().byId("closeTicketButton");
            }
            if (!dateClosed) {
                if (!oModel) {
                    oModel = this.getView().getModel();
                }
                dateClosed = oModel.dateClosed;
            }
            if (dateClosed !== "" && dateClosed !== "?" && dateClosed !== null && dateClosed !== undefined) {
                oCloseTicketButton.setEnabled(true);
            } else {
                oCloseTicketButton.setEnabled(false);
            }
        },
        /**
         * This function handles start ticket button presses - set button as unclickable, OData call, react to response
         * @private
         */
		onPressStartTicket : function () {
            var i18nResBundle = this.getView().getModel("i18n").getResourceBundle();
            //Set button as unclickable
            if (!oStartTicketButton) {
                oStartTicketButton = this.getView().byId("startTicketButton");
            }
            oStartTicketButton.setEnabled(false);
            //Confirm selection
            if (confirm(this.getView().getModel("i18n").getResourceBundle().getText("TicketDetails.StartTicketConfirm")) === true) {
                //oData Service
                var oParams = {};
                oParams.success = function() {
                    sap.m.MessageToast.show(i18nResBundle.getText("TicketDetails.StartTicketSuccess"), {
                        closeOnBrowserNavigation: false
                    });
                    if (!oEventBus) {
                        oEventBus = sap.ui.getCore().getEventBus();
                    }
                    oEventBus.publish("ticketListChannel", "updateTicketList");
                    oEventBus.publish("ticketDetailsChannel", "setStartTicketButton");
                    oEventBus.publish("ticketDetailsChannel", "updateFields");
                    oEventBus.publish("ticketEditChannel", "updateFields");
                };
                oParams.error = function(){
                    sap.m.MessageToast.show(i18nResBundle.getText("TicketDetails.StartTicketError"), {
                        closeOnBrowserNavigation: false
                    });
                    if (!oEventBus) {
                        oEventBus = sap.ui.getCore().getEventBus();
                    }
                    oEventBus.publish("ticketDetailsChannel", "setStartTicketButton", false);
                };
                oParams.bMerge = true;
                this.getView().getModel().update("/StartTicket('" + currentTicketId + "')", {}, oParams );
            }
        },
        /**
         * This function handles start ticket button presses - set button as unclickable, OData call, react to response
         * @private
         */
        onPressCloseTicket : function () {
            var i18nResBundle = this.getView().getModel("i18n").getResourceBundle();
            //Set button as unclickable
            if (oCloseTicketButton === undefined) {
                oCloseTicketButton = this.getView().byId("closeTicketButton");
            }
            oCloseTicketButton.setEnabled(false);
            //Confirm selection
            if (confirm(this.getView().getModel("i18n").getResourceBundle().getText("TicketDetails.CloseTicketConfirm")) === true) {
                //oData Service
                var oParams = {};
                oParams.success = function() {
                    sap.m.MessageToast.show(i18nResBundle.getText("TicketDetails.CloseTicketSuccess"), {
                        closeOnBrowserNavigation: false
                    });
                    if (!oEventBus) {
                        oEventBus = sap.ui.getCore().getEventBus();
                    }
                    oEventBus.publish("ticketListChannel", "updateTicketList");
                    oEventBus.publish("ticketDetailsChannel", "setCloseTicketButton");
                    oEventBus.publish("ticketDetailsChannel", "updateFields");
                    oEventBus.publish("ticketEditChannel", "updateFields");
                };
                oParams.error = function() {
                    sap.m.MessageToast.show(i18nResBundle.getText("TicketDetails.CloseTicketError"), {
                        closeOnBrowserNavigation: false
                    });
                    if (!oEventBus) {
                        oEventBus = sap.ui.getCore().getEventBus();
                    }
                    oEventBus.publish("ticketDetailsChannel", "setCloseTicketButton", false);
                };
                oParams.bMerge = true;
                this.getView().getModel().update("/CloseTicket('" + currentTicketId + "')", {}, oParams );
            }
        },
        /**
         * This function is a callback function (refreshes model if changes are made elsewhere)
         * @private
         */
        updateFields : function() {
            if (!oModel) {
                oModel = this.getView().getModel();
            }
            oModel.refresh();
        },
		/*********************/
        /***  DETAILS TAB  ***/
        /*********************/
        /**
         * This function handles edit ticket button presses - nav to edit ticket page
         * @private
         */
		onClickEdit : function () {
			this.getRouter().navTo("ticketEdit",{
				ticketId : currentTicketId
			});
		},
		/**********************/
        /***  COMMENTS TAB  ***/
        /**********************/
        /**
         * This function handles post comment button presses - prepare object for OData call
         * @private
         */
		onPostComment : function(oEvent) {
            //Get comment text
			var userCommentText = oEvent.getParameter("value");
            //Context data
            var currUser = "STU0000002"; // TODO: GET USER FROM CONTEXT
            if (userCommentText === "" || currentTicketId === "" || currUser === "") {
                sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("TicketDetails.Comments.Validation"), {
					closeOnBrowserNavigation: false
				});
            } else {
                //Define defaults
                var defaultCommentId = "X"; // Req'd for create, but a new id is generated in hdbprocedure from hdbsequence
                //Create json object
                var commentsJSO =
                    {
                        "commentId": defaultCommentId, // Req'd for create, but a new id is generated in hdbprocedure from hdbsequence
                        "text":  userCommentText  ,
                        "author.userId":  currUser  ,
                        "ticket.ticketId":  currentTicketId
                    };
                //oData create call - also refresh comment list
                this.addNewComment(commentsJSO);
            }
		},
        /**
         * This function handles start ticket button presses - OData call, react to response
         * @private
         */
		addNewComment : function(commentsJSO) {
            var oParams = {};
            var i18nResBundle = this.getView().getModel("i18n").getResourceBundle();
            oParams.success = function() {
                sap.m.MessageToast.show(i18nResBundle.getText("TicketDetails.Comments.Success"), {
					closeOnBrowserNavigation: false
				});
                if (!oEventBus) {
                    oEventBus = sap.ui.getCore().getEventBus();
                }
                oEventBus.publish("ticketDetailsChannel", "updateFields");
            };
            oParams.error = function() {
                sap.m.MessageToast.show(i18nResBundle.getText("TicketDetails.Comments.Error"), {
					closeOnBrowserNavigation: false
				});
            };
            oParams.bMerge = true;
            this.getView().getModel().create("/CreateComment", commentsJSO, oParams );
		},
		/*********************/
        /***  USER POP-UP  ***/
        /*********************/
        /**
         * This function handles author name presses - prepares author model to open
         * @private
         */
		onAuthorPress: function (oEvent) {
            var oCommentId = oEvent.getSource().getCustomData()[0].getValue("commentId");
            var oCommentData = this.getView().getModel().getData("/Comments('" + oCommentId + "')");
            var oCommentModel = new JSONModel(
                {
                    path : [{
                        firstName : oCommentData.firstName,
                        lastName : oCommentData.lastName,
                        email : oCommentData.email
                    }]
                });
            var oSenderDomRef = oEvent.getParameters().getDomRef();
			this.openQuickView(oCommentModel, oSenderDomRef);
		},
        /**
         * This function calls a popover function, and places the popover in the correct location if it is a larger screen
         * @private
         */
		openQuickView : function (oCommentModel, oSenderDomRef) {
			this.createPopover();
			this._oQuickView.setModel(oCommentModel);
			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			jQuery.sap.delayedCall(10, this, function () {
				this._oQuickView.openBy(oSenderDomRef);
				this._oQuickView.setPlacement(sap.m.PlacementType.Bottom);
			});
		},
        /**
         * This function handles XML fragment popover creation
         * @private
         */
		createPopover : function () {
			if (!this._oQuickView) {
				this._oQuickView = sap.ui.xmlfragment("statapp.view.user.UserDetails", this);
				this.getView().addDependent(this._oQuickView);
			}
		},
        /**
         * This function handles exiting the generated XML fragment
         * @private
         */
		onExit : function () {
			if (this._oQuickView) {
				this._oQuickView.destroy();
			}
		}
		/*********************/
        /***  ATTACHMENTS  ***/
        /*********************/
		
	});
});
