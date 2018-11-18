let Jmode = 'time'; // date-time / date / time / time_two_days
let JtimeFormat = '24h'; // AM-PM / 24h
let JdateFormat = 'm_d_y'; // m_d_y / d_m_y

let debugMode = 'message'; // alert / console / errorMessage
let debugProcess = false;

let numberMax = 999;

function initJDTB(_mode, _timeFormat, _dateFormat,_debugMode){

    Jmode = _mode;
    JtimeFormat = _timeFormat;
    JdateFormat = _dateFormat;
    debugMode = _debugMode;

}

let startingTimeH = null;
let startingTimeM = null;
let startingDate = null;
let endingTimeH = null;
let endingTimeM = null;
let endingDate = null;
let endingTimeDayPlusOne = null;
let bookingDurationH = null;
let bookingDurationM = null;
let bookingDurationDays = null;
let bookingDurationMonths = null;
let bookingDurationYears = null;



// Add events to jquery time booker elements ( a booking during a single day )
// startingTimeHour : startingTimeMinute
// endingTimeHour : endingTimeMinute
// bookingDurationHours bookingDurationMinutes
function addEventsToJTimeBooker(stH,stM,etH,etM,bdH,bdM){

    startingTimeH = stH;
    startingTimeM = stM;
    endingTimeH = etH;
    endingTimeM = etM;
    bookingDurationH = bdH;
    bookingDurationM = bdM;

    JBookingElementEvents(stH,'starting-time-hour');
    JBookingElementEvents(stM,'starting-time-minute');
    JBookingElementEvents(etH,'ending-time-hour');
    JBookingElementEvents(etM,'ending-time-minute');
    JBookingElementEvents(bdH,'booking-duration-hours');
    JBookingElementEvents(bdM,'booking-duration-minutes');

}

// Add events to jquery time-two-days booker elements ( a 48h schedule booking  )
// startingTimeHour : startingTimeMinute
// endingTimeHour : endingTimeMinute (endingDayPlusOne)
// bookingDurationHours bookingDurationMinutes
function addEventsToJTimeTwoDaysBooker(stH,stM,etH,etM,etDp1,bdH,bdM){

    startingTimeH = stH;
    startingTimeM = stM;
    endingTimeH = etH;
    endingTimeM = etM;
    endingTimeDayPlusOne = etDp1;
    bookingDurationH = bdH;
    bookingDurationM = bdM;

    JBookingElementEvents(stH,'starting-time-hour');
    JBookingElementEvents(stM,'starting-time-minute');
    JBookingElementEvents(etH,'ending-time-hour');
    JBookingElementEvents(etM,'ending-time-minute');
    JBookingElementEvents(etDp1,'ending-time-dayplusone');
    JBookingElementEvents(bdH,'booking-duration-hours');
    JBookingElementEvents(bdM,'booking-duration-minutes');

}

// Add events to jquery datetime booker elements
// startingDate startingTimeHour : startingTimeMinute
// endingDate endingTimeHour : endingTimeMinute
// bookingDurationDays bookingDurationHours bookingDurationMinutes
function addEventsToJDateTimeBooker(stH,stM,stD,etH,etM,etD,bdH,bdM,bdD,bdMo,bdY){

    startingTimeH = stH;
    startingTimeM = stM;
    startingDate = stD;
    endingTimeH = etH;
    endingTimeM = etM;
    endingDate = etD;
    //endingTimeDayPlusOne = etDp1;
    bookingDurationH = bdH;
    bookingDurationM = bdM;
    bookingDurationDays = bdD;
    bookingDurationMonths = bdMo;
    bookingDurationYears = bdY;

    startingDate.datepicker(); // USE datePicker for dateAttribute
    endingDate.datepicker();

    JBookingElementEvents(stH,'starting-time-hour');
    JBookingElementEvents(stM,'starting-time-minute');
    JBookingElementEvents(stD,'starting-time-date');
    JBookingElementEvents(etH,'ending-time-hour');
    JBookingElementEvents(etM,'ending-time-minute');
    JBookingElementEvents(etD,'ending-time-date');

    JBookingElementEvents(bdH,'booking-duration-hours');
    JBookingElementEvents(bdM,'booking-duration-minutes');
    JBookingElementEvents(bdD,'booking-duration-days');
    JBookingElementEvents(bdD,'booking-duration-months');
    JBookingElementEvents(bdD,'booking-duration-years');


}




function JBookingElementEvents(e,arg){
    e.change(function(){

        if(JdateFormat === 'd_m_y'){ // UPDATE DATEFORMAT TO FRENCH FORMAT IF dateFormat set to d_m_y
            if(arg === 'starting-time-date' || arg === 'ending-time-date'){
                let usDate = e.val();
                e.val(usDateToFrenchDate(usDate));
            }
        }

        JUpdateValuesEvent(e,arg);
    });

}


function JConstrainValue(e,arg){

    let value = e.val();

    if(arg === 'starting-time-hour' || arg === 'ending-time-hour' || arg === 'booking-duration-hours'){
        if(value > 23) e.val(23);
        if(value < 0) e.val(0);
    }

    if(arg === 'starting-time-minute' || arg === 'ending-time-minute' || arg === 'booking-duration-minutes'){
        if(value > 59) e.val(59);
        if(value < 0) e.val(0);
    }

    if(arg === 'starting-time-date' || arg === 'ending-time-date'){
        if(value > numberMax) e.val(numberMax);
        if(value < 0) e.val(0);
    }

    //numberMax

}

function JUpdateValuesEvent(e,arg){


    if(debugMode === 'message'){
        $("#jdtbErrors").empty();

    }

    JConstrainValue(e,arg);

    console.log("update booking value " + arg);

    if(arg === 'starting-time-hour' || arg === 'starting-time-minute' || arg === 'ending-time-hour' || arg === 'ending-time-minute' || arg === 'ending-time-dayplusone'
        || arg === 'starting-time-date' || arg === 'ending-time-date'
    ){

        //console.log("UPDATE PLZ");
        if(debugProcess)alert("Update booking duration");
        JUpdateBookingDuration();

    }


    if(arg === 'booking-duration-hours' || arg === 'booking-duration-minutes'){

        if(debugProcess)alert("Update ending duration");
        JUpdateEndingTime();

    }



}

function JUpdateBookingDuration(){


    // Are fields ready to calculate duration ?
    if(!JGetFieldsReady('duration')){

        JDebugErrors("Some values aren't yet defined, so duration calculation is not yet available.");
        return false;
    }

    let startingObject = null;
    let endingObject = null;




    if(Jmode === 'time' || Jmode === 'time_two_days'){
        startingObject = {
            "hour": startingTimeH.val() ,
            "minute" : startingTimeM.val()
        };

        endingObject = {
            "hour": endingTimeH.val() ,
            "minute" : endingTimeM.val()
        };

        let oldestObject = JGetOldestTime(startingObject,endingObject);

        let getDayPlusOne = endingTimeDayPlusOne;

        if(getDayPlusOne && endingTimeDayPlusOne.prop('checked')){
            getDayPlusOne = true;
        }else{
            getDayPlusOne = false;
        }

        if(!oldestObject && !getDayPlusOne){

            JDebugErrors("Starting "+Jmode+" and Ending "+Jmode+" are the same.");
            return false;
        }

        if(oldestObject === endingObject){

            if(Jmode === 'time' ){
                JDebugErrors("Ending " + Jmode + " is older than Starting "+ Jmode + ".",'duration');
                return false;
            }

            if(Jmode === 'time_two_days'){
                if(!endingTimeDayPlusOne.prop('checked')){
                    JDebugErrors("Ending " + Jmode + "  is older than Starting " + Jmode + " .",'duration');
                    return false;
                }
            }

        }

        let deltaMinutes = endingTimeM.val() - startingTimeM.val();
        let deltaHours = endingTimeH.val() - startingTimeH.val();

        if(deltaMinutes < 0){
            deltaHours--;
            deltaMinutes+=60;
        }

        if(endingTimeDayPlusOne){
            if(endingTimeDayPlusOne.prop('checked'))deltaHours+=24;
        }

        bookingDurationH.val(deltaHours);
        bookingDurationM.val(deltaMinutes);

    }


    // With datetime calculation is more complex. We need to manage calendar exception, differents months duration, localoffset etc...
    //Hopefully, JS dates integrates all theses solutions.
    if(Jmode === 'datetime'){


        let eSD = JfrDate(startingDate.val()).split("/"); // explode Starting Date
        let eED = JfrDate(endingDate.val()).split("/"); // explode Ending Date

        let startTime = new Date(parseInt(eSD[2]),parseInt(eSD[1]),parseInt(eSD[0]),startingTimeH.val(),startingTimeM.val());
        let endTime = new Date(parseInt(eED[2]),parseInt(eED[1]),parseInt(eED[0]),endingTimeH.val(),endingTimeM.val());

        let deltaTime = endTime.getTime() - startTime.getTime();

        if(deltaTime < 0){
            JDebugErrors("Ending " + Jmode + "  is older than Starting " + Jmode + " .",'duration');
            return false;
        }

        if(deltaTime === 0){
            JDebugErrors("Starting "+Jmode+" and Ending "+Jmode+" are the same.");
            return false;
        }



        if(deltaTime > 0){
            //console.log(endTime);

            let nbSeconds = deltaTime / 1000;
            let nbMinutes = (nbSeconds / 60) % 60;
            let nbHours = Math.floor(nbSeconds / 3600) % 24;
            let nbDays = Math.floor(nbSeconds / 3600 / 24);

            bookingDurationM.val(nbMinutes);
            bookingDurationH.val(nbHours);
            bookingDurationDays.val(nbDays);

            console.log(nbDays);

        }




    }



}


function JusDate(date){

    if(JdateFormat === 'd_m_y')return frDateToUSDate(date);

    return date;

}

function JfrDate(date){ // WE USE d_m_y format for easier calculation

    if(JdateFormat === 'm_d_y')return usDateToFrenchDate(date);

    return date;
}



function JUpdateEndingTime(){

    // Are fields ready to calculate ending time ?
    if(!JGetFieldsReady('ending')){

        JDebugErrors("Some values aren't yet defined, so ending-time calculation is not yet available.");
        return false;
    }


    let eth = parseInt(startingTimeH.val()) + parseInt(bookingDurationH.val());
    let etm = parseInt(startingTimeM.val()) + parseInt(bookingDurationM.val());

    if(etm > 59){
        etm-=60;
        eth++;
    }

    if(eth > 23){
        eth -= 24;
        //$("#EndingDayPlusOne").html("<b>(Day +1)</b>");
        endingTimeDayPlusOne.prop('checked',true);
    }

    endingTimeH.val(eth);
    endingTimeM.val(etm);

}

//return oldest time
function JGetOldestTime(timeA,timeB){

    if(Jmode === 'time' || Jmode === 'time_two_days'){

        if(timeA["hour"] > timeB["hour"])return timeB;
        if(timeA["hour"] < timeB["hour"])return timeA;
        if(timeA["hour"] === timeB["hour"]){
            if(timeA["minute"] > timeB["minute"])return timeB;
            if(timeA["minute"] < timeB["minute"])return timeA;
        }

    }

    return null; // timeA and timeB are Equals !!!
    //return true;
}



// Check if all fields are ready
function JGetFieldsReady(arg){  // arg : update mode ( ending ? duration ? )

    if(Jmode === 'datetime'){

        if(arg === 'duration'){

            if(!startingDate.val()){
                JDebugErrors("Starting Date is undefined so duration time could not be defined.");
                return false;
            }

            if(!endingDate.val()){
                JDebugErrors("Ending Date is undefined so duration time could not be defined.");
                return false;
            }

        }

    }

    if(Jmode === 'time' || Jmode === 'time_two_days' || Jmode === 'datetime'){


        if(!startingTimeH.val()){
            JDebugErrors("Starting time Hour is undefined so duration time could not be defined.");
            return false;
        }

        if(!startingTimeM.val()){
            JDebugErrors("Starting time Minute is undefined so duration time could not be defined.");
            return false;
        }


        if(arg === 'duration'){

            if(!endingTimeH.val()){
                JDebugErrors("Ending time Hour is undefined so duration time could not be defined.");
                return false;
            }

            if(!endingTimeM.val()){
                JDebugErrors("Ending time Minute is undefined so duration time could not be defined.");
                return false;
            }

        }

        if(arg === 'ending'){

            if(!bookingDurationDays.val() && !bookingDurationM.val() && !bookingDurationH.val()){
                JDebugErrors("Duration is undefined so ending time could not be defined.");
                return false;
            }

        }

    }


    return true;

}




function JDebugErrors(message,arg){

    if(debugMode === 'alert'){
        alert(message);
    }

    if(debugMode === 'console'){
        console.error(message);
    }

    if(debugMode === 'message'){
        $("#jdtbErrors").append('<p>'+message+'</p>');
    }

    if(arg === 'ending'){
        endingTimeH.val("");
        endingTimeM.val("");
    }

    if(arg === 'duration'){
        bookingDurationH.val("");
        bookingDurationM.val("");
    }

}

// EXPECTED INPUT : 10/31/2018
function usDateToFrenchDate(date){

    let explode = date.split('/');
    return explode[1]+'/'+explode[0]+'/'+explode[2];


}

// EXPECTED INPUT : 31/10/2018
function frDateToUSDate(date){

    let explode = date.split('/');
    return explode[1]+'/'+explode[0]+'/'+explode[2];

}

// --> https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
// Month here is 1-indexed (January is 1, February is 2, etc). This is
// because we're using 0 as the day so that it returns the last day
// of the last month, so you have to add 1 to the month number
// so it returns the correct amount of days
function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}