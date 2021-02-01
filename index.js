const config = require('./config.json');
const Discord = require('discord.js');
const fs = require('fs');
const { Scraper } = require('./helpers/scraper');
const { Vtuber } = require('./helpers/vtuber');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    let timeout = 10 * 60 * 1000;
    sendLive(timeout);
});

client.login(process.env.DS_TOKEN);

async function sendLive(timeout) {
    setInterval(async () => {
        let scraper = new Scraper();
        await scraper.init().then(async () => {
            let vtuber = new Vtuber();
            await vtuber.init(scraper.formatedSchedule, timeout)
                .then(async (result) => {
                    if (result.length != 0) {
                        let mess = '';
                        for (var message of result) {
                            mess += message + "\n";
                            console.log("Message:" + message);
                        }
                        let channels = config.channels;
                        for(const [key, channel] of Object.entries(channels)){
                            let current = client.channels.cache.get(channel.id);
                            if(!current) continue;
                            current.send(mess)
                                .then(msg => {
                                    for(emoji of channel.emojis){
                                        msg.react(emoji).catch(e => {
                                            console.log("Errore nell'invio dell'emoji:" + e);
                                        });
                                    }
                                });
                        }
                        
                    }else{
                        console.log("Nessuna live trovata, riprovo tra:" + timeout);
                    }
                    return;
                })
                .catch(e => {
                    console.log(e);
                });
            return;
        });
    }, timeout)
}

//command handler
const cooldowns = new Discord.Collection();

client.on('message', message => {
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;
    if(message.author.id != "451423628974751765") return;
    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const commandName = args.shift().toLocaleLowerCase();
    //check if user is dyslexic
    if(!client.commands.has(commandName)){
        return message.channel.send("Pog?");
    }

    const command = client.commands.get(commandName);
    //check if arg is supplied
    if(command.args && !args.length){
        return message.channel.send("Pog?");
    }
    //avoid spam 
    if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if(timestamps.has(message.author.id)){
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expirationTime){
            return message.reply("Non spammare diocristo");
        }
    }
    //save the timestamp of the last time the user used the command
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    //execute command
    try{
        command.execute(message, args);
    }catch(error){
        console.error(error);
    }
});
