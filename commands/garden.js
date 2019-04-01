const jimp = require('jimp');
const Discord = require('discord.js');

async function dessine(channel, loutres) {
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

module.exports = {
    name: 'garden',
    description: 'Affiche le magnifique jardin des loutres.',
    aliases: [],
    usage: '',
    cooldown: 5,
    execute(msg, args, server) {
        msg.channel.startTyping();

        dessine(msg.channel, server.loutres);
    },
};