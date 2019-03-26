const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const jimp = require('jimp');
const request = require('request');

config = require('./config.json');
grafana_url = config['grafana_render_url'];
knet_key = config['knet_key'];
knet_url = config['knet_url'];
token = config['token'];

let loutres = {};
if(fs.existsSync('loutres.json'))
    loutres = JSON.parse(fs.readFileSync('loutres.json'));

async function dessine(channel) {
    const garden = await jimp.read('garden.jpg');
    const loutre = await jimp.read('loutre.png');

    const w = garden.bitmap.width;
    const h = garden.bitmap.height;

    const lw = loutre.bitmap.width;
    const lh = loutre.bitmap.height;

    console.log(jimp.FONT_SANS_32_BLACK);
    const font = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);


    for(l in loutres){
        const x = Math.floor((w-lw)*Math.random());
        const y = Math.floor((h-lh)*Math.random());
        await garden.blit(loutre, x, y);
        await garden.print(font, x, y, loutres[l].name);

        console.log(loutres[l].name)
        console.log(x+","+y);

    }

    await garden.write('gwl.jpg');

    const attachement = new Discord.Attachment('gwl.jpg');
    await channel.send(attachement);
    channel.stopTyping();
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
      client.user.setGame('Jardin de loutres');

});

client.on('message', async msg => {
    if(msg.author.bot) return;

    if(msg.content.indexOf(config.prefix) !== 0) return;
  
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    console.log(msg.channel.name)
    if(msg.channel.name == 'loutres'){
        console.log(command);
        console.log(msg.author.tag);
        console.log(loutres);
        if(command == 'adopt'){
            if(msg.author.tag in loutres){
                msg.react('❌')
                return msg.reply('Tu as déjà une loutre !');
            }

            console.log(args);
            if(args.length > 0){
                const name = args.join(' ');
                loutres[msg.author.tag] = {
                    'name': name,
                    'food': 10,
                    'hapiness': 10
                }

                msg.react('👍');
                msg.reply('**'+name+'** rejoint le parc à loutres ! :heart_eyes: ');
            }
        }

        if(command == 'hug'){
            if(!(msg.author.tag in loutres)){
                msg.react('❌')
                return msg.reply('Tu n\'as pas encore de loutre, tu peux en adopter une avec la commande **!adopt [Nom de la loutre]** !');
            }

            if(loutres[msg.author.tag].hapiness > 10 && Math.random() > 0.5){
                msg.reply(loutres[msg.author.tag].name+' ne veut plus de câlins !');
                msg.react('😪');
                return;
            }
            loutres[msg.author.tag].hapiness += 1;
            msg.reply('(づ｡◕‿‿◕｡)づ '+loutres[msg.author.tag].name);
            msg.reply('Ta loutre est maintenant toute contente !');
            msg.react('😍')
        }

        if(command == 'garden'){
            msg.channel.startTyping();
            dessine(msg.channel)
        }

        

        fs.writeFileSync('loutres.json', JSON.stringify(loutres))
    }

    if(command == 'monitoring'){
            msg.channel.startTyping();
            msg.channel.send(new Discord.Attachment(grafana_url, 'grafana.png')).then(function(){
                msg.channel.stopTyping();
            })
        }

    if(command == 'knet'){
        console.log(args);
        var username = args[0].toLowerCase();
        request.post(knet_url, {form: {
            'apikey': knet_key,
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

    }
});

client.login(token);