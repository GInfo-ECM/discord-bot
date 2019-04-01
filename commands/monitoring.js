const Discord = require('discord.js');

module.exports = {
    name: 'monitoring',
    description: 'Affichage de l\'état des serveurs.',
    aliases: [],
    usage: '',
    cooldown: 5,
    execute(msg, args, server) {
        msg.channel.startTyping();
        msg.channel.send(new Discord.Attachment(server.grafana_url, 'grafana.png')).then(function(){
            msg.channel.stopTyping();
        })
    },
};

