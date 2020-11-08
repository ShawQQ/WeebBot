const config = require('./config.json');
const Discord = require('discord.js');
var {google} = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: config.yt_token
})
const vtuber = require('./vtuber.json');
const client = new Discord.Client();

client.once('ready', () => {
    const channel = client.channels.cache.get(config.channel_id);
    if(!channel) return console.error("Canale non trovato");
    console.log("Bot online");
});

client.on('message', async message => {
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const command = args.shift().toLocaleLowerCase();
    if(command === 'live'){
        if(!args.length){
            return message.channel.send("Nope");
        }
        if(args[0] in vtuber){
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
                var videoId = response.data.items[0].id.videoId;
                var url = `https://youtube.com/watch?v=${videoId}`;
                //TODO: controllare che coco non tiri fuori live a caso
                if(videoId == "nHRKoNOQ56w" || videoId == "vbrj8fgvfrg"){
                    return message.channel.send("Nessuna live in corso")
                }
                return message.channel.send(url);
            }, err => {
                console.log("Errore nell'esecuzione:"+err);
            }).catch(error => {
                return message.channel.send("Richiesta rifiutata da big G per il seguente motivo: "+error);
            });
        }
    }else{
        console.error("Commando non trovato");
    }
});

client.login(config.ds_token);