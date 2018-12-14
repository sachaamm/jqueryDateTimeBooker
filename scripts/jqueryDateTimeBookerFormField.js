
class TB_FormField {



    constructor(_options) {

        this.uniqueId = TB_Hasher.basicHash(7);

        let uid = this.uniqueId;

        //this.calendar = _calendar;
        this.calendar = _options.hasOwnProperty("calendar") ? _options["calendar"] : null;

        //this.dayCalendar = _dayCalendar;
        this.dayCalendar = _options.hasOwnProperty("dayCalendar") ? _options["dayCalendar"] : null;

        this.selectMode = _options.hasOwnProperty("selectMode") ? _options["selectMode"] : 'SINGLE_DATETIME_BOOKING';

        this.confirmProcess = _options.hasOwnProperty("confirmProcess") ? _options["confirmProcess"] : false;

        if(this.calendar == null){
            alert('calendar is null');
        }
        
        this.indexForSeveral = 0;
        
        //this.inputId = _inputId;
        this.inputId = _options.hasOwnProperty("inputId") ? _options["inputId"] : null;
        if(this.inputId == null){
            alert("You must provide inputId argument for your TB_FormField !!!! ");
        }


        $(this.inputId).click(function () {
            _options["calendar"].setVisibility("flex");
            
            TB_IncrementFormFieldSelectState(uid);
            if(_options["selectMode"] === 'SINGLE_DATETIME_BOOKING'){
                _options["calendar"].emptyTimeMarkers(); // avec SINGLE_DATETIME_BOOKING 
                TB_EmptyFormFieldVal(uid); // avec SINGLE_DATETIME_BOOKING 
            }
            
        });


        this.hidePanels();


        console.log(this.calendar);

        this.selectState = 0;

        TB_AppendFormField(this);

        let backgroundPanelDiv = "<div id='tb_formfield_background_" + this.uniqueId + "' onclick='TB_ClosePanels("+this.uniqueId+")' class='tb_formFieldBackground' ></div>";
        $("body").append(backgroundPanelDiv);
        $("#tb_formfield_background_" + this.uniqueId).css("display","none");

        // modes :  single dateTimeBooking    ( ex: le 12/12 de 9h30 à 11h10 )
        //          several dateTimeBooking ( indiquer vos périodes de disponibilités )    ( ex: lundi prochain de 9h11 à 11h11 et mercredi prochain de 12h12 à 14h13 )
        //          several dateBooking ( indiquer vos périodes de congés ) ( ex : du 12/12 au 14/12 et du 23/12 au 25/12 )
        //          single dateTimeDurationBooking ( ex: du 12/12 à 9h au 14/12 à 15h10 )    :  A FAIRE ULTERIEUREMENT, PAS BESOIN ACTUELLEMENT
        //          several datetimedurationBooking ( ex: du 12/12 à 9h30 au 14/12 à 15h30 et du 23/12 à 15h20 au 25/12 à 15h50 )      :  A FAIRE ULTERIEMENT, PAS BESOIN ACTUELLEMENT
        

    }

    selectDayPeriod(){
        this.dayCalendar.setVisibility("block");
    }

    updateFormFieldVal(_val){
        $(this.inputId).val(_val);
    }

    getFormFieldVal(){
        return $(this.inputId).val();
    }

    hidePanels(){
        // DISABLE
        if(this.calendar)this.calendar.setVisibility("none");
        if(this.dayCalendar)this.dayCalendar.setVisibility("none");
    }

    hideDayCalendarPanel(){
        this.dayCalendar.setVisibility("none");
    }

    incrementSelectState(){
        
        this.selectState++;

        // pour le mode singleDateTimeBooking et severalDateTimeBooking
        if(this.selectMode === 'SINGLE_DATETIME_BOOKING' || this.selectMode === 'SEVERAL_DATETIME_BOOKING'){

            if(this.selectState % 3 == 0){
                $("#tb_formfield_background_" + this.uniqueId).css("display","none");
            }else{
                $("#tb_formfield_background_" + this.uniqueId).css("display","block");
            }

        }


        if(this.selectMode === 'SEVERAL_DATE_BOOKING'){

            if(this.selectState % 2 == 0){
                $("#tb_formfield_background_" + this.uniqueId).css("display","none");
            }else{
                $("#tb_formfield_background_" + this.uniqueId).css("display","block");
            }

        }


    }


}


let formFields = [];

function TB_AppendFormField(ff){
    formFields.push(ff);
}

function TB_IncrementFormFieldSelectState(formId){


    for(let i = 0 ; i < formFields.length ; i++){

        if(parseInt(formFields[i].uniqueId) === parseInt(formId)){
           
            formFields[i].incrementSelectState();
        }
    }

}


function TB_EmptyFormFieldVal(formId){

    for(let i = 0 ; i < formFields.length ; i++){


        if(parseInt(formFields[i].uniqueId) === parseInt(formId)){
           
            formFields[i].updateFormFieldVal("");
        }
    }

}


function TB_ClosePanels(formId){

    for(let i = 0 ; i < formFields.length ; i++){


        if(parseInt(formFields[i].uniqueId) === parseInt(formId)){
           
            formFields[i].hidePanels();
            formFields[i].selectState = 0;
            $("#tb_formfield_background_" + formFields[i].uniqueId).css("display","none");
            
        }
    }


}
