module.exports = {
    name: 'copypasta',
    description: 'USW',
    cooldown: 0,
    execute(message, args){
        const arg = args.shift().toLocaleLowerCase();
        const pastaList = require('../utils/pasta.json');
        let pasta = '';
        if(arg == 'list'){
            for(name in pastaList){
                pasta += name + "\n";
            }
        }else{
            if(!arg in pastaList) return;
            pasta = pastaList[arg];
        }

        message.channel.send(pasta);
    }
}