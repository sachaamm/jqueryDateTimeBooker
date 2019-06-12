class TB_Calendar {


    constructor(options) {

        let _options = options ? options : {};

        this.currentMonth = -1;
        this.currentYear = -1;
        this.uniqueId = TB_Hasher.basicHash(4);

        this.calendarNodeId = "jdtb_calendar_calendar_table_" + this.uniqueId;
        this.calendarTitleNodeId = "jdtb_calendar_monthTitle_" + this.uniqueId;
        this.calendarStartDurationTextInfoId = "calendarStartDurationInfo_" + this.uniqueId;
        this.calendarEndDurationTextInfoId = "calendarEndDurationInfo_" + this.uniqueId;

        this.selectMode = _options.hasOwnProperty("selectMode") ? _options["selectMode"] : "SINGLE"; // SINGLE / DURATION
        this.calendarType = "DAY"; // DAY / DAY_TIME

        // CURRENT SELECTED IS USED FOR DURATION BEGINNING / SINGLE SELECTED
        this.currentSelectedMinute = null; // IS IT USEFUL ?
        this.currentSelectedHour = null;
        this.currentSelectedCellId = null;
        this.currentSelectedCellArg = null;
        this.currentSelectedMonth = null;
        this.currentSelectedYear = null;

        // CURRENT SELECTED END IS USED FOR DURATION END
        this.currentSelectedEndMinute = null;
        this.currentSelectedEndHour = null;
        this.currentSelectedCellEndId = null;
        this.currentSelectedCellEndArg = null;
        this.currentSelectedEndMonth = null;
        this.currentSelectedEndYear = null;


        this.selectState = 0; // SELECT STATE IS USED FOR DURATION MODE

        this.prevMonthLastDayNumber = null;
        this.nextMonthLastDayNumber = null;

        this.sameMonthDuration = null; // start and end duration in same month

        let _dateTimeEnabled = false;
        if (_options.hasOwnProperty("dateTimeEnabled")) {
            _dateTimeEnabled = options["dateTimeEnabled"];
        }

        this.localDateOptions = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' }; // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Date/toLocaleDateString
        if (_dateTimeEnabled) {
            this.localDateOptions = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        }

        // TB_TimeMarker array, containing ONLY startingDate
        this.dateMarkers = [];

        // TB_TimeMarker array, containing startingDate + endingDate
        this.durationMarkers = [];

        this.selectableDaysInMonth = _options.hasOwnProperty("bookableDays") ? options["bookableDays"] : null;

        this.repickSameDate = _options.hasOwnProperty("repickSameDate") ? options["repickSameDate"] : false;



        // STYLE ARRAY : CSS CLASS TO DEFINE CUSTOM CLASS. IF THIS IS NOT REQUIRED AND YOU WANT TO USE DEFAULT CALENDAR CSS CLASS, JUST DEFINE IT AS NULL.
        // 0 : calendar class
        // 1 : calendar div class
        // 2 : selectable calendar Cell class
        // 3 : selected calendar Cell class
        this.calendarNodeClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarClass"]) ? _options["styleClassArray"]["calendarClass"] : 'jdtb_calendar'; // STYLE FALLBACKS
        this.calendarDivNodeClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarDivClass"]) ? _options["styleClassArray"]["calendarDivClass"] : 'jdtb_calendarDiv';
        this.calendarBookableCellClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["selectableCellClass"]) ? _options["styleClassArray"]["selectableCellClass"] : 'jdtb_selectableCell';
        this.calendarSelectedCellClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["selectedCellClass"]) ? _options["styleClassArray"]["selectedCellClass"] : 'jdtb_selectedCell';
        this.calendarSubmittedCellClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["submittedCellClass"]) ? _options["styleClassArray"]["submittedCellClass"] : 'jdtb_submittedCell';
        
        this.calendarContainerClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarContainerClass"]) ? _options["styleClassArray"]["calendarContainerClass"] : 'jdtb_calendar_container_div';
     


        this.calendarMonthTitleContainerClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarMonthTitleContainerClass"]) ? _options["styleClassArray"]["calendarMonthTitleContainerClass"] : 'jdtb_calendar_monthTitle_container';
        this.calendarMonthTitleClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarMonthTitleClass"]) ? _options["styleClassArray"]["calendarMonthTitleClass"] : 'jdtb_calendar_monthTitle';
        this.calendarMonthTitleHeaderMarginClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarMonthTitleHeaderMarginClass"]) ? _options["styleClassArray"]["calendarMonthTitleHeaderMarginClass"] : 'jdtb_calendar_monthTitle_headerMargin';
        this.calendarMonthTitleFooterMarginClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarMonthTitleFooterMarginClass"]) ? _options["styleClassArray"]["calendarMonthTitleFooterMarginClass"] : 'jdtb_calendar_monthTitle_footerMargin';
        this.calendarMonthTitleTextClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarMonthTitleTextClass"]) ? _options["styleClassArray"]["calendarMonthTitleTextClass"] : 'jdtb_calendar_monthTitle_text';
        this.calendarMonthTitleTextPClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarMonthTitleTextPClass"]) ? _options["styleClassArray"]["calendarMonthTitleTextPClass"] : 'jdtb_calendar_monthTitle_textP';
        this.calendarLeftIconContainerClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarLeftIconContainerClass"]) ? _options["styleClassArray"]["calendarLeftIconContainerClass"] : 'jdtb_calendar_monthTitle_leftArrowDiv';
        this.calendarRightIconContainerClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightIconContainerClass"]) ? _options["styleClassArray"]["calendarRightIconContainerClass"] : 'jdtb_calendar_monthTitle_rightArrowDiv';
        this.calendarLeftIconClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarLeftIconClass"]) ? _options["styleClassArray"]["calendarLeftIconClass"] : 'jdtb_calendar_leftIcon';
        this.calendarRightIconClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightIconClass"]) ? _options["styleClassArray"]["calendarRightIconClass"] : 'jdtb_calendar_rightIcon';
        this.calendarTableClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarTableClass"]) ? _options["styleClassArray"]["calendarTableClass"] : 'jdtb_calendar_calendar_table';
        this.calendarAddIconContainerClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarAddIconContainerClass"]) ? _options["styleClassArray"]["calendarAddIconContainerClass"] : 'jdtb_calendar_add_container';
        this.calendarSubmitIconContainerClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarSubmitIconContainerClass"]) ? _options["styleClassArray"]["calendarSubmitIconContainerClass"] : 'jdtb_calendar_submit_container';
        this.calendarAddIconClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarAddIconClass"]) ? _options["styleClassArray"]["calendarAddIconClass"] : 'jdtb_calendar_plusIcon';
        this.calendarSubmitIconClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarSubmitIconClass"]) ? _options["styleClassArray"]["calendarSubmitIconClass"] : 'jdtb_calendar_submitIcon';
        this.calendarLeftFooterClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarLeftFooterClass"]) ? _options["styleClassArray"]["calendarLeftFooterClass"] : 'jdtb_calendar_footer';
        this.calendarRightHeaderClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightHeaderClass"]) ? _options["styleClassArray"]["calendarRightHeaderClass"] : 'jdtb_calendar_right_header';
        this.calendarRightSectionMidClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightSectionMidClass"]) ? _options["styleClassArray"]["calendarRightSectionMidClass"] : 'jdtb_calendar_rightSection_mid';
        this.calendarRightSectionMidClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightSectionMidClass"]) ? _options["styleClassArray"]["calendarRightSectionMidClass"] : 'jdtb_calendar_rightSection_mid';
        this.calendarRightSectionMidHeaderClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightSectionMidHeaderClass"]) ? _options["styleClassArray"]["calendarRightSectionMidHeaderClass"] : 'jdtb_calendar_rightSection_mid_headerMargin';
        this.calendarRightSectionMidHeaderClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightSectionMidHeaderClass"]) ? _options["styleClassArray"]["calendarRightSectionMidHeaderClass"] : 'jdtb_calendar_rightSection_mid_headerMargin';
        this.calendarRightSectionMidMidClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightSectionMidMidClass"]) ? _options["styleClassArray"]["calendarRightSectionMidMidClass"] : 'jdtb_calendar_rightSection_mid_mid';
        this.calendarRightSectionMidMidClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightSectionMidMidClass"]) ? _options["styleClassArray"]["calendarRightSectionMidMidClass"] : 'jdtb_calendar_rightSection_mid_mid';
        this.calendarRightSectionMidLeftMarginClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightSectionMidLeftMarginClass"]) ? _options["styleClassArray"]["calendarRightSectionMidLeftMarginClass"] : 'jdtb_calendar_rightSection_mid_leftMargin';
        this.calendarRightSectionMidTimeMarkerContainerClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightSectionMidTimeMarkerContainerClass"]) ? _options["styleClassArray"]["calendarRightSectionMidTimeMarkerContainerClass"] : 'jdtb_calendar_rightSection_mid_timeMarkersContainer';
        this.calendarRightSectionMidRightMarginClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightSectionMidRightMarginClass"]) ? _options["styleClassArray"]["calendarRightSectionMidRightMarginClass"] : 'jdtb_calendar_rightSection_mid_rightMargin';
        this.calendarRightSectionMidFooterMarginClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightSectionMidFooterMarginClass"]) ? _options["styleClassArray"]["calendarRightSectionMidFooterMarginClass"] : 'jdtb_calendar_rightSection_mid_footerMargin';
        this.calendarRightSectionFooterClass = (_options.hasOwnProperty("styleClassArray") && _options["styleClassArray"]["calendarRightSectionFooterClass"]) ? _options["styleClassArray"]["calendarRightSectionFooterClass"] : 'jdtb_calendar_monthTitle_footerMargin';
        

        // MINIMAL AND MAXIMAL DURATION CONSTRAINS
        this.minimalPeriodDuration = _options.hasOwnProperty("minimalDuration") ? _options["minimalDuration"] : null;
        this.maximalPeriodDuration = _options.hasOwnProperty("maximalDuration") ? _options["maximalDuration"] : null;

        //this.createCalendarDiv(_parentNode,this.calendarNodeClass,this.calendarDivNodeClass,_dateTimeEnabled);
        this.createCalendarDivElements(_options.hasOwnProperty("parentNode") ? $(_options["parentNode"]) : $("body"));

        this.init(_options.hasOwnProperty("language") ? _options["language"] : "en-US");

        TB_PushCalendar(this);

        // CALLBACK
        this.changeMonthCallback = _options.hasOwnProperty("changeMonthCallback") ? _options["changeMonthCallback"] : null;
        this.selectDateCallback = _options.hasOwnProperty("selectDateCallback") ? _options["selectDateCallback"] : null;
        this.appendTimeMarkerCallback = _options.hasOwnProperty("appendTimeMarkerCallback") ? _options["appendTimeMarkerCallback"] : null;
        this.removeTimeMarkerCallback = _options.hasOwnProperty("removeTimeMarkerCallback") ? _options["removeTimeMarkerCallback"] : null;


        this.periodBookableReachEndOfMonth = false;
        this.periodBookableContinuityEnd = -1;
        this.periodBookableGetContinuity = false;

    }


    init(_language) {

        this.language = _language;

        $("#" + this.calendarNodeId).empty();
        this.buildCalendarDays();

        if (this.currentMonth === -1 || this.currentYear === -1) { // ON DEFINIT LA DATE A AUJOURDHUI QUAND CETTE DERNIERE NEST PAS DEFINIE
            this.setCalendarToActualTime();
        }

        this.setCalendarTitle(this.currentYear);
        this.appendDaysNumberInCalendar();

        this.updateBookableDays(this.selectableDaysInMonth, true);

    }

    //////////////////////////////////
    // SETTERS
    //////////////////////////////////
    setSelectMode(_selectMode) {
        this.selectMode = _selectMode;
    }

    setChangeMonthCallback(callbackFunc) {
        this.changeMonthCallback = callbackFunc;
    } // when changing month event, call a specific callbackFunc .

    setSelectDateCallback(callbackFunc) {
        this.selectDateCallback = callbackFunc;
    }

    setCurrentYearAndMonth(_year, _month) {
        this.currentYear = _year;
        this.currentMonth = _month;
    }

    setCalendarToActualTime() {
        let now = new Date();
        this.setCurrentYearAndMonth(now.getFullYear(), now.getMonth());
    }

    setCalendarVisibility(state) {
        $("#calendarDiv_" + this.uniqueId).css("display", state);
    }

    setStartTime(hour,minute){
        this.currentSelectedMinute = minute;
        this.currentSelectedHour = hour;
    }

    setEndTime(hour,minute){

    }

    /////////////////////////////////////
    // DOM MANIPULATION
    /////////////////////////////////////
    createCalendarDivElements(parentNode) {

        // CREATE MAIN CONTAINER
        let mainContainer = "<div id='jdtb_calendar_container_div_" + this.uniqueId + "' class='"+this.calendarContainerClass+"'></div>";
        parentNode.append(mainContainer);

        // CREATE LEFT SECTION & RIGHT SECTION
        let leftSection = "<div id='jdtb_calendar_leftSection_" + this.uniqueId + "' class='jdtb_calendar_leftSection'></div>";
        let rightSection = "<div id='jdtb_calendar_rightSection_" + this.uniqueId + "' class='jdtb_calendar_rightSection'></div>";

        let mainContainerSelector = $("#jdtb_calendar_container_div_" + this.uniqueId);
        mainContainerSelector.append(leftSection);
        mainContainerSelector.append(rightSection);

        // ADD SUBSECTIONS IN LEFT SECTION ( TITLE CONTAINER / CALENDAR CONTAINER / LEFT FOOTER CONTAINER
        let monthTitleContainer = "<div id='jdtb_calendar_monthTitle_container_" + this.uniqueId + "'class='jdtb_calendar_monthTitle_container'></div>";
        let calendarContainer = "<div id='jdtb_calendar_div_" + this.uniqueId + "' class='jdtb_calendar_div' ></div>";
        let footerContainer = "<div id='jdtb_calendar_footer_" + this.uniqueId + "' class='jdtb_calendar_footer'></div>";
        let leftSectionSelector = $("#jdtb_calendar_leftSection_" + this.uniqueId);
        leftSectionSelector.append(monthTitleContainer);
        leftSectionSelector.append(calendarContainer);
        leftSectionSelector.append(footerContainer);

        // ADD MONTH TITLE CONTAINER SUBSECTIONS
        let monthTitleHeaderMargin = "<div id='jdtb_calendar_monthTitle_headerMargin_" + this.uniqueId + "' class='jdtb_calendar_monthTitle_headerMargin'></div>";
        let monthTitle = "<div id='jdtb_calendar_monthTitle_" + this.uniqueId + "' class='jdtb_calendar_monthTitle'></div>";
        let monthTitleFooterMargin = "<div id='jdtb_calendar_monthTitle_footerMargin_" + this.uniqueId + "' class='jdtb_calendar_monthTitle_footerMargin'></div>";
        let monthTitleContainerSelector = $("#jdtb_calendar_monthTitle_container_" + this.uniqueId);
        monthTitleContainerSelector.append(monthTitleHeaderMargin);
        monthTitleContainerSelector.append(monthTitle);
        monthTitleContainerSelector.append(monthTitleFooterMargin);

        // ADD TITLE SUBSECTIONS
        let leftArrowDiv = "<div id='jdtb_calendar_monthTitle_leftArrowDiv_" + this.uniqueId + "' class='jdtb_calendar_monthTitle_leftArrowDiv'></div>";
        let monthTitleText = "<div id='jdtb_calendar_monthTitle_text_" + this.uniqueId + "' class='jdtb_calendar_monthTitle_text'></div>";
        let rightArrowDiv = "<div id='jdtb_calendar_monthTitle_rightArrowDiv_" + this.uniqueId + "' class='jdtb_calendar_monthTitle_rightArrowDiv'></div>";
        let monthTitleSelector = $("#jdtb_calendar_monthTitle_" + this.uniqueId);
        monthTitleSelector.append(leftArrowDiv);
        monthTitleSelector.append(monthTitleText);
        monthTitleSelector.append(rightArrowDiv);

        // ADD LEFT ARROW SUBSECTIONS
        let leftIcon = "<div id='jdtb_calendar_leftIcon_" + this.uniqueId + "' class='jdtb_calendar_leftIcon'></div>";
        let leftArrowSelector = $('#jdtb_calendar_monthTitle_leftArrowDiv_' + this.uniqueId);
        leftArrowSelector.append(leftIcon);

        // ADD MONTH TITLE TEXT SUBSECTIONS
        let monthTitleTextP = "<span id='jdtb_calendar_monthTitle_textP_" + this.uniqueId + "' class='jdtb_calendar_monthTitle_textP'></span>";
        let monthTitleTextSelector = $("#jdtb_calendar_monthTitle_textP_" + this.uniqueId);
        monthTitleTextSelector.append(monthTitleTextP);

        // ADD RIGHT ARROW SUBSECTIONS
        let rightIcon = "<div id='jdtb_calendar_rightIcon_" + this.uniqueId + "' class='jdtb_calendar_rightIcon'></div>";
        let rightArrowSelector = $("#jdtb_calendar_monthTitle_rightArrowDiv_" + this.uniqueId);
        rightArrowSelector.append(rightIcon);

        // ADD CALENDAR CONTAINER SUBSECTIONS
        let calendarHeaderMargin = "<div id='jdtb_calendar_headerMargin_" + this.uniqueId + "' class='jdtb_calendar_headerMargin'></div>";
        let calendar = "<div id='jdtb_calendar_" + this.uniqueId + "' class='jdtb_calendar'></div>";
        let calendarFooterMargin = "<div id='jdtb_calendar_footerMargin_" + this.uniqueId + "' class='jdtb_calendar_footerMargin'></div>";
        let calendarContainerSelector = $("#jdtb_calendar_div_" + this.uniqueId);
        calendarContainerSelector.append(calendarHeaderMargin);
        calendarContainerSelector.append(calendar);
        calendarContainerSelector.append(calendarFooterMargin);

        // ADD CALENDAR SUBSECTIONS
        let calendarLeftMargin = "<div id='jdtb_calendar_leftMargin_" + this.uniqueId + "' class='jdtb_calendar_leftMargin'></div>";
        let calendarCalendar = "<div id='jdtb_calendar_calendar_" + this.uniqueId + "' class='jdtb_calendar_calendar'></div>";
        let calendarRightMargin = "<div id='jdtb_calendar_rightMargin_" + this.uniqueId + "' class='jdtb_calendar_rightMargin'></div>";
        let calendarSelector = $("#jdtb_calendar_" + this.uniqueId);
        calendarSelector.append(calendarLeftMargin);
        calendarSelector.append(calendarCalendar);
        calendarSelector.append(calendarRightMargin);

        // ADD LEFT SECTION FOOTER SUBSECTIONS
        let leftFooterAddContainer = "<div id='jdtb_calendar_add_container_" + this.uniqueId + "' class='jdtb_calendar_add_container'></div>";
        let leftFooterSubmitContainer = "<div id='jdtb_calendar_submit_container_" + this.uniqueId + "' class='jdtb_calendar_submit_container'></div>";
        let leftFooterMargin = "<div id='jdtb_calendar_leftFooter_margin_" + this.uniqueId + "' class='jdtb_calendar_leftFooter_margin'></div>";
        let leftFooterSelector = $('#jdtb_calendar_footer_' + this.uniqueId);
        leftFooterSelector.append(leftFooterAddContainer);
        leftFooterSelector.append(leftFooterSubmitContainer);
        leftFooterSelector.append(leftFooterMargin);

        // ADD ADDCONTAINER SUBSECTIONS
        let addIcon = "<img id='jdtb_calendar_plusIcon" + this.uniqueId + "' class='jdtb_calendar_plusIcon' onclick='TB_AppendTimeMarker(" + this.uniqueId + ")' />";
        let leftFooterAddContainerSelector = $("#jdtb_calendar_add_container_" + this.uniqueId);
        leftFooterAddContainerSelector.append(addIcon);

        // ADD SUBMITCONTAINER SUBSECTIONS
        let submitIcon = "<img id='jdtb_calendar_submitIcon_" + this.uniqueId + "' class='jdtb_calendar_submitIcon'/>";
        let leftFooterSubmitContainerSelector = $('#jdtb_calendar_submit_container_' + this.uniqueId);
        leftFooterSubmitContainerSelector.append(submitIcon);

        // ADD SUBSECTIONS IN RIGHT SECTION ( HEADER CONTAINER / TIME MARKERS CONTAINER / RIGHT FOOTER CONTAINER
        let rightHeaderContainer = "<div id='jdtb_calendar_right_header_" + this.uniqueId + "' class='jdtb_calendar_right_header'></div>";
        let timeMarksContainer = "<div id='jdtb_calendar_rightSection_mid_" + this.uniqueId + "' class='jdtb_calendar_rightSection_mid'></div>";
        let rightSectionFooter = "<div id='jdtb_calendar_rightSection_footer_" + this.uniqueId + "' class='jdtb_calendar_rightSection_footer'></div>";
        let rightSectionSelector = $("#jdtb_calendar_rightSection_" + this.uniqueId);
        rightSectionSelector.append(rightHeaderContainer);
        rightSectionSelector.append(timeMarksContainer);
        rightSectionSelector.append(rightSectionFooter);

        // ADD RIGHT HEADER SUBSECTIONS
        let rightHeaderStartDate = "<div id='jdtb_calendar_right_header_startDateText_" + this.uniqueId + "' class='jdtb_calendar_right_header_startDateText'></div>";
        let rightHeaderEndDate = "<div id='jdtb_calendar_right_header_endDateText_" + this.uniqueId + "' class='jdtb_calendar_right_header_endDateText'></div>";
        let rightHeaderSelector = $("#jdtb_calendar_right_header_" + this.uniqueId);
        rightHeaderSelector.append(rightHeaderStartDate);
        rightHeaderSelector.append(rightHeaderEndDate);

        // ADD TIME MARKER MID SUBSECTIONS
        let midSectionHeaderMargin = "<div id='jdtb_calendar_rightSection_mid_headerMargin_" + this.uniqueId + "' class='jdtb_calendar_rightSection_mid_headerMargin'></div>";
        let midMidSection = "<div id='jdtb_calendar_rightSection_mid_mid_" + this.uniqueId + "' class='jdtb_calendar_rightSection_mid_mid' ></div>";
        let midFooterMargin = "<div id='jdtb_calendar_rightSection_mid_footerMargin_" + this.uniqueId + "' class='jdtb_calendar_rightSection_mid_footerMargin'></div>";
        let midSectionSelector = $("#jdtb_calendar_rightSection_mid_" + this.uniqueId);
        midSectionSelector.append(midSectionHeaderMargin);
        midSectionSelector.append(midMidSection);
        midSectionSelector.append(midFooterMargin);

        // ADD MID MID SUBSECTIONS
        let midMidLeftMargin = "<div id='jdtb_calendar_rightSection_mid_leftMargin_" + this.uniqueId + "' class='jdtb_calendar_rightSection_mid_leftMargin'></div>";
        let midMidTimeMarkersDiv = "<div id='jdtb_calendar_rightSection_mid_timeMarkersContainer_" + this.uniqueId + "' class='jdtb_calendar_rightSection_mid_timeMarkersContainer'></div>";
        let midMidRightMargin = "<div id='jdtb_calendar_rightSection_mid_rightMargin_" + this.uniqueId + "' class='jdtb_calendar_rightSection_mid_rightMargin'></div>";
        let midMidSelector = $("#jdtb_calendar_rightSection_mid_mid_" + this.uniqueId);
        midMidSelector.append(midMidLeftMargin);
        midMidSelector.append(midMidTimeMarkersDiv);
        midMidSelector.append(midMidRightMargin);

        // APPEND CALENDAR TABLE
        $("#jdtb_calendar_calendar_" + this.uniqueId).append("<table class='jdtb_calendar_calendar_table' id='jdtb_calendar_calendar_table_" + this.uniqueId + "'></table>");

    }

    enableCalendarTimeDiv() {
        $("#calendarDiv_TimeDiv" + this.uniqueId).css("display", "block");
    }

    disableCalendarTimeDiv() {
        $("#calendarDiv_TimeDiv" + this.uniqueId).css("display", "none");
    }

    setVisibility(state){

        $("#jdtb_calendar_container_div_" + this.uniqueId).css("display",state);

    }





    appendEventDiv() { // APPEND INDICATION ABOUT BOOKING SUBMISSION ( DATE DIV / DURATION DIV )

        if (this.selectMode === 'SINGLE') { // ADD A SINGLE DAY DATE / DATE TIME
            let hour = $("#calendarDiv_TimeDiv_hour").val();
            let minute = $("#calendarDiv_TimeDiv_minute").val();

            alert('rr');

            this.appendDateDiv(new Date(this.currentYear, this.currentMonth, this.currentSelectedCellId, hour, minute));
        }

    }

    // DATE DIV :  a div indicating a booked date. ( SINGLE )
    appendDateDiv(date) {

        alert("append date div function is useless !");

        let calendarDivSelector = $("#calendarDiv_" + this.uniqueId);
        let dateDiv = new TB_TimeMarker(date);
        this.dateMarkers.push(dateDiv);
        let removeDateButton = '<button class="" onclick="TB_DateDiv_RemoveDateDiv(' + this.uniqueId + ',' + dateDiv.uniqueId + ')" >X</button>';
        let toLocaleDate = date.toLocaleDateString(this.language, this.localDateOptions);
        calendarDivSelector.append("<div id='calendarDateDiv_" + dateDiv.uniqueId + "' class=''><p onclick='TB_DurationDiv_SelectDurationDiv(" + this.uniqueId + "," + dateDiv.uniqueId + ")' class='jtdb_calendarDurationDiv'>" + toLocaleDate + " </p>" + removeDateButton + "</div>");
    }


    removeDateDiv(dateDivId) {

        alert("remove date div function is useless !");

        for (let i = 0; i < this.dateMarkers.length; i++) {
            if (parseInt(this.dateMarkers[i].uniqueId) === parseInt(dateDivId)) {
                this.dateMarkers.slice(i);
                $("#calendarDateDiv_" + dateDivId).remove();
            }
        }
    }

    appendTimeMarker() {

        
        if (this.appendTimeMarkerCallback) {
            setTimeout(this.appendTimeMarkerCallback(this, this.currentYear, this.currentMonth, this.currentSelectedCellId), 1); // 1 ms later
        }

        $("#jdtb_calendar_right_header_startDateText_" + this.uniqueId).text("");
        $("#jdtb_calendar_right_header_endDateText_" + this.uniqueId).text("");

        if (this.selectMode === 'DURATION' && this.selectState % 2 === 1) return;

        
        let previousDate = new Date(this.currentSelectedYear, this.currentSelectedMonth, this.currentSelectedCellId);
        let currentDate = new Date(this.currentYear, this.currentMonth, this.currentSelectedCellEndId);

        this.appendDurationTimeMarker(previousDate, currentDate);

        let startingCellId = this.currentSelectedCellId;

        // SUBMIT SELECTED PERIOD
        if(this.selectMode === 'SINGLE'){
            let prevMonthCellSelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + startingCellId);
            prevMonthCellSelector.attr("class", this.calendarSubmittedCellClass);
        }

        if (this.selectMode === 'DURATION') {

            let startId = 1;
            let endId = 1;
            // CHECK IF ITS A SINGLE MONTH DURATION
            if (this.currentSelectedMonth == this.currentSelectedEndMonth && this.currentSelectedYear == this.currentSelectedEndYear) {
                startId = this.currentSelectedCellId;
                endId = parseInt(this.currentSelectedCellEndId);
            } else {

                if (this.currentMonth == this.currentSelectedEndMonth) {
                    startId = 1;
                    endId = this.currentSelectedCellEndId;
                }

                if (this.currentMonth == this.currentSelectedMonth) {
                    startId = this.currentSelectedCellId;
                    endId = TB_TimeAttributes.daysInMonth(this.currentSelectedMonth + 1, this.currentSelectedYear);
                }
            }
            
            if (this.selectableDaysInMonth) {

                for (let i = startId; i <= endId; i++) {
                    if (this.selectableDaysInMonth.includes(i)) {
                        let submittedCellSelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + i);
                        submittedCellSelector.attr("class", this.calendarSubmittedCellClass);
                    }
                }

            } else {

                for (let i = startId; i <= endId; i++) {
                    let prevMonthCellSelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + i);
                    prevMonthCellSelector.attr("class", this.calendarSubmittedCellClass);
                }
            }
        }

        this.currentSelectedCellId = null;
        this.currentSelectedMonth = null;
        this.currentSelectedYear = null;
        this.currentSelectedCellEndId = null;
        this.currentSelectedEndMonth = null;
        this.currentSelectedEndYear = null;

    }


    emptyTimeMarkers(){

        for(let i = 0; i < this.dateMarkers.length; i++){

            $("#calendarCell_CURRENT_" + this.uniqueId + "_" + this.dateMarkers[i].dateA.getDate()).attr("class",this.calendarBookableCellClass);

            

            let newDurationDivContainerSelector = $("#jdtb_calendar_rightSection_timeMarker_container_" + this.dateMarkers[i].uniqueId + "");
            newDurationDivContainerSelector.remove();

            this.dateMarkers.splice(i);
            this.highlighSubmittedDays();

            

        }

        for (let i = 0; i < this.durationMarkers.length; i++) {

            let newDurationDivContainerSelector = $("#jdtb_calendar_rightSection_timeMarker_container_" + this.durationMarkers[i].uniqueId + "");
            newDurationDivContainerSelector.remove();

            if(this.selectableDaysInMonth){

                for(let j = 1; j <= TB_TimeAttributes.daysInMonth(this.currentMonth + 1 , this.currentYear) ; j++){
                    if(this.selectableDaysInMonth.includes(j)){
                        $("#calendarCell_CURRENT_" + this.uniqueId + "_" + j).attr("class",this.calendarBookableCellClass);
                    }
                }    

            }else{

                for(let j = 1; j <= TB_TimeAttributes.daysInMonth(this.currentMonth + 1 , this.currentYear) ; j++){  
                    $("#calendarCell_CURRENT_" + this.uniqueId + "_" + j).attr("class",this.calendarBookableCellClass);
                }
            }

            this.durationMarkers.splice(i);
            this.highlighSubmittedDays();
                
            
           
        }


    }

    removeTimeMarker(timeMarkerId) {

        let indexToSplice = -1;

        for(let i = 0; i < this.dateMarkers.length; i++){

            if(parseInt(this.dateMarkers[i].uniqueId) === parseInt(timeMarkerId)){
                $("#calendarCell_CURRENT_" + this.uniqueId + "_" + this.dateMarkers[i].dateA.getDate()).attr("class",this.calendarBookableCellClass);

                this.dateMarkers.splice(i,1);
                this.highlighSubmittedDays();

                let newDurationDivContainerSelector = $("#jdtb_calendar_rightSection_timeMarker_container_" + timeMarkerId + "");
                newDurationDivContainerSelector.remove();

                indexToSplice = i;

            }

        }

        for (let i = 0; i < this.durationMarkers.length; i++) {

            if (parseInt(this.durationMarkers[i].uniqueId) === parseInt(timeMarkerId)) {
                
                if(this.selectableDaysInMonth){


                    for(let j = 1; j <= TB_TimeAttributes.daysInMonth(this.currentMonth + 1 , this.currentYear) ; j++){
                        if(this.selectableDaysInMonth.includes(j)){
                            $("#calendarCell_CURRENT_" + this.uniqueId + "_" + j).attr("class",this.calendarBookableCellClass);
                        }
                    }    

                }else{

                    for(let j = 1; j <= TB_TimeAttributes.daysInMonth(this.currentMonth + 1 , this.currentYear) ; j++){  
                        $("#calendarCell_CURRENT_" + this.uniqueId + "_" + j).attr("class",this.calendarBookableCellClass);
                    }
                }

                this.durationMarkers.splice(i,1);
                this.highlighSubmittedDays();
                
                let newDurationDivContainerSelector = $("#jdtb_calendar_rightSection_timeMarker_container_" + timeMarkerId + "");
                newDurationDivContainerSelector.remove();

                indexToSplice = i;

                //alert("ee");


                
            }

        }



        let saveCellSelector = "#calendarCell_CURRENT_" + this.uniqueId + "_" + this.currentSelectedCellId;
        $(saveCellSelector).attr("class", this.calendarSelectedCellClass); //JUST SAVE SELECTED START WHEN REMOVE IF NECESSARY


        if (this.removeTimeMarkerCallback) {
            setTimeout(this.removeTimeMarkerCallback(this, this.currentYear, this.currentMonth, this.currentSelectedCellId,indexToSplice), 1); // 1 ms later
        }
         


    }

    removeLastDurationMarker(){

        let last = this.durationMarkers.length -1;

        let timeMarkerId = this.durationMarkers[last].uniqueId;
        this.durationMarkers.splice(last,1);


        let newDurationDivContainerSelector = $("#jdtb_calendar_rightSection_timeMarker_container_" + timeMarkerId + "");
        newDurationDivContainerSelector.remove();

        if(this.selectableDaysInMonth){


            for(let j = 1; j <= TB_TimeAttributes.daysInMonth(this.currentMonth + 1 , this.currentYear) ; j++){
                if(this.selectableDaysInMonth.includes(j)){
                    $("#calendarCell_CURRENT_" + this.uniqueId + "_" + j).attr("class",this.calendarBookableCellClass);
                }
            }    

        }else{

            for(let j = 1; j <= TB_TimeAttributes.daysInMonth(this.currentMonth + 1 , this.currentYear) ; j++){  
                $("#calendarCell_CURRENT_" + this.uniqueId + "_" + j).attr("class",this.calendarBookableCellClass);
            }
        }

        this.highlighSubmittedDays();

    }



    // DURATION DIV : a div indicating a day period. ( DURATION )
    appendDurationTimeMarker(durationStart, durationEnd) {

        let startToLocaleDate = durationStart.toLocaleDateString(this.language, this.localDateOptions);
        let endToLocaleDate = durationEnd.toLocaleDateString(this.language, this.localDateOptions);

        let durationDiv = new TB_TimeMarker(durationStart, durationEnd);
        let dateDiv = new TB_TimeMarker(durationStart);

        let timeMakerUniqueId = -1;

        if(this.selectMode === 'SINGLE'){
            //durationDiv = new TB_TimeMarker(durationStart);
            this.dateMarkers.push(dateDiv);
            timeMakerUniqueId = dateDiv.uniqueId;
        } 

        if(this.selectMode === 'DURATION'){
            this.durationMarkers.push(durationDiv);
            timeMakerUniqueId = durationDiv.uniqueId;
        }

        let timeMarkersContainer = $("#jdtb_calendar_rightSection_mid_timeMarkersContainer_" + this.uniqueId);

        //let durationDiv = new TB_TimeMarker(durationStart, durationEnd);
        let newDurationDivContainer = "<div class='jdtb_calendar_rightSection_durationDiv_container' id='jdtb_calendar_rightSection_timeMarker_container_" + timeMakerUniqueId + "' ></div>";

        let newDurationDivTextContainer = "<div id='jdtb_calendar_rightSection_durationDiv_text_" + timeMakerUniqueId + "' class='jdtb_calendar_rightSection_durationDiv_text'>";
        
        if(this.selectMode === 'DURATION'){
            newDurationDivTextContainer += "<span>";
            newDurationDivTextContainer += startToLocaleDate;
            newDurationDivTextContainer += "->";
            newDurationDivTextContainer += endToLocaleDate;
            newDurationDivTextContainer += "</span>";
            newDurationDivTextContainer += "</div>";
        }

        if(this.selectMode === 'SINGLE'){
            newDurationDivTextContainer += "<span>";
            newDurationDivTextContainer += startToLocaleDate;
            newDurationDivTextContainer += "</span>";
            newDurationDivTextContainer += "</div>";
        }

        let newDurationDivRemoveContainer = '<div id="jdtb_calendar_rightSection_durationDiv_iconContainer_' + timeMakerUniqueId + '" class="jdtb_calendar_rightSection_durationDiv_iconContainer">';
        newDurationDivRemoveContainer += "<img class='jdtb_calendar_rightSection_durationDiv_removeIcon' onclick='TB_TimeMarker_RemoveTimeMarker(" + this.uniqueId + "," + timeMakerUniqueId + ")' />";
        newDurationDivRemoveContainer += "</div>";

        timeMarkersContainer.append(newDurationDivContainer);

        let newDurationDivContainerSelector = $("#jdtb_calendar_rightSection_timeMarker_container_" + timeMakerUniqueId + "");

        newDurationDivContainerSelector.append(newDurationDivTextContainer);
        newDurationDivContainerSelector.append(newDurationDivRemoveContainer);

    }


    isAlreadySubmittedDay(year, month, date) {

        let indexDays = [];

        for (let i = 0; i < this.dateMarkers.length; i++) {
            let cdm = this.dateMarkers[i];
            if (cdm.dateA.getDate() === date && cdm.dateA.getMonth() === month && cdm.dateA.getDate() === date) return true;
        }

        for (let i = 0; i < this.durationMarkers.length; i++) {

            let cdm = this.durationMarkers[i];

            if (cdm.dateA.getDate() <= date && cdm.dateA.getMonth() <= month && cdm.dateA.getFullYear() <= year &&
                cdm.dateB.getDate() >= date && cdm.dateB.getMonth() >= month && cdm.dateB.getFullYear() >= year) {
                return true; // NOT WORKING WITH PERIOD OVER SEVERAL MONTHS
            }
        }

        return false;
    }

    checkIfAlreadySubmittedDatesInsidePeriod(dateA, dateB) {

        for (let i = 0; i < this.dateMarkers.length; i++) {
            let cdm = dateMarkers[i];
            if (cdm.dateA.getDate() === dateA.getDate() && cdm.dateA.getMonth() === dateA.getMonth() && cdm.dateA.getFullYear() === dateA.getFullYear()) return true;
            if (cdm.dateB.getDate() === dateB.getDate() && cdm.dateB.getMonth() === dateB.getMonth() && cdm.dateB.getFullYear() === dateB.getFullYear()) return true;
        }

        for (let i = 0; i < this.durationMarkers.length; i++) {
            let cdm = this.durationMarkers[i];
            if (cdm.dateA.getTime() >= dateA.getTime() && cdm.dateA.getTime() <= dateB.getTime()) return true;
        }

        return false;
    }

    // when selection is done, display info about this selection
    updateInfoCalendar(selector, text) {
        selector.html(text);
    }

    //check
    updateBookableDays(bookableDays, avoidInitLoop) {

        this.selectableDaysInMonth = bookableDays;
        if (!avoidInitLoop) this.init(this.language);

        if (!bookableDays) {
            this.setAllDaysSelectable();
        } else {
            this.highlightSelectableDays(bookableDays);

            if(this.currentSelectedCellId){
                // ON VERIFIE JUSQUOU ON A LA CONTINUITE ACTUELLE, puisquon a this.periodBookableReachEndOfMonth
                for(let i = 1 ; i < TB_TimeAttributes.daysInMonth(this.currentMonth+1,this.currentYear); i++){
                    if(this.periodBookableReachEndOfMonth ){
                        if(bookableDays.includes(i)){
                            this.periodBookableContinuityEnd = i;
                        }else{
                            this.periodBookableReachEndOfMonth = false;     
                        } 
                    }
                }
            }

        }

    }

    highlightSelectableDays(array, selectableCellClass) {

        for (let i = 0; i < array.length; i++) {
            let cellSelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + array[i]);
            if (selectableCellClass) {
                cellSelector.attr("class", selectableCellClass);
            } else {
                cellSelector.attr("class", this.calendarBookableCellClass);
            }
        }

    }

    selectDays(array) {

        for (let i = 0; i < array.length; i++) {
            let cellSelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + array[i]);
            cellSelector.attr("class", this.calendarSelectedCellClass);
        }

    }

    setAllDaysSelectable(selectableCellClass) {

        let daysInMonth = TB_TimeAttributes.daysInMonth(this.currentMonth - 1, this.currentYear)

        for (let i = 1; i <= (daysInMonth + 1); i++) {

            let cellSelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + i);
            if (selectableCellClass) {
                cellSelector.attr("class", selectableCellClass);
            } else {
                cellSelector.attr("class", this.calendarBookableCellClass);
                //console.log("eee " + this.calendarBookableCellClass);
            }
        }

    }

    // Days labels header : Sunday, monday, etc...
    buildCalendarDays() {

        let headRowId = "#jdtb_calendar_calendar_table_" + this.uniqueId + "_headRow";

        if ($(headRowId)) $(headRowId).remove();
        
        let tableLabels = "<tr id='jdtb_calendar_calendar_table_" + this.uniqueId + "_headRow'>";

        for (let i = 0; i < 7; i++) {
            tableLabels += "<th>" + TB_TimeAttributes.getShortDayAttribute(this.language, i) + "</th>";
        }

        tableLabels += "</tr>";
        $("#jdtb_calendar_calendar_table_" + this.uniqueId).append(tableLabels);
    }

    setCalendarTitle(currentYear) {

        let prevYear = currentYear;
        let nextYear = currentYear;
        let prevMonth = this.currentMonth - 1;
        if (prevMonth < 0) {
            prevMonth += 12;
            prevYear--;
        }
        let nextMonth = this.currentMonth + 1;
        if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
        }

        //let prevmonth = "<a onclick='this.prevCalendarMonth("+prevYear+","+prevMonth+")'>←</a>";
        let prevmonth = "<a style='cursor:pointer' onclick='TB_GetCalendar_ChangeMonth(\"PREV\"," + this.uniqueId + "," + prevYear + "," + prevMonth + ")'>←</a>";

        //let nextmonth = "<a onclick='this.nextCalendarMonth("+nextYear+","+nextMonth+")'>→</a>";
        let nextmonth = "<a style='cursor:pointer' onclick='TB_GetCalendar_ChangeMonth(\"NEXT\"," + this.uniqueId + "," + nextYear + "," + nextMonth + ")'>→</a>";

        let monthStr = TB_TimeAttributes.getMonthAttribute(this.language, this.currentMonth);

        // firstDay with us date ( begins with sunday ) is 1. firstDay with fr date ( begins with monday ) is 0. !
        $("#jdtb_calendar_monthTitle_text_" + this.uniqueId).empty();
        $("#jdtb_calendar_monthTitle_text_" + this.uniqueId).append('<span id="jdtb_calendar_monthTitle_textP_' + this.uniqueId + '" class="jdtb_calendar_monthTitle_textP"></span>');
        $("#jdtb_calendar_monthTitle_textP_" + this.uniqueId).html(monthStr + " " + currentYear);
        $("#jdtb_calendar_leftIcon_" + this.uniqueId).attr("onclick", "TB_GetCalendar_ChangeMonth('PREV'," + this.uniqueId + "," + prevYear + "," + prevMonth + ")");
        $("#jdtb_calendar_rightIcon_" + this.uniqueId).attr("onclick", "TB_GetCalendar_ChangeMonth('NEXT'," + this.uniqueId + "," + nextYear + "," + nextMonth + ")");


    }

    prevMonth(_year, _month) {
        this.changeMonthEvent(_year, _month);
    }

    nextMonth(_year, _month) {
        this.changeMonthEvent(_year, _month);
    }

    changeMonthEvent(_year, _month) {

        this.selectableDaysInMonth = null; // RESET selectableDaysInMonth ( = BOOKABLE DAYS ) ARRAY

        this.setCurrentYearAndMonth(_year, _month);
        this.setCalendarTitle(_year);

        if (!this.changeMonthCallback) { // IF WE DONT GET A CALLBACK, CALL init() HERE.
            this.init(this.language);
            this.setAllDaysSelectable(); // WE DONT GET BOOKABLE DAYS AS ARGUMENT SO WE DEFINED ALL MONTH DAYS AS SELECTABLE CELLS
        } else { // OTHERWISE WE CALL UPDATE BOOKABLE DAYS WHICH CALL init()
            setTimeout(this.changeMonthCallback(this, this.currentYear, this.currentMonth), 1); // 1 ms later
        }

        if(this.selectMode === 'SINGLE' && this.currentSelectedCellId ){
            if(this.currentSelectedMonth == _month && this.currentSelectedYear == _year)this.selectDays([this.currentSelectedCellId]);
        }


        this.highlighSubmittedDays();


        if (this.selectMode != 'DURATION') return;

        let currentSelectedBeginningDate = new Date(this.currentSelectedYear, this.currentSelectedMonth, this.currentSelectedCellId);

        //let currentSelectedEndingDate = new Date(parseInt(this.currentSelectedEndYear),parseInt(this.currentSelectedEndMonth),parseInt(this.currentSelectedEndCellId));
        let currentSelectedEndingDate = new Date(parseInt(this.currentSelectedEndYear), parseInt(this.currentSelectedEndMonth), parseInt(this.currentSelectedCellEndId));
        let currentMonthDate = new Date(this.currentYear, this.currentMonth);

        
        // 
        if (!this.currentSelectedEndMonth) {

            if (this.currentMonth === this.currentSelectedMonth && this.currentYear === this.currentSelectedYear) {
                this.selectDays([this.currentSelectedCellId]);
            }

        }

        let durationOverMonths = false;

        
        if(this.currentSelectedMonth != this.currentSelectedEndMonth || this.currentSelectedYear != this.currentSelectedEndYear){
            durationOverMonths = true;
            
        }


        

        if (this.currentSelectedMonth != null && this.currentSelectedEndMonth != null) {

           

            // on est sur un mois intermediraire
            if (_month > this.currentSelectedMonth && _month < this.currentSelectedEndMonth) {

                alert("on est sur un mois intermediaire");

                if (this.selectableDaysInMonth) {

                    this.selectDays(this.selectableDaysInMonth);
                } else {
                    this.selectDays(this.getPeriodIntermediatePart(currentMonthDate));
                }

            }


            if(durationOverMonths){
              
                // SELECTION DES JOURS SELECTIONNABLE DU DEBUT DE LA DUREE JUSQUAU DERNIER JOUR SELECTIONNABLE DU MEME MOIS
                if (_month === this.currentSelectedMonth ) { // on est sur le mois de depart

                    console.log(this.currentSelectedCellEndId);
                    
                    if(!this.currentSelectedCellEndId){
                        

                        this.selectDays([this.currentSelectedCellId]);


                    }else{
                        this.selectDays(this.getPeriodBeginningLastPart(currentSelectedBeginningDate));

                    }

                    
                    return;
                }
                // SELECTION DES JOURS SELECTIONNABLE DU PREMIER JOUR JUSQUAU DERNIER JOUR DE LA DUREE
                if (_month === this.currentSelectedEndMonth) {
                    
                    this.selectDays(this.getPeriodEndFirstPart(currentSelectedEndingDate));
                    return;
                }

            }else{
                
               
                if(this.currentMonth == this.currentSelectedMonth){
                    for(let i = this.currentSelectedCellId; i <= this.currentSelectedCellEndId;i++){
                    
                        $("#calendarCell_CURRENT_"+this.uniqueId+"_"+i).attr("class",this.calendarSelectedCellClass);
                    }
                }
                

            }

            

        }






    }

    highlighSubmittedDays() {

        let indexDays = [];

        let daysInCurrentMonth = TB_TimeAttributes.daysInMonth(this.currentMonth + 1, this.currentYear);


      
        for (let j = 1; j <= daysInCurrentMonth; j++) {

            let testDate = new Date(this.currentYear, this.currentMonth, j);
            let date = testDate.getDate();
            let month = testDate.getMonth();
            let year = testDate.getFullYear();

            for (let i = 0; i < this.dateMarkers.length; i++) {
                let cdm = this.dateMarkers[i];

                
                if (cdm.dateA.getDate() === date && cdm.dateA.getMonth() === month && cdm.dateA.getDate() === date) {
                    // highlight
                    let cellDaySelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + j);
                    cellDaySelector.attr("class", this.calendarSubmittedCellClass);
                }
            }

            for (let i = 0; i < this.durationMarkers.length; i++) {

                let cdm = this.durationMarkers[i]; // CURRENT DATE MARKER

                let startDate = cdm.dateA;
                let endDate = cdm.dateB;

              
                if (startDate.getTime() <= testDate.getTime() && testDate.getTime() <= endDate.getTime()) {
                    //return true; // NOT WORKING WITH PERIOD OVER SEVERAL MONTHS
                    let cellDaySelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + j);
                    cellDaySelector.attr("class", this.calendarSubmittedCellClass);
                }
            }

        }

    }

    getPeriodEndFirstPart(dateStart) {
        if (this.selectableDaysInMonth) return this.getFirstFromSelectableDays(dateStart.getDate());
        let days = [];

        for (let i = 1; i <= dateStart.getDate(); i++) {
            days.push(i);
        }
        return days;
    }

    getPeriodBeginningLastPart(dateStart) {
        if (this.selectableDaysInMonth) return this.getLastPartFromSelectableDays(dateStart.getDate());
        let daysInStartMonth = TB_TimeAttributes.daysInMonth(dateStart.getMonth() - 1, dateStart.getFullYear());
        let days = [];

        for (let i = dateStart.getDate(); i <= daysInStartMonth; i++) {
            days.push(i);
        }

        return days;
    }

    getPeriodIntermediatePart(dateStart) {
        let daysInStartMonth = TB_TimeAttributes.daysInMonth(dateStart.getMonth() - 1, dateStart.getFullYear());
        let days = [];

        for (let i = 1; i <= daysInStartMonth; i++) {
            days.push(i);
        }
        return days;
    }

    getLastPartFromSelectableDays(startDuration) { // GET PERIOD BEGINNING LAST PART, WITH selectableDaysInMonth
        let part = [];

        for (let i = 0; i < this.selectableDaysInMonth.length; i++) {
            if (this.selectableDaysInMonth[i] >= startDuration) part.push(this.selectableDaysInMonth[i]);
        }

        return part;
    }

    getFirstFromSelectableDays(endDuration) { // GET PERIOD END FIRST PART, WITH selectableDaysInMonth
        let part = [];

        for (let i = 0; i < this.selectableDaysInMonth.length; i++) {
            if (this.selectableDaysInMonth[i] <= endDuration) part.push(this.selectableDaysInMonth[i]);
        }

        return part;
    }

    selectDayCell(arg, cellId) {

        this.enableCalendarTimeDiv();

        let currentDate = new Date(this.currentYear, this.currentMonth, cellId);
        let toLocaleDate = currentDate.toLocaleDateString(this.language, this.localDateOptions);


        
        if (this.isAlreadySubmittedDay(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) && !this.repickSameDate) {
            // ITS ALREADY A SUBMITTED DAY.
            return;
        }

        /*
        if (this.selectDateCallback) {
            setTimeout(this.selectDateCallback(this, this.currentYear, this.currentMonth, this.currentSelectedCellId), 1); // 1 ms later
        }
        */

        if (this.selectMode === 'SINGLE') {

            // PUT THIS IN THE RIGHT SECTION, MAYBE BETTER IN A SPECIFIC FUNCTION
            $("#jdtb_calendar_right_header_startDateText_" + this.uniqueId).text(toLocaleDate);

            if (this.currentSelectedCellId && this.currentSelectedCellArg) { // REMOVE PREVIOUS SELECTION
                let previousSelectedSelector = '#calendarCell_' + this.currentSelectedCellArg + '_' + this.uniqueId + '_' + this.currentSelectedCellId;
                $(previousSelectedSelector).attr("class", this.calendarBookableCellClass);
            }

            let cellSelector = '#calendarCell_' + arg + '_' + this.uniqueId + '_' + cellId;
            $(cellSelector).attr("class", this.calendarSelectedCellClass);

            this.currentSelectedCellId = cellId;
            this.currentSelectedCellArg = arg;

            this.currentSelectedMonth = this.currentMonth;
            this.currentSelectedYear = this.currentYear;

        }

        if (this.selectMode === 'DURATION') {

            if (this.selectState % 2 === 0) { // DURATION SELECTION FIRST STEP -> Select beginning of duration

                $("#jdtb_calendar_right_header_startDateText_" + this.uniqueId).text(toLocaleDate);
                $("#jdtb_calendar_right_header_endDateText_" + this.uniqueId).text("");

                // save start duration month and year
                this.currentSelectedMonth = this.currentMonth;
                this.currentSelectedYear = this.currentYear;

                if (this.currentSelectedCellEndId) { // REMOVE THE PREVIOUS SELECTION                 

                    if (this.selectableDaysInMonth) {

                        for (let i = parseInt(this.currentSelectedCellId); i <= parseInt(this.currentSelectedCellEndId); i++) {
                            if (this.selectableDaysInMonth.includes(i)) {
                                let prevMonthCellSelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + i);
                                prevMonthCellSelector.attr("class", this.calendarBookableCellClass);
                            }
                        }

                    } else {

                        // IF ITS NOT AN ALREADY SUBMITED DAY 
                        for (let i = parseInt(this.currentSelectedCellId); i <= parseInt(this.currentSelectedCellEndId); i++) {
                            if (!this.isAlreadySubmittedDay(this.currentSelectedYear, this.currentSelectedMonth, i)) {
                                let prevMonthCellSelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + i);
                                prevMonthCellSelector.attr("class", this.calendarBookableCellClass);
                            }
                        }

                    }

                    this.updateInfoCalendar($("#" + this.calendarEndDurationTextInfoId), "");
                }

                // SELECT START OF DURATION
                this.currentSelectedCellId = cellId;
                this.currentSelectedCellArg = arg;

                if(this.selectableDaysInMonth){

                    this.periodBookableReachEndOfMonth = true;
                    this.periodBookableGetContinuity = true;

                    //CHECK IF SELECTED PERIOD REACH END OF MONTH, IN ORDER TO CHECK PERIOD CONTINUITY                    
                    if(!this.selectableDaysInMonth.includes(TB_TimeAttributes.daysInMonth(this.currentMonth+1,this.currentYear))) this.periodBookableReachEndOfMonth = true; 

                    for(let i = this.currentSelectedCellId; i <= TB_TimeAttributes.daysInMonth(this.currentSelectedMonth + 1,this.currentSelectedYear); i++){
        
                        if(!this.selectableDaysInMonth.includes(i)){
                            this.periodBookableReachEndOfMonth = false;
                            this.periodBookableGetContinuity = false; // NO CONTINUITY THROUGH NEXT MONTH
                        }

                    }

                    if(this.periodBookableReachEndOfMonth) this.periodBookableContinuityEnd = TB_TimeAttributes.daysInMonth(this.currentSelectedMonth + 1,this.currentSelectedYear);
                }

                let cellSelector = '#calendarCell_' + arg + '_' + this.uniqueId + '_' + cellId;
                $(cellSelector).attr("class", this.calendarSelectedCellClass);

            } else { // DURATION SELECTION SECOND STEP -> Select end of duration

                this.currentSelectedEndMonth = this.currentMonth;
                this.currentSelectedEndYear = this.currentYear;

                this.currentSelectedCellEndId = cellId;
                this.currentSelectedCellEndArg = arg;

                let startDate = new Date(parseInt(this.currentSelectedYear), parseInt(this.currentSelectedMonth), parseInt(this.currentSelectedCellId));
                let endDate = new Date(parseInt(this.currentSelectedEndYear), parseInt(this.currentSelectedEndMonth), parseInt(this.currentSelectedCellEndId));

                if (this.checkIfAlreadySubmittedDatesInsidePeriod(startDate, endDate)) {
                    alert("An already booked period is contained in this query");
                    return;
                }


                if(this.currentSelectedMonth == this.currentSelectedEndMonth && this.currentSelectedYear == this.currentSelectedEndYear && this.currentSelectedCellId == this.currentSelectedCellEndId){
                    
                    $("#calendarCell_CURRENT_"+this.uniqueId+"_"+this.currentSelectedCellId).attr("class",this.calendarBookableCellClass);
                    this.currentSelectedCellId = null;
                    this.selectState = 0;
                    $("#jdtb_calendar_right_header_startDateText_"+this.uniqueId).text("");
                    return;
                }

                // DURATION CALCULATION
                let durationStartArg = this.currentSelectedCellArg;
                let durationEndArg = arg;

                // SELECT LAST DAYS OF PREV MONTH IF THEY ARE :
                let sameMonth = true;

                let endDurationBeforeStartDuration = false;

                if (this.currentSelectedMonth !== this.currentSelectedEndMonth) sameMonth = false;
                if (this.currentSelectedYear !== this.currentSelectedEndYear) sameMonth = false;

                if (this.currentSelectedYear > this.currentSelectedEndYear) endDurationBeforeStartDuration = true;
                if (this.currentSelectedMonth > this.currentSelectedEndMonth && this.currentSelectedYear === this.currentSelectedEndYear) endDurationBeforeStartDuration = true;
                if (this.currentSelectedCellId > this.currentSelectedCellEndId && this.currentSelectedMonth === this.currentSelectedEndMonth && this.currentSelectedYear === this.currentSelectedEndYear) endDurationBeforeStartDuration = true;

                if (endDurationBeforeStartDuration) {
                    //alert("The end of your duration is happening before the beginning of your duration");
                    alert(TB_TimeAttributes.getCalendarErrorMessage(this.language,"endDurationBeforeStartDuration"));

                    return;
                }

                let startingCellId = this.currentSelectedCellId;

                if (!sameMonth) startingCellId = 0;

                if (this.selectableDaysInMonth) {

                    let durationStartCell = startingCellId;
                    let durationEndCell = startingCellId;

                    let bookablePeriod = [];

                    let startingDayId = parseInt(startingCellId);

                    let periodOverDifferentsMonths = false;

                    // si on est pas sur le meme mois/annee entre le debut et la fin 
                    if (parseInt(this.currentSelectedMonth) != parseInt(this.currentSelectedEndMonth) || parseInt(this.currentSelectedYear) != parseInt(this.currentSelectedEndYear)) {

                        periodOverDifferentsMonths = true;

                        //alert(this.currentSelectedMonth + " " + this.currentSelectedEndMonth);
                        let nbDaysInPreviousMonth = TB_TimeAttributes.daysInMonth(this.currentSelectedMonth + 1, this.currentSelectedYear);
                        let gap = this.currentSelectedCellId - nbDaysInPreviousMonth;

                        let startMonth = this.currentSelectedMonth;
                        let monthGap = parseInt(this.currentSelectedEndMonth) - parseInt(this.currentSelectedMonth);

                        let yearGap = parseInt(this.currentSelectedEndYear) - parseInt(this.currentSelectedYear);

                        let dayOffset = 0;

                        let _currentMonthDelta = monthGap;
                        let _offsetCurrentMonth = this.currentSelectedMonth; // DO MIX UP ME WITH this.currentMonth plz

                        for (let i = 0; i < yearGap; i++) {
                            monthGap += 12;
                        }

                        for (let i = 0; i < monthGap; i++) {
                            _currentMonthDelta--;
                            let nbDaysInMonth = TB_TimeAttributes.daysInMonth(_offsetCurrentMonth + 1, this.currentSelectedYear);

                            if (i == 0) { // IF ITS THE FIRST MONTH, CALCULATE THE DELTA WITH NEXT MONTH DAY
                                dayOffset += (this.currentSelectedCellId - TB_TimeAttributes.daysInMonth(this.currentSelectedMonth + 1, this.currentSelectedYear));
                            } else {
                                // its not actually the previous month , SUBSTRACT daysInMonth in THE OFFSET
                                dayOffset -= TB_TimeAttributes.daysInMonth(_offsetCurrentMonth + 1, this.currentSelectedYear);
                            }

                            _offsetCurrentMonth++;
                            if (_offsetCurrentMonth == 12) _offsetCurrentMonth -= 12; // HAPPY NEW YEAR !

                        }

                        startingDayId = dayOffset;

                    }

                    let periodGap = parseInt(this.currentSelectedCellEndId) - (startingDayId);
                    let nbDaysInPeriod = periodGap + 1;

                    if (this.minimalPeriodDuration) {
                        if (nbDaysInPeriod < this.minimalPeriodDuration) {
                            //alert("You must select a period containing at least " + this.minimalPeriodDuration + " days.");
                            alert(TB_TimeAttributes.getCalendarErrorMessage(this.language,"durationIsTooShort", " Select at least " + this.minimalPeriodDuration + " days"));

                            this.currentSelectedCellEndId = null;
                            return;
                        }
                    }

                    if (this.maximalPeriodDuration) {
                        if (nbDaysInPeriod > this.maximalPeriodDuration) {
                            //alert("You must select a period containing less than " + (this.maximalPeriodDuration + 1) + " days.");
                            alert(TB_TimeAttributes.getCalendarErrorMessage(this.language,"durationIsTooLong", " Select less than " + this.maximalPeriodDuration + " days"));

                            this.currentSelectedCellEndId = null;
                            return;
                        }
                    }

                    if(!this.periodBookableReachEndOfMonth && periodOverDifferentsMonths){                        
                        if(this.currentSelectedCellEndId > this.periodBookableContinuityEnd || !this.periodBookableGetContinuity){
                            //alert("Your period is not continuous ! " );
                            alert(TB_TimeAttributes.getCalendarErrorMessage(this.language,"nonContinuousPeriod"));
                            this.currentSelectedCellEndId = null;
                            return;    
                        }                        
                    }
                   
                    let _startId = parseInt(startingCellId);
                    //alert(_startId);
                    if(!periodOverDifferentsMonths){
                        for (let i = _startId; i <= parseInt(this.currentSelectedCellEndId); i++) {           
                        
                            if(!this.selectableDaysInMonth.includes(i)){
                                //alert("Your period is not continuous . ");
                                alert(TB_TimeAttributes.getCalendarErrorMessage(this.language,"nonContinuousPeriod"));
                                this.currentSelectedCellEndId = null;
                                return;
                            }
                        }
                    }         
                    

                    for (let i = _startId; i <= parseInt(this.currentSelectedCellEndId); i++) {
                        let prevMonthCellSelector = $("#calendarCell_CURRENT_" + this.uniqueId + "_" + i);
                        prevMonthCellSelector.attr("class", this.calendarSelectedCellClass);
                    }

                } else {

                    let startingDayId = parseInt(startingCellId);

                    // si on est pas sur le meme mois/annee entre le debut et la fin 
                    if (parseInt(this.currentSelectedMonth) != parseInt(this.currentSelectedEndMonth) || parseInt(this.currentSelectedYear) != parseInt(this.currentSelectedEndYear)) {

                        //alert(this.currentSelectedMonth + " " + this.currentSelectedEndMonth);
                        let nbDaysInPreviousMonth = TB_TimeAttributes.daysInMonth(this.currentSelectedMonth + 1, this.currentSelectedYear);
                        let gap = this.currentSelectedCellId - nbDaysInPreviousMonth;
        
                        let startMonth = this.currentSelectedMonth;
                        let monthGap = parseInt(this.currentSelectedEndMonth) - parseInt(this.currentSelectedMonth);
                        let yearGap = parseInt(this.currentSelectedEndYear) - parseInt(this.currentSelectedYear);

                        let dayOffset = 0;

                        let _currentMonthDelta = monthGap;
                        let _offsetCurrentMonth = this.currentSelectedMonth; // DO MIX UP ME WITH this.currentMonth plz

                        for (let i = 0; i < yearGap; i++) {
                            monthGap += 12;
                        }

                        for (let i = 0; i < monthGap; i++) {
                            _currentMonthDelta--;
                            let nbDaysInMonth = TB_TimeAttributes.daysInMonth(_offsetCurrentMonth + 1, this.currentSelectedYear);

                            if (i == 0) { // IF ITS THE FIRST MONTH, CALCULATE THE DELTA WITH NEXT MONTH DAY
                                dayOffset += (this.currentSelectedCellId - TB_TimeAttributes.daysInMonth(this.currentSelectedMonth + 1, this.currentSelectedYear));
                            } else {    
                                // its not actually the previous month , SUBSTRACT daysInMonth in THE OFFSET
                                dayOffset -= TB_TimeAttributes.daysInMonth(_offsetCurrentMonth + 1, this.currentSelectedYear);
                            }

                            _offsetCurrentMonth++;
                            if (_offsetCurrentMonth == 12) _offsetCurrentMonth -= 12; // HAPPY NEW YEAR !

                        }

                        startingDayId = dayOffset;

                    }

                    let periodGap = parseInt(this.currentSelectedCellEndId) - (startingDayId);
                    let nbDaysInPeriod = periodGap + 1;

                    // RECLIQUER SUR LA DATE DE DEBUT POUR L'ANNULER
                    if (this.currentSelectedCellId === this.currentSelectedCellEndId && this.currentSelectedMonth === this.currentSelectedEndMonth
                        && this.currentSelectedYear === this.currentSelectedEndYear) {
                        
                        $("#calendarCell_CURRENT_" + this.uniqueId + "_" + this.currentSelectedCellId).attr("class", this.calendarBookableCellClass);

                        this.currentSelectedCellId = null;
                        this.currentSelectedCellEndId = null;
                        this.currentSelectedMonth = null;
                        this.currentSelectedEndMonth = null;
                        this.currentSelectedYear = null;
                        this.currentSelectedEndYear = null;

                        $("#jdtb_calendar_right_header_startDateText_" + this.uniqueId).text("");

                        this.selectState = 0;

                        return;
                    }

                    if (this.minimalPeriodDuration) {
                        if (nbDaysInPeriod < this.minimalPeriodDuration) {
                            //alert("You must select a period containing at least " + this.minimalPeriodDuration + " days.");
                            alert(TB_TimeAttributes.getCalendarErrorMessage(this.language,"durationIsTooShort", " Select at least " + this.minimalPeriodDuration + " days")); // ADDED

                            this.currentSelectedCellEndId = null;

                            return;
                        }
                    }

                    if (this.maximalPeriodDuration) {
                        if (nbDaysInPeriod > this.maximalPeriodDuration) {
                            alert(TB_TimeAttributes.getCalendarErrorMessage(this.language,"durationIsTooLong", " Select less than " + this.maximalPeriodDuration + " days")); // ADDED

                            this.currentSelectedCellEndId = null;

                            return;
                        }
                    }

                    for (let i = parseInt(startingCellId); i <= parseInt(this.currentSelectedCellEndId); i++) {
                        $("#calendarCell_CURRENT_" + this.uniqueId + "_" + i).attr("class", this.calendarSelectedCellClass);
                    }

                }

                let toLocaleDateDuration = currentDate.toLocaleDateString(this.language, this.localDateOptions);
                $("#jdtb_calendar_right_header_endDateText_" + this.uniqueId).text(toLocaleDateDuration);

            }

        }

        this.selectState++;

        if (this.selectDateCallback) {
            setTimeout(this.selectDateCallback(this, this.currentYear, this.currentMonth, this.currentSelectedCellId), 1); // 1 ms later
        }


    }

    checkPeriodConinuity(bookableDaysInMonths){

        // fonction appelée au moment ou on change de mois. 
        // on regarde si la continuité existe entre le mois de debut et tous les mois qui suivent.
        // si on a plus de un mois de difference, on verifie sur les mois intermediaires que tous les jours du mois intermediaire sont bookable.
        let _Month = this.currentSelectedMonth;
        let _Year = this.currentSelectedYear;

        let transitionnalMonthContinuous = 0;

        for(let i = 0; i < bookableDaysInMonths.length ; i++){

            let bdim = bookableDaysInMonths[i];

            _Month++;
            if(_Month>=12){
                _Month-=12;
                _Year++;
            }

            // si c'est un mois intermediaire
            if(i !== bookableDaysInMonths.length -1){

                if(bdim.length != TB_TimeAttributes.daysInMonth(_Month+1,_Year)){
                    // Pas continu
                    this.periodBookableGetContinuity = false;
                    
                }else{
                    transitionnalMonthContinuous++;
                }
            }

        }

        if(transitionnalMonthContinuous == bookableDaysInMonths.length -1){
            // continu
            this.periodBookableGetContinuity = true;
        }

    }

    // AJOUT DES CASES DANS LE CALENDRIER
    appendDaysNumberInCalendar() {

        let firstDayOffset = TB_TimeAttributes.getFirstDayOffset(this.language);
        let firstDay = new Date(this.currentYear, this.currentMonth, firstDayOffset).getDay();
        let numberOfLines = (7 - firstDay); // USE NUMBER OF LINES TO CHECK IF WE ADD NEXT MONTH WEEK LAST LINE
        let firstWeekDaysRemaining = 7 - firstDay; // 7 - 4 = 3
        let daysRemaining = TB_TimeAttributes.daysInMonth(this.currentMonth - 1, this.currentYear) - firstWeekDaysRemaining;
        let numbersOfWeekLines = 1 + Math.ceil(daysRemaining / 7); // ET ON A RAJOUTERA TOUJOURS UNE LIGNE POUR LES JOURS DU MOIS SUIVANT
        let dayMonth = 1;
        let start = false;
        let dayPrevMonth = -1;
        let dayNextMonth = 1;
        let firstWeekDaysPreceding = firstDay; // HOW MANY DAYS ARE PRECEEDING IN THE PREVIOUS MONTH ?
        let numbersOfDaysInLastMonth = -1;

        if (this.currentMonth > 0) {
            numbersOfDaysInLastMonth = TB_TimeAttributes.daysInMonth(this.currentMonth, this.currentYear); // month + 1
            this.prevMonthLastDayNumber = numbersOfDaysInLastMonth;
        } else {
            numbersOfDaysInLastMonth = TB_TimeAttributes.daysInMonth(12, this.currentYear - 1); // January to previous year's December
            this.prevMonthLastDayNumber = numbersOfDaysInLastMonth;
        }

        // dayPrevMonth is the starting day from the previous month
        dayPrevMonth = numbersOfDaysInLastMonth - (firstWeekDaysPreceding - 1);// 31 - (4+1) // 31 - 3 // 28

        for (let i = 0; i < numbersOfWeekLines; i++) {

            let currentTableRow = "<tr>";

            for (let j = 0; j < 7; j++) {
                if (i === 0 && j === firstDay) {
                    start = true;
                }

                if (!start) {
                    //let previousMonthCellFunction = "TB_CalendarCell_Selected('PREV','" + dayPrevMonth+ "')";
                    currentTableRow += "<td id='calendarCell_PREV_" + dayPrevMonth + "' class='x' ><em>" + dayPrevMonth + "</em></td>";
                    dayPrevMonth++;
                } else {

                    if (dayMonth < (TB_TimeAttributes.daysInMonth(this.currentMonth + 1, this.currentYear) + 1)) {

                        // IF WE DEFINED SELECTABLE DAYS FOR THIS MONTH , DEFINE ONLY APPROPRIATE DAYS AS SELECTABLE
                        if (this.selectableDaysInMonth) { // WE SHOULD CREATE constrainedSelectableDaysInMonth, to keep
                            // really selectables days, including min and max period duration constrains , for duration selectMode
                            if (this.selectableDaysInMonth.includes(dayMonth)) {
                                currentTableRow += "<td id='calendarCell_CURRENT_" + this.uniqueId + "_" + dayMonth + "' class='x' onclick='TB_CalendarCell_Selected(" + this.uniqueId + ",\"CURRENT\"," + dayMonth + ")'><b>" + dayMonth + "</b></td>";
                            } else {
                                currentTableRow += "<td id='calendarCell_CURRENT_" + this.uniqueId + "_" + dayMonth + "' class='x' ><b>" + dayMonth + "</b></td>";
                            }
                        } else {
                            // OTHERWISE , DEFINE ALL DAYS AS SELECTABLE
                            currentTableRow += "<td id='calendarCell_CURRENT_" + this.uniqueId + "_" + dayMonth + "' class='x' onclick='TB_CalendarCell_Selected(" + this.uniqueId + ",\"CURRENT\"," + dayMonth + ")'><b>" + dayMonth + "</b></td>";
                        }

                        dayMonth++;

                    } else {
                        // NEXT MONTH DAYS SHOULD NOT BE SELECTABLE
                        currentTableRow += "<td id='calendarCell_NEXT_" + dayNextMonth + "' class='x' ><em>" + dayNextMonth + "</em></td>";
                        dayNextMonth++;
                    }
                }
            }

            currentTableRow += "</tr>";
            $("#jdtb_calendar_calendar_table_" + this.uniqueId).append(currentTableRow);

        }

        let currentTableRow = "<tr>";

        // ADD LAST LINE FOR NEXT MONTH
        for (let i = 0; i < 7; i++) {

            //currentTableRow += "<td id='calendarCell_NEXT_" + dayNextMonth + "' class='x' onclick='TB_CalendarCell_Selected(" + this.uniqueId + ",\"NEXT\"," + dayNextMonth + ")' ><em>"+dayNextMonth+"</em></td>";
            currentTableRow += "<td id='calendarCell_NEXT_" + dayNextMonth + "' class='x' ><em>" + dayNextMonth + "</em></td>";
            dayNextMonth++;
        }

        currentTableRow += "</tr>";
        $("#" + this.calendarNodeId).append(currentTableRow);

    }


}

class TB_TimeMarker {

    constructor(dateA, dateB) {

        this.uniqueId = TB_Hasher.basicHash(4);
        this.dateA = dateA;
        this.dateB = dateB;

        

    }




}

let calendars = [];

function TB_PushCalendar(calendar) {
    calendars.push(calendar);
}

function TB_GetCalendar_ChangeMonth(arg, uniqueId, year, month) {

    for (let i = 0; i < calendars.length; i++) {
        if (parseInt(calendars[i].uniqueId) === parseInt(uniqueId)) {
            if (arg === 'NEXT') {
                calendars[i].nextMonth(year, month);
            }
            if (arg === 'PREV') {
                calendars[i].prevMonth(year, month);
            }
        }
    }

}

function TB_CalendarCell_Selected(uniqueId, arg, cellId) {

    for (let i = 0; i < calendars.length; i++) {
        if (parseInt(calendars[i].uniqueId) === parseInt(uniqueId)) calendars[i].selectDayCell(arg, cellId);
    }

}

function TB_CalendarAppendButton(uniqueId) {

    // on valide pour ajouter, que ca soit une date unique pour plusieurs dates uniques, ou pour une duree pour de la multi duree
    for (let i = 0; i < calendars.length; i++) {
        if (parseInt(calendars[i].uniqueId) === parseInt(uniqueId)) calendars[i].appendEventDiv();
    }

}

// Time Marker
function TB_TimeMarker_RemoveTimeMarker(calendarId, timeMarkerId) {

    for (let i = 0; i < calendars.length; i++) {
        if (parseInt(calendars[i].uniqueId) === parseInt(calendarId)) calendars[i].removeTimeMarker(timeMarkerId);
    }

}

function TB_TimeElement_constrainTime(element, max) {

    if ($(element).val() > max) {
        $(element).val(max);
    }

    if ($(element).val() < 0) {
        $(element).val(0);
    }
}

function TB_AppendTimeMarker(calendarId) {

    for (let i = 0; i < calendars.length; i++) {
        if (parseInt(calendars[i].uniqueId) === parseInt(calendarId)) calendars[i].appendTimeMarker();
    }

}