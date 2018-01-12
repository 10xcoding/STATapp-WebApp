sap.ui.define([
    "sap/m/MessageBox"
    ,"sap/m/MessageToast"
	,"statapp/controller/BaseController"
	,"sap/ui/model/json/JSONModel"
	,"sap/ui/core/Fragment"
	,"jquery.sap.global"
], function (MessageBox, MessageToast, BaseController, JSONModel, Fragment, jQuery) {
	"use strict";
	var _aValidTabKeys = ["Details", "Comments", "Attachments"];
	var oViews;
	var currentTicketId = "";
// 	var oAuthorModel;
    var oModel;
    var dateStarted, dateClosed;
	var oStartTicketButton, oCloseTicketButton;
	return BaseController.extend("statapp.controller.ticket.TicketDetails", {
        /*******************************/
        /***  ROUTE/BINDING/LOADING  ***/
        /*******************************/
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
		_onBindingChange : function () {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},
        onInit : function () {
            // Set router
			var oRouter = this.getRouter();
			this.getView().setModel(new JSONModel(), "view");
			oRouter.getRoute("ticket").attachMatched(this._onRouteMatched, this);
			
			// Subscribe to event buses
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("ticketDetailsChannel", "setStartTicketButton", this.setStartTicketButton, this);
            oEventBus.subscribe("ticketDetailsChannel", "setCloseTicketButton", this.setCloseTicketButton, this);
            oEventBus.subscribe("ticketDetailsChannel", "updateFields", this.updateFields, this);
            // oEventBus.subscribe("ticketDetailsChannel", "updateCommentFeed", this.updateCommentFeed, this);
		},
		onAfterRendering : function() {
// 			var oComment = this.getView().byId('ticketDetailsComments');
// 			oComment.$().attr('aria-haspopup', true);
		},
		/**********************/
        /***  DETAILS PAGE  ***/
        /**********************/
		onTabSelect : function (oEvent){
			var oCtx = this.getView().getBindingContext();
			this.getRouter().navTo("ticket", {
				ticketId : oCtx.getProperty("ticketId"),
				query: {
					tab : oEvent.getParameter("selectedKey")
				}
			}, true /*without history*/);
		},
        setStartTicketButton : function() {
            // Check ticket status, set start ticket button as needed
            if (oModel === undefined) {
                oModel = this.getView().getModel();
            }
            if (dateStarted === undefined) {
                dateStarted = oModel.dateStarted;
            }
            if (dateStarted !== "" && dateStarted !== "?" && dateStarted !== null) {
                if (oStartTicketButton === undefined) {
                    oStartTicketButton = this.getView().byId("startTicketButton");
                }
                oStartTicketButton.setEnabled(true);
            }
        },
        setCloseTicketButton : function() {
            // Check ticket status, set close button as needed
            if (oModel === undefined) {
                oModel = this.getView().getModel();
            }
            if (dateStarted === undefined) {
                dateClosed = oModel.dateClosed;
            }
            if (dateClosed !== "" && dateClosed !== "?" && dateClosed !== null) {
                if (oCloseTicketButton === undefined) {
                    oCloseTicketButton = this.getView().byId("closeTicketButton");
                }
                this.getView().byId("closeTicketButton").setEnabled(true);
            }
        },
		onPressStartTicket : function () {
            //Set button as unclickable
            if (oStartTicketButton === undefined) {
                oStartTicketButton = this.getView().byId("startTicketButton");
            }
            oStartTicketButton.setEnabled(false);
            //Confirm selection
            if (confirm("Ticket start date cannot be changed after ticket is started. Continue?") == true) {
                //oData Service
                var oParams = {};
                oParams.success = function(){
                    MessageToast.show("Ticket Started!", {
                        closeOnBrowserNavigation: false }
                    );
                    var oEventBus = sap.ui.getCore().getEventBus();
                    oEventBus.publish("ticketListChannel", "updateTicketList");
                    oEventBus.publish("ticketDetailsChannel", "setStartTicketButton");
                    oEventBus.publish("ticketDetailsChannel", "updateFields");
                    oEventBus.publish("ticketEditChannel", "updateFields");
                };
                oParams.error = function(){
                    MessageToast.show("Error occured when updating,\nno changes saved", {
                        closeOnBrowserNavigation: false }
                    );
                    var oEventBus = sap.ui.getCore().getEventBus();
                    oEventBus.publish("ticketDetailsChannel", "setStartTicketButton", false);
                };
                oParams.bMerge = true;
                this.getView().getModel().update("/StartTicket('" + currentTicketId + "')", {}, oParams );
            }
        },
        onPressCloseTicket : function () {
            //Set button as unclickable
            if (oCloseTicketButton === undefined) {
                oCloseTicketButton = this.getView().byId("closeTicketButton");
            }
            oCloseTicketButton.setEnabled(false);
            //Confirm selection
            if (confirm("Ticket close date cannot be changed after ticket is closed. Continue?") == true) {
                //oData Service
                var oParams = {};
                oParams.success = function(){
                    MessageToast.show("Ticket Closed!", {
                        closeOnBrowserNavigation: false }
                    );
                    var oEventBus = sap.ui.getCore().getEventBus();
                    oEventBus.publish("ticketListChannel", "updateTicketList");
                    oEventBus.publish("ticketDetailsChannel", "setCloseTicketButton");
                    oEventBus.publish("ticketDetailsChannel", "updateFields");
                    oEventBus.publish("ticketEditChannel", "updateFields");
                };
                oParams.error = function(){
                    MessageToast.show("Error occured when updating,\nno changes saved", {
                        closeOnBrowserNavigation: false }
                    );
                    var oEventBus = sap.ui.getCore().getEventBus();
                    oEventBus.publish("ticketDetailsChannel", "setCloseTicketButton", false);
                };
                oParams.bMerge = true;
                this.getView().getModel().update("/CloseTicket('" + currentTicketId + "')", {}, oParams );
            }
        },
        updateFields : function() {
            oModel.refresh();
        },
		/*********************/
        /***  DETAILS TAB  ***/
        /*********************/
		onClickEdit : function () {
			this.getRouter().navTo("ticketEdit",{
				ticketId : currentTicketId
			});
		},
		/**********************/
        /***  COMMENTS TAB  ***/
        /**********************/
		onPostComment : function(oEvent) {
            //Get comment text
			var userCommentText = oEvent.getParameter("value");
            //Context data
            var currUser = "STU0000002"; // TODO: GET USER FROM CONTEXT
            if (userCommentText === "" || currentTicketId === "" || currUser === "") {
                MessageToast.show("Something went wrong. Please try again later.", {
                    closeOnBrowserNavigation: false });
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
		addNewComment : function(commentsJSO) {
            var oParams = {};
            oParams.success = function(){
                MessageToast.show("Comment posted!");
                var oEventBus = sap.ui.getCore().getEventBus();
                oEventBus.publish("ticketDetailsChannel", "updateFields");
            };
            oParams.error = function(){
                MessageToast.show("Error occured when posting comment", {
                    closeOnBrowserNavigation: false }
                );
            };
            oParams.bMerge = true;
            this.getView().getModel().create("/CreateComment", commentsJSO, oParams );
		},
		/*********************/
        /***  USER POP-UP  ***/
        /*********************/
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
		openQuickView : function (oCommentModel, oSenderDomRef) {
			this.createPopover(oCommentModel);
			this._oQuickView.setModel(oCommentModel);
			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			jQuery.sap.delayedCall(10, this, function () {
				this._oQuickView.openBy(oSenderDomRef);
				this._oQuickView.setPlacement(sap.m.PlacementType.Bottom);
			});
		},
		createPopover : function () {
			if (!this._oQuickView) {
				this._oQuickView = sap.ui.xmlfragment("statapp.view.user.UserDetails", this);
				this.getView().addDependent(this._oQuickView);
			}
		},
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
