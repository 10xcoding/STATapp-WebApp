sap.ui.define([
    "sap/m/MessageToast"
	,"statapp/controller/BaseController"
], function (MessageToast, BaseController) {
	"use strict";
	return BaseController.extend("statapp.controller.ticket.NewTicket", {
        onInit : function() {
            // Subscribe to event buses
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("newTicketChannel", "clearFields", this.clearFields, this);
            
            // sOrigin = "https://stats0017130098trial.hanatrial.ondemand.com"
            var sOrigin = window.location.protocol + "//" + window.location.hostname
                            + (window.location.port ? ":" + window.location.port : "");
            // ticketListOdataServiceUrl = "https://stats0017130098trial.hanatrial.ondemand.com/dev/dev01/statapp/services/ticket.xsodata"
            var ticketListOdataServiceUrl = sOrigin
                            + "/dev/dev01/statapp/services/ticket.xsodata";
            // oDataModel
            var oDataModel = new sap.ui.model.odata.v2.ODataModel(ticketListOdataServiceUrl);
            this.getView().setModel(oDataModel);
        },
        onAfterRendering : function() {
        },
		onPressSave : function () {
            //Get required data from input fields
            var userTicketTitle = this.getView().byId("newTicketTitle").getValue();
            var userTicketDescription = this.getView().byId("newTicketDescription").getValue();
            var userFunctionalAreaValue = this.getView().byId("newFuncAreaSelect").getProperty("selectedKey");
            var userTicketPriorityValue = this.getView().byId("newTicketPrioritySelect").getProperty("selectedKey");
            
            if (userTicketTitle === "" || userTicketDescription === "") {
                MessageToast.show("Please fill in all required fields!", {
                    closeOnBrowserNavigation: false }
                );
            } else {
                //Context data
                var defaultAssignee = "STU0000012";  // TODO: Call to funcarea service
                var currUserCreator = "STU0000002"; // TODO: GET USER FROM CONTEXT
                // var dateEpochNow = Math.floor((new Date()).getTime()/100000)*100000;
                // var dateCreateNow = null;
                
                //Define defaults
                var defaultTicketId = "X";
                
                //Create json object
                var ticketsJSO =
                    {
                        "ticketId":  defaultTicketId  ,
                        "ticketTitle":  userTicketTitle  ,
                        "ticketDescription":  userTicketDescription  ,
                        "functionalArea.value":  userFunctionalAreaValue  ,
                        "creator.userId":  currUserCreator  ,
                        "assignee.userId":  defaultAssignee  ,
                        "ticketPriority.value":  userTicketPriorityValue
                    };
                //oData create call
                this.addNewTicket(ticketsJSO);
                
                //Nav to ticketList
                this.getRouter().navTo("ticketList");
            }
            
        },
		onPressCancel : function () {
			this.onNavBack();
		},
        addNewTicket : function(ticketJSO) {
            var oParams = {};
            oParams.success = function(){
                MessageToast.show("New ticket has been successfully created", {
                    closeOnBrowserNavigation: false }
                );
                var oEventBus = sap.ui.getCore().getEventBus();
                oEventBus.publish("ticketListChannel", "updateTicketList");
                oEventBus.publish("newTicketChannel", "clearFields");
            };
            oParams.error = function(){
                MessageToast.show("Error occured when creating ticket", {
                    closeOnBrowserNavigation: false }
                );
            };
            oParams.bMerge = true;
            this.getView().getModel().create("/CreateTicket", ticketJSO, oParams );
        },
        clearFields : function() {
            this.getView().byId("newTicketTitle").setValue("");
            this.getView().byId("newTicketDescription").setValue("");
            this.getView().byId("newFuncAreaSelect").setSelectedKey("");
            this.getView().byId("newTicketPrioritySelect").setSelectedKey("");
        }
	});
});