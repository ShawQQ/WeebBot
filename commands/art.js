module.exports = {
    name: 'art',
    description: 'The Kubric Stare',
    cooldown: 0,
    execute(message){
        var fs = require("fs");
        const path = require("path")
        var text = fs.readFileSync(path.resolve(__dirname,'./various/kubrick.txt'), "utf-8");
        message.channel.send(text, {
            files: [
                path.resolve(__dirname,"./various/art.png")
            ]
        });
    }
}