// ==UserScript==
// @name         Auto N/A
// @namespace    https://github.com/bartholdbos/livechat
// @version      0.4
// @description  Automatic Non Accepting on end of shift
// @author       Barthold Bos
// @match        https://my.livechatinc.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://raw.githubusercontent.com/mozilla-comm/ical.js/master/build/ical.min.js
// @downloadURL  https://raw.githubusercontent.com/bartholdbos/livechat/master/livechat.user.js
// ==/UserScript==

$(window).load(function(){
    var ical = GM_getValue("ical", null);
    if(ical === null){
        ical = prompt("Enter ICAL link");
        GM_setValue("ical", ical);
        start(ical);
    }else{
        start(ical);
    }
});

function start(ical){
    var link = ical.split("://")[1].split("/");
    link.shift();
    $.get("https://xss.bos.cloud/" + link.join("/"), parse);
    $("#menu ul").append('<li><a id="autona">Auto NA</a></li>');
}

function parse(data, textStatus, jqXHR ){
    var calendar = ICAL.parse(data);
    var calendarcomp = new ICAL.Component(calendar);
    var events = calendarcomp.getAllSubcomponents('vevent');
    var shift1 = ICAL.Time.fromData(events[0].getFirstPropertyValue("dtend"));
    var shift2 = ICAL.Time.fromData(events[1].getFirstPropertyValue("dtend"));
    if(shift1.dayOfYear() == shift2.dayOfYear()){
        autona(shift2);
    }else{
        autona(shift1);
    }
}

function autona(prop){
    var time = new Date((prop.toUnixTime()- 600)*1000);
    var now = new Date();
    var timetillNA = time - now;
    if(timetillNA >= 0){
        setTimeout(function(){$("#status-not-accepting").click(); $("#autona").text("einde shift");}, timetillNA);
        $("#autona").text("na om: " + time.getHours() + ":" + time.getMinutes());
    }else{
        $("#autona").text("einde shift");
    }
}