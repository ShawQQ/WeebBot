const config = require('./config.json');
const Discord = require('discord.js');
const fs = require('fs');
const { setIntervalAsync } = require('set-interval-async/fixed')
const { Scraper } = require('./helpers/scraper');
const { Vtuber } = require('./helpers/vtuber');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    const channel = client.channels.cache.get(config.channel_id);
    if(!channel) return console.error("Canale non trovato");
    let timeout = 15 * 1000;
    setTimeout(sendLive, timeout);
});


//command handler
//TODO: implements other commands
// const cooldowns = new Discord.Collection();
// 
// client.on('message', message => {
//     if(!message.content.startsWith(prefix) || message.author.bot) return;

//     const args = message.content.slice(config.prefix.length).trim().split(' ');
//     const commandName = args.shift().toLocaleLowerCase();
//     //check if user is dyslexic
//     if(!client.commands.has(commandName)){
//         return message.channel.send("Pog?");
//     }

//     const command = client.commands.get(commandName);
//     //check if arg is supplied
//     if(command.args && !args.length){
//         return message.channel.send("Pog?");
//     }
//     //avoid spam 
//     if(!cooldowns.has(command.name)){
//         cooldowns.set(command.name, new Discord.Collection());
//     }
//     const now = Date.now();
//     const timestamps = cooldowns.get(command.name);
//     const cooldownAMount = (command.cooldown || 3) * 1000;
//     if(timestamps.has(message.author.id)){
//         const expirationTime = timestamps.get(message.author.id) + cooldownAMount;

//         if(now < expirationTime){
//             return message.reply("Non spammare diocristo");
//         }
//     }
//     //save the timestamp of the last time the user used the command
//     timestamps.set(message.author.id, now);
//     setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

//     //execute command
//     try{
//         command.execute(message, args);
//     }catch(error){
//         console.error(error);
//     }
// });


client.login(process.env.DS_TOKEN);

async function sendLive(){
    var scraper = new Scraper();
    await scraper.init().then(async () => {
        var vtuber = new Vtuber();
        await vtuber.init(scraper.formatedSchedule).then((result) => {
            timeout = result.diff;
            if(result.found.length != 0){
                var mess = '';
                for(var message of result.found){
                    mess += message + "\n";
                }
                return channel.send(mess);
            }
            console.log("Nessuna live trovata, riprovo tra:"+timeout);
            return;
        });
    return;
    });
    setTimeout(sendLive, timeout);
}