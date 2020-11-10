const config = require('./config.json');
const Discord = require('discord.js');
var {google} = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YT_TOKEN
});
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
    }else{
        console.error("Commando non trovato");
    }
});

client.login(process.env.DS_TOKEN);
