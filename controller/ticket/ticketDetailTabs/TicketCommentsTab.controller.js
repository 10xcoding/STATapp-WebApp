// sap.ui.define([
//     "sap/m/MessageBox"
//     ,"sap/m/MessageToast"
// 	,"statapp/controller/ticket/TicketDetails"
// 	,"sap/ui/model/json/JSONModel"
// ], function (MessageBox, MessageToast, TicketDetails, JSONModel) {
// 	"use strict";
// 	var oAuthorModel = new JSONModel();
// 	return TicketDetails.extend("statapp.controller.ticket.TicketDetails", {
//         onInit: function () {
// 			// Subscribe to event buses
//             var oEventBus = sap.ui.getCore().getEventBus();
//             oEventBus.subscribe("ticketDetailsChannel", "updateCommentFeed", this.updateCommentFeed, this);
// 		},
//         updateCommentFeed : function() {
//             this.getView().getModel().refresh();
//         },
// 		_onBindingChange : function () {
// 			// No data for the binding
// 			if (!this.getView().getBindingContext()) {
// 				this.getRouter().getTargets().display("notFound");
// 			}
// 		},
// 		onPostComment : function(oEvent) {
//             //Get comment text
// 			var userCommentText = oEvent.getParameter("value");
//             //Context data
//             var currUser = "STU0000002"; // TODO: GET USER FROM CONTEXT
//             if (userCommentText === "" || currentTicketId === "" || currUser === "") {
//                 MessageToast.show("Something went wrong. Please try again later.", {
//                     closeOnBrowserNavigation: false });
//             } else {
//                 //Define defaults
//                 var defaultCommentId = "X"; // Req'd for create, but a new id is generated in hdbprocedure from hdbsequence
//                 //Create json object
//                 var commentsJSO =
//                     {
//                         "commentId": defaultCommentId, // Req'd for create, but a new id is generated in hdbprocedure from hdbsequence
//                         "text":  userCommentText  ,
//                         "author.userId":  currUser  ,
//                         "ticket.ticketId":  currentTicketId
//                     };
//                 //oData create call - also refresh comment list
//                 this.addNewComment(commentsJSO);
//             }
// 		},
// 		addNewComment : function(commentsJSO) {
//             var oParams = {};
//             oParams.success = function(){
//                 MessageToast.show("Comment posted!");
//                 var oEventBus = sap.ui.getCore().getEventBus();
//                 oEventBus.publish("ticketDetailsChannel", "updateFields");
//             };
//             oParams.error = function(){
//                 MessageToast.show("Error occured when posting comment", {
//                     closeOnBrowserNavigation: false }
//                 );
//             };
//             oParams.bMerge = true;
//             this.getView().getModel().create("/CreateComment", commentsJSO, oParams );
// 		},
// 		onAuthorPress: function (oEvent) {
// 		    var oView = this.getView();
// 			var oUserId = oEvent.getParameter("userId");
//             this.oAuthorModel.bindElement({
//                 path : "/Users('" + oUserId + "')",
//                 events : {
//                     change : this._onBindingChange.bind(this),
//                     dataRequested: function () {
//                         oView.setBusy(true);
//                     },
//                     dataReceived: function () {
//                         oView.setBusy(false);
//                     }
//                 }
//             });
// 			this.openQuickView(oEvent, oAuthorModel);
// 		},
// 		createPopover: function() {
// 			if (!this._oQuickView) {
// 				this._oQuickView = sap.ui.xmlfragment("sap.m.sample.QuickView.QuickView", this);
// 				this.getView().addDependent(this._oQuickView);
// 			}
// 		},
// 		openQuickView: function (oEvent, oModel) {
// 			this.createPopover();
// 			this._oQuickView.setModel(oModel);
// 			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
// 			var oText = oEvent.getSource();
// 			jQuery.sap.delayedCall(0, this, function () {
// 				this._oQuickView.openBy(oText);
// 			});
// 		},
// 		onExit: function () {
// 			if (this._oQuickView) {
// 				this._oQuickView.destroy();
// 			}
// 		}
// 	});
// });