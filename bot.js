const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');



client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

const conf = require('./config.json');


let server  = {
    config: conf,
    grafana_url: conf['grafana_render_url'],
    knet_key: conf['knet_key'],
    knet_url: conf['knet_url'],
    token: conf['token'],
    loutres: {},

    loadLoutres: function(){
        if(fs.existsSync('loutres.json'))
            this.loutres = JSON.parse(fs.readFileSync('loutres.json'));
    },

    saveLoutres: function(){
        fs.writeFileSync('loutres.json', JSON.stringify(this.loutres));
    }
};

server.loadLoutres();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
      client.user.setGame('Jardin de loutres');

});

client.on('message', async msg => {
    if(msg.author.bot) return;

    if(msg.content.indexOf(server.config.prefix) !== 0) return;
  
    const args = msg.content.slice(server.config.prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && msg.channel.type !== 'text') {
        return msg.reply('I can\'t execute that command inside DMs!');
    }

    try {
        command.execute(msg, args, server);
    } catch (error) {
        console.error(error);
        msg.reply('J\'ai perdu. (Ou j\'ai planté mais je marche encore)');
    }

});

client.login(server.token);