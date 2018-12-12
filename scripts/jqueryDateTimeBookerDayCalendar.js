// AMELIORATION : ajouter DUREE MINIMALE RESERVATION,  adapter selection en fonction de DUREE MINIMALE RESERVATION avec les booking
//                           cad qu'on ne peut pas démarrer la réservation avant DUREE MINIMALE d'une durée de RESERVATION
//                           DUREE MAXIMALE RESERVATION



// AMELIORATIONS : DESACTIVER au moment de la deuxieme phase de selection
                    // Logique DUREE MAXIMALE
                    // Définir un nombre maximal d'utilisateurs pour une période bookée ( par défaut 1 )


class TB_DayCalendar{


    // language, availabilities, booking, divideTime, fullDay, dureeMinimaleReservation, dureeMaximaleReservation
    //constructor(_language,_bookablePeriods, _bookedPeriods,_segmentTime, _fullDay,_dureeMinimale){
    constructor(_options){

        
        this.uniqueId = TB_Hasher.basicHash(7);

        this.bookingStartHour = null;
        this.bookingStartMinute = null;
        this.bookingEndHour = null;
        this.bookingEndMinute = null;

        this.selectMode = 'SINGLE';
        this.selectStep = 0;
        this.availabilityIndex = null;

        this.language = _options.hasOwnProperty("language") ? _options["language"] : 'en-US';
        this.bookablePeriods = _options.hasOwnProperty("bookablePeriods") ? _options["bookablePeriods"] : [];
        this.bookedPeriods = _options.hasOwnProperty("bookedPeriods") ? _options["bookedPeriods"] : [];
        this.segmentTime = _options.hasOwnProperty("segmentTime") ? _options["segmentTime"] : 'en-US';
        this.fullDay = _options.hasOwnProperty("fullDay") ? _options["fullDay"] : true;
        this.minimalDuration = _options.hasOwnProperty("minimalDuration") ? _options["minimalDuration"] : 0;
        this.maximalDuration = _options.hasOwnProperty("maximalDuration") ? _options["maximalDuration"] : 999999;
        this.selectMode = _options.hasOwnProperty("selectMode") ? _options["selectMode"] : "SINGLE"; // SINGLE / DURATION

        
        this.bodyContainer = _options.hasOwnProperty("containerParent") ? _options["containerParent"] : "body"; // SINGLE / DURATION

        this.selectDayPeriodCallback = _options.hasOwnProperty("selectDayPeriodCallback") ? _options["selectDayPeriodCallback"] : null;
        

        this.dayCalendarContainerClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["dayCalendarContainerClass"]) ? _options["styleClassArray"]["dayCalendarContainerClass"] : '';
     



        this.dayCalendarSelector = "#DayCalendar_" + this.uniqueId + "";


        this.build();

        TB_PushDayTimeBooker(this);

    }

    init(_options){

        this.language = _options.hasOwnProperty("language") ? _options["language"] : 'en-US';
        this.bookablePeriods = _options.hasOwnProperty("bookablePeriods") ? _options["bookablePeriods"] : [];
        this.bookedPeriods = _options.hasOwnProperty("bookedPeriods") ? _options["bookedPeriods"] : [];
        this.segmentTime = _options.hasOwnProperty("segmentTime") ? _options["segmentTime"] : 'en-US';
        this.fullDay = _options.hasOwnProperty("fullDay") ? _options["fullDay"] : true;
        this.minimalDuration = _options.hasOwnProperty("minimalDuration") ? _options["minimalDuration"] : 0;
        this.selectMode = _options.hasOwnProperty("selectMode") ? _options["selectMode"] : "SINGLE"; // SINGLE / DURATION

        
        this.bodyContainer = _options.hasOwnProperty("containerParent") ? _options["containerParent"] : "body"; // SINGLE / DURATION

        this.selectDayPeriodCallback = _options.hasOwnProperty("selectDayPeriodCallback") ? _options["selectDayPeriodCallback"] : null;
        
        

    }

    build(){

        let removeCalendarSelector = $("#DayCalendar_" + this.uniqueId);
        if( removeCalendarSelector ){
            removeCalendarSelector.remove();
        }

        let dayCalendarContainerNode = "<div id='jdtb_daycalendar_container_"+this.uniqueId+"' class='" + this.dayCalendarContainerClass + "' ></div>";
        $(this.bodyContainer).append(dayCalendarContainerNode);
        let dayCalendarContainerSelector = $("#jdtb_daycalendar_container_" + this.uniqueId);
        dayCalendarContainerSelector.append("<h2></h2>");

        this.tableNode = "<table id='DayCalendar_" + this.uniqueId + "' class='DayCalendar'></table>";
        dayCalendarContainerSelector.append(this.tableNode);



        let appendHeadDayCalendar = "<tr>";
        //  -   /   matin / apres-midi
        appendHeadDayCalendar+= "<th> </th>";

        for(let i=0; i< 60;i+=this.segmentTime){
            appendHeadDayCalendar+= "<th>"+i+"</th>";
        }

        let timeSegmentsCount = 60 / this.segmentTime; // 60 / 5 : 12
        //appendHeadDayCalendar+= "<th>.</th>";

        $(this.dayCalendarSelector).append(appendHeadDayCalendar);

        let nbHours = 12;
        if(this.fullDay) nbHours = 24;

        for(let i = 0 ; i < nbHours ; i++){

            let newLine = "<tr>";
            newLine+="<td class='DayCalendar_hourLabel'>"+ TB_TimeAttributes.getHourLabel(this.language,i)+"</td>";

            for(let j = 1; j < timeSegmentsCount + 1 ; j++){
                let content  = "";
                let td_class = "x";

                let nextHour = i;
                if(j === timeSegmentsCount) nextHour = i+1;

                let onClickEvent = '';

                let cellHour = i;
                let cellMinute = j * this.segmentTime - this.segmentTime;

                if(TB_DayCalendar.isAvailableTimeSegment(this.bookablePeriods,cellHour,cellMinute + this.segmentTime,cellHour,cellMinute + this.segmentTime)){

                    let addDureeMinimale = 0;
                    if(this.minimalDuration) addDureeMinimale = this.minimalDuration;

                    if(TB_DayCalendar.isBookedTimeSegment(this.bookedPeriods,cellHour,cellMinute + this.segmentTime,cellHour,cellMinute + this.segmentTime)){
                        td_class="DayCalendar_bookedTimeSegment";
                    }else{

                        let currentAvailabilityPeriodIndex = TB_DayCalendar.returnAvailabilityPeriodIndex(this.bookablePeriods,cellHour,cellMinute,cellHour,cellMinute);

                        let isNonSelectable = false;


                        let deltaMinuteBeforePeriodEnd = 0;
                        let periodEnd = TB_DayCalendar.getPeriodEnd(this.bookablePeriods,currentAvailabilityPeriodIndex);

                        let ePE = periodEnd.split(":");
                        let periodEndHour = parseInt(ePE[0]);
                        let periodEndMinute = parseInt(ePE[1]);

                        let deltaHourPE = periodEndHour - cellHour;
                        let deltaMinutePE = periodEndMinute - cellMinute;

                        let deltaPEInMinutes = deltaMinutePE + deltaHourPE * 60;

     
                        if(deltaPEInMinutes < this.minimalDuration){
                            isNonSelectable = true;
                        }

                        for(let k = 0 ; k < this.minimalDuration; k+=  this.segmentTime){

                            let endDurationHour = cellHour;
                            let endDurationMinute = cellMinute + this.segmentTime + k;

                            if(endDurationMinute >= 60){
                                endDurationHour++;
                                endDurationMinute-=60;
                            }

                            if(TB_DayCalendar.isBookedTimeSegment(this.bookedPeriods,endDurationHour,endDurationMinute  ,endDurationHour,endDurationMinute  )) {

                                let actualAvailabilityPeriodIndex = TB_DayCalendar.returnAvailabilityPeriodIndex(this.bookablePeriods,endDurationHour,endDurationMinute);

                                if(actualAvailabilityPeriodIndex === currentAvailabilityPeriodIndex){
                                    isNonSelectable = true;
                                }

                            }

                        }

                        if(isNonSelectable){
                            td_class="DayCalendar_availableTimeSegmentNonSelectable";
                            onClickEvent = 'prepare_onclick="TB_SelectDayTimeBookerPeriod('+ this.uniqueId + ',' + cellHour + ',' + cellMinute + ')"';
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

        console.log("available booking " + startHour + " " + startMinute + " " + endHour + " " + endMinute);

        for(let i = startHour; i <= endHour;i++){

            let sMinute = 0;
            if(i === startHour) sMinute = startMinute;
            sMinute += divideTime;
            let eMinute = 60;
            if(i === endHour) eMinute = endMinute;

            for(let j = sMinute ; j < eMinute ; j+= divideTime){
                if(TB_DayCalendar.isBookedTimeSegment(bookings,i,j,i,j)){
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
        return availabilities[availabilityPeriodIndex].split(" ")[1];
    }

    get test(){
        return this.myTest();
    }

    static myTest(){
        alert("e");
    }

    setVisibility(state){
        $("#DayCalendar_"+this.uniqueId).css("display",state);
    }

    activateTimeSegmentNonSelectable(){

        $("#DayCalendar_"+this.uniqueId+" .DayCalendar_availableTimeSegmentNonSelectable").each(function(index){

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
                //console.log(this.bookablePeriods);

                this.availabilityIndex = TB_DayCalendar.returnAvailabilityPeriodIndex(this.bookablePeriods,hour,minute,hour,minute);

                //alert("availability index " + this.availabilityIndex);
                // NOW THAT WE KNOW OUR BEGINNING , WE MUST CONSIDER DISABLED NON SELECTABLE ( EX : TIME SEGMENTS AFTER A BOOKED DURATION )

            }else{


                this.disableNonSelectableTimeSegments();

                // CHECK  IF HOUR AND MINUTE IS IN PERIOD SELECTED
                let endAvailabilityIndex = TB_DayCalendar.returnAvailabilityPeriodIndex(this.bookablePeriods,hour,minute,hour,minute);

                if(endAvailabilityIndex !== this.availabilityIndex){
                    //alert("You must select booking end in same period");
                    alert(TB_TimeAttributes.getDayCalendarErrorMessage(this.language,"mustBookInSamePeriod"));

                          
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
                    //alert("Your booking duration must be greater or equal than " + this.minimalDuration + " minutes ");
                    alert(TB_TimeAttributes.getDayCalendarErrorMessage(this.language,"mustBookLongerThan"));


                    //alert("Your booking duration must be greater or equal than " + this.minimalDuration + " minutes ");
                    return;
                }

                if(totalDeltaMinute + this.segmentTime > this.maximalDuration){
                    //alert("Your booking duration must be greater or equal than " + this.minimalDuration + " minutes ");
                    alert(TB_TimeAttributes.getDayCalendarErrorMessage(this.language,"mustBookLessThan"));


                    //alert("Your booking duration must be greater or equal than " + this.minimalDuration + " minutes ");
                    return;
                }



                if(!TB_DayCalendar.availableBooking(this.bookedPeriods,this.segmentTime,this.bookingStartHour,this.bookingStartMinute,this.bookingEndHour,this.bookingEndMinute)){
                    //alert("This booking is conflicting with another one");
                    //alert("This booking is conflicting with another one");
                    alert(TB_TimeAttributes.getDayCalendarErrorMessage(this.language,"bookConflicts"));
                    //alert("This booking is conflicting with another one");
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
                    alert(TB_TimeAttributes.getCalendarErrorMessage(this.language,"endDurationBeforeStartDuration"));
                    //alert("Booking end must be after booking start");
                    return;
                }


                if (this.selectDayPeriodCallback) {
                    setTimeout(this.selectDayPeriodCallback(this, this.bookingStartHour, this.bookingStartMinute, this.bookingEndHour, this.bookingEndMinute), 1); // 1 ms later
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
        $("#DayCalendar_" + this.uniqueId + " td").removeAttr("style");
    }

    disableNonSelectableTimeSegments(){
        $("#DayCalendar_" + this.uniqueId + " .DayCalendar_availableTimeSegmentNonSelectable").off();
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