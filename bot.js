const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require('fs');
var servers = fs.readFileSync('servers.json');
var config = JSON.parse(servers);
var request = require('tinyreq');

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

function hasRole(user, role) {
    var hasrole = false;
    console.log(user.roles[0]);
    for (i = 0; i < user.roles.length; i++) {
        if (user.roles[i].toLowerCase() == role.toLowerCase()) { hasrole = true; }
    }
    return (hasrole);
}

function saveConfig(cfg){
    var data = JSON.stringify(cfg, null, 2);
    fs.writeFileSync('servers.json', data);
    servers = fs.readFileSync('servers.json');
    config = JSON.parse(servers);
}

function rand(int){
    return Math.floor(Math.random() * parseInt(int));
}

bot.on('ready', () => {
    console.log('Vulpix: online');
    bot.user.setGame("Type v-config");
});

bot.on('guildCreate', guild =>{
    console.log('Vulpix joined "' + guild.name + '" server with ID "' + guild.id.toString() + '" at date: ' + Date.now() + '.');
    guild.defaultChannel.sendMessage('Hello! I am Vulpix. I am here to help you out with utility commands, shortcuts, and more. Contact user `M3rein#7122` for questions and inquiries!');
    var g = guild.id.toString(); // Default Config settings.
    config[g] = {};
    config[g]["prefix"] = "!";
    config[g]["ignored_channels"] = [];
    config[g]["disabled_commands"] = [];
    config[g]["messages"] = {};
    config[g]["messages"]["welcome"]["msg"] = "Welcome to the server, (user)!";
    config[g]["messages"]["welcome"]["status"] = "on";
    config[g]["messages"]["mute"]["msg"] = "(user) has been muted!"
    config[g]["messages"]["mute"]["status"] = "on"
    saveConfig(config);
})

bot.on('guildMemberAdd', member =>{
    member.guild.defaultChannel.sendMessage(`Hey there, ${member.user.username} :heart:~`);
    member.guild.roles
});

bot.on('message', message => {
    var thisconfig = config[message.guild.id.toString()];
    if (!thisconfig["no_command_channels"].contains(message.channel.name)){
        if (message.content.startsWith(thisconfig["prefix"])){
            cmd = message.content.split(thisconfig["prefix"])[1].split(' ')[0];
            args = message.content.split(" ");
            args.splice(0, 1);
            if (cmd == "pc"){
                message.channel.sendMessage('https://pokecommunity.com/~'+args[0]);
            }
            else if (cmd == "rand" || cmd == "random"){
                message.channel.sendMessage(rand(args[0]));
            }
            else if (cmd == "choose"){
                _args = message.content.split(' ');
                var str = "";
                for (i = 1; i < _args.length; i++){
                    str += _args[i];
                    if (i != _args.length - 1) { str += " "; }
                }
                options = str.split('|');
                message.channel.sendMessage(options[rand(options.length)]);
            }
            else if (cmd == "dex"){
                    message.channel.sendMessage({embed: {
                        color: 1762633,
                        title: "🡒001: Bulbasaur",
                        url: "https://bulbapedia.bulbagarden.net/wiki/Bulbasaur_(Pok%C3%A9mon)",
                        description: "**Types:** Grass | Poison\n**Base Stats:** 45 | 49 | 49 | 65 | 65 | 45\n**Abilities:**\nNormal: Overgrow\nHidden: Chlorophyll\n**Height:** 0.7m\n**Weight:** 6.9kg\n**Gender Ratio:**\nMale: 87.5%\nFemale: 12.5%\n**Growth Rate:** Medium Slow\n**Base EXP:** 64\n**Catch Rate:** 45\n**EV Yield:** 1 SpAtk\n**Hatch Time:** 5140 - 5396 steps**\nEvolutions:**\nBulbasaur 🡒 Level 16 🡒 Ivysaur 🡒 Level 32 🡒 Venusaur\n\nBulbasaur, The Seed Pokémon.\nBulbasaur can be seen napping in bright sunlight. There is a seed on its back. By soaking up the sun's rays, the seed grows progressively larger.",
                        image: {
                            "url": "https://cdn.bulbagarden.net/upload/archive/2/21/20170712171828%21001Bulbasaur.png"
                        },
                        thumbnail: {
                            "url": "https://cdn.bulbagarden.net/upload/9/9c/Shuffle001.png"
                        }
                    }
                });
            }
            else if (cmd == "channel"){
                message.channel.sendMessage(message.channel.name);
            }
        }
        else if (message.content.startsWith("v-config")){ // Configuration of the bot for the server.
            args = message.content.split(" ");
            args.splice(0, 1);
            var param = args[0];
            var setting = args[1];
            if (param == "prefix"){
                if (setting != undefined){
                    config[message.guild.id.toString()]["prefix"] = setting;
                    saveConfig(config);
                    message.channel.sendMessage('Successfully set active command prefix to `'+config[message.guild.id.toString()]["prefix"]+'`.');
                }
                else{
                    message.channel.sendMessage('The prefix for commands is currently `'+thisconfig["prefix"]+'`.');
                }
            }
            else if (param == "messages"){
                var arg = args[1];
                if (arg == "welcome"){
                    message.channel.sendMessage('The message that is sent whenever a new user joins.```Message: '+thisconfig["messages"]["welcome"]["msg"]+'\nStatus: '+thisconfig["messages"]["welcome"]["status"]+'```');
                }
                else if (arg == "mute"){
                    message.channel.sendMessage('When you mute someone via the bot, this is the message that will be displayed. ```Mute message: '+thisconfig["messages"]["mute"]["msg"]+'\r\nStatus: '+thisconfig["messages"]["mute"]["status"]+'```');
                }
                else{
                    message.channel.sendMessage('');
                }
            }
            else if (param == "autorole"){
                message.channel.sendMessage('When a new user joins, you can choose for the bot to give them a role.```Role given: '+thisconfig["autorole"]+'\r\nStatus: '+thisconfig["autorole"]+'```Use one of the following commands to change the settings:```v-config autorole on\nv-config autorole off\nv-config autorole set (rolename)```');
            }
            else if (param == "ignored_channels"){

            }
            else{
                message.channel.sendMessage('To configure the bot for this server, use one of the following commands: ```v-config prefix\nv-config messages\nv-config autorole\nv-config ignored_channels```')
            }
        }
    }
});

bot.login('MzM5NzM5ODU5NTQ5NjgzNzEy.DFoW6g.LFoDAVvsDq77XIrkt0lBygFqXOw');