// AMELIORATION : ajouter DUREE MINIMALE RESERVATION,  adapter selection en fonction de DUREE MINIMALE RESERVATION avec les booking
//                           cad qu'on ne peut pas démarrer la réservation avant DUREE MINIMALE d'une durée de RESERVATION
//                           DUREE MAXIMALE RESERVATION



// AMELIORATIONS : DESACTIVER au moment de la deuxieme phase de selection
                    // Logique DUREE MAXIMALE
                    // Définir un nombre maximal d'utilisateurs pour une période bookée ( par défaut 1 )


class DayCalendar{


    // language, availabilities, booking, divideTime, fullDay, dureeMinimaleReservation, dureeMaximaleReservation
    constructor(_language,_availibilitiesPeriods, _bookingPeriods,_segmentTime, _fullDay,_dureeMinimale){

        this.language = _language;
        this.dayCalendarSelector = "#DayCalendar";
        this.uniqueId = TB_Hasher.hash(7);

        this.periods = _availibilitiesPeriods;
        this.bookingPeriods = _bookingPeriods;

        this.bookingStartHour = null;
        this.bookingStartMinute = null;
        this.bookingEndHour = null;
        this.bookingEndMinute = null;

        this.selectMode = 'SINGLE';
        this.selectStep = 0;
        this.availabilityIndex = null;

        this.minimalDuration = _dureeMinimale;

        this.fullDay = _fullDay;
        //this.eventDuration = _eventDuration;

        let appendHeadDayCalendar = "<tr>";
        //  -   /   matin / apres-midi
        appendHeadDayCalendar+= "<th>.</th>";

        this.segmentTime = _segmentTime;


        for(let i=0; i< 60;i+=this.segmentTime){
            appendHeadDayCalendar+= "<th>"+i+"</th>";
        }

        let timeSegmentsCount = 60 / this.segmentTime; // 60 / 5 : 12
        //appendHeadDayCalendar+= "<th>.</th>";

        $(this.dayCalendarSelector).append(appendHeadDayCalendar);

        let nbHours = 12;
        if(_fullDay) nbHours = 24;

        for(let i = 0 ; i < nbHours ; i++){

            let newLine = "<tr>";
            newLine+="<td >"+ TB_TimeAttributes.getHourLabel(this.language,i)+"</td>";

            for(let j = 1; j < timeSegmentsCount + 1 ; j++){
                let content  = ".";
                let td_class = "x";

                let nextHour = i;
                if(j === timeSegmentsCount) nextHour = i+1;

                let onClickEvent = '';

                let cellHour = i;
                let cellMinute = j * this.segmentTime - this.segmentTime;

                if(DayCalendar.isAvailableTimeSegment(_availibilitiesPeriods,cellHour,cellMinute + this.segmentTime,cellHour,cellMinute + this.segmentTime)){

                    let addDureeMinimale = 0;
                    if(_dureeMinimale) addDureeMinimale = _dureeMinimale;

                    if(DayCalendar.isBookedTimeSegment(_bookingPeriods,cellHour,cellMinute + this.segmentTime,cellHour,cellMinute + this.segmentTime)){
                        td_class="DayCalendar_bookedTimeSegment";
                    }else{

                        let currentAvailabilityPeriodIndex = DayCalendar.returnAvailabilityPeriodIndex(_availibilitiesPeriods,cellHour,cellMinute,cellHour,cellMinute);
                        //console.log("Cell hour " + cellHour + " cell minute " + cellMinute + " capi " + currentAvailabilityPeriodIndex);
                        let isNonSelectable = false;


                        let deltaMinuteBeforePeriodEnd = 0;
                        let periodEnd = DayCalendar.getPeriodEnd(_availibilitiesPeriods,currentAvailabilityPeriodIndex);

                        let ePE = periodEnd.split(":");
                        let periodEndHour = parseInt(ePE[0]);
                        let periodEndMinute = parseInt(ePE[1]);

                        let deltaHourPE = periodEndHour - cellHour;
                        let deltaMinutePE = periodEndMinute - cellMinute;

                        let deltaPEInMinutes = deltaMinutePE + deltaHourPE * 60;

                        //console.log("Period end " + periodEnd + " // " + cellHour + ":" + cellMinute + " deltaPEInMinutes " + deltaPEInMinutes);
                        //deltaMinuteBeforePeriodEnd =
                        if(deltaPEInMinutes < _dureeMinimale){
                            isNonSelectable = true;
                        }


                        for(let k = 0 ; k < _dureeMinimale; k+=  this.segmentTime){

                            let endDurationHour = cellHour;
                            let endDurationMinute = cellMinute + this.segmentTime + k;

                            if(endDurationMinute >= 60){
                                endDurationHour++;
                                endDurationMinute-=60;
                            }

                            if(DayCalendar.isBookedTimeSegment(_bookingPeriods,endDurationHour,endDurationMinute  ,endDurationHour,endDurationMinute  )) {

                                let actualAvailabilityPeriodIndex = DayCalendar.returnAvailabilityPeriodIndex(_availibilitiesPeriods,endDurationHour,endDurationMinute);

                                if(actualAvailabilityPeriodIndex === currentAvailabilityPeriodIndex){
                                    isNonSelectable = true;
                                }

                            }

                        }

                        if(isNonSelectable){

                            //console.log("non selectable");

                            td_class="DayCalendar_availableTimeSegmentNonSelectable";
                            onClickEvent = 'prepare_onclick="TB_SelectDayTimeBookerPeriod('+ this.uniqueId + ',' + cellHour + ',' + cellMinute + ')"';
                            //onClickEvent = '';

                        }else{
                            td_class="DayCalendar_availableTimeSegment";
                            onClickEvent = 'onclick="TB_SelectDayTimeBookerPeriod('+ this.uniqueId + ',' + cellHour + ',' + cellMinute + ')"';
                        }

                    }

                }

                newLine+="<td id='DayCalendar_" + cellHour + "_" + cellMinute + "' class='"+td_class+"' "+ onClickEvent +" >"+content+"</td>";
            }

            //newLine+="<td>"+((i+12)%24)+"</td>";
            newLine += "</tr>";

            $(this.dayCalendarSelector).append(newLine);

        }

        TB_PushDayTimeBooker(this);


    }

    setSelectMode(_selectMode){

        // SINGLE/ DURATION
        this.selectMode = _selectMode;

    }


    static isAvailableTimeSegment(availabilities,hour,minute,hourB,minuteB){

        for(let i = 0 ; i < availabilities.length; i++){

            let e = availabilities[i].split(" ");
            let availabiltyStartHour = parseInt(e[0].split(":")[0]);
            let availabiltyStartMinute = parseInt(e[0].split(":")[1]);
            let availabiltyEndHour = parseInt(e[1].split(":")[0]);
            let availabiltyEndMinute = parseInt(e[1].split(":")[1]);

            if(hour === availabiltyStartHour){
                if(minute > availabiltyStartMinute)return true;
            }

            if(hour >availabiltyStartHour && hour <availabiltyEndHour){
                return true;
            }

            if(hour === availabiltyEndHour){
                if(minuteB <= availabiltyEndMinute)return true;
            }

        }

        return false;
    }

    static isBookedTimeSegment(bookings,hour,minute,hourB,minuteB){

        if(!bookings)return false;

        for(let i = 0 ; i < bookings.length; i++){

            let e = bookings[i].split(" ");
            let bookingStartHour = parseInt(e[0].split(":")[0]);
            let bookingStartMinute = parseInt(e[0].split(":")[1]);
            let bookingEndHour = parseInt(e[1].split(":")[0]);
            let bookingEndMinute = parseInt(e[1].split(":")[1]);

            //console.log("bSH " + bookingStartHour + " bSM " + bookingStartMinute + " bEH " + bookingEndHour + " bEM " + bookingEndMinute + " h " + hour + " m " + minute  );

            if(hour === bookingStartHour){
                if(hour === bookingEndHour){
                    if(minute > bookingStartMinute && minute <= bookingEndMinute)return true;
                }

                if(hour < bookingEndHour){
                    if(minute > bookingStartMinute)return true;
                }

            }

            if(hour >bookingStartHour && hour <bookingEndHour) return true;


            if(hour === bookingEndHour && hour > bookingStartHour){
                if(minuteB <= bookingEndMinute)return true;
            }

        }

        return false;

    }

    static availableBooking(bookings,divideTime,startHour,startMinute,endHour,endMinute){ // check if booking is not conflicting with another one

        //console.log("available booking " + startHour + " " + startMinute + " " + endHour + " " + endMinute);

        for(let i = startHour; i <= endHour;i++){

            let sMinute = 0;
            if(i === startHour) sMinute = startMinute;
            let eMinute = 60;
            if(i === endHour) eMinute = endMinute;

            for(let j = sMinute ; j < eMinute ; j+= divideTime){
                if(DayCalendar.isBookedTimeSegment(bookings,i,j,i,j)){
                    console.log("Available booking ? " + i + " h : " + j);
                    return false;
                }
            }

        }

        return true;

    }

    static returnAvailabilityPeriodIndex(availabilities,hour,minute,hourB,minuteB){

        for(let i = 0 ; i < availabilities.length; i++){

            let e = availabilities[i].split(" ");
            let availabiltyStartHour = parseInt(e[0].split(":")[0]);
            let availabiltyStartMinute = parseInt(e[0].split(":")[1]);
            let availabiltyEndHour = parseInt(e[1].split(":")[0]);
            let availabiltyEndMinute = parseInt(e[1].split(":")[1]);

            if(hour === availabiltyStartHour){
                if(minute >= availabiltyStartMinute)return i;
            }

            if(hour >availabiltyStartHour && hour <availabiltyEndHour){
                return i;
            }

            if(hour === availabiltyEndHour){
                if(minuteB <= availabiltyEndMinute)return i;
            }

        }

        return -1;

    }

    static getPeriodEnd(availabilities, availabilityPeriodIndex){

        /*
        console.log("availabilities");
        console.log(availabilities);
        console.log("availability period index");
        console.log(availabilityPeriodIndex);

        console.log(availabilities[availabilityPeriodIndex]);
        */
        return availabilities[availabilityPeriodIndex].split(" ")[1];

    }


    get test(){
        return this.myTest();
    }


    static myTest(){

        alert("e");

    }


    setVisibility(state){

        $("#DayCalendar").css("display",state);
    }



    activateTimeSegmentNonSelectable(){

        $("#DayCalendar .DayCalendar_availableTimeSegmentNonSelectable").each(function(index){

            //console.log($(this).attr("id"));
            let onclick = $(this).attr("prepare_onclick");
            let basicBg = $(this).css("background-color");

            //console.log(onclick);
            $(this).removeAttr("prepare_onclick");
            $(this).attr("onclick",onclick);
            $(this).css("cursor","pointer");

            $(this).hover(function(){
                TB_HighlightSegmentTimeNonSelectable( $(this).attr('id') );
            });

            $(this).mouseout(function(){
                TB_UnstyleSegmentTimeNonSelectable( $(this).attr('id'), basicBg );
            });



        });


    }



    selectTimePeriod(hour,minute){

        if(this.selectMode === 'SINGLE'){

            if(this.bookingStartHour != null && this.bookingStartMinute != null){
                $("#DayCalendar_" + this.bookingStartHour + "_" + this.bookingStartMinute).removeAttr("style");
            }

            $("#DayCalendar_" + hour + "_" + minute).css("background-color","blue");
            this.bookingStartHour = hour;
            this.bookingStartMinute = minute;

        }

        if(this.selectMode === 'DURATION'){

            if(this.selectStep % 2 === 0){

                this.unselectPreviousPeriod();

                this.activateTimeSegmentNonSelectable();

                this.bookingStartHour = hour;
                this.bookingStartMinute = minute;

                $("#DayCalendar_" + hour + "_" + minute).css("background-color","blue");
                //console.log(this.periods);

                this.availabilityIndex = DayCalendar.returnAvailabilityPeriodIndex(this.periods,hour,minute,hour,minute);

                //alert("availability index " + this.availabilityIndex);
                // NOW THAT WE KNOW OUR BEGINNING , WE MUST CONSIDER DISABLED NON SELECTABLE ( EX : TIME SEGMENTS AFTER A BOOKED DURATION )

            }else{

                this.disableNonSelectableTimeSegments();

                // CHECK  IF HOUR AND MINUTE IS IN PERIOD SELECTED
                let endAvailabilityIndex = DayCalendar.returnAvailabilityPeriodIndex(this.periods,hour,minute,hour,minute);

                if(endAvailabilityIndex !== this.availabilityIndex){
                    alert("You must select booking end in same period");
                    return;
                }

                // CHECK BOOKING END AFTER BOOKING START
                this.bookingEndHour = hour;
                this.bookingEndMinute = minute;

                let deltaHour = parseInt(this.bookingEndHour) - parseInt(this.bookingStartHour);
                let deltaMinute = parseInt(this.bookingEndMinute) - parseInt(this.bookingStartMinute);

                let totalDeltaMinute = deltaHour * 60 + deltaMinute;

                //alert("deltaHour " + deltaHour+ " deltaMinute "+ deltaMinute + "total Delta minute " + totalDeltaMinute);
                //alert("total delta minute " + totalDeltaMinute + " minimal duration " + this.minimalDuration);

                if(totalDeltaMinute + this.segmentTime < this.minimalDuration){
                    alert("Your booking duration must be greater or equal than " + this.minimalDuration + " minutes ");
                    return;
                }

                if(!DayCalendar.availableBooking(this.bookingPeriods,this.segmentTime,this.bookingStartHour,this.bookingStartMinute,this.bookingEndHour,this.bookingEndMinute)){
                    alert("This booking is conflicting with another one");
                    return;
                }

                let bookingEndAfterStart = true;

                if(this.bookingEndHour < this.bookingStartHour){
                    bookingEndAfterStart = false;
                }

                if(this.bookingEndHour === this.bookingStartHour && this.bookingEndMinute < this.bookingStartMinute){
                    bookingEndAfterStart = false;
                }

                if(!bookingEndAfterStart){
                    alert("Booking end must be after booking start");
                    return;
                }

                this.highlightPeriodSelected();
            }

            this.selectStep++;
        }

    }

    highlightPeriodSelected(){

        for(let j = this.bookingStartHour ; j <= this.bookingEndHour;j++){

            let startingMinute = this.bookingStartMinute;
            if(j !== this.bookingStartHour) startingMinute = 0;
            let endingMinute = 60;
            if(j === this.bookingEndHour) endingMinute = this.bookingEndMinute + this.segmentTime;

            for(let i = startingMinute; i < endingMinute; i += this.segmentTime){
                $("#DayCalendar_"+j+"_"+i).css("background-color","green");
            }
        }

    }

    unselectPreviousPeriod(){
        $("#DayCalendar td").removeAttr("style");
    }

    disableNonSelectableTimeSegments(){
        $("#DayCalendar .DayCalendar_availableTimeSegmentNonSelectable").off();
    }


}


let timeBookers = [];

function TB_PushDayTimeBooker(timeBooker){

    timeBookers.push(timeBooker);

}

function TB_SelectDayTimeBookerPeriod(timeBookerId,hour,minute){

    for(let i = 0 ; i < timeBookers.length ; i++){
        if(parseInt(timeBookers[i].uniqueId) === parseInt(timeBookerId)){
            timeBookers[i].selectTimePeriod(hour,minute);

        }
    }


}


function TB_HighlightSegmentTimeNonSelectable(elementId){

    //$("#" + elementId).css("background-color",$("#DayCalendar .DayCalendar_availableTimeSegment").css("background-color"));
    $("#" + elementId).css("background-color","red");

}

function TB_UnstyleSegmentTimeNonSelectable(elementId,bg){

    $("#" + elementId).css("background-color",bg);


}