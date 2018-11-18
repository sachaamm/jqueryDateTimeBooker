class TB_TimeAttributes{

    static timeAttributes() {

        return {

            "en-US": {
                months: "January_February_March_April_May_June_July_August_September_October_November_December",
                days: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday",
                firstDayOffset: 1, // Calendar begins Sunday
                dayCalendarLabels: "AM_PM",
                singleDayLabel: "Day selected : ",
                startDurationLabel: "Period beginning : ",
                endDurationLabel: "Period ending : ",
                hoursLabels: "00(AM)_01(AM)_02(AM)_03(AM)_04(AM)_05(AM)_06(AM)_07(AM)_08(AM)_09(AM)_10(AM)_11(AM)_12_13(PM)_14(PM)_15(PM)_16(PM)_17(PM)_18(PM)_19(PM)_20(PM)_21(PM)_22(PM)_23(PM)"

            },

            "fr-FR": {
                months: "Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre",
                days: "Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi_Dimanche",
                firstDayOffset: 0, // Calendar begins Monday (Lundi)
                dayCalendarLabels: "Matin_Après-Midi",
                singleDayLabel: "Jour selectionné : ",
                startDurationLabel: "Début de la période : ",
                endDurationLabel: "Fin de la période : ",
                hoursLabels: "00h_01h_02h_03h_04h_05h_06h_07h_08h_09h_10h_11h_12h_13h_14h_15h_16h_17h_18h_19h_20h_21h_22h_23h"
            }

        }

    }

    static getDayAttribute(language,index) {

        if(!this.checkLanguageExists(language))return false;

        let days = this.timeAttributes()[language]["days"];

        let explode = days.split("_");

        if(explode.length !== 7){
            console.error("Process aborted with language " + language + " because days key doesnt contains 7 elements." );
            return false;
        }

        return explode[index];


    }


    static getMonthAttribute(language,index){

        if(!this.checkLanguageExists(language))return false;

        let months = this.timeAttributes()[language]["months"];

        let explode = months.split("_");

        if(explode.length !== 12){
            console.error("Process aborted with language " + language + " because months key doesnt contains 12 elements." );
            return false;
        }

        return explode[index];

    }

    static getDayCalendarLabelAttribute(language,index) {

        if(!this.checkLanguageExists(language))return false;

        let dayCalendarLabels = this.timeAttributes()[language]["dayCalendarLabels"];

        let explode = dayCalendarLabels.split("_");

        if(explode.length !== 2){
            console.error("Process aborted with language " + language + " because dayCalendarLabels key doesnt contains 2 elements." );
            return false;
        }

        return explode[index];


    }

    static getFirstDayOffset(language){

        if(!this.checkLanguageExists(language))return false;

        return this.timeAttributes()[language]["firstDayOffset"];


    }

    static getStartDurationLabel(language){

        if(!this.checkLanguageExists(language))return false;

        return this.timeAttributes()[language]["startDurationLabel"];

    }

    static getEndDurationLabel(language){

        if(!this.checkLanguageExists(language))return false;

        return this.timeAttributes()[language]["endDurationLabel"];

    }

    static checkLanguageExists(language){

        if(!(language in this.timeAttributes())){
            console.error("Process aborted with language " + language + " because the key is not contained in time Attributes." );
            return false;
        }

        return true;
    }

    static getHourLabel(language,index){

        if(!this.checkLanguageExists(language))return false;

        let hoursLabels = this.timeAttributes()[language]["hoursLabels"];
        let explodeHoursLabels = hoursLabels.split("_");

        return explodeHoursLabels[index];

    }


    static daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }



}















let timeAttributes = {

    en_us : {
        months : "January_February_March_April_May_June_July_August_September_October_November_December",
        days : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday",
        firstDayOffset: 1, // Calendar begins Sunday
        dayCalendarLabels: "AM_PM"
    },

    fr_fr : {
        months : "Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre",
        days : "Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi_Dimanche",
        firstDayOffset:  0, // Calendar begins Monday (Lundi)
        dayCalendarLabels: "Matin_Après-Midi"

    }


};

function getMonthAttribute(language,index){

    if(!checkLanguageExists())return false;

    let months = timeAttributes[language]["months"];

    let explode = months.split("_");

    if(explode.length !== 12){
        console.error("Process aborted with language " + language + " because months key doesnt contains 12 elements." );
        return false;
    }

    return explode[index];

}

function getDayAttribute(language,index) {

    if(!checkLanguageExists())return false;

    let days = timeAttributes[language]["days"];

    let explode = days.split("_");

    if(explode.length !== 7){
        console.error("Process aborted with language " + language + " because days key doesnt contains 7 elements." );
        return false;
    }

    return explode[index];


}

function getDayCalendarLabelAttribute(language,index) {

    if(!checkLanguageExists())return false;

    let dayCalendarLabels = timeAttributes[language]["dayCalendarLabels"];

    let explode = dayCalendarLabels.split("_");

    if(explode.length !== 2){
        console.error("Process aborted with language " + language + " because dayCalendarLabels key doesnt contains 2 elements." );
        return false;
    }

    return explode[index];


}

function getFirstDayOffset(language){

    if(!checkLanguageExists())return false;

    return timeAttributes[language]["firstDayOffset"];


}


function checkLanguageExists(){

    if(!(language in timeAttributes)){
        console.error("Process aborted with language " + language + " because the key is not contained in time Attributes." );
        return false;
    }

    return true;
}