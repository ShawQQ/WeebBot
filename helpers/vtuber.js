var {google} = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YT_TOKEN
});
const VTUBER_LIST = require('../utils/vtuber.json');
const moment = require("moment-timezone");

class Vtuber{
    constructor(){}

    async init(schedule, timeout){
        //current hour
        var now = moment().utc().format('HH:mm');
        var hour = parseInt(now.substr(0, 2)) * 60 + parseInt(now.substr(3, 5));
        var vtubers = [];
        console.log(now);
        console.log(schedule);
        for(let i = 0; i < schedule.length; i++){
            //schedule hour
            var scheduleHour = parseInt(schedule[i][0].substr(0, 2)) * 60 + parseInt(schedule[i][0].substr(3, 5));
            if((hour - scheduleHour) >= 0 && (hour - scheduleHour) <= (timeout / (60 * 1000))){
                if(!(schedule[i][1] in VTUBER_LIST)){
                    console.warn("Vtuber non trovata "+VTUBER_LIST[schedule[i][1]]);
                    continue;
                }

                vtubers.push(VTUBER_LIST[schedule[i][1]]);
            }
        }

        var found = [];
        var retry = 2;
        while(retry != 0){
            for(var search of vtubers){
                await youtube.search.list({
                    "part": [
                        "snippet"
                    ],
                    "eventType": "live",
                    "maxResults": 1,
                    "q": search,
                    "type": [
                        "video"
                    ]
                }).then(response => {
                    if(response.data.items.length == 0) return;
                    var videoId = response.data.items[0].id.videoId;
                    //TODO:Evitare livestram delle chiese
                    if(videoId == "nHRKoNOQ56w" || videoId == "vbrj8fgvfrg" || videoId == "EooOWujmgbg") return;
                    var url = `https://youtube.com/watch?v=${videoId}`;
                    var name = search.split(" ");
                    found.push(`${name[0]} è in live!\n${url}`);
                    //remove from array
                    vtubers.splice(vtubers.indexOf(search), 1);
                    return;
                }, err => {
                    console.log("Errore nell'esecuzione:"+err);
                }).catch(error => {
                    console.error(error);
                });
            }
            
            if(vtubers.length == 0) break;
            retry--;
            //wait 15s before retry
            await new Promise(r => setTimeout(r, 15000));
        }
        return found;
    }
}

module.exports = {
    Vtuber: Vtuber
}