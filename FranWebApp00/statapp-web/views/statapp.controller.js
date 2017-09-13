sap.ui.controller( "views.statapp", {
    
    onInit : function() {
        // var sOrigin = window.location.protocol + "//" + window.location.hostname
        // + (window.location.port ? ":" + window.location.port : "");
        
        // sap.ui.commons.MessageBox.alert("sOrigin: " + sOrigin);
        // document.write("sOrigin: " + sOrigin);
        // window.alert("sOrigin: " + sOrigin);
        
        // var ticketListOdataServiceUrl = sOrigin
        // + "dev/dev00/statapp/services/ticket.xsodata/getTickets/";
        
        var ticketListOdataServiceUrl = "https://stats0017130098trial.hanatrial.ondemand.com/dev/dev00/statapp/services/ticket.xsodata/getTickets/?$format=json";
        
        var odataModel = new sap.ui.model.odata.ODataModel(ticketListOdataServiceUrl);
        this.getView().setModel(odataModel);
    },
    
    addNewTicket : function() {
        // var title = this.getView().getTitleField().getValue();
        // var description = this.getView().getDescriptionField().getValue();
        // var priority = this.getView().getPriorityField().getValue();
        // var tickets = {};
        // tickets.ID ="1";
        // tickets.TITLE = title;
        // tickets.DESCRIPTION = description;
        // tickets.PRIORITY = priority;
        // this.getView().getModel().create("/Tickets", tickets,null,this.successMsg,this.errorMsg);
    },
    
    successMsg :function() {
        sap.ui.commons.MessageBox.alert("Ticket entity has been successfully created");
    },
    
    errorMsg :function() {
        sap.ui.commons.MessageBox.alert("Error occured when creating ticket entity");
    },
    
    onAfterRendering : function() {
        this.getView().getTestTextField();
        // this.getView().getTitleField().focus();
    }
    
});
