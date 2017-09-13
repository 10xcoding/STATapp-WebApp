sap.ui.jsview("views.statapp", {
    oTitleField :null,
    oDescriptionField :null,
    oPriorityField :null,
    
    getControllerName : function() {
        return "views.statapp";
    },
    
    createContent : function(oController) { // Create an instance of the table controller
    var oTextView = new sap.ui.commons.TextView({
	text : 'Hi Fran! Feel better! This is a long text to see if the wrapping property works. If wrapping is set to false it should not wrap automatically. Only defined line breaks should be used. \nThis is a new line.',
	tooltip : 'This is a Tooltip',
	wrapping : true,
	width : '1000px',
	semanticColor: sap.ui.commons.TextViewColor.Positive,
	design: sap.ui.commons.TextViewDesign.H2
	});
	
	return oTextView;
    //     var oTable = new sap.ui.table.Table({
    //         title :"Ticket List",
    //         visibleRowCount : 6,
    //         firstVisibleRow : 3,
    //         selectionMode : sap.ui.table.SelectionMode.Single
    //     });
        
    //     // add TableToolbar
    //     var oTableToolbar = new sap.ui.commons.Toolbar();
        
    //     // add title field
    //     var oTitleLabel = new sap.ui.commons.Label({ text :'Title' });
    //     this.oFirstNameField = new sap.ui.commons.TextField({
    //         id :'titleFieldId',
    //         value :'',
    //         width :'10em',
    //     });
    //     oTitleLabel.setLabelFor(this.oTitleField);
    //     oTableToolbar.addItem(oTitleLabel);
    //     oTableToolbar.addItem(this.oTitleField);
        
    //     // add description field
    //     var oDescriptionLabel = new sap.ui.commons.Label({ text :'Description' });
    //     this.oDescriptionField = new sap.ui.commons.TextField({
    //         id :'descriptionFieldId',
    //         value :'',
    //         width :'10em',
    //     });
    //     oDescriptionLabel.setLabelFor(this.oDescriptionField);
    //     oTableToolbar.addItem(oDescriptionLabel);
    //     oTableToolbar.addItem(this.oDescriptionField);
        
    //     // add priority field
    //     var oPriorityLabel = new sap.ui.commons.Label({ text :'Priority' });
    //     this.oPriorityField = new sap.ui.commons.TextField({
    //         id :'priorityFieldId',
    //         value :'',
    //         width :'10em',
    //     });
    //     oPriorityLabel.setLabelFor(this.oPriorityField);
    //     oTableToolbar.addItem(oPriorityLabel);
    //     oTableToolbar.addItem(this.oPriorityField);
        
    //     // add button
    //     var oAddTicketButton = new sap.ui.commons.Button({
    //         id :'addTicketButtonId',
    //         text :"Add Ticket",
    //         press :function() {
    //             oController.addNewTicket();
    //         }
    //     });
    //     oTableToolbar.addItem(oAddTicketButton);
    //     oTable.setToolbar(oTableToolbar);
        
    //     // define the columns and the control templates to be used
    //     oTable.addColumn(new sap.ui.table.Column({
    //         label :new sap.ui.commons.Label({ text :"Title" }),
    //         template :new sap.ui.commons.TextView().bindProperty("text","TITLE"),
    //         sortProperty :"TITLE", filterProperty :"TITLE", width :"100px"
    //     }));
    //     oTable.addColumn(new sap.ui.table.Column({
    //         label : new sap.ui.commons.Label({ text :"Description" }),
    //         template :new sap.ui.commons.TextView().bindProperty("text","DESCRIPTION"),
    //         sortProperty :"DESCRIPTION",
    //         filterProperty :"DESCRIPTION", width :"200px"
    //     }));
    //     oTable.addColumn(new sap.ui.table.Column({
    //         label : new sap.ui.commons.Label({ text :"Priority" }),
    //         template :new sap.ui.commons.TextView().bindProperty("text","PRIORITY"),
    //         sortProperty :"PRIORITY",
    //         filterProperty :"PRIORITY", width :"200px"
    //     }));
        
    //     // bind table rows to /Tickets based on the model defined in the init method of the
    //     // controller (aggregation binding)
    //     oTable.bindRows("/Tickets");
    //     return oTable;
    //      //return testText;
    // },
    
    // getTitleField :function() {
    //     return this.oTitleField;
    // },
    
    // getDescriptionField : function() {
    //     return this.oDescriptionField;
    // },
    
    // getPriorityField : function() {
    //     return this.oPriorityField;
    }
});