sap.ui.define([
    "sap/m/MessageToast"
	,"statapp/controller/BaseController"
], function (MessageToast, BaseController) {
	"use strict";
	var oEventBus;
	return BaseController.extend("statapp.controller.ticket.NewTicket", {
        onInit : function() {
            // Subscribe to event buses
            if (!oEventBus) {
                oEventBus = sap.ui.getCore().getEventBus();
            }
            oEventBus.subscribe("newTicketChannel", "clearFields", this.clearFields, this);
            // sOrigin = "https://stats0017130098trial.hanatrial.ondemand.com"
            // ticketListOdataServiceUrl = "https://stats0017130098trial.hanatrial.ondemand.com/dev/dev01/statapp/services/ticket.xsodata"
            var sOrigin = window.location.protocol + "//" + window.location.hostname
                            + (window.location.port ? ":" + window.location.port : "");
            var ticketListOdataServiceUrl = sOrigin + "/dev/dev01/statapp/services/ticket.xsodata";
            // oDataModel
            var oDataModel = new sap.ui.model.odata.v2.ODataModel(ticketListOdataServiceUrl);
            this.getView().setModel(oDataModel);
        },
		onPressSave : function () {
            //Get required data from input fields
            var userTicketTitle = this.getView().byId("newTicketTitle").getValue();
            var userTicketDescription = this.getView().byId("newTicketDescription").getValue();
            var userFunctionalAreaValue = this.getView().byId("newFuncAreaSelect").getProperty("selectedKey");
            var userAssigneeValue = this.getView().byId("newAssigneeSelect").getProperty("selectedKey");
            var userTicketPriorityValue = this.getView().byId("newTicketPrioritySelect").getProperty("selectedKey");
            if (userTicketTitle === "" || userTicketDescription === "" || userFunctionalAreaValue === "" ||
                    userAssigneeValue === "" || userTicketPriorityValue === "") {
				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("NewTicket.Validation"), {
					closeOnBrowserNavigation: false
				});
            } else {
                //Context data
                var currUserCreator = "STU0000002"; // TODO: GET USER FROM CONTEXT
                //Define defaults
                var defaultTicketId = "X"; // Req'd for create, but a new id is generated in hdbprocedure from hdbsequence
                //Create json object
                var ticketsJSO =
                    {
                        "ticketId":  defaultTicketId  ,
                        "ticketTitle":  userTicketTitle  ,
                        "ticketDescription":  userTicketDescription  ,
                        "functionalArea.value":  userFunctionalAreaValue  ,
                        "creator.userId":  currUserCreator  ,
                        "assignee.userId":  userAssigneeValue  ,
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
		onFuncAreaChange : function(event) {
            var funcAreaId = event.getSource().getProperty("selectedKey");
            var oDataModel = this.getView().getModel("FuncAreaModel");
            var defaultUser = oDataModel.oData["FuncAreas(" + funcAreaId + ")"].defaultUser_userId;
            var newAssigneeSelect = this.getView().byId("newAssigneeSelect");
            newAssigneeSelect.setSelectedKey(defaultUser);
		},
        addNewTicket : function(ticketJSO) {
            var oParams = {};
            var i18nResBundle = this.getView().getModel("i18n").getResourceBundle();
            oParams.success = function(){
                MessageToast.show(i18nResBundle.getText("NewTicket.Success"), {
                    closeOnBrowserNavigation: false
                });
                if (!oEventBus) {
                    oEventBus = sap.ui.getCore().getEventBus();
                }
                oEventBus.publish("ticketListChannel", "updateTicketList");
                oEventBus.publish("newTicketChannel", "clearFields");
            };
            oParams.error = function(){
                MessageToast.show(i18nResBundle.getText("NewTicket.Error"), {
                    closeOnBrowserNavigation: false
                });
            };
            oParams.bMerge = true;
            this.getView().getModel().create("/CreateTicket", ticketJSO, oParams );
        },
        clearFields : function() {
            this.getView().byId("newTicketTitle").setValue("");
            this.getView().byId("newTicketDescription").setValue("");
            this.getView().byId("newFuncAreaSelect").setSelectedKey("");
            this.getView().byId("newAssigneeSelect").setSelectedKey("");
            this.getView().byId("newTicketPrioritySelect").setSelectedKey("");
        }
	});
});