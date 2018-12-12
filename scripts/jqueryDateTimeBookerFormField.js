
class TB_FormField {



    constructor(_inputId, _calendar, _dayCalendar) {

        this.uniqueId = TB_Hasher.basicHash(7);

        let uid = this.uniqueId;

        this.calendar = _calendar;
        this.dayCalendar = _dayCalendar;

        //$("body").append("<input type='text' id='jdtb_formField_" + this.uniqueId + "' />");
        $(_inputId).click(function () {
            _calendar.setVisibility("flex");
            _calendar.emptyTimeMarkers();
            TB_IncrementFormFieldSelectState(uid);
            TB_EmptyFormFieldVal(uid);
        });

        this.hidePanels();
        
        this.inputId = _inputId;

        console.log(this.calendar);

        this.selectState = 0;

        TB_AppendFormField(this);

        let backgroundPanelDiv = "<div id='tb_formfield_background_" + this.uniqueId + "' class='tb_formFieldBackground' ></div>";
        $("body").append(backgroundPanelDiv);
        $("#tb_formfield_background_" + this.uniqueId).css("display","none");

    }

    selectDayPeriod(){
        this.dayCalendar.setVisibility("block");
    }

    updateFormFieldVal(_val){
        $(this.inputId).val(_val);
    }

    hidePanels(){
        // DISABLE
        this.calendar.setVisibility("none");
        this.dayCalendar.setVisibility("none");
    }

    hideDayCalendarPanel(){
        this.dayCalendar.setVisibility("none");
    }

    incrementSelectState(){
        

        this.selectState++;

        if(this.selectState % 3 == 0){

            $("#tb_formfield_background_" + this.uniqueId).css("display","none");

        }else{

            $("#tb_formfield_background_" + this.uniqueId).css("display","block");


        }

        
    }

    




}


let formFields = [];

function TB_AppendFormField(ff){
    formFields.push(ff);
}

function TB_IncrementFormFieldSelectState(formId){


    for(let i = 0 ; i < formFields.length ; i++){

        console.log(formFields[i]);

        if(parseInt(formFields[i].uniqueId) === parseInt(formId)){
           
            formFields[i].incrementSelectState();
        }
    }

}


function TB_EmptyFormFieldVal(formId){

    for(let i = 0 ; i < formFields.length ; i++){

        console.log(formFields[i]);

        if(parseInt(formFields[i].uniqueId) === parseInt(formId)){
           
            formFields[i].updateFormFieldVal("");
        }
    }

}


