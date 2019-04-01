module.exports = {
    name: 'adopt',
    description: 'Adopte une loutre !',
    aliases: [],
    usage: '[nom de la loutre]',
    cooldown: 5,
    execute(msg, args, server) {
        if(msg.author.tag in server.loutres){
            msg.react('❌');
            return msg.reply('Tu as déjà une loutre !');
        }

        console.log(args);
        if(args.length > 0){
            const name = args.join(' ');
            server.loutres[msg.author.tag] = {
                'name': name,
                'food': 10,
                'hapiness': 10
            };

            server.saveLoutres();

            msg.react('👍');
            msg.reply('**'+name+'** rejoint le parc à loutres ! :heart_eyes: ');
        }
    },
};