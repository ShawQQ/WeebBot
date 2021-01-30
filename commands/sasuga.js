module.exports = {
    name: 'sasuga',
    description: 'SASUGA MAEDA SENPAI SASUGA MAEDA SENPAI',
    cooldown: 0,
    execute(message, args){
        var fs = require("fs");
        const path = require("path")
        var text = fs.readFileSync(path.resolve(__dirname, './various/maedasensei.txt'), "utf-8");
        message.channel.send(text, {
            files: [
                path.resolve(__dirname, "./various/maeda.png")
            ]
        });
    }
}