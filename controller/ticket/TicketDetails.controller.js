sap.ui.define([
    "sap/m/MessageBox"
    ,"sap/m/MessageToast"
	,"statapp/controller/BaseController"
	,"sap/ui/model/json/JSONModel"
], function (MessageBox, MessageToast, BaseController, JSONModel) {
	"use strict";
	var _aValidTabKeys = ["Details", "Comments", "Attachments"];
	var currentTicketId = "";
	var oAuthorModel = new JSONModel();
// 	var oStartButton, oCloseButton;
	return BaseController.extend("statapp.controller.ticket.TicketDetails", {
        /*******************************/
        /***  ROUTE/BINDING/LOADING  ***/
        /*******************************/
		_onRouteMatched : function (oEvent) {
			var oArgs, oView, oQuery;
			oArgs = oEvent.getParameter("arguments");
			currentTicketId = oArgs.ticketId;
			oView = this.getView();
			oView.bindElement({
				path : "/Tickets('" + currentTicketId + "')",
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oView.setBusy(true);
					},
					dataReceived: function () {
						oView.setBusy(false);
					}
				}
			});
			oQuery = oArgs["?query"];
			if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) >= 0) { 
				oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
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
        onInit: function () {
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
            // var oComments = this.getView().byId('ticketDetailsComments');
            // for (var i = 0 ; i < oComments.length ; i++) {
            //     oComments[i].sender.$().attr('aria-haspopup', true);
            // }
            // oStartButton = "";
            // oCloseButton = "";
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
            var oModel = this.getView().getModel();
            var dateStarted = oModel.dateStarted;
            if (dateStarted !== "" && dateStarted !== "?" && dateStarted !== null) {
                this.getView().byId("startTicketButton").setEnabled(true);
            }
        },
        setCloseTicketButton : function() {
            // Check ticket status, set close button as needed
            var oModel = this.getView().getModel();
            var dateClosed = oModel.dateClosed;
            if (dateClosed !== "" && dateClosed !== "?" && dateClosed !== null) {
                this.getView().byId("closeTicketButton").setEnabled(true);
            }
        },
        updateFields : function() {
            this.getView().getModel().refresh();
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
        /***  ATTACHMENTS  ***/
        /*********************/
		
		/*********************/
        /***  USER POP-UP  ***/
        /*********************/
		onAuthorPress: function (oEvent) {
		    var oView = this.getView();
			var oUserId = oEvent.getParameter("userId");
            this.oAuthorModel.bindElement({
                path : "/Users('" + oUserId + "')",
                events : {
                    change : this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oView.setBusy(true);
                    },
                    dataReceived: function () {
                        oView.setBusy(false);
                    }
                }
            });
			this.openQuickView(oEvent, oAuthorModel);
		},
		createPopover: function() {
			if (!this._oQuickView) {
				this._oQuickView = sap.ui.xmlfragment("sap.m.sample.QuickView.QuickView", this);
				this.getView().addDependent(this._oQuickView);
			}
		},
		openQuickView: function (oEvent, oModel) {
			this.createPopover();
			this._oQuickView.setModel(oModel);
			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			var oText = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this._oQuickView.openBy(oText);
			});
		},
		onExit: function () {
			if (this._oQuickView) {
				this._oQuickView.destroy();
			}
		}
	});
});
