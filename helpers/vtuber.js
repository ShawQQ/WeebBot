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
        console.log(now);
        var hour = parseInt(now.substr(0, 2)) * 60 + parseInt(now.substr(3, 5));
        var found = [];
        for(let i = 0; i < schedule.length; i++){
            //schedule hour
            var scheduleHour = parseInt(schedule[i][0].substr(0, 2)) * 60 + parseInt(schedule[i][0].substr(3, 5));
            if((hour - scheduleHour) >= 0 && (hour - scheduleHour) <= (timeout / (60 * 1000))){
                if(!(schedule[i][1] in VTUBER_LIST)){
                    console.warn("Vtuber non trovata");
                    continue;
                }
                await youtube.search.list({
                    "part": [
                        "snippet"
                    ],
                    "eventType": "live",
                    "maxResults": 1,
                    "q": VTUBER_LIST[schedule[i][1]],
                    "type": [
                        "video"
                    ]
                }).then(response => {
                    console.log("Vtuber trovata:"+VTUBER_LIST[schedule[i][1]]);
                    if(response.data.items.length == 0) return;
                    var videoId = response.data.items[0].id.videoId;
                    if(videoId == "nHRKoNOQ56w" || videoId == "vbrj8fgvfrg") return;
                    var url = `https://youtube.com/watch?v=${videoId}`;
                    found.push(`${VTUBER_LIST[schedule[i][1]]} è in live!\n${url}`);
                    return;
                }, err => {
                    console.log("Errore nell'esecuzione:"+err);
                }).catch(error => {
                    console.error(error);
                });
            }
        }

        return found;
    }
}

module.exports = {
    Vtuber: Vtuber
}