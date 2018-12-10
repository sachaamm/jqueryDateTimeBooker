
class TB_FormField {



    constructor(_inputId, _calendar, _dayCalendar) {

        this.uniqueId = TB_Hasher.basicHash(7);

        this.calendar = _calendar;
        this.dayCalendar = _dayCalendar;

        //$("body").append("<input type='text' id='jdtb_formField_" + this.uniqueId + "' />");
        $(_inputId).click(function () {
            _calendar.setVisibility("flex");
        });


        // DISABLE
        this.calendar.setVisibility("none");
        this.dayCalendar.setVisibility("none");

        console.log(this.calendar);

    }

    selectDayPeriod(){
        this.dayCalendar.setVisibility("block");
    }








}


