const jsdom = require("jsdom");
const moment = require("moment-timezone");
const { JSDOM } = jsdom;
const translation = require('../utils/translation.json');

class Scraper{
    constructor(){
        this.today = moment().tz("Asia/Tokyo").format('MM/DD');
        this.tomorrow = moment().tz("Asia/Tokyo").add(1, "days").format('MM/DD');
    }
    async init(){
        return JSDOM.fromURL("https://schedule.hololive.tv/simple").then((dom) => {
            let isToday = false;
            let simpleSchedule = [];
            for(var row of dom.window.document.querySelectorAll("div.container")){
                if(row.textContent.replace(/\s/g, "").match(/\d?\d\/\d?\d/g) == this.today){
                    isToday = true;
                }
                if(row.textContent.replace(/\s/g, "").match(/\d?\d\/\d?\d/g) == this.tomorrow){
                    isToday = false;
                    break;
                }
                if(!isToday) continue;
                simpleSchedule.push(row.textContent.replace(/ +?/g, "").split("\n"));
            }
            simpleSchedule = [].concat.apply([], simpleSchedule);
            this.formatedSchedule = formatSchedule(simpleSchedule);
        }).catch(e => {
            console.error(e);
        });
    }
}

//the plural of regex is regrets
function formatSchedule(simpleSchedule){
    schedule = [];
    //remove emoji from schedule by matching kanjis, names and timeslot
    schedule = simpleSchedule.filter((el) => {
        return el.match(/(\d\d:\d\d|[a-zA-Z]+|[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B)/)
    });
    for(let i = 0; i < schedule.length; i++){
        value = schedule[i];
        if(i % 2 == 0 && value in translation){
            schedule[i] = translation[value];
        }else if(value.match(/\d\d:\d\d/)){
            //convert timeslot from JST to UTC
            var jpDate = moment.tz([moment().year(), moment().month(), moment().date(), value.substr(0, 2), value.substr(3, 5)], "Asia/Tokyo");
            // var utcDate = jpDate.clone().tz("Europe/Rome");
            schedule[i] = jpDate.utc().format('HH:mm');
        }else{
            if(schedule[i - 1] !== null){
                schedule[i - 1] = undefined;
            }
            schedule[i] = undefined;
        }
    }
    //remove every undefined item(in general not defined vtubers)
    schedule = schedule.filter(function (el) {
        return el != undefined;
    });
    let newSchedule = [];
    let k = 0;
    //format the schedule in a multidimensional array of the form [hour : vtuber]
    for(let j = 0; j < Math.floor(schedule.length / 2); j++){
        if(newSchedule[j] == undefined) newSchedule[j] = [];
        newSchedule[j][0] = schedule[k++];
        newSchedule[j][1] = schedule[k++]
    }
    newSchedule.sort((a,b) => {
        //convert hh:mm to int
        let firstSlot = parseInt(a[0].substr(0,2)) * 60 + parseInt(a[0].substr(3,5));
        let secondSlot = parseInt(b[0].substr(0,2)) * 60 + parseInt(b[0].substr(3,5));
        return firstSlot - secondSlot;
    })
    return newSchedule;
}

module.exports = {
    Scraper: Scraper
}
