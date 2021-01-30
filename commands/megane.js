module.exports = {
    name: 'megane',
    description: 'Fubuki is ma friendo',
    cooldown: 0,
    execute(message, args){
        var fs = require("fs");
        const path = require("path")
        var text = fs.readFileSync(path.resolve(__dirname, './various/megane.txt'), "utf-8");
        message.channel.send(text);
    }
}