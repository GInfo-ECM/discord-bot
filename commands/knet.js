const request = require('request');

module.exports = {
    name: 'knet',
    description: 'Ajoute une canette sur knet.',
    aliases: [],
    usage: '[nom d\'utilisateur]',
    cooldown: 5,
    execute(msg, args, server) {
        console.log(args);
        let username = args[0].toLowerCase();
        request.post(server.knet_url, {form: {
                'apikey': server.knet_key,
                'username': username,
                'knet': 1
            }}, function(error, response, body){
            console.log(body);
            data = JSON.parse(body);
            if(data['ok']){
                msg.reply('C\'est bon ! Ton nouveau solde est de **'+(data['solde']/100)+'**, et il reste **'+data['stock']+'** canettes au local. ');
            }else{
                msg.reply('Echec ! ('+data['msg']+')');
            }
            //msg.channel.send(body);
        });
    },
};




