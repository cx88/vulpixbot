const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require('fs');
var servers = fs.readFileSync('servers.json');
var config = JSON.parse(servers);

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

String.prototype.contains = function(obj){
    return this.indexOf(obj) !== -1;
}

function dateNow(){
    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var dt = d.getDate();
    var hr = d.getHours() + 1;
    var mnts = d.getMinutes() + 1;
    if (m < 10) { m = '0'+m.toString(); }
    if (dt < 10) { dt = '0'+dt.toString(); }
    if (hr < 10) { hr = '0'+hr.toString(); }
    if (mnts < 10) { mnts = '0'+mnts.toString(); }
    y = y.toString();
    m = m.toString();
    dt = dt.toString();
    hr = hr.toString();
    mnts = mnts.toString();
    return y + '-' + m + '-' + dt + '__' + hr + ':' + mnts;
}

function hasRole(member, role){
    var _role = member.guild.roles.find("name", role);
    return member.roles.has(_role.id);
}

function setDefaultConfig(guild){
    var g = guild.id.toString(); // Default Config settings.
    config[g] = {};
    config[g]["prefix"] = "!";
    config[g]["ignored_channels"] = [];
    config[g]["disabled_commands"] = [];
    config[g]["messages"] = {};
    config[g]["messages"]["welcome"] = {};
    config[g]["messages"]["welcome"]["msg"] = "Welcome to the server, (user)!";
    config[g]["messages"]["welcome"]["status"] = "on";
    config[g]["messages"]["welcome"]["role"] = "Member";
    config[g]["messages"]["mute"] = {};
    config[g]["messages"]["mute"]["msg"] = "(user) has been muted!";
    config[g]["messages"]["mute"]["status"] = "on";
    config[g]["messages"]["mute"]["role"] = "Muted";
    saveConfig(config);
}

function saveConfig(cfg){
    var data = JSON.stringify(cfg, null, 2);
    fs.writeFileSync('servers.json', data);
    servers = fs.readFileSync('servers.json');
    config = JSON.parse(servers);
    console.log(config);
}

function rand(int){
    return Math.floor(Math.random() * parseInt(int));
}

bot.on('ready', () => {
    console.log('Vulpix online');
    bot.user.setGame("Type v-config");
});

bot.on('guildCreate', guild =>{
    console.log('Vulpix joined "' + guild.name + '" server with ID "' + guild.id.toString() + '" at date: ' + Date.now() + '.');
    guild.defaultChannel.send('Hello! I am Vulpix. I am here to help you out with utility commands, shortcuts, and more. Contact user `M3rein#7122` for questions and inquiries!');
    setDefaultConfig();
})

bot.on('guildMemberAdd', member =>{
    if (config[member.guild.id.toString()]["messages"]["welcome"]["status"] == "on"){
        var msg = config[member.guild.id.toString()]["messages"]["welcome"]["msg"];
        msg = msg.replace('(user)', member.user.username);
        member.guild.defaultChannel.send(msg);
    }
});

bot.on('message', message => {
    var guild = message.guild;
    var thisconfig = config[guild.id.toString()];
    if (thisconfig == undefined){
        setDefaultConfig(guild);
        thisconfig = config[guild.id.toString()];
    }
    if (!thisconfig["ignored_channels"].contains(message.channel.name)){
        if (message.content.startsWith(thisconfig["prefix"])){
            cmd = message.content.split(thisconfig["prefix"])[1].split(' ')[0];
            args = message.content.split(" ");
            args.splice(0, 1);
            console.log(dateNow() + ' ' + message.author.username + `: ` + message.content);
            if (cmd == "pc"){
                message.channel.send('https://pokecommunity.com/~'+args[0]);
            }
            else if (cmd == "rand" || cmd == "random"){
                message.channel.send(rand(args[0]));
            }
            else if (cmd == "choose"){
                _args = message.content.split(' ');
                var str = "";
                for (i = 1; i < _args.length; i++){
                    str += _args[i];
                    if (i != _args.length - 1) { str += " "; }
                }
                options = str.split('|');
                message.channel.send(options[rand(options.length)]);
            }
            else if (cmd == "dex"){
                    message.channel.send({embed: {
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
                message.channel.send(message.channel.name);
            }
            else if (cmd == "thundaga"){
                if (args[0] == undefined){
                    message.channel.send("https://www.youtube.com/channel/UCS9280oK413_XO8abzQa8ig");
                }
                else{
                    var results = "";
                    var vids = fs.readFileSync('database/thundaga.json');
                    var eps = JSON.parse(vids);
                    ar = Object.keys(eps);
                    for (i = 0; i < ar.length; i++){
                        for (j = 0; j < eps[ar[i]]["keywords"].length; j++){
                            if (message.content.contains(' '+eps[ar[i]]["keywords"][j])){
                                results += eps[ar[i]]["url"] + "\n";
                                break;
                            }
                        }
                    }
                    if (results == ""){
                        message.channel.send('No results found.');
                    }
                    else{
                        message.channel.send(results);
                    }
                }
            }
            else if (cmd == "wiki" || cmd == "wikia"){

            }
            else if (cmd == "ebs"){
                message.channel.send("http://sj-web.byethost18.com/");
            }
            else if (cmd == "pbs" || cmd == "pbs+" || cmd == "pbseditor" || cmd == "pbs_editor"){
                message.channel.send("https://www.pokecommunity.com/showthread.php?t=393347");
            }
            else if (cmd == "read"){
                if (args[0] == undefined){
                    message.channel.send('Hello. I am Vulpix. I represent the annoyance of ' + message.author.username + '. You have failed to read one or more of their messages.\nInstead of being snarky and saying "Read the fucking messages, please!", they desperately used this command to have me talk for them. I hope you can appreciate their choice and fucking read for once.');
                }
                else if (args[0] == "wiki" || args[0] == "wikia"){
                    message.channel.send('Hello. I see you have failed to look up the wikia. Shame on you. It wasn\'t made for decoration purposes. People put time into making that and providing you with information. You should respect that and read the wikia. If you end up not finding what you need, try again and state that you did in fact read the wikia.');
                }
                else if (args[0] == "instructions" || args[0] == "instr" || args[0] == "instruction"){
                    message.channel.send('Hey there. It\'s seriously annoying if you don\'t read provided instructions. People will get snarky if you don\'t. So please, look for instructions wherever you downloaded or saw something. Read them and then follow them.');
                }
                else if (args[0] == "docu" || args[0] == "doc" || args[0] == "documentation"){
                    message.channel.send('Hi. Read the documentation. It\'s there to help you. It will take away most questions you have. If you do have questions, **always** read provided documentation before you end up asking stupid questions.');
                }
                else if (args[0] == "faq"){
                    message.channel.send('If only there was such a thing as **"FREQUENTLY ASKED QUESTIONS"**... Hmmm... Whether it\'s a website, resource or Discord server, they are likely to have a FAQ channel or document. For all that is holy, read that.');
                }
            }
            else if (cmd == "debug"){
                message.channel.send(hasRole(message.member, "Administrator").toString());
            }
        }
        else if (message.content.startsWith("v-config")){ // Configuration of the bot for the server.
            args = message.content.split(" ");
            args.splice(0, 1);
            var param = args[0];
            var setting = args[1];
            console.log(dateNow() + ' ' + message.author.username + `: ` + message.content);
            if (param == "prefix"){
                if (setting != undefined){
                    if (setting == "v-"){
                        message.channel.send('v- cannot be used as a command prefix.');
                    }
                    else{
                        config[message.guild.id.toString()]["prefix"] = setting;
                        saveConfig(config);
                        message.channel.send('Successfully set active command prefix to `'+config[message.guild.id.toString()]["prefix"]+'`.');
                    }
                }
                else{
                    message.channel.send('The prefix for commands is currently `'+thisconfig["prefix"]+'`.');
                }
            }
            else if (param == "messages"){
                var arg = args[1];
                if (arg == "welcome"){
                    message.channel.send('The message that is sent whenever a new user joins.```Message: '+thisconfig["messages"]["welcome"]["msg"]+'\nStatus: '+thisconfig["messages"]["welcome"]["status"]+'``` \
                    Use one of the following commands to change the settings:```v-config messages welcome msg');
                }
                else if (arg == "mute"){
                    message.channel.send('When you mute someone via the bot, this is the message that will be displayed. ```Mute message: '+thisconfig["messages"]["mute"]["msg"]+'\r\nStatus: '+thisconfig["messages"]["mute"]["status"]+'```');
                }
                else{
                    message.channel.send('These are messages the bot will send under specific circumstances. You can turn them on/off and change the message. Use one of the following commands for more information:```v-config messages welcome\nv-config messages mute```');
                }
            }
            else if (param == "autorole"){
                message.channel.send('When a new user joins, you can choose for the bot to give them a role.```Role given: '+thisconfig["autorole"]+'\r\nStatus: '+thisconfig["autorole"]+'```Use one of the following commands to change the settings:```v-config autorole on\nv-config autorole off\nv-config autorole set (rolename)```');
            }
            else if (param == "ignored_channels"){
                var msg = 'If a command other than v-config is executed in any of the following channels, it will be ignored:```\n';
                if (thisconfig["ignored_channels"].length == 0) { msg += "---"; }
                else{
                    for (i = 0; i < thisconfig["ignored_channels"].length; i++){
                        msg += thisconfig["ignored_channels"][i];
                        if (i != thisconfig["ignored_channels"].length - 1) { msg += '\n'; }
                    }
                }
                msg += '``` Add or remove a channel with one of the following commands:```v-config ignored_channels add (channelname)\nv-config ignored_channels remove (channelname)```Channelname is the actual name of the channel, not a hyperlink or id.';
                message.channel.send(msg);
            }
            else if (param == "show"){
                message.channel.send('```JavaScript\n'+JSON.stringify(thisconfig, null, 2)+'```');
            }
            else{
                message.channel.send('To configure the bot for this server, use one of the following commands: ```v-config prefix\nv-config messages\nv-config autorole\nv-config ignored_channels\nv-config show```')
            }
        }
    }
});

bot.login('MzM5NzM5ODU5NTQ5NjgzNzEy.DFoW6g.LFoDAVvsDq77XIrkt0lBygFqXOw');