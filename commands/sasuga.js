module.exports = {
    name: 'sasuga',
    description: 'SASUGA MAEDA SENPAI SASUGA MAEDA SENPAI',
    cooldown: 0,
    execute(message, args){
        var fs = require("fs");
        var text = fs.readFileSync('./maedasensei.txt', "utf-8");
        message.channel.send(text, {
            files: [
                "./maeda.png"
            ]
        });
    }
}