module.exports = {
    name: 'hug',
    description: 'Fais un câlin à ta loutre !',
    aliases: [],
    usage: '',
    cooldown: 5,
    execute(msg, args, server) {
        if(!(msg.author.tag in server.loutres)){
            msg.react('❌')
            return msg.reply('Tu n\'as pas encore de loutre, tu peux en adopter une avec la commande **!adopt [Nom de la loutre]** !');
        }

        if(server.loutres[msg.author.tag].hapiness > 10 && Math.random() > 0.5){
            msg.reply(server.loutres[msg.author.tag].name+' ne veut plus de câlins !');
            msg.react('😪');
            return;
        }
        server.loutres[msg.author.tag].hapiness += 1;
        server.saveLoutres();

        let hugs = ['(づ｡◕‿‿◕｡)づ', '(づ￣ ³￣)づ', '༼ つ ̥◕͙_̙◕͖ ͓༽つ', '༼ つ ͡ ͡° ͜ ʖ ͡ ͡° ༽つ', 'ʕっ•ᴥ•ʔっ'];

        msg.reply(hugs[Math.floor(Math.random() * hugs.length)]+' '+server.loutres[msg.author.tag].name);
        msg.reply('Ta loutre est maintenant toute contente !');
        msg.react('😍')
    },
};