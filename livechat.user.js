// ==UserScript==
// @name         Auto N/A
// @namespace    https://github.com/bartholdbos/livechat
// @version      0.2
// @description  Automatic Non Accepting on end of shift
// @author       Barthold Bos
// @match        https://my.livechatinc.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/mozilla-comm/ical.js/master/build/ical.min.js
// @downloadURL  https://raw.githubusercontent.com/bartholdbos/livechat/master/livechat.user.js
// ==/UserScript==

$(window).load(function(){
    $.get("https://xss.bos.cloud/", parse);
    $("#menu ul").append('<li><a id="autona">Auto NA</a></li>');
});

function parse(data, textStatus, jqXHR ){
    var calendar = ICAL.parse(data);
    var calendarcomp = new ICAL.Component(calendar);
    var event = calendarcomp.getAllSubcomponents('vevent');
    var property = event[2].getFirstPropertyValue("dtend");
    autona(property);
}

function autona(property){
    var time = new Date(ICAL.Time.fromData(property).toUnixTime()*1000);
    var now = new Date();
    var timetillNA = time - now;
    if(timetillNA >= 0){
        setTimeout(function(){$("#status-not-accepting").click(); $("#autona").text("einde shift");}, timetillNA);
        $("#autona").text("na om: " + time.getHours() + ":" + time.getMinutes());
    }else{
        $("#autona").text("einde shift");
    }
}