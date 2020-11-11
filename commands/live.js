module.exports = {
    name: 'live',
    description: 'Check if a specific vtuber is livestreaming and retrieve it',
    cooldown: 5,
    async execute(message, args){
        if(!args[0] in vtuber) return message.channel.send("Pog per la dislessia");

        await youtube.search.list({
            "part": [
                "snippet"
            ],
            "eventType": "live",
            "maxResults": 1,
            "q": vtuber[args[0]],
            "type": [
                "video"
            ]
        }).then(response => {
            if(response.data.items.length == 0){
                return message.channel.send("Nessuna live in corso");
            }
            var sendMsg = '';
            var videoId = response.data.items[0].id.videoId;
            var url = `https://youtube.com/watch?v=${videoId}`;
            //TODO: controllare che coco non tiri fuori live a caso
            if(videoId == "nHRKoNOQ56w" || videoId == "vbrj8fgvfrg"){
                return message.channel.send("Nessuna live in corso")
            }
            if(message.author.id == config.monsterWeeb){
                sendMsg = `<@${config.danielito}> PogPogPogPogPog <@${config.danielito}>\n`;
            }
            sendMsg += url;
            return message.channel.send(sendMsg);
        }, err => {
            console.log("Errore nell'esecuzione:"+err);
        }).catch(error => {
            return message.channel.send("Richiesta non riuscita");
        });
    }
}