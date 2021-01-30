module.exports = {
    name: 'art',
    description: 'The Kubric Stare',
    cooldown: 0,
    execute(message){
        var fs = require("fs");
        var text = fs.readFileSync('./various/kubrick.txt', "utf-8");
        message.channel.send(text, {
            files: [
                "./art.png"
            ]
        });
    }
}