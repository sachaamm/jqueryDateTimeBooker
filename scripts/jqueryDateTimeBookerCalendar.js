// Important : LE CALENDAR DOIT TOUJOURS FAIRE LE MM NB DE LIGNES !!!


// selectMode = 'single' , 'single-duration' , 'several-single' , 'several-duration'
// soit on est sur un mode de selection single : on choisit une date unique   ( ex : le 31/10 )
// soit on est sur un mode de selection several-single : on choisit plusieurs dates uniques ( ex: le 31/10 et le 25/12 )
// soit on est sur un mode de selection single-duration : on choisit une unique plage de jours ( ex : du 25/12 au 31/12 )
// soit on est sur un mode de selection several-duration : on choisit plusieurs plages de plusieurs jours ( ex : du 23/12 au 26/12 et du 30/12 au 1/1 )


// AMELIORATIONS :
// AJOUTER LES FORMULAIRES INDICATIFS ( LISTES DES JOURS SELECTIONNES PAR EXEMPLE , NOMBRE DE JOURS SELECTIONNES , ETC ) -> FAIRE CA DANS UNe AUTRE classe INTITULE CALENDAR DATA

// POUVOIR SELECTIONNER DES HORAIRES AU SEIN DES JOURNEES.

// METTRE LES DATES MULTIPLES DANS L'ORDRE



// FAIRE DES BANDES DE SELECTION CORRESPONDANT A DES PERIODES POUR LE MODE SELECTION DE PERIODES MULTIPLES , ET EN CLIQUANT SUR LA CROIX DE LA BANDE ON SUPPRIME LA PERIODE DE RESERVATION SUR LE CALENDRIER
// POUVOIR SCROLLER LES MOIS AVEC LA SOURIS



// BUGS : AVRIL 2019 PAS DE SEMAINE AVANT ( en fr ) / DECEMBRE 2019 1 SEMAINE EN TROP A LA FIN -> il faut verifier quil y ait le bon nombre de ligne et
//                                                                                                une semaine qui demarre sur un lundi 1er doit etre precede
//                                                                                                  de la derniere semaine du mois d'avant
//                       Selectionne du 5 au 17 novembre mois d'avant et mois d'apres et revient tu verra que ca reselectionne tout plutot que la bonne période

class TB_Calendar{


    constructor(_language,_parentNode,_styleArray,_bookableDays,_dateTimeEnabled){

        this.currentMonth = -1;
        this.currentYear = -1;
        this.uniqueId = TB_Hasher.hash(7);

        this.calendarNodeId = "calendar_" + this.uniqueId;
        this.calendarTitleNodeId = "calendarTitle_" + this.uniqueId;
        this.calendarStartDurationTextInfoId = "calendarStartDurationInfo_" + this.uniqueId;
        this.calendarEndDurationTextInfoId = "calendarEndDurationInfo_" + this.uniqueId;


        this.selectMode = "SINGLE"; // SINGLE / DURATION
        this.calendarType = "DAY"; // DAY / DAY_TIME

        // CURRENT SELECTED IS USED FOR DURATION BEGINNING / SINGLE SELECTED
        this.currentSelectedCellId = null;
        this.currentSelectedCellArg = null;
        this.currentSelectedMonth = null;
        this.currentSelectedYear = null;

        // CURRENT SELECTED END IS USED FOR DURATION END
        this.currentSelectedCellEndId = null;
        this.currentSelectedCellEndArg = null;
        this.currentSelectedEndMonth = null;
        this.currentSelectedEndYear = null;

        this.selectState = 0; // SELECT STATE IS USED FOR DURATION MODE

        this.prevMonthLastDayNumber = null;
        this.nextMonthLastDayNumber = null;

        this.sameMonthDuration = null; // start and end duration in same month


        this.localDateOptions = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' }; // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Date/toLocaleDateString
        if(_dateTimeEnabled){
            this.localDateOptions = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
        }

        //this.fallbackSelectableCellClass = "jtdb_selectableCell";

        // TB_DateDiv array
        this.dateDivs = [];

        // TB_DurationDiv array
        this.durationDivs = [];


        if(_bookableDays){
            this.selectableDaysInMonth = _bookableDays;
        }


        // STYLE ARRAY : CSS CLASS TO DEFINE CUSTOM CLASS. IF THIS IS NOT REQUIRED AND YOU WANT TO USE DEFAULT CALENDAR CSS CLASS, JUST DEFINE IT AS NULL.
        // 0 : calendar class
        // 1 : calendar div class
        // 2 : selectable calendar Cell class
        // 3 : selected calendar Cell class
        this.calendarNodeClass = 'jdtb_calendar'; // STYLE FALLBACKS
        this.calendarDivNodeClass = 'jdtb_calendarDiv';
        this.calendarBookableCellClass = 'jdtb_selectableCell';
        this.calendarSelectedCellClass = 'jdtb_selectedCell';
        this.calendarSubmittedCellClass = 'jdtb_submittedCell';


        if(_styleArray){

            if(_styleArray.length > 0) this.calendarNodeClass = _styleArray[0];
            if(_styleArray.length > 1) this.calendarDivNodeClass = _styleArray[1];
            if(_styleArray.length > 2) this.calendarBookableCellClass = _styleArray[2];
            if(_styleArray.length > 3) this.calendarSelectedCellClass = _styleArray[3];
        }

        alert("bookable class for " + _language + " is " + this.calendarBookableCellClass);


        this.createCalendarDiv(_parentNode,this.calendarNodeClass,this.calendarDivNodeClass,_dateTimeEnabled);

        this.init(_language);

        TB_PushCalendar(this);

        this.changeMonthCallback = null;
        this.selectDateCallback = null;

        // TODO: enregistrer au demarrage les couleurs de base pour les bookable date. ( ne pas revenir forcement en noir )
    }


    init(_language){

        this.language = _language;

        $("#" + this.calendarNodeId).empty();
        this.buildCalendarDays();

        if(this.currentMonth === -1 || this.currentYear === -1){ // ON DEFINIT LA DATE A AUJOURDHUI QUAND CETTE DERNIERE NEST PAS DEFINIE
            this.setCalendarToActualTime();
        }

        this.setCalendarTitle(this.currentYear);
        this.appendDaysNumberInCalendar();

    }

    //////////////////////////////////
    //
    // SETTERS
    //////////////////////////////////

    setSelectMode(_selectMode){
        this.selectMode = _selectMode;
    }

    setChangeMonthCallback(callbackFunc){
        this.changeMonthCallback = callbackFunc;
    } // when changing month event, call a specific callbackFunc .

    setSelectDateCallback(callbackFunc){
        this.selectDateCallback = callbackFunc;
    }

    setCurrentYearAndMonth(_year,_month){
        this.currentYear = _year;
        this.currentMonth = _month;
    }

    setCalendarToActualTime(){
        let now = new Date();
        this.setCurrentYearAndMonth(now.getFullYear(),now.getMonth());
    }


    /////////////////////////////////////
    //
    // DOM MANIPULATION
    /////////////////////////////////////

    createCalendarDiv(parentNode,calendarClass,calendarDivClass,_dateTimeEnabled){  // CALENDAR CREATION

        let calendarDiv = "<div id='calendarDiv_" + this.uniqueId + "' class='" + calendarDivClass + "'></div>";
        parentNode.append(calendarDiv);

        let calendarDivSelector = $("#calendarDiv_" + this.uniqueId);

        calendarDivSelector.append("<h1 id='" + this.calendarTitleNodeId + "' ></h1>");
        calendarDivSelector.append("<table id='" + this.calendarNodeId + "' class='" + calendarClass + "' ></table>");
        calendarDivSelector.append("<p id='" + this.calendarStartDurationTextInfoId + "'></p>");
        calendarDivSelector.append("<p id='" + this.calendarEndDurationTextInfoId + "'></p>");

        if(_dateTimeEnabled){
            let timeDiv = "<div id='calendarDiv_TimeDiv"+this.uniqueId+"'>";
            timeDiv += "<h3>Time</h3>";
            timeDiv += "<input type='number' id='calendarDiv_TimeDiv_hour' onchange='TB_TimeElement_constrainTime(this,23)' min=0 max=24 steps=1 value=0 />:";
            timeDiv += "<input type='number' id='calendarDiv_TimeDiv_minute' onchange='TB_TimeElement_constrainTime(this,59)' min=0 max=59 steps=1 value=0 /><br/>";
            timeDiv += "</div>";

            calendarDivSelector.append(timeDiv);
        }

        this.disableCalendarTimeDiv();
        calendarDivSelector.append("<button class='jtdb_addDurationDivButton' onclick='TB_CalendarAppendButton("+this.uniqueId+")'> + </button>");

    }


    enableCalendarTimeDiv(){
       $("#calendarDiv_TimeDiv" + this.uniqueId).css("display","block");
    }

    disableCalendarTimeDiv(){
        $("#calendarDiv_TimeDiv" + this.uniqueId).css("display","none");
    }


    appendEventDiv(){ // APPEND INDICATION ABOUT BOOKING SUBMISSION ( DATE DIV / DURATION DIV )

        if(this.selectMode === 'SINGLE'){ // ADD A SINGLE DAY DATE / DATE TIME
            let hour = $("#calendarDiv_TimeDiv_hour").val();
            let minute = $("#calendarDiv_TimeDiv_minute").val();
            this.appendDateDiv(new Date(this.currentYear,this.currentMonth,this.currentSelectedCellId,hour,minute));
        }

        // ADD A DURATION OF DATE / DATE TIME AREA
        if(this.selectMode === 'DURATION'){

        }

    }

    // DATE DIV :  a div indicating a booked date. ( SINGLE )
    appendDateDiv(date){
        let calendarDivSelector = $("#calendarDiv_" + this.uniqueId);
        let dateDiv = new TB_DurationDiv(date);
        this.dateDivs.push(dateDiv);
        let removeDateButton = '<button class="" onclick="TB_DateDiv_RemoveDateDiv('+this.uniqueId+','+dateDiv.uniqueId+')" >X</button>';
        let toLocaleDate = date.toLocaleDateString(this.language,this.localDateOptions);
        calendarDivSelector.append("<div id='calendarDateDiv_"+dateDiv.uniqueId+"' class=''><p onclick='TB_DurationDiv_SelectDurationDiv("+this.uniqueId+ ","+dateDiv.uniqueId+")' class='jtdb_calendarDurationDiv'>" + toLocaleDate + " </p>"+ removeDateButton + "</div>");
    }

    selectDateDiv(dateDivId){
        for (let i = 0; i < this.dateDivs.length; i++) {
            if (parseInt(this.dateDivs[i].uniqueId) === parseInt(dateDivId)) {
                // SOMETHING
            }
        }
    }

    removeDateDiv(dateDivId){
        for(let i = 0; i < this.dateDivs.length; i++){
            if(parseInt(this.dateDivs[i].uniqueId) === parseInt(dateDivId)){
                this.dateDivs.slice(i);
                $("#calendarDateDiv_" + dateDivId).remove();
            }
        }
    }

    // DURATION DIV : a div indicating a day period. ( DURATION )
    appendDurationDiv(durationStart,durationEnd){
        let calendarDivSelector = $("#calendarDiv_" + this.uniqueId);
        let durationDiv = new TB_DurationDiv(durationStart,durationEnd);
        this.durationDivs.push(durationDiv);
        let removeDurationButton = '<button class="" onclick="TB_DateDiv_RemoveDateDiv('+this.uniqueId+','+durationDiv.uniqueId+')" >X</button>';
        let startToLocaleDate = durationStart.toLocaleDateString(this.language,this.localDateOptions);
        let endToLocaleDate = durationEnd.toLocaleDateString(this.language,this.localDateOptions);
        calendarDivSelector.append("<div id='calendarDurationDiv_"+durationDiv.uniqueId+"' class=''><p onclick='TB_DurationDiv_SelectDurationDiv("+this.uniqueId+ ","+durationDiv.uniqueId+")' class='jtdb_calendarDurationDiv'>" + startToLocaleDate + " -> " + endToLocaleDate + "</p>" + removeDurationButton + "</div>");
    }

    // focus selection setting calendar month to the duration beginning month
    selectDurationDiv(durationDivId) {
        for (let i = 0; i < this.durationDivs.length; i++) {
            if (parseInt(this.durationDivs[i].uniqueId) === parseInt(durationDivId)) {
                // SOMETHING
            }
        }
    }

    removeDurationDiv(durationDivId){
        for(let i = 0; i < this.durationDivs.length; i++){
            if(parseInt(this.durationDivs[i].uniqueId) === parseInt(durationDivId)){
                this.durationDivs.slice(i);
                $("#calendarDurationDiv_" + durationDivId).remove();
            }
        }
    }


    // todo: buildDatesDivs should sort asc date/duration divs by time
    buildDatesDivs(){

        // 1 empty calendar Booking Div
        //$("#calendarDiv");

        // 2 sort datesDiv with date

        // 3 append all datesDiv ordered


    }



    // when selection is done, display info about this selection
    updateInfoCalendar(selector,text){
        selector.html(text);
    }

    updateBookableDays(bookableDays){

        this.selectableDaysInMonth = bookableDays;
        this.init(this.language);

        if(!bookableDays){
            this.setAllDaysSelectable();
        }else{
            this.highlightSelectableDays(bookableDays);
        }

    }


    highlightSelectableDays(array,selectableCellClass){

        for(let i = 0 ; i < array.length ; i++){
            let cellSelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + array[i]);
            if(selectableCellClass){
                cellSelector.attr("class",selectableCellClass);
            }else{
                cellSelector.attr("class",this.calendarBookableCellClass);
            }
        }

    }

    selectDays(array){

        for(let i = 0 ; i < array.length ; i++) {
            let cellSelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + array[i]);
            cellSelector.css("color","orange");
        }

    }

    setAllDaysSelectable(selectableCellClass){

        let daysInMonth = TB_TimeAttributes.daysInMonth(this.currentMonth-1,this.currentYear)

        for(let i = 1 ; i <= (daysInMonth+1) ; i++) {

            let cellSelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + i);
            if(selectableCellClass){
                cellSelector.attr("class",selectableCellClass);
            }else{
                cellSelector.attr("class",this.calendarBookableCellClass);
                //console.log("eee " + this.calendarBookableCellClass);
            }

        }

    }



    // Days labels header : Sunday, monday, etc...
    buildCalendarDays(){

        let headRowId = "#"+this.calendarNodeId+"_headRow";

        if($(headRowId)){
            $(headRowId).remove();
        }

        let tableLabels = "<tr id='"+this.calendarNodeId+"_headRow'>";

        for(let i = 0 ; i < 7; i++){
            let day = TB_TimeAttributes.getDayAttribute(this.language,i);
            tableLabels+="<th>"+day+"</th>";
        }

        tableLabels += "</tr>";
        $("#"+this.calendarNodeId).append(tableLabels);
    }

    setCalendarTitle(currentYear){

        let prevYear = currentYear;
        let nextYear = currentYear;
        let prevMonth = this.currentMonth -1;
        if(prevMonth < 0){
            prevMonth += 12;
            prevYear--;
        }
        let nextMonth = this.currentMonth + 1;
        if(nextMonth > 11){
            nextMonth = 0;
            nextYear++;
        }

        //let prevmonth = "<a onclick='this.prevCalendarMonth("+prevYear+","+prevMonth+")'>←</a>";
        let prevmonth = "<a style='cursor:pointer' onclick='TB_GetCalendar_ChangeMonth(\"PREV\","+this.uniqueId+","+prevYear+","+prevMonth+")'>←</a>";

        //let nextmonth = "<a onclick='this.nextCalendarMonth("+nextYear+","+nextMonth+")'>→</a>";
        let nextmonth = "<a style='cursor:pointer' onclick='TB_GetCalendar_ChangeMonth(\"NEXT\","+this.uniqueId+","+nextYear+","+nextMonth+")'>→</a>";

        let monthStr = TB_TimeAttributes.getMonthAttribute(this.language,this.currentMonth);

        // firstDay with us date ( begins with sunday ) is 1. firstDay with fr date ( begins with monday ) is 0. !
        //alert("First day of " + getMonthAttribute(language,currentMonth) + " " + currentYear+ " is " +getDayAttribute(language,firstDay));
        $("#"+this.calendarTitleNodeId).html(prevmonth + " " + monthStr + " " +currentYear  + " " + nextmonth);

    }

    prevMonth(_year,_month){
        this.changeMonthEvent(_year,_month);
    }


    nextMonth(_year,_month){
        this.changeMonthEvent(_year,_month);
    }

    changeMonthEvent(_year,_month){

        this.selectableDaysInMonth = null; // RESET selectableDaysInMonth ( = BOOKABLE DAYS ) ARRAY

        this.setCurrentYearAndMonth(_year,_month);
        this.setCalendarTitle(_year);


        if(!this.changeMonthCallback){ // IF WE DONT GET A CALLBACK, CALL init() HERE.
            this.init(this.language);
            this.setAllDaysSelectable(); // WE DONT GET BOOKABLE DAYS AS ARGUMENT SO WE DEFINED ALL MONTH DAYS AS SELECTABLE CELLS

            //alert('ee');
        }else{ // OTHERWISE WE CALL UPDATE BOOKABLE DAYS WHICH CALL init()
            setTimeout(this.changeMonthCallback(this,this.currentYear,this.currentMonth), 1); // 1 ms later
        }



        // POUR LES DURATION , SAVOIR SI ON SELECTIONNE DES DATES PRESENTES DANS LA PERIODE
        // ON SELECTIONNE LA PERIODE SELECTIONNEE EN FONCTION DU MOIS MIS A JOUR, DE LA DATE DE DEBUT ET DE FIN DE LA DUREE
        if(this.currentSelectedMonth && this.currentSelectedEndMonth){

            // ATTENTION A LA GESTION DES ANNEES, CA CEST DANS LE CAS OU ON EST SUR LA MEME ANNEEE
            if(this.currentSelectedEndYear === this.currentSelectedYear){

                // SELECTION DE TOUS LES JOURS SELECTIONNABLES POUR UN MOIS INTERMEDIAIRE
                if(_month > this.currentSelectedMonth && _month < this.currentSelectedEndMonth) this.selectDays(this.selectableDaysInMonth);
                // SELECTION DES JOURS SELECTIONNABLE DU DEBUT DE LA DUREE JUSQUAU DERNIER JOUR SELECTIONNABLE DU MEME MOIS
                if(_month === this.currentSelectedMonth) this.selectDays(this.getLastPartFromSelectableDays(this.currentSelectedCellId));
                // SELECTION DES JOURS SELECTIONNABLE DU PREMIER JOUR JUSQUAU DERNIER JOUR DE LA DUREE
                if(_month === this.currentSelectedEndMonth) this.selectDays(this.getFirstFromSelectableDays(this.currentSelectedCellEndId));

            }else{

                if(_year === this.currentSelectedYear){

                    if(_month === this.currentSelectedMonth) this.selectDays(this.getLastPartFromSelectableDays(this.currentSelectedCellId));

                    if(_month > this.currentSelectedMonth) this.selectDays(this.selectableDaysInMonth);

                }

                if(_year === this.currentSelectedEndYear && _month <= this.currentSelectedEndMonth){

                    if(_month < this.currentSelectedEndMonth) this.selectDays(this.selectableDaysInMonth);

                    if(_month === this.currentSelectedEndMonth) this.selectDays(this.getFirstFromSelectableDays(this.currentSelectedCellEndId));

                }

                if(_year !== this.currentSelectedYear && _year !== this.currentSelectedEndYear) this.selectDays(this.selectableDaysInMonth);

            }


        }


    }

    getLastPartFromSelectableDays(startDuration){
        let part = [];

        for(let i = 0 ; i < this.selectableDaysInMonth.length;i++){
            if(this.selectableDaysInMonth[i] >= startDuration) part.push(this.selectableDaysInMonth[i]);
        }

        return part;
    }

    getFirstFromSelectableDays(endDuration){
        let part = [];

        for(let i = 0 ; i < this.selectableDaysInMonth.length;i++){
            if(this.selectableDaysInMonth[i] <= endDuration) part.push(this.selectableDaysInMonth[i]);
        }

        return part;
    }



    selectDayCell(arg,cellId){


        this.enableCalendarTimeDiv();

        if(this.selectMode === 'SINGLE'){

            if(this.currentSelectedCellId && this.currentSelectedCellArg){

                let previousSelectedSelector = '#calendarCell_' + this.currentSelectedCellArg + '_' + this.uniqueId + '_' + this.currentSelectedCellId;
                $(previousSelectedSelector).attr("class",this.calendarBookableCellClass);


            }

            let cellSelector = '#calendarCell_' + arg + '_' + this.uniqueId + '_' + cellId;
            //$(cellSelector).css("color","red");
            $(cellSelector).attr("class",this.calendarSelectedCellClass);


            this.currentSelectedCellId = cellId;
            this.currentSelectedCellArg = arg;

            if(this.selectDateCallback){
                setTimeout(this.selectDateCallback(this,this.currentYear,this.currentMonth,this.currentSelectedCellId), 1); // 1 ms later
            }

        }

        if(this.selectMode === 'DURATION'){

            if(this.selectState % 2 === 0){ // DURATION SELECTION FIRST STEP -> Select beginning of duration
                // save start duration month and year
                this.currentSelectedMonth = this.currentMonth;
                this.currentSelectedYear = this.currentYear;

                if(this.currentSelectedCellEndId){ // REMOVE THE PREVIOUS SELECTION
                    for(let i = parseInt(this.currentSelectedCellId); i <= parseInt(this.currentSelectedCellEndId);i++){
                        let prevMonthCellSelector = $("#calendarCell_CURRENT_" + i);

                        prevMonthCellSelector.attr("class",this.calendarBookableCellClass);

                    }

                    this.updateInfoCalendar($("#" + this.calendarEndDurationTextInfoId),"");

                }

                // SELECT START OF DURATION
                this.currentSelectedCellId = cellId;
                this.currentSelectedCellArg = arg;

                let cellSelector = '#calendarCell_' + arg + '_' + cellId;

                $(cellSelector).attr("class",this.calendarSelectedCellClass);


                let currentDate = new Date(this.currentYear,this.currentMonth,cellId,20,20);
                this.updateInfoCalendar($("#" + this.calendarStartDurationTextInfoId),"<b>" + TB_TimeAttributes.getStartDurationLabel(this.language) + "</b>" + currentDate.toLocaleDateString(this.language,this.localDateOptions));



            }else{ // DURATION SELECTION SECOND STEP -> Select end of duration

                this.currentSelectedEndMonth = this.currentMonth;
                this.currentSelectedEndYear = this.currentYear;

                this.currentSelectedCellEndId = cellId;
                this.currentSelectedCellEndArg = arg;

                // calcul de la durée

                let durationStartArg = this.currentSelectedCellArg;
                let durationEndArg = arg;

                // SELECT LAST DAYS OF PREV MONTH IF THEY ARE :

                let sameMonth = true;

                let endDurationBeforeStartDuration = false;

                if(this.currentSelectedMonth !== this.currentSelectedEndMonth)sameMonth = false;
                if(this.currentSelectedYear !== this.currentSelectedEndYear)sameMonth = false;

                if(this.currentSelectedYear > this.currentSelectedEndYear) endDurationBeforeStartDuration = true;
                if(this.currentSelectedMonth > this.currentSelectedEndMonth  && this.currentSelectedYear === this.currentSelectedEndYear) endDurationBeforeStartDuration = true;
                if(this.currentSelectedCellId > this.currentSelectedCellEndId && this.currentSelectedMonth === this.currentSelectedEndMonth && this.currentSelectedYear === this.currentSelectedEndYear) endDurationBeforeStartDuration = true;

                if(endDurationBeforeStartDuration){
                    alert("The end of your duration is happening before the beginning of your duration");
                    return;
                }

                let startingCellId = this.currentSelectedCellId;

                if(!sameMonth)startingCellId = 0;

                if(this.selectableDaysInMonth){

                    for(let i = parseInt(startingCellId); i <= parseInt(this.currentSelectedCellEndId);i++){
                        if(this.selectableDaysInMonth.includes(i)){
                            let prevMonthCellSelector = $("#calendarCell_CURRENT_" + i);
                            //prevMonthCellSelector.css("color","orange");
                            prevMonthCellSelector.attr("class",this.calendarSubmittedCellClass);


                        }
                    }

                }else{

                    for(let i = parseInt(startingCellId); i <= parseInt(this.currentSelectedCellEndId);i++){
                        let prevMonthCellSelector = $("#calendarCell_CURRENT_" + i);
                        //prevMonthCellSelector.css("color","orange");
                        prevMonthCellSelector.attr("class",this.calendarSubmittedCellClass);
                    }

                }

                let previousDate = new Date(this.currentSelectedYear,this.currentSelectedMonth,this.currentSelectedCellId);
                let currentDate = new Date(this.currentYear,this.currentMonth,cellId);

                this.updateInfoCalendar($("#" + this.calendarEndDurationTextInfoId),"<b>" + TB_TimeAttributes.getEndDurationLabel(this.language) + "</b>" + currentDate.toLocaleDateString(this.language,this.localDateOptions));

                this.appendDurationDiv(previousDate, currentDate);

            }

        }

        this.selectState++;

    }

    // AJOUT DES CASES DANS LE CALENDRIER
    appendDaysNumberInCalendar(){

        let firstDayOffset = TB_TimeAttributes.getFirstDayOffset(this.language);
        let firstDay = new Date(this.currentYear, this.currentMonth, firstDayOffset).getDay();
        let numberOfLines = (7 - firstDay); // USE NUMBER OF LINES TO CHECK IF WE ADD NEXT MONTH WEEK LAST LINE
        let firstWeekDaysRemaining = 7 - firstDay; // 7 - 4 = 3
        let daysRemaining = TB_TimeAttributes.daysInMonth(this.currentMonth-1,this.currentYear) - firstWeekDaysRemaining;
        let numbersOfWeekLines = 1 + Math.ceil(daysRemaining / 7); // ET ON A RAJOUTERA TOUJOURS UNE LIGNE POUR LES JOURS DU MOIS SUIVANT
        let dayMonth = 1;
        let start = false;
        let dayPrevMonth = -1;
        let dayNextMonth = 1;
        let firstWeekDaysPreceding = firstDay; // HOW MANY DAYS ARE PRECEEDING IN THE PREVIOUS MONTH ?
        let numbersOfDaysInLastMonth = -1;

        if(this.currentMonth > 0){
            numbersOfDaysInLastMonth = TB_TimeAttributes.daysInMonth(this.currentMonth,this.currentYear); // month + 1
            this.prevMonthLastDayNumber = numbersOfDaysInLastMonth;
        }else{
            numbersOfDaysInLastMonth = TB_TimeAttributes.daysInMonth(12,this.currentYear-1); // January to previous year's December
            this.prevMonthLastDayNumber = numbersOfDaysInLastMonth;
        }

        // dayPrevMonth is the starting day from the previous month
        dayPrevMonth = numbersOfDaysInLastMonth - (firstWeekDaysPreceding-1);// 31 - (4+1) // 31 - 3 // 28

        for(let i = 0 ; i < numbersOfWeekLines;i++){

            let currentTableRow = "<tr>";

            for(let j = 0; j < 7; j++){
                if(i === 0 && j === firstDay){
                    start = true;
                }

                if(!start){
                    //let previousMonthCellFunction = "TB_CalendarCell_Selected('PREV','" + dayPrevMonth+ "')";
                    //currentTableRow += "<td id='calendarCell_PREV_" + dayPrevMonth + "' class='x' onclick='TB_CalendarCell_Selected(" + this.uniqueId + ",\"PREV\"," + dayPrevMonth + ")'><em>"+dayPrevMonth+"</em></td>";
                    currentTableRow += "<td id='calendarCell_PREV_" + dayPrevMonth + "' class='x' ><em>"+dayPrevMonth+"</em></td>";
                    dayPrevMonth++;
                }else{

                    if(dayMonth < (TB_TimeAttributes.daysInMonth(this.currentMonth+1,this.currentYear) + 1)){

                        // IF WE DEFINED SELECTABLE DAYS FOR THIS MONTH , DEFINE ONLY APPROPRIATE DAYS AS SELECTABLE
                        if(this.selectableDaysInMonth) {
                            if(this.selectableDaysInMonth.includes(dayMonth)){
                                currentTableRow += "<td id='calendarCell_CURRENT_" + this.uniqueId + "_" + dayMonth + "' class='x' onclick='TB_CalendarCell_Selected(" + this.uniqueId + ",\"CURRENT\"," + dayMonth + ")'><b>"+dayMonth+"</b></td>";
                            }else{
                                currentTableRow += "<td id='calendarCell_CURRENT_" + this.uniqueId + "_" + dayMonth + "' class='x' ><b>"+dayMonth+"</b></td>";
                            }
                        }else{
                            // OTHERWISE , DEFINE ALL DAYS AS SELECTABLE
                            currentTableRow += "<td id='calendarCell_CURRENT_" + this.uniqueId + "_" + dayMonth + "' class='x' onclick='TB_CalendarCell_Selected(" + this.uniqueId + ",\"CURRENT\"," + dayMonth + ")'><b>"+dayMonth+"</b></td>";
                        }

                        dayMonth++;

                    }else{
                        // NEXT MONTH DAYS SHOULD NOT BE SELECTABLE
                        //currentTableRow += "<td id='calendarCell_NEXT_" + dayNextMonth + "' class='x' onclick='TB_CalendarCell_Selected(" + this.uniqueId + ",\"NEXT\"," + dayNextMonth + ")' ><em>"+dayNextMonth+"</em></td>";
                        currentTableRow += "<td id='calendarCell_NEXT_" + dayNextMonth + "' class='x' ><em>"+dayNextMonth+"</em></td>";
                        dayNextMonth++;
                    }

                }

            }

            currentTableRow+= "</tr>";
            $("#"+this.calendarNodeId).append(currentTableRow);

        }

        let currentTableRow = "<tr>";

        // ADD LAST LINE FOR NEXT MONTH
        for(let i = 0 ; i < 7 ; i++){

            //currentTableRow += "<td id='calendarCell_NEXT_" + dayNextMonth + "' class='x' onclick='TB_CalendarCell_Selected(" + this.uniqueId + ",\"NEXT\"," + dayNextMonth + ")' ><em>"+dayNextMonth+"</em></td>";
            currentTableRow += "<td id='calendarCell_NEXT_" + dayNextMonth + "' class='x' ><em>"+dayNextMonth+"</em></td>";
            dayNextMonth++;
        }

        currentTableRow+= "</tr>";
        $("#"+this.calendarNodeId).append(currentTableRow);

    }


}


class TB_DateDiv{

    constructor(date){
        this.uniqueId = TB_Hasher.hash(7);
        this.date=date;
    }

}

class TB_DurationDiv{

    constructor(durationA,durationB){
        this.uniqueId = TB_Hasher.hash(7);
        this.durationA = durationA;
        this.durationB = durationB;
    }

}



let calendars = [];

function TB_PushCalendar(calendar){

    calendars.push(calendar);
    //console.log(calendars);
}

function TB_GetCalendar_ChangeMonth(arg,uniqueId,year,month){

    for(let i = 0 ; i < calendars.length; i++){
        if(parseInt(calendars[i].uniqueId) === parseInt(uniqueId)){
            if(arg === 'NEXT'){
                calendars[i].nextMonth(year,month);
            }
            if(arg === 'PREV'){
                calendars[i].prevMonth(year,month);
            }
        }
    }

}

function TB_CalendarCell_Selected(uniqueId,arg,cellId) {



    for (let i = 0; i < calendars.length; i++) {
        if (parseInt(calendars[i].uniqueId) === parseInt(uniqueId)){

            calendars[i].selectDayCell(arg,cellId);
        }
    }

}


function TB_CalendarAppendButton(uniqueId){

// on valide pour ajouter, que ca soit une date unique pour plusieurs dates uniques, ou pour une duree pour de la multi duree
    for (let i = 0; i < calendars.length; i++) {
        if (parseInt(calendars[i].uniqueId) === parseInt(uniqueId)) calendars[i].appendEventDiv();
    }

}


// Duration Div


function TB_DurationDiv_SelectDurationDiv(calendarId,durationDivId){

    for (let i = 0; i < calendars.length; i++) {
        if (parseInt(calendars[i].uniqueId) === parseInt(calendarId)) calendars[i].selectDurationDiv(durationDivId);
    }

}

function TB_DurationDiv_RemoveDurationDiv(calendarId,durationDivId){

    for (let i = 0; i < calendars.length; i++) {
        if (parseInt(calendars[i].uniqueId) === parseInt(calendarId)) calendars[i].removeDurationDiv(durationDivId);
    }

}


function TB_DateDiv_SelectDateDiv(calendarId,dateDivId){

    for (let i = 0; i < calendars.length; i++) {
        if (parseInt(calendars[i].uniqueId) === parseInt(calendarId)) calendars[i].selectDateDiv(dateDivId);
    }

}


function TB_DateDiv_RemoveDateDiv(calendarId,dateDivId){

    for (let i = 0; i < calendars.length; i++) {
        if (parseInt(calendars[i].uniqueId) === parseInt(calendarId)) calendars[i].removeDateDiv(dateDivId);
    }
}


function TB_TimeElement_constrainTime(element,max){

    if($(element).val() > max){
        $(element).val(max);
    }

    if($(element).val() < 0){
        $(element).val(0);
    }
}