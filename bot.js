const Discord = require('discord.js');
const bot = new Discord.Client();
var paste = require('better-pastebin');
var url = process.env.URL;
var fs = require('fs');
var delet_this = JSON.parse(fs.readFileSync('database/delet_this.json')).memes;
var vids = fs.readFileSync('database/thundaga.json');
var eps = JSON.parse(vids);
var config = {};
var main_color = 10876925;
var admin = require('firebase-admin');
var serviceAccount = require('./database/vulpix-bot-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE
});
var ref = admin.database().ref();
ref.once('value', function(data){
    config = data.val();
}, function(err){
    console.log(err);
})
const level_curve = [ 0,
  24,    54,    93,    135,   183,   // 1  - 5
  234,   288,   351,   420,   495,   // 6  - 10
  582,   684,   771,   867,   984,   // 11 - 15
  1092,  1260,  1476,  1716,  1953,  // 16 - 20
  2181,  2436,  2742,  3159,  3576,  // 21 - 25
  4155,  4788,  5589,  6435,  7452,  // 26 - 30
  8643,  9999,  11676, 13734, 15597, // 31 - 35
  17898, 20496, 23163, 26721, 30000  // 36 - 40
]

const magic8ball = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes - definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
]

const commands = [
    "pc", "soon", "rand", "choose",
    "dex", "thundaga", "wikia", "ebs",
    "pbs+", "read", "lenny", "shrug",
    "delet", "rank", "8ball",
    "eval", "user", "bug", "spoon",
    "mock", "gandalf", "channel", "server",
    "quotes", "add", "remove", "top"
]

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

Array.prototype.shuffle = function shuffle() {
    for (let i = this.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [this[i - 1], this[j]] = [this[j], this[i - 1]];
    }
    return this;
}

String.prototype.contains = function(obj){
    return this.indexOf(obj) !== -1;
}

String.prototype.capitalize = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function jsonToString(json){
    if (!json) return '---';
    if (json.construcor == Array){
        return `[\n    "${json.join('",\n    "')}"\n]`
    }
    else{
        return JSON.stringify(json, null, 4);
    }
}

function getDate(date = null){
    var d = date ? date : new Date();
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

function getChannelMembers(channel){
	var total = channel.members.map(m => m).length;
	var members;
	if (total == 0){
		members = "---";
	}
	else if (total <= 10){
		members = channel.members.map(m => m.user.username).join('\n');
	}
	else{
		members = total;
	}
	return members;
}

function getGuildMembers(guild){
	var total = guild.members.map(m => m).length;
	var members;
	if (total == 0){
		members = "---";
	}
	else if (total <= 10){
		members = guild.members.map(m => m.user.username).join('\n');
	}
	else{
		members = guild.memberCount;
	}
	return members;
}

function getAbility(ability){
    return `[${ability.replace(`_`, ` `)}](https://bulbapedia.bulbagarden.net/wiki/${ability}_(Ability\\))`;
}

function hasRole(member, role){
    var _role = member.guild.roles.find("name", role);
    try{
        return member.roles.has(_role.id);
    }
    catch (Error){
        return false;
    }
}

function getRank(guild, user){
    var sortable = [];
    for (var id in config[guild.id].ranks) {
        sortable.push([id, config[guild.id].ranks[id]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1]
    });
    for (i = 0; i < sortable.length; i++){
        if (sortable[i][0] == user.id){
            return i + 1;
        }
    }
}

function userExists(guild, username){
    var user = getUser(guild, username);
    return user != null && user != undefined;
}

function getUser(guild, _user){
	var user = guild.members.get(_user);
	if (user) user = user;
	if (!user) user = guild.members.find(m => m.user.username === _user);
    if (!user) user = guild.members.find(m => m.user.username.toLowerCase() === _user.toLowerCase());
    try{
        return user.user;
    }
    catch (err){
        return undefined;
    }
}

function tryGetChannel(guild, str){
    if (!str) return;
    var channel;
    while (str.contains('%20')){
    	str = str.replace('%20', ' ');
    }
    if (channelExists(guild, str)){
        channel = getChannel(guild, str);
    }
    return channel;
}

function tryGetUser(guild, str){
	if (!str) return;
    var user;
    while (str.contains('%20')){
        str = str.replace('%20', ' ');
    }
    if (userExists(guild, str)){
        user = getUser(guild, str);
    }
    else{
        var name;
        try{
            name = guild.members.find(m => m.nickname == str);
        }
        catch (err){
            try{
                if (!name) name = guild.members.find(m => m.nickname.toLowerCase() == str.toLowerCase());
                if (name) user = name.user;
            }
            catch (err){
                return null;
            }
        }
    }
    if (!user){
    	user = guild.members.get(str);
    	if (user) user = user.user;
    }
    return user;
}

function channelExists(guild, channel){
    var chnl = getChannel(guild, channel);
    return chnl != null && chnl != undefined;
}

function getChannel(guild, channel){
	var chan = guild.channels.find(chnl => chnl.name == channel);
	if (!chan) chan = guild.channels.find(chnl => chnl.name.toLowerCase() == channel.toLowerCase());
	if (!chan){
		chan = guild.channels.get(channel);
	}
    return chan;
}

function isBotAdmin(member){
    return hasRole(member, "Vulpix Admin") || member.user.id == member.guild.ownerID || member.user.id == '270175313856561153';
}

function isDeveloper(member){
    return isBotAdmin(member) || hasRole(member, "Developers");
}

function setDefaults(guild){
    var g = guild.id.toString(); // Default Config settings.
    config[g] = {
        "prefix": "?",
        "servername": guild.name,
        "ranks": {

        },
        "users": {

        },
        "channels": {

        },
        "suggestions": [

        ],
        "commands": {

        },
        "messages": {
            "welcome": {
                "msg": "Welcome to the server, (user)!",
                "status": "on",
                "role": "Member",
                "channel": guild.defaultChannel.name
            },
            "levelup": {
                "msg": "Congrats, (@user)! You leveled up to level (level)!",
                "status": "on"
            },
            "goodbye": {
                "msg": "(user) has just left the server. Rest in peace!",
                "status": "on",
                "channel": guild.defaultChannel.name
            },
            "news": {
                "status": "on",
                "channel": guild.defaultChannel.name
            }
        },
        "bot_log": {
            "channel": guild.defaultChannel.name,
            "status": "on"
        },
        "roles": {

        },
        "quotes": {

        },
        "bugs": {

        },
        "commandlog": [

        ]
    }

    saveConfig();
    var role = guild.roles.find("name", "Vulpix Admin");
    if (role == null || role == undefined){
        guild.createRole({
            name: 'Vulpix Admin',
            color: '#C6C6C6',
            permissions: [
                "KICK_MEMBERS", "ADD_REACTIONS",
                "READ_MESSAGES", "SEND_MESSAGES",
                "SEND_TTS_MESSAGES", "MANAGE_MESSAGES",
                "EMBED_LINKS", "ATTACH_FILES",
                "READ_MESSAGE_HISTORY", "EXTERNAL_EMOJIS",
                "CONNECT", "SPEAK", "DEAFEN_MEMBERS",
                "CHANGE_NICKNAME", "MANAGE_NICKNAMES",
                "MANAGE_ROLES_OR_PERMISSIONS", "MUTE_MEMBERS",
                "MOVE_MEMBERS", "USE_VAD", "MANAGE_WEBHOOKS",
                "MANAGE_EMOJIS"
            ],
            mentionable: true
        })
    }
}

function saveConfig(){
    ref.update(config);
}

function logMessage(guild, message){
    if (!config[guild.id].commandlog) config[guild.id].commandlog = []
    config[guild.id].commandlog.push(message);
}

function botLog(guild, message){
    var id = guild.id;
    if (config[id].bot_log && config[id].bot_log.channel && config[id].bot_log.status == "on"){
        channel = tryGetChannel(guild, config[id].bot_log.channel);
        if (channel){
            channel.send(message);
        }
    }
}

function rand(int){
    return Math.floor(Math.random() * parseInt(int));
}

function command(channel, arg, cmd){
    try{
        return arg == cmd && !config[channel.guild.id].channels[channel.id].disabled_commands.contains(cmd);
    }
    catch (err){
        return true;
    }
}

function getBugEmbed(title, description, username, url){
    return {embed: {
        color: main_color,
        footer: {
            text: username,
            icon_url: url
        },
        fields: [{
            name: `**Bug Title**`,
            value: title
        },{
            name: `**Bug Description**`,
            value: description
        }]
    }};
}

function getQuotes(member){
	if (!config[member.guild.id].quotes || !config[member.guild.id].quotes[member.user.id]) return [];
	return config[member.guild.id].quotes[member.user.id];
}

function changeAvatar(){
    var avatars = JSON.parse(fs.readFileSync('database/avatars.json')).avatars;
    bot.user.setAvatar(avatars[rand(avatars.length)]);
}

setInterval(saveConfig, 15000);
setInterval(changeAvatar, 720000)

bot.on('ready', () => {
    console.log('Vulpix online');
    bot.user.setGame("Type v-config");
});

bot.on('guildCreate', guild =>{
    if (!config) return;
    console.log('Vulpix joined "' + guild.name + '" server with ID "' + guild.id.toString() + '" at date: ' + Date.now() + '.');
    guild.defaultChannel.send('Hello! I am Vulpix. I am here to help you out with utility commands, shortcuts, and more. Contact user `M3rein#7122` for questions and inquiries!');
    setDefaults(guild);
})

bot.on('guildMemberAdd', member =>{
    if (!config) return;
    if (config[member.guild.id.toString()] == undefined){
        setDefaults(member.guild);
    }
    if (config[member.guild.id.toString()].messages.welcome.status == "on"){
        var channel = config[member.guild.id.toString()].messages.welcome.channel;
        var msg = config[member.guild.id.toString()].messages.welcome.msg;
        while (msg.contains('(user)')){
            msg = msg.replace('(user)', member.user.username);
        }
        while (msg.contains('(@user)')){
            msg = msg.replace('(@user)', member.user);
        }
        if (channelExists(member.guild, channel)){
            getChannel(member.guild, channel).send(msg);
        }
        else{
            member.guild.defaultChannel.send(`Welcome to the server, ${member.user}!`);
            botLog(member.guild, `Channel \`${channel}\` does not exist as referred to in \`v-config messages welcome channel\`.`);
        }
    }
    if (!config[member.guild.id].users) config[member.guild.id].users = {};
    if (!config[member.guild.id].users[member.user.id]) config[member.guild.id].users[member.user.id] = {};
    config[member.guild.id].users[member.user.id].number = member.guild.memberCount
    if (config[member.guild.id].roles && config[member.guild.id].roles.memberJoin){
        var roles = config[member.guild.id].roles.memberJoin;
        for (i = 0 ; i < roles.length; i++){
            if (roles[i]){
                var role = member.guild.roles.find('name', roles[i]);
                if (role){
                    member.addRole(role);
                }
                else{
                    botLog(member.guild, `Role \`${roles[i]}\` does not exist as referred to in \`v-config roles\` with event "memberJoin".`);
                }
            }
        }
    }
    saveConfig();
});

bot.on('guildMemberRemove', member => {
    if (!config) return;
    var guild = member.guild;
    var id = guild.id;
    var userid = member.user.id;
    if (config[id] && config[id].ranks && config[id].ranks[userid]){
        delete config[id].ranks[userid];
    }
    if (config[id] && config[id].quotes && config[id].quotes[userid]){
        delete config[id].quotes[userid];
    }
    if (config[id] && config[id].users && config[id].users[userid]){
        delete config[id].users[userid];
    }
    if (config[id] && config[id].messages && config[id].messages.goodbye && config[id].messages.goodbye.status == "on"){
        var channel = tryGetChannel(guild, config[id].messages.goodbye.channel);
        if (channel){
            var msg = config[id].messages.goodbye.msg;
            while (msg.contains('(user)')){
                msg = msg.replace('(user)', member.user.username);
            }
            channel.send(msg);
        }
        else{
            guild.defaultChannel.send(`${member.user.username} just left. Goodbye!`);
            botLog(guild, `Channel \`${config[id].messages.goodbye.channel}\` does not exist as referred to in \`v-config messages goodbye channel\`.`);
        }
    }
    saveConfig();
});

bot.on('channelDelete', channel => {
    if (!config) return;
    var guild = channel.guild;
    var id = guild.id;
    var channelid = channel.id;
    if (config[id] && config[id].channels && config[id].channels[channelid]){
        delete config[id].channels[channelid];
    }
    saveConfig();
});

bot.on('guildDelete', guild => {
    if (!config) return;
    var id = guild.id;
    if (config[id]){
        delete config[id];
    }
    saveConfig();
});

bot.on('guildUpdate', (oldguild, newguild) => {
    var id = newguild.id;
    config[id].servername = newguild.name;
    saveConfig();
});

bot.on('message', message => {
    if (!config[message.channel.guild.id]) setDefaults(message.channel.guild);
	if (!message || !message.member) return;
    if (message.member.user.bot) return;
    var guild = message.guild;
    var id = guild.id;
    var channel = message.channel;
    var prefix = config[id].prefix;
    var user = message.author;
    var member = message.member;
    if (config[id] == undefined) return;

    function canAddRole(user, role){
      if (!user || user.constructor.name != 'User'|| !role){
        return false
      }
      var role = role;
      if (role.constructor.name != 'Role'){
        role = guild.roles.find('name', role);
      }
      var rolepos = role.position;
      var positions = guild.members.get(bot.user.id).roles.map(r => r.position);
      var upositions = guild.members.get(user.id).roles.map(r => r.position);
      return Math.max.apply(Math, positions) > role.position && Math.max.apply(Math, positions) > Math.max.apply(Math, upositions);  
    }

    function hasRole(user, role){
        var role = guild.members.get(user.id).roles.find('name', role);
        return role ? true : false;
    }

    function addRole(user, role){
        if (user.constructor.name == 'GuildMember'){
            user = user.user;
        }
        if (user.constructor.name != 'User'){
            botLog(`Invalid user given to method \`addRole\`.`);
            return false;
        }
        if (canAddRole(user, role)){
            guild.members.get(user.id).addRole(guild.roles.find('name', role));
            return true;
        }
        else{
            botLog(`Could not add role \`${role}\` to user \`${user.username}\`.`);
            return false;
        }
    }

    function send(msg, channel = null){
      if (!channel){
        message.channel.send(msg);
      }
      else{
        var chnl = tryGetChannel(guild, channel);
        if (chnl){
          chnl.send(msg);
        }
        else{
          message.channel.send('Could not find channel.');
        }
      }
    }

    if (!message.content.startsWith(config[id].prefix) && !message.content.startsWith("v-")){
        if (config[id]["ranks"] == undefined){
            config[id]["ranks"] = {};
        }
        if (config[id]["ranks"][message.member.user.id] == undefined){
            config[id]["ranks"][message.member.user.id] = 0;
        }
        else{
           config[id]["ranks"][message.member.user.id]++;
            if (level_curve.contains(config[id].ranks[message.member.user.id])){
                var level = level_curve.indexOf(config[id].ranks[message.member.user.id]);
                if (!config[id].messages["levelup"]){
                    config[id].messages["levelup"] = {
                        "msg": "Congrats, (@user)! You leveled up to level (level)!",
                        "status": "on"
                    }
                }
                if (config[id].messages["levelup"].status == "on"){
                    var str = config[id].messages["levelup"].msg;
                    while (str.contains('(user)')){
                        str = str.replace('(user)', message.member.user.username);
                    }
                    while (str.contains('(@user)')){
                        str = str.replace('(@user)', message.member.user)
                    }
                    while (str.contains('(level)')){
                        str = str.replace('(level)', level);
                    }
                    message.channel.send(str);
                }
                if (config[id].roles && config[id].roles[`level ${level}`]){
                    var roles = config[id].roles[`level ${level}`];
                    for (i = 0 ; i < roles.length; i++){
                        if (roles[i]){
                            var role = guild.roles.find('name', roles[i]);
                            if (role){
                                message.member.addRole(role);
                            }
                        }
                    }
                }
            }
        }
    }
    if (message.content.startsWith(config[id].prefix)){
        cmd = message.content.substr(1).split(' ')[0];
        args = message.content.split(" ");
        args.splice(0, 1);
        logMessage(guild, getDate() + ' ' + message.author.username + `: ` + message.content);
        if (command(channel, cmd, "pc")){
            if (args[0] == undefined) return;
            message.channel.send('https://pokecommunity.com/~'+args[0]);
        }
        else if (command(channel, cmd, "soon")){
            message.channel.send(`Soon:tm:`);
        }
        else if (command(channel, cmd, "rand")){
            message.channel.send(rand(args[0]));
        }
        else if (command(channel, cmd, "choose")){
            _args = message.content.split(' ');
            var str = "";
            for (i = 1; i < _args.length; i++){
                str += _args[i];
                if (i != _args.length - 1) { str += " "; }
            }
            var options = str.split('|');
            for (i = 0; i < options.length; i++){
                while (options[i][0] == ' '){
                    options[i] = options[i].substr(1);
                }
                while (options[i][options[i].length - 1] == ' '){
                    options[i] = options[i].substr(0, options[i].length - 1);
                }
            }
            if (options.length == 1){
                message.channel.send(`Don't try to trick me!`);
                return;
            }
            if (options.length == 2){
                if (options[0] == options[1]){
                    message.channel.send(`Don't try to trick me!`);
                    return;
                }
            }
            message.channel.send(options[rand(options.length)]);
        }
        else if (command(channel, cmd, "dex")){
            if (args[0] == undefined){
                message.channel.send(`If you want to see the data on a Pokémon, use \`${config[id].prefix}dex [pokemon]\`.`);
                return;
            }
            var file = fs.readFileSync('database/pokemon.json');
            var dat = JSON.parse(file);
            var mon;
            if (message.content.toLowerCase().contains('type') || message.content.toLowerCase().contains('null')){
                poke = dat["Type: Null"];
            }
            else{
                poke = dat[args[0].capitalize()];
            }
            if (poke == undefined || poke == null) return;
            var tmp = fs.readFileSync('database/colors.json');
            var colors = JSON.parse(tmp);
            var color = colors[poke.type1.toLowerCase()];
            var types = `**Types:** ${poke.type1} ${poke.type2 != "Unknown" && poke.type2 != undefined ? `| ${poke.type2}` : ""}`;
            var s = poke.stats
            var stats = `**Base Stats**: ${s[0]} | ${s[1]} | ${s[2]} | ${s[3]} | ${s[4]} | ${s[5]}`;
            var abilities = `Normal: ${getAbility(poke.ability1)} ${poke.ability2 != undefined ? "| " + getAbility(poke.ability2) : ""}`;
            var height = `**Height**: ${poke.height}`;
            var weight = `**Weight**: ${poke.weight}`;
            var genderratio = `**Gender Ratio**: `
            if (poke.genderratio == "Genderless"){
                genderratio += `Genderless`;
            }
            else{
                var female = parseFloat(poke.genderratio.split('%')[0]);
                var male = parseFloat(parseFloat(100) - female);
                genderratio += `\nMale: ${male}%\nFemale: ${female}%`
            }
            var growthrate = `**Growth Rate**: ${poke.levelingrate}`;
            var exp = `**Base EXP**: ${poke.base_exp}`;
            var catchrate = `**Catch Rate**: ${poke.catchrate}`;
            var evyield = `**EV Yield**: `;
            var evs = [];
            var _stats = [`HP`, `Atk`, `Def`, `SpAtk`, `SpDef`, `Speed`]
            for (i = 0; i < poke.evyield.length; i++){
                if (poke.evyield[i] > 0){
                    evs.push(`${poke.evyield[i]} ${_stats[i]}`);
                }
            }
            evyield += evs.join(', ');
            evyield.split(',')
                .splice(-1, 1)
                .join(',');
            var hatchtime = `${poke.hatchtime} steps`
            var shuffle = poke.shuffle;
            var image = poke.url;
            var evolutions = "";
            if (poke.evolutions != undefined && poke.evolutions.length > 0){
                evolutions = poke.evolutions.join("\n");
                evolutions += "\n";
            }
            var kind = `${args[0].capitalize() == "Type:" ? "Type: Null" : args[0].capitalize()}, the ${poke.kind} Pokémon.`;
            var desc = poke.desc;
            var embed = {
                embed: {
                    color: color,
                    title: `🡒${poke.species}: ${args[0].capitalize()}`,
                    url: `https://bulbapedia.bulbagarden.net/wiki/${args[0].capitalize()}_(Pok%C3%A9mon)`,
                    description: `${types}\n${stats}\n**Abilities:**\n${abilities}${poke.hiddenability != undefined ? `\nHidden: ${getAbility(poke.hiddenability)}` : ""}\n${height}\n${weight}\n${genderratio}\n${growthrate}\n${exp}\n${catchrate}\n${evyield}\n${hatchtime}\n**Evolutions:**\n${evolutions}\n${kind}\n${desc}`,
                    image: {
                        "url": `https://`+image
                    }
                }
            }
            if (shuffle != undefined && shuffle != null && shuffle != ""){
                embed["embed"]["thumbnail"] = {
                    "url": `https://`+shuffle
                }
            }

            message.channel.send(embed);
        }
        else if (command(channel, cmd, "thundaga")){
            if (args[0] == undefined){
                message.channel.send("https://www.youtube.com/channel/UCS9280oK413_XO8abzQa8ig");
            }
            else{
                var str = message.content;
                str.replace(" a ", " ");
                str.replace(" an ", " ");
                ar = Object.keys(eps);
                var sent = false;
                var words = str.split(' ');
                for (i = 0; i < ar.length; i++){
                    if (sent) { break; }
                    for (j = 0; j < eps[ar[i]]["keywords"].length; j++){
                        if (str.contains(eps[ar[i]]["keywords"][j])){
                            var skip = false;
                            if (eps[ar[i]].blacklist != undefined){
                                for (k = 0; k < eps[ar[i]].blacklist.length; k++){
                                    if (str.contains(eps[ar[i]].blacklist[k])){
                                        skip = true;
                                        break;
                                    }
                                }
                            }
                            if (!skip){
                                message.channel.send(eps[ar[i]]["url"]);
                                sent = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        else if (command(channel, cmd, "wikia")){
            message.channel.send('Command under construction.');
        }
        else if (command(channel, cmd, "ebs")){
            message.channel.send("http://sj-web.byethost18.com/");
        }
        else if (command(channel, cmd, "pbs+")){
            message.channel.send("https://www.pokecommunity.com/showthread.php?t=393347");
        }
        else if (command(channel, cmd, "read")){
            if (args[0] == undefined){
                message.channel.send('Hello. I am Vulpix. I represent the annoyance of ' + message.author.username + '. You have failed to read one or more of their messages.\nInstead of being snarky and saying "Read the fucking messages, please!", they desperately used this command to have me talk for them. I hope you can appreciate their choice and read for once.');
            }
            else if (args[0] == "wiki" || args[0] == "wikia"){
                message.channel.send('Hello. I see you have failed to look up the wikia. Shame on you. It wasn\'t made for decoration purposes. People put time into making that and providing you with information. You should respect that and read the wikia. If you end up not finding what you need, try again and state that you did in fact read the wikia.');
            }
            else if (args[0] == "instructions" || args[0] == "instr" || args[0] == "instruction"){
                message.channel.send('Hey there. It\'s seriously annoying if you don\'t read provided instructions. People will get snarky if you don\'t. So please, look for instructions wherever you downloaded or saw something. Read them and then follow them.');
            }
            else if (args[0] == "docu" || args[0] == "doc" || args[0] == "documentation" || args[0] == "docs"){
                message.channel.send('Hi. Read the documentation. It\'s there to help you. It will take away most questions you have. If you do have questions, **always** read provided documentation before you end up asking stupid questions.');
            }
            else if (args[0] == "faq"){
                message.channel.send('If only there was such a thing as **"FREQUENTLY ASKED QUESTIONS"**... Hmmm... Whether it\'s a website, resource or Discord server, they are likely to have a FAQ channel or document. For all that is holy, read that.');
            }
            else if (args[0] == "rules"){
                message.channel.send('Yo. If you don\'t read the rules, you\'ll get in trouble soon enough. Rules are there for very good reasons; organization, past experiences, and so on. Read them so you\'re sure that you comply with them.');
            }
            else if (args[0] == "error"){
                message.channel.send('Ey. Error messages are often very English and easy to understand. Please, before you ask for help... read the error message. They\'re so self-explanatory most of the times...');
            }
        }
        else if (command(channel, cmd, "lenny")){
            message.delete();
            message.channel.send("( ͡° ͜ʖ ͡°)");
        }
        else if (command(channel, cmd, "shrug")){
            message.delete();
            message.channel.send("¯\\_(ツ)_/¯");
        }
        else if (command(channel, cmd, "delet")){
            message.delete();
            message.channel.send(delet_this[rand(delet_this.length)]);
        }
        else if (command(channel, cmd, "rank")){
            var user = message.mentions.users.first();
            if (!user) user = tryGetUser(guild, args.join(' '));
            if (!user) user = message.member.user;
            if (user.bot){
                message.channel.send(`Bots do not have ranks.`);
                return;
            }
            var rank = 0;
            var req = 16;
            for (i = 0; i < level_curve.length; i++){
                if (config[id].ranks[user.id] == undefined) { break; }
                if (level_curve[i] > config[id]["ranks"][user.id]){
                    rank = i - 1;
                    req = level_curve[i];
                    break;
                }
            }
            if (!config[id].ranks){
            	config[id].ranks = {};
            }
            if (!config[id].ranks[user.id]){
            	config[id].ranks[user.id] = 0;
            }
            var exp = config[id].ranks[user.id] * 7 + " / " + req * 7;
            message.channel.send({embed:{
                color: main_color,
                author: {
                    name: user.username,
                    icon_url: user.avatarURL
                },
                thumbnail: {
                    "url": user.avatarURL
                },
                fields: [{
                    name: "**Level**",
                    value: rank
                },{
                    name: "**Experience**",
                    value: exp
                },{
                    name: "**Rank**",
                    value: `${getRank(guild, user) == undefined ? guild.memberCount : getRank(guild, user)}/${guild.memberCount}`
                }]
            }})
        }
        else if (command(channel, cmd, "8ball")){
            message.channel.send(magic8ball[rand(magic8ball.length)]);
        }
        else if (command(channel, cmd, "eval")){
            var str = message.content.split(`${config[id].prefix}eval `)[1];
            if (!isBotAdmin(message.member)){
                if (str.contains('config') || str.contains('Config') || str.contains('abort') || str.contains('exit') || str.contains('close') || 
                    str.contains('user') || str.contains('User') || str.contains('channel') || str.contains('Channel') || str.contains('guild') ||
                    str.contains('Guild') || str.contains('message') || str.contains('member') || str.contains('end') || str.contains('while') || 
                    str.contains('process') || str.contains('kill') || str.contains('env') || str.contains('bot')){
                    message.channel.send(`You are trying to evaluate something you are not authorized to.`);
                    return;
                }
            }
            try{
                var result = eval(str);
                message.channel.send({embed:{
                    color: main_color,
                    description: `Please note that the output is automatically converted into a string.`,
                    footer: {
                        text: message.author.tag,
                        icon_url: message.author.avatarURL
                    },
                    fields: [{
                        name: `**Input**`,
                        value: str
                    },{
                        name: `**Output**:white_check_mark:`,
                        value: ((result != null && result.toString().length > 0) ? result.toString() : `---`)
                    }]
                }});
            }
            catch (e){
                message.channel.send({embed:{
                    color: main_color,
                    description: `Please note that the output is automatically converted into a string.`,
                    footer: {
                        text: message.author.tag,
                        icon_url: message.author.avatarURL
                    },
                    fields: [{
                        name: `**Input**`,
                        value: str
                    },{
                        name: `**Output**:x:`,
                        value: e.name +': ' + e.message
                    }]
                }});
            }
        }
        else if (command(channel, cmd, "user")){
            var user = message.mentions.users.first();
            if (!user) user = tryGetUser(guild, args.join(' '));
            if (!user) user = message.member.user;
            var embed = { embed: {
                color: main_color,
                author: {
                    name: user.username,
                    icon_url: user.avatarURL
                },
                title: user.tag,
                thumbnail: {
                    url: user.avatarURL
                },
                fields: [{
                    name: `**Nickname**`,
                    value: user.username,
                    inline: true
                },{
                    name: `**User ID**`,
                    value: user.id,
                    inline: true
                },{
                    name: `**Status**`,
                    value: user.presence.status,
                    inline: true
                },{
                    name: `**Game**`,
                    value: user.presence.game ? user.presence.game.name : "---",
                    inline: true
                },{
                    name: `**Bot**`,
                    value: user.bot
                },{
                    name: `**Created At**`,
                    value: user.createdAt,
                    inline: true
                }]
            }};
            if (config[id].users && config[id].users[user.id] && config[id].users[user.id].number){
                embed.embed.fields.push({
                    name: `User number`,
                    value: config[id].users[user.id].number,
                    inline: true
                })
            }
            message.channel.send(embed);
        }
        else if (command(channel, cmd, "bug")){
            if (config[id].bugs == undefined){
                config[id].bugs = {};
                saveConfig();
            }
            if (args[0] == "list"){
                var bug_titles = Object.keys(config[id].bugs);
                message.channel.send(`Known bugs:\`\`\`\n${bug_titles.length == 0 ? `---` : bug_titles.join('\n')}\`\`\``)
            }
            else if (args[0] == "submit"){
                if (config[id].users){
                    if (config[id].users[message.member.user.id]){
                        if (config[id].users[message.member.user.id].can_submit_bugs == false){
                            message.channel.send(`You are not authorized to submit bugs.`);
                            return;
                        }
                    }
                }
                if (args[1] == undefined){
                    message.channel.send(`Submit a bug using the following command: \`\`\`\n${config[id].prefix}bug submit name:"Bug title"; description:"A descriptive description of the bug. Give as much relevant information as possible."\`\`\`Note that you cannot use the \`"\` character in the title or description themselves, as they are used to surround them.`);
                }
                else{
                    var msg = message.content.split(`${config[id].prefix}bug submit `)[1];
                    try{
                        if (msg.match(/"/g).length != 4){
                            message.channel.send(`Invalid bug submission format.`);
                            return;
                        }
                    }
                    catch (err){
                        message.channel.send(`Invalid bug submission format.`);
                        return;
                    }
                    var name;
                    var desc;
                    if (msg.contains('name:')){
                        name = msg.split('name:')[1].split('"')[1].split('"')[0];
                    }
                    else{
                        message.channel.send(`Invalid bug submission format.`);
                        return;
                    }
                    if (msg.contains('description:')){
                        desc = msg.split('description:')[1].split('"')[1].split('"')[0];
                    }
                    else{
                        message.channel.send(`Invalid bug submission format.`);
                        return;
                    }
                    name = name.toUpperCase();
                    desc = msg.split('description:')[1].split('"')[1].split('"')[0];
                    if (config[id].bugs[name] != undefined){
                        message.channel.send(`There is already a bug with that title.`);
                        return;
                    }
                    name = name.toUpperCase();
                    config[id].bugs[name] = {};
                    config[id].bugs[name].desc = desc;
                    config[id].bugs[name].username = message.member.user.tag;
                    config[id].bugs[name].url = message.member.user.avatarURL;
                    saveConfig();
                    message.channel.send(`Successfully submitted a new bug:`);
                    message.channel.send(getBugEmbed(name, config[id].bugs[name].desc, config[id].bugs[name].username, config[id].bugs[name].url));
                }
            }
            else if (args[0] == "view"){
                if (args[1] != undefined){
                    var name = message.content.split(`${config[id].prefix}bug view `)[1];
                    name = name.toUpperCase();
                    if (config[id].bugs[name] != undefined){
                        message.channel.send(getBugEmbed(name, config[id].bugs[name].desc, config[id].bugs[name].username, config[id].bugs[name].url));
                    }
                    else{
                        message.channel.send(`There is no bug with such a title.`);
                    }
                }
                else{
                    message.channel.send(`To view a bug with its description, use \`${config[id].prefix}bug view [bug title]\`.`);
                }
            }
            else if (args[0] == "close"){
                if (isBotAdmin(message.member)){
                    if (args[1] != undefined){
                        var name = message.content.split(`${config[id].prefix}bug close `)[1];
                        name = name.toUpperCase();
                        if (config[id].bugs[name] != undefined){
                            delete config[id].bugs[name];
                            saveConfig();
                            message.channel.send(`Succefully closed bug "${name}".`);
                        }
                        else{
                            message.channel.send(`There is no bug with such a title.`);
                        }
                    }
                    else{
                        message.channel.send(`To close a bug submission, use \`${config[id].prefix}bug close [bug title]\``);
                    }
                }
            }
            else if (args[0] == "allow"){
                if (isBotAdmin(message.member)){
                    var user = message.mentions.users.first();
                    if (!user) user = tryGetUser(guild, args[1]);
                    if (user != undefined){
                        if (config[id].users == undefined){
                            config[id].users = {};
                            saveConfig();
                            message.channel.send(`This user is already able to submit bugs.`);
                            return;
                        }
                        if (config[id].users[user.id] == undefined){
                            config[id].users[user.id] = {};
                            saveConfig();
                            message.channel.send(`This user is already able to submit bugs.`);
                            return;
                        }
                        if (config[id].users[user.id].can_submit_bugs){
                            message.channel.send(`This user is already able to submit bugs.`);
                            return;
                        }
                        else{
                            config[id].users[user.id].can_submit_bugs = true;
                            saveConfig();
                            message.channel.send(`This user can now submit bugs.`);
                        }
                    }
                    else{
                        message.channel.send(`User couldn't be found.`);
                    }
                }
            }
            else if (args[0] == "disallow"){
                if (isBotAdmin(message.member)){
                    var user = message.mentions.users.first();
                    if (!user) user = tryGetUser(guild, args[1]);
                    if (user != undefined){
                        if (config[id].users == undefined){
                            config[id].users = {};
                            config[id].users[user.id] = {};
                            config[id].users[user.id].can_submit_bugs = false;
                            saveConfig();
                            message.channel.send(`This user is no longer able to submit bugs.`);
                            return;
                        }
                        if (config[id].users[user.id] == undefined){
                            config[id].users[user.id] = {};
                            config[id].users[user.id].can_submit_bugs = false;
                            saveConfig();
                            message.channel.send(`This user is no longer able to submit bugs.`);
                            return;
                        }
                        if (!config[id].users[user.id].can_submit_bugs){
                            message.channel.send(`This user is already unable to submit bugs.`);
                            return;
                        }
                        else{
                            config[id].users[user.id].can_submit_bugs = false;
                            saveConfig();
                            message.channel.send(`This user can no longer submit bugs.`);
                        }
                    }
                    else{
                        message.channel.send(`User couldn't be found.`);
                    }
                }
            }
            else{
                message.channel.send(`Use one of the following commands for more information:\`\`\`\n${config[id].prefix}bug list\n${config[id].prefix}bug view\n${config[id].prefix}bug submit\n${config[id].prefix}bug close\n${config[id].prefix}bug disallow [user]\n${config[id].prefix}bug allow [user]\`\`\``);
            }
        }
        else if (command(channel, cmd, "spoon")){
            var msg = message.content.split(`${config[id].prefix}spoon `)[1];
            if (msg != undefined && msg != null){
                var array = msg.split("");
                array = array.shuffle();
                message.channel.send(array.join(''));
            }
        }
        else if (command(channel, cmd, "mock")){
            message.delete();
            var msg = message.content.split(`${config[id].prefix}mock `)[1];
            console.log(msg);
            if (msg != undefined && msg != null){
                msg = msg.toLowerCase();
                var mes = "";
                for (i = 0; i < msg.length; i++){
                    var rndm = rand(2);
                    if (rndm == 1){
                        mes += msg[i].toUpperCase();
                    }
                    else{
                        mes += msg[i].toLowerCase();
                    }
                }
                message.channel.send(mes);
            }
        }
        else if (command(channel, cmd, "gandalf")){
            message.delete();
            message.channel.send({files:['database/gandalf.gif']});
        }
        else if (command(channel, cmd, "top")){
            var page = parseInt(args[0]);
            if (isNaN(page)) page = 1;
            var sortable = [];
            for (var id in config[guild.id].ranks) {
                sortable.push([id, config[guild.id].ranks[id]]);
            }
            sortable.sort(function(a, b) {
                return b[1] - a[1]
            });
            page -= 1;
            var top = sortable.slice(10 * page, 10 * (page + 1));
            var embed = {embed: {
                author: {
                    name: bot.user.username,
                    icon_url: bot.user.avatarURL
                },
                color: main_color,
                fields: []
            }};
            var desc = "";
            if (page >= top.length){
                message.channel.send(`There are no users on this page.`);
                return;
            }
            for (i = 0; i < top.length; i++){
                if (!guild.members.get(top[i][0])) continue;
                var user = guild.members.get(top[i][0]).user;
                var level;
                for (j = 0; j < level_curve.length; j++){
                    if (config[guild.id].ranks[user.id] == undefined) { break; }
                    if (level_curve[j] > config[guild.id].ranks[user.id]){
                        level = j - 1;
                        break;
                    }
                }
                embed["embed"].fields.push({
                    name: `**Rank #${(i + 1) + (page * 10)}**`,
                    value: `${user.username}\nLevel ${level} (${top[i][1] * 7})\n${top[i][1]} Messages`
                })
            }
            message.channel.send(embed);
        }
        else if (command(channel, cmd, "channel")){
            var chnl = message.mentions.channels.first();
            if (!chnl) chnl = tryGetChannel(guild, args.join(' '));
            if (!chnl){
                chnl = channel;
            }
            var user = tryGetUser(guild, guild.ownerID);
            var embed = {embed: {
            	color: main_color,
                footer: {
                    text: user.tag,
                    icon_url: user.avatarURL
                },
                thumbnail: {
                    url: guild.iconURL
                },
                title: `${guild.name}: ${chnl.type == 'text' ? `#` : ``}${chnl.name}`,
                fields: [{
                    name: `**Channel Type**`,
                    value: chnl.type.capitalize(),
                    inline: true
                },{
                	name: chnl.type == 'text' ? `**NSFW**` : `**Bitrate**`,
                	value: chnl.type == 'text' ? chnl.nsfw : chnl.bitrate,
                	inline: true
                },{
                	name: `**Channel ID**`,
                	value: chnl.id
                },{
                	name: `**Channel Position**`,
                    value: chnl.position + 1,
                    inline: true
                },{
                    name: `**Created At**`,
                    value: chnl.createdAt,
                    inline: true
                }]
            }};
            if (chnl.type == 'voice'){
            	var members = getChannelMembers(chnl);
            	embed["embed"].fields.push({
            		name: `**User Limit**`,
            		value: chnl.userLimit
            	});
            	embed["embed"].fields.push({
            		name: `**Members**`,
            		value: members
            	});
            }
            message.channel.send(embed);
        }
        else if (command(channel, cmd, "server")){
        	var owner = tryGetUser(guild, guild.ownerID);
        	var emotes;
        	if (guild.emojis.map(e => e).length == 0){
        		emotes = '---';
        	}
        	else if (guild.emojis.map(e => e).join(' ').length < 1024){
        		emotes = guild.emojis.map(e => e).join(' ');
        	}
        	else{
        		emotes = guild.emojis.map(e => e).join(' ').slice(0, 1010).split(' ');
        		emotes = emotes.slice(0, emotes.length - 1);
        		emotes = emotes.join(' ') + " and more..."
        	}
        	var roles = guild.roles.map(r => r.name);
        	roles = roles.slice(1, roles.length);
        	if (roles.length == 0){
        		roles = '---';
        	}
        	else if (roles.join(', ').length < 1024){
        		roles = roles.join(', ');
        	}
        	else{
        		roles = roles.join(', ').slice(0, 1010).split(', ');
        		roles = roles.slice(0, roles.length - 1);
        		roles = roles.join(', ') + " and more..."
        	}
        	var text = guild.channels.filter(c => c.type == 'text').array().length
        	var voice = guild.channels.filter(c => c.type == 'voice').array().length
        	var embed = { embed: {
        		color: main_color,
        		author: {
        			name: owner.tag,
        			icon_url: owner.avatarURL
        		},
        		title: guild.name,
        		thumbnail: {
        			url: guild.iconURL
        		},
        		fields: [{
        			name: `**Region**`,
        			value: guild.region,
        			inline: true
        		},{
        			name: `**Default Channel**`,
        			value: `#${guild.defaultChannel.name}`,
        			inline: true
        		},{
        			name: `**Emoji's**`,
        			value: emotes
        		},{
        			name: `**Verification Level**`,
        			value: guild.verificationLevel,
        			inline: true
        		},{
        			name: `**Guild ID**`,
        			value: guild.id,
        			inline: true
        		}]
        	}};
        	if (guild.iconURL){
        		embed["embed"].fields.push({
        			name: `**Icon URL**`,
        			value: guild.iconURL
        		})
        	}
        	else{
        		embed["embed"].fields.push({
        			name: `**Roles**`,
        			value: roles
        		})
        	}
        	embed["embed"].fields.push({
        			name: `**Owner Tag**`,
        			value: owner.tag,
        			inline: true
        		});
        	embed["embed"].fields.push({
        			name: `**Owner ID**`,
        			value: guild.ownerID,
        			inline: true
        		});
        	if (guild.iconURL){
        		embed["embed"].fields.push({
        			name: `**Roles**`,
        			value: roles
        		});
        	}
        	embed["embed"].fields.push({
        			name: `**Created At**`,
        			value: guild.createdAt
        		});
        	embed["embed"].fields.push({
        			name: `**Channels**`,
        			value: guild.channels.map(c => c).length <= 10 ? guild.channels.map(c => c.name).join('\n') : `Text: ${text}\nVoice: ${voice}`,
        			inline: true
        		});
        	embed["embed"].fields.push({
        			name: `**Members**`,
        			value: getGuildMembers(guild),
        			inline: true
        		});
        	if (config[id].desc && config[id].desc != "") embed["embed"].description = config[id].desc;
        	message.channel.send(embed);
        }
        else if (command(channel, cmd, "quotes")){
            var user;
            if (args[0]){
                user = message.mentions.users.first();
                if (!user) user = tryGetUser(guild, args.join(' '));
                if (!user){
                    message.channel.send(`User not found.`);
                    return;
                }
            }
            else{
                user = message.member.user;
            }
            var member = message.member;
            member = guild.members.get(user.id);
            if (getQuotes(member).length == 0){
                message.channel.send(`${user == message.author ? `You don't` : `This user doesn't`} have any quotes saved!`);
                return;
            }
        	var embed = { embed: {
                color: main_color,
        		author: {
        			name: member.user.tag,
        			icon_url: member.user.avatarURL
        		},
        		fields: []
        	}};
        	for (i = 0; i < getQuotes(member).length; i++){
        		embed["embed"].fields.push({
        			name: `**Quote #${i + 1}**`,
        			value: getQuotes(member)[i]
        		})
        	}
        	message.channel.send(embed);

        }
        else if (command(channel, cmd, "add")){
            if (args[0] == "quote"){
                args.splice(0, 1);
                if (args[0] == undefined) {
                    message.channel.send(`Use \`${config[id].prefix}add quote [user]\` to see someone's quotes. Use \`${config[id].prefix}add quote [user] [message]\` to add a quote to that user. Note that [user] should be one word if it isn't a tag. \`%20\` will be substituted with a space.`);
                    return;
                }
                var user = message.mentions.users.first();
                if (!user) user = tryGetUser(guild, args[0]);
                if (!user){
                    message.channel.send(`User not found.`);
                    return;
                }
                var msg = message.content.split(`${config[id].prefix}add quote `)[1].split(' ');
                msg.splice(0, 1);
                msg = msg.join(' ');
                if (msg){
                    if (config[id].quotes[user.id] == undefined){
                        config[id].quotes[user.id] = [
                            msg
                        ];
                        saveConfig();
                        message.channel.send(`Quote saved!`);
                    }
                    else{
                        config[id].quotes[user.id].push(msg);
                        saveConfig();
                        message.channel.send(`Quote saved!`);
                    }
                }
                else if (!config[id].quotes[user.id] || config[id].quotes[user.id].length == 0){
                    message.channel.send(`This user doesn't have any quotes saved!`);
                }
            }
        }
        else if (command(channel, cmd, "remove")){
            var member = message.member;
            if (args[0] == "quote"){
                if (args[1] == undefined){
                    message.channel.send(`Please enter the index of the quote you'd like to remove. You can see your quotes with ?quotes.`);
                    return;
                }
                var index;
                index = parseInt(args[1]) - 1;
                if (isNaN(index)){
                    message.channel.send(`Please enter the index of the quote you'd like to remove. You can see your quotes with ?quotes.`);
                    return;
                }
                if (isBotAdmin(message.member)){
                    args.splice(0, 2);
                    var user = message.mentions.users.first();
                    if (!user) user = tryGetUser(guild, args.join(' '));
                    if (user) member = guild.members.get(user.id);
                }
                if (getQuotes(member).length == 0){
                    message.channel.send(`${member.user == message.author ? `You don't` : `This user doesn't`} have any quotes saved.`);
                    return;
                }
                if (index >= getQuotes(member).length){
                    var length = getQuotes(member).length;
                    message.channel.send(`You have only ${length} quote${length == 1 ? `` : `s`}. Pick a smaller index.`);
                    return;
                }
                else if (index < 0){
                    message.channel.send(`You cannot pick an index lower than 1.`);
                    return;
                }
                else{
                    config[id].quotes[member.user.id].splice(index, 1);
                    saveConfig();
                    message.channel.send(`Successfully removed quote #${index + 1}${member.user != message.author ? ` of ${member.user.username}` : ``}.`);
                }
            }
        }
        else if (command(channel, cmd, "bot")){
            var guilds = bot.guilds.map(g => g).length;
            var members = 0;
            for (i = 0; i < bot.guilds.map(g => g).length; i++){
                members += bot.guilds.map(g => g)[i].members.map(m => m).length;
            }
            var onlineSince = getDate(bot.readyAt).split('__')[0] + " at " + getDate(bot.readyAt).split('__')[1] + " (GMT + 2 (Mid EU))";
            message.channel.send({ embed:{
                author: {
                    name: bot.user.tag,
                    icon_url: bot.user.avatarURL
                },
                thumbnail: {
                    url: bot.user.avatarURL
                },
                color: main_color,
                title: `Serving ${members} users in ${guilds} guilds!`,
                description: `Online since ${onlineSince}`,
                fields:[{
                    name: `**Status**`,
                    value: bot.user.presence.status.capitalize(),
                    inline: true
                },{
                    name: `**ID**`,
                    value: bot.user.id,
                    inline: true
                },{
                    name: `**Creator**`,
                    value: `M3rein#7122`
                }]
            }});
        }
        if (isBotAdmin(message.member)){
            if (cmd == "say"){
                if (args[0] != undefined){
                    if (channelExists(message.guild, args[0])){
                        getChannel(message.guild, args[0]).send(message.content.split(`${config[id].prefix}say ${args[0]} `)[1]);
                    }
                }
            }
            else if (cmd == "id"){
                if (args[0] == "channel"){
                	args.splice(0, 1);
                	var channel = message.mentions.channels.first();
                	if (!channel) channel = tryGetChannel(guild, args.join(' '));
                	if (!channel) channel = message.channel;
                    message.channel.send(`ID of channel \`${channel.name}\`: ${channel.id}`);
                }
                else if (args[0] == "server"){
                    message.channel.send(`ID of guild "${guild.name}": ${guild.id}`);
                }
                else if (args[0] == "user"){
                	var user;
                    args.splice(0, 1);
                    var user = message.mentions.users.first();
                    if (!user) user = tryGetUser(guild, args.join(' '));
                    if (!user) user = message.member.user;
                    message.channel.send(`ID of user "${user.username}": ${user.id}`)
                }
            }
            else if (cmd == "serverdesc"){
            	if (args[0]){
          			config[id].desc = args.join(' ');
          			saveConfig();
          			message.channel.send(`Set the server description to:\n${config[id].desc}`);
            	}
            	else{
            		message.channel.send(`Set the description of the server as seen in \`${config[id].prefix}server\` using \`serverdesc [description]\`.`);
            	}
            }
            else if (cmd == "exp"){
                if (args[0] == "add"){
                    var user = message.mentions.users.first();
                    if (!user) user = tryGetUser(guild, args[1]);
                    if (!user){
                        message.channel.send(`User not found.`);
                        return;
                    }
                    if (isNaN(args[2])){
                        message.channel.send(`Invalid amount of experience to add.`);
                        return;
                    }
                    var exp = parseInt(args[2]);
                    if (!config[id].ranks) config[id].ranks = {};
                    if (!config[id].ranks[user.id]) config[id].ranks[user.id] = 0;
                    if (exp % 7 != 0){
                        message.channel.send(`Cannot add experience that is not divisible by 7.`);
                        return;
                    }
                    config[id].ranks[user.id] += exp / 7;
                    saveConfig();
                    message.channel.send(`User "${user.username}" experience is now ${config[id].ranks[user.id] * 7}.`);
                }
                else if (args[0] == "remove"){
                    var user = message.mentions.users.first();
                    if (!user) user = tryGetUser(guild, args[1]);
                    if (!user){
                        message.channel.send(`User not found.`);
                        return;
                    }
                    if (isNaN(args[2])){
                        message.channel.send(`Invalid amount of experience to remove.`);
                        return;
                    }
                    var exp = parseInt(args[2]);
                    if (!config[id].ranks) config[id].ranks = {};
                    if (!config[id].ranks[user.id]) config[id].ranks[user.id] = 0;
                    if (exp % 7 != 0){
                        message.channel.send(`Cannot remove experience that is not divisible by 7.`);
                        return;
                    }
                    config[id].ranks[user.id] -= exp / 7;
                    if (config[id].ranks[user.id] < 0) config[id].ranks[user.id] = 0;
                    saveConfig();
                    message.channel.send(`User "${user.username}" experience is now ${config[id].ranks[user.id] * 7}.`);
                }
                else if (args[0] == "set"){
                    var user = message.mentions.users.first();
                    if (!user) user = tryGetUser(guild, args[1]);
                    if (!user){
                        message.channel.send(`User not found.`);
                        return;
                    }
                    if (isNaN(args[2])){
                        message.channel.send(`Invalid amount of experience to set to.`);
                        return;
                    }
                    var exp = parseInt(args[2]);
                    if (!config[id].ranks) config[id].ranks = {};
                    if (!config[id].ranks[user.id]) config[id].ranks[user.id] = 0;
                    if (exp % 7 != 0){
                        message.channel.send(`Cannot set experience that is not divisible by 7.`);
                        return;
                    }
                    config[id].ranks[user.id] = exp / 7;
                    saveConfig();
                    message.channel.send(`User "${user.username}" experience is now ${config[id].ranks[user.id] * 7}.`);
                }
            }
            else if (cmd == "nick"){
                if (args[0] == undefined){
                    message.channel.send(`Specify a user to change their nickname.`);
                    return;
                }
                var user = message.mentions.users.first();
                if (!user) user = tryGetUser(guild, args[0]);
                if (!user){
                    message.channel.send(`Specify a valid user to change their nickname.`);
                    return;
                }
                var member = guild.members.get(user.id);
                if (args[1] == undefined){
                    member.setNickname('');
                    message.channel.send(`User "${user.username}"'s nickname has been reset.`);
                }
                else{
                    args.splice(0, 1);
                    member.setNickname(args.join(' '));
                    message.channel.send(`User "${user.username}"'s nickname has been set to "${args.join(' ')}".`);   
                }
            }
            else if (cmd == "kick"){
                if (!args[0]){
                    message.channel.send(`Specify a user to kick.`);
                    return;
                }
                var user = message.mentions.users.first();
                if (!user) user = tryGetUser(guild, args[0]);
                if (!user){
                    message.channel.send(`User not found.`);
                    return;
                }
                args.splice(0, 1);
                var reason = args.join(' ');
                guild.members.get(user.id).kick(reason);
                botLog(guild, `User "${message.author.username}" kicked user "${user.username}"${reason ? `for: ${reason}` : `.`}`);
            }
        }
        if (message.member.user.id == 270175313856561153){
            if (cmd == "sendnews"){
                if (!args[0]){
                    message.channel.send(`Please enter a message that you would like to send to all servers the bot is a part of.`);
                    return;
                }
                var guilds = bot.guilds.map(g => g);
                for (i = 0; i < guilds.length; i++){
                    if (!config[guilds[i].id].messages.news){
                        var name = guilds[i].defaultChannel ? guilds[i].defaultChannel.name : guilds[i].channels.map(c => c)[0].name;
                        config[guilds[i].id].messages.news = {
                            "status": "on",
                            "channel": name
                        }
                    }
                    if (config[guilds[i].id].messages.news.status == "on"){
                        var channel = tryGetChannel(guilds[i], config[guilds[i].id].messages.news.channel);
                        if (channel.constructor.name == 'TextChannel'){
                            channel.send(args.join(' '));
                        }
                        else{
                            botLog(guilds[i], `Channel \`${config[guilds[i].id].messages.news.channel}\` does not exist as referred to in \`v-config messages news channel\` or is invalid.`);
                        }
                    }
                }
            }
        }
    }
    if (message.content.startsWith("v-config") && isBotAdmin(message.member)){ // Configuration of the bot for the server.
        args = message.content.split(" ");
        args.splice(0, 1);
        var cmd = args[0];
        var setting = args[1];
        logMessage(guild, `${getDate()} ${message.author.username}: ${message.content}`);
        if (cmd == "prefix"){
            if (setting != undefined){
                if (setting == "v-"){
                    message.channel.send(`\`v-\` cannot be used as a command prefix.`);
                }
                else{
                    config[id]["prefix"] = setting;
                    saveConfig();
                    message.channel.send(`Successfully set active command prefix to \`${config[id].prefix}\`.`);
                }
            }
            else{
                message.channel.send(`The prefix for commands is currently ${config[id].prefix}. Use \`v-config prefix [new prefix]\` to change it.`);
            }
        }
        else if (cmd == "messages"){
            var arg = args[1];
            var setting = args[2];
            if (arg == "welcome"){
                if (setting == "msg"){
                    var msg = message.content.split('v-config messages welcome msg ')[1];
                    if (!msg){
                        message.channel.send(`The current welcoming message is: \`\`\`${config[id]["messages"]["welcome"]["msg"]}\`\`\`\nUse this command to change the message:\`\`\`v-config messages welcome msg [message]\`\`\`Inside the message, \`(user)\` will be replaced with the joining user's username, whereas \`(@user)\` will tag the joining user.`);
                    }
                    else{
                        config[id].messages.welcome.msg = msg;
                        saveConfig();
                        message.channel.send(`Successfully set welcome message to: \`\`\`${config[id].messages.welcome.msg}\`\`\``);
                    }
                }
                else if (setting == "on"){
                    if (config[id].messages.welcome.status == "on"){
                        message.channel.send(`The welcome message was already enabled. Nothing happened.`);
                    }
                    else{
                        config[id].messages.welcome.status = "on";
                        saveConfig();
                        message.channel.send(`The welcome message will now be sent for every new member that joins the server.`);
                    }
                }
                else if (setting == "off"){
                    if (config[id].messages.welcome.status == "off"){
                        message.channel.send(`The welcome message was already disabled. Nothing happened.`);
                    }
                    else{
                        config[id].messages.welcome.status = "off";
                        saveConfig();
                        message.channel.send(`The welcome message will no longer be sent for every new member that joins the server.`);
                    }
                }
                else if (setting == "channel"){
                    if (args[3] != undefined){
                        channel = message.mentions.channels.first();
                        if (!channel) channel = tryGetChannel(guild, args[3]);
                        if (channel) {
                            config[id].messages.welcome.channel = channel.name;
                        }
                        else{
                            config[id].messages.welcome.channel = args[3];
                        }
                        saveConfig();
                        message.channel.send('The welcome message will now be sent in `' + config[id].messages.welcome.channel + '`.');
                    }
                    else{
                        message.channel.send('The channel the welcome message will be sent in. Currently set to ```' + config[id].messages.welcome.channel + '```Use the following command to change it: ```v-config messages welcome channel [channelname]```Note that it should be the channel **name**, not a hyperlink or id.');
                    }
                }
                else{
                    message.channel.send('The message that is sent whenever a new user joins.```Message: '+config[id].messages.welcome.msg+'\nStatus: '+config[id].messages.welcome.status+'\nChannel: '+config[id]["messages"]["welcome"]["channel"]+'```\nUse one of the following commands to change the settings:```v-config messages welcome msg [message]\nv-config messages welcome on\nv-config messages welcome off\nv-config messages welcome channel [channelname]```In the welcome message, `(user)` will be replaced with the username.');
                }
            }
            else if (arg == "levelup"){
                if (!config[id].messages.levelup){
                    config[id].messages.levelup = {
                        "msg": "Congrats, (@user)! You leveled up to level (level)!",
                        "status": "on"
                    }
                }
                if (setting == "msg"){
                    if (args[3] == undefined){
                        message.channel.send(`You can change the levelup message by typing \`v-config messages levelup msg [message]\`.\nIn the message, \`(user)\` will become the user's name, \`(@user)\` will tag the person, and (level) will become the new level.`);
                        return;
                    }
                    config[id].messages.levelup.msg = message.content.split(`v-config messages levelup msg `)[1];
                    saveConfig();
                    message.channel.send(`The message when a user levels up has been set to\`\`\`\n${config[id].messages.levelup.msg}\`\`\``);
                }
                else if (setting == "on"){
                    if (config[id].messages.levelup.status == "on"){
                        message.channel.send(`The message when a user levels up is already enabled.`);
                        return;
                    }
                    config[id].messages.levelup.status = "on";
                    saveConfig();
                    message.channel.send(`The message when a user levels up has been enabled.`);
                }
                else if (setting == "off"){
                    if (config[id].messages.levelup.status == "off"){
                        message.channel.send(`The message when a user levels up is already disabled.`);
                        return;
                    }
                    config[id].messages.levelup.status = "off";
                    saveConfig();
                    message.channel.send(`The message when a user levels up has been disabled.`);
                }
                else{
                    message.channel.send(`When someone levels up, Vulpix will send a message. You can configure that using one of the following commands:\n\`\`\`v-config messages levelup msg\nv-config messages levelup on\nv-config messages levelup off\`\`\``);
                }
            }
            else if (arg == "goodbye"){
                if (!config[id].messages.goodbye){
                    config[id].messages.goodbye = {
                        "msg": "(user) has just left the server. Rest in peace!",
                        "status": "on",
                        "channel": "general"
                    }
                }
                if (args[2] == "msg"){
                    var msg = message.content.split('v-config messages goodbye msg ')[1];
                    if (!msg){
                        message.channel.send(`The current goodbye message is:\`\`\`\n${config[id].messages.goodbye.msg}\`\`\`Type \`v-config messages goodbye msg [message]\` to change it.`)
                        return;
                    }
                    config[id].messages.goodbye.msg = msg;
                    saveConfig();
                    message.channel.send(`The goodbye message has been set to:\`\`\`\n${config[id].messages.goodbye.msg}\`\`\``);
                }
                else if (args[2] == "on"){
                    if (config[id].messages.goodbye.status == "on"){
                        message.channel.send(`The goodbye message is already enabled.`);
                        return;
                    }
                    config[id].messages.goodbye.status = "on";
                    saveConfig();
                    message.channel.send(`The goodbye message has been enabled.`);
                }
                else if (args[2] == "off"){
                    if (config[id].messages.goodbye.status == "off"){
                        message.channel.send(`The goodbye message is already disabled.`);
                        return;
                    }
                    config[id].messages.goodbye.status = "off";
                    saveConfig();
                    message.channel.send(`The goodbye message has been disabled.`);
                }
                else if (args[2] == "channel"){
                    if (!args[3]){
                        message.channel.send(`The goodbye message is currently being sent in \`${config[id].messages.goodbye.channel}\`. You can change the channel using \`v-config messages goodbye channel [channel]\`.`);
                        return;
                    }
                    channel = message.mentions.channels.first();
                    if (!channel) channel = tryGetChannel(guild, args[3]);
                    if (channel) {
                        config[id].messages.goodbye.channel = channel.name;
                    }
                    else{
                        config[id].messages.goodbye.channel = args[3];
                    }
                    saveConfig();
                    message.channel.send(`The goodbye message will now be sent in \`${config[id].messages.goodbye.channel}\`.`);
                }
                else{
                    message.channel.send(`These are the current configurations for the goodbye messages:\`\`\`\nMessage: ${config[id].messages.goodbye.msg}\nStatus: ${config[id].messages.goodbye.status}\nChannel: ${config[id].messages.goodbye.channel}\`\`\`Change the configurations with one of the following commands: \`\`\`\nv-config messages goodbye msg\nv-config messages goodbye on\nv-config messages goodbye off\nv-config messages goodbye channel\`\`\``)
                }
            }
            else if (args[1] == "news"){
                if (!config[id].messages.news){
                    config[id].messages.news = {
                        "status": "on",
                        "channel": "general"
                    }
                }
                if (args[2] == "on"){
                    if (config[id].messages.news.status == "on"){
                        message.channel.send(`You already have news enabled.`);
                        return;
                    }
                    config[id].messages.news.status = "on";
                    saveConfig();
                    message.channel.send(`News has been enabled.`);
                }
                else if (args[2] == "off"){
                    if (config[id].messages.news.status == "off"){
                        message.channel.send(`You already have news disabled.`);
                        return;
                    }
                    config[id].messages.news.status = "off";
                    saveConfig();
                    message.channel.send(`News has been disabled.`);
                }
                else if (args[2] == "channel"){
                    if (args[3]){
                        if (config[id].messages.news.channel == args[3]){
                            message.channel.send(`You are already receiving news in that channel.`);
                            return;
                        }
                        config[id].messages.news.channel = args[3]
                        saveConfig();
                        message.channel.send(`You will now receive news in \`${config[id].messages.news.channel}\` if you have it enabled.`);
                        return;
                    }
                    message.channel.send(`News will be sent in channel \`${config[id].messages.news.channel}\` if you have it enabled. To change in which channel news is sent, use \`v-config messages news channels [channel]\`.`);
                }
                else{
                    message.channel.send(`Your news configurations are as follows: \`\`\`Status: ${config[id].messages.news.status}\nChannel: ${config[id].messages.news.channel}\`\`\`To change any of them, use one of the following commands: \`\`\`v-config messages news off\nv-config messages news on\nv-config messages news channel\`\`\`News are messages sent by the creator of the bot, M3rein, to inform you about things that are currently hot and happening. This includes: new, major game releases, fangame takedowns, and other resource releases (including his own).`);
                }
            }
            else{
                message.channel.send('These are messages the bot will send under specific circumstances. You can turn them on/off, change the messages, and choose in which channel they should be sent. Use one of the following commands for more information:```v-config messages welcome\nv-config messages levelup\nv-config messages goodbye\nv-config messages news```');
            }
        }
        else if (cmd == "roles"){
            if (args[1] == "add"){
                if (!args[2]){
                    message.channel.send(`To add a role on a specific event, use one of the following commands:\`\`\`\nv-config roles add "myRole" on "memberJoin"\nv-config roles add "myRole" on "level 5"\`\`\`Explanation:\nIf the event is "memberJoin", whenever the user joins the server, "myRole" will be given to them.\nIf the event is "level X", whenever level X is reached, the user will be given "myRole".`);
                    return;
                }
                var msg = message.content.split('v-config roles add ')[1];
                if (msg.match(/"/g).length != 4){
                    message.channel.send(`Invalid format for adding role event.`);
                    return;
                }
                if (!msg.contains('on')){
                    message.channel.send(`Invalid format for adding role event.`);
                    return;
                }
                var role = msg.split('"')[1].split('"')[0];
                var event = msg.split('"')[3].split('"')[0];
                var param = event.split(' ')[1];
                if (event.contains('level')){
                    if (isNaN(param)){
                        message.channel.send(`Invalid level for event "level X".`);
                        return;
                    }
                }
                if (event != "memberJoin" && !event.contains('level')){
                    message.channel.send(`Invalid event specified.`);
                    return;
                }
                if (role && event){
                    if (!config[id].roles) config[id].roles = {};
                    if (!config[id].roles[event]) config[id].roles[event] = [];
                    config[id].roles[event].push(role);
                    message.channel.send(`Upon event "${event}", role "${role}" will be added.`);
                }
            }
            else if (args[1] == "remove"){
                if (!config[id].roles){
                    message.channel.send(`There are no role events that you can remove.`);
                    return;
                }
                if (!args[2]){
                    message.channel.send(`You can remove automatically assigned roles by typing \`v-config roles remove [index]\`. You can see the index of the role using \`v-config roles\`.`);
                    return;
                }
                if (isNaN(args[2])){
                    message.channel.send(`Invalid index to remove at.`);
                    return;
                }
                var roles = []
                var keys = Object.keys(config[id].roles)
                for (i = 0; i < keys.length; i++){
                    for (j = 0; j < config[id].roles[keys[i]].length; j++){
                        roles.push(`${roles.length + 1}.) "${config[id].roles[keys[i]][j]}" on "${keys[i]}"`);
                    }
                }
                var index = parseInt(args[2]) - 1;
                if (index >= roles.length){
                    message.channel.send(`Index out of range.`);
                    return;
                }
                var msg = roles[index];
                var key = msg.split('"')[3].split('"')[0];
                var value = msg.split('"')[1].split('"')[0];
                config[id].roles[key].splice(config[id].roles[key].indexOf(value), 1);
                if (config[id].roles[key].length == 0){
                    delete config[id].roles[key];
                }
                saveConfig();
                message.channel.send(`Successfully removed "${value}" on "${key}"`);
            }
            else{
                var roles = []
                if (config[id].roles){
                    var keys = Object.keys(config[id].roles)
                    for (i = 0; i < keys.length; i++){
                        for (j = 0; j < config[id].roles[keys[i]].length; j++){
                            roles.push(`${roles.length + 1}.) "${config[id].roles[keys[i]][j]}" on "${keys[i]}"`);
                        }
                    }
                }
                message.channel.send(`These role events are currently active:\`\`\`\n${roles.length == 0 ? `---` : roles.join('\n')}\`\`\`Configure roles by using one of the following commands:\`\`\`\nv-config roles add\nv-config roles remove\`\`\``)
            }
        }
        else if (cmd == "bot_log"){
            if (!config[id].bot_log) {
                config[id].bot_log = {
                    "channel": "bot_log",
                    "status": "on"
                }
            }
            if (args[1] == "channel"){
                if (!args[2]){
                    message.channel.send(`The bot will currently log its unordinary actions in \`${config[id].bot_log.channel}\`.`);
                    return;
                }
                channel = message.mentions.channels.first();
                if (!channel) channel = tryGetChannel(guild, args[2]);
                if (channel) {
                    config[id].bot_log.channel = channel.name;
                }
                else{
                    config[id].bot_log.channel = args[2];
                }
                saveConfig();
                message.channel.send(`The bot will now log unordinary actions in channel \`${config[id].bot_log.channel}\`.`);
            }
            else if (args[1] == "on"){
                if (config[id].bot_log.status == "on"){
                    message.channel.send(`The bot log is already enabled.`);
                    return;
                }
                config[id].bot_log.status = "on";
                saveConfig();
                message.channel.send(`The bot log is now enabled.`);
            }
            else if (args[1] == "off"){
                if (config[id].bot_log.status == "off"){
                    message.channel.send(`The bot log is already disabled.`);
                    return;
                }
                config[id].bot_log.status = "off";
                saveConfig();
                message.channel.send(`The bot log is now disabled.`);
            }
            else{
                message.channel.send(`The channel the bot will log its unordinary actions. The current configuration is as follows:\`\`\`\nChannel: ${config[id].bot_log.channel}\nStatus: ${config[id].bot_log.status}\`\`\`Use one of the following commands to change the configuration:\`\`\`\nv-config bot_log channel\nv-config bot_log on\nv-config bot_log off\`\`\``);
            }
        }
        else if (cmd == "channels"){
            if (!config[id].channels){
                console.log(`Resetting channels for server ${id}`)
                config[id].channels = {};
            }
            var channels = [];
            for (i = 0; i < guild.channels.array().length; i++){
                if (guild.channels.array()[i].type == 'text') { channels.push(guild.channels.array()[i].name); }
            }
            if (args[1]){
                channel = message.mentions.channels.first();
                if (!channel) channel = tryGetChannel(guild, args[1]);
                if (!channel || channel.type != 'text'){
                    message.channel.send(`That channel does not exist or is not a text channel.`);
                }
            }
            if (!config[id].channels[channel.id]){
                console.log(`Resetting commands for channel ${channel.id} on server ${id}`)
                config[id].channels[channel.id] = {
                    "disabled_commands": []
                };
            }
            if (channels.contains(args[1])){
                if (args[2] == "disable"){
                    if (args[3] != undefined){
                        if (!commands.contains(args[3])){
                            message.channel.send(`Command "${args[3]}" is not a valid Vulpix command.`);
                            return;
                        }
                        if (config[id].channels[channel.id].disabled_commands.contains(args[3])){
                            message.channel.send(`"${args[3]}" is already disabled in \`${args[1]}\`.`);
                        }
                        else{
                            config[id].channels[channel.id].disabled_commands.push(args[3]);
                            saveConfig();
                            message.channel.send(`"${args[3]}" is now disabled in \`${args[1]}\`.`);
                        }
                    }
                    else{
                        message.channel.send(`To disable one of the following Vulpix commands: \`\`\`\n${commands.join('\n')}\`\`\`\nType the following: \`\`\`\nv-config channels [channel] disable [command]\`\`\`You should not write a prefix before the command, only the name.`);
                    }
                }
                else if (args[2] == "enable"){
                    if (args[3] != undefined){
                        if (!commands.contains(args[3])){
                            message.channel.send(`Command "${args[3]}" is not a valid Vulpix command.`);
                            return;
                        }
                        if (!config[id].channels[channel.id].disabled_commands.contains(args[3])){
                            message.channel.send(`"${args[3]}" is already enabled in \`${args[1]}\`.`);
                        }
                        else{
                            config[id].channels[channel.id].disabled_commands.splice(config[id].channels[channel.id].disabled_commands.indexOf(args[3]), 1);
                            saveConfig();
                            message.channel.send(`"${args[3]}" is now enabled in \`${args[1]}\`.`);
                        }
                    }
                    else{
                        message.channel.send(`To enable one of the following Vulpix commands: \`\`\`\n${commands.join('\n')}\`\`\`Type the following: \`\`\`\nv-config channels [channel] enable [command]\`\`\`You should not write a prefix before the command, only the name.`);
                    }
                }
                else if (args[2] == "disable_all"){
                    config[id].channels[channel.id].disabled_commands = [];
                    for (i = 0; i < commands.length; i++){
                        config[id].channels[channel.id].disabled_commands.push(commands[i]);
                    }
                    saveConfig();
                    message.channel.send(`All public Vulpix commands besides "v-config" are now disabled in \`${args[1]}\`.`)
                }
                else if (args[2] == "enable_all"){
                    config[id].channels[channel.id].disabled_commands = [];
                    saveConfig();
                    message.channel.send(`All public Vulpix commands are now enabled in channel \`${args[1]}\`.`)
                }
                else{
                    message.channel.send(`${`These commands are currently disabled in \`${args[1]}\`: \`\`\`\n${config[id].channels[channel.id].disabled_commands.length == 0 ? "---" : config[id].channels[channel.id].disabled_commands.join('\n')}\`\`\``} To disable or enable a command/all commands for a channel, use one of the following commands:\`\`\`\nv-config channels [channel] disable\nv-config channels [channel] enable\nv-config channels [channel] disable_all\nv-config channels [channel] enable_all\`\`\``);
                }
            }
            else if (args[1] == undefined){
                channels.splice(channels.indexOf('General'), 1);
                var msg = 'v-config channels ' + channels.join('\nv-config channels ');
                message.channel.send(`Use one of the following commands to configure commands for a channel: \`\`\`\n${msg}\`\`\``);
            }
            else{
                message.channel.send(`Channel \`${args[1]}\` doesn't exist.`);
            }
        }
        else if (cmd == "reset_to_default"){
            setDefaults(message.guild);
            message.channel.send(`The configurations have been reset to the default.`);
        }
        else if (cmd == "show"){
            var msg = "";
            if (args[1] == "prefix"){
                msg = config[id].prefix;
            }
            else if (args[1] == "all"){
                msg = jsonToString(config[id]);
            }
            else if (args[1] == "messages"){
                msg = jsonToString(config[id].messages);
            }
            else if (args[1] == "quotes"){
                msg = jsonToString(config[id].quotes);
            }
            else if (args[1] == "ranks"){
                msg = jsonToString(config[id].ranks);
            }
            else if (args[1] == "channels"){
                msg = jsonToString(config[id].channels);
            }
            else if (args[1] == "bugs"){
                msg = jsonToString(config[id].bugs);
            }
            else if (args[1] == "users"){
                msg = jsonToString(config[id].users);
            }
            else{
                message.channel.send(`Use one of the following values to show: \`\`\`v-config show prefix\nv-config show messages\nv-config show quotes\nv-config show ranks\nv-config show channels\nv-config show bugs\nv-config show users\`\`\``);
                return;
            }
            message.channel.send('```JavaScript\n'+msg+'```');
        }
        else if (cmd == "commands"){
            if (!config[id].commands){
                config[id].commands = {}
            }
            if (args[1] == "create"){
                if (!args[2]){
                    message.channel.send(`
To create a new command, use the following format: \`\`\`v-config commands create "[name]": [code]\`\`\`
Here is an example: \`\`\`v-config commands create "download": send('The game is not out yet!')\`\`\`
Note that you can use \`${config[id].prefix}eval\` to test the code!

To create a more advanced command, you should know the basics of JavaScript. It may be possible if you don't, but it will be harder.
Here are some methods you can use:

Note: Wherever you see a "user" argument, that, by default, is whoever sent the message, but it can also be a username!
\`\`\`send('message')
Sends a message.
                        
send('message', 'channelname');
Sends a message in the channel you specified.
                        
canAddRole(user, 'Member');
Returns a boolean. True if the bot can give the user the role, false if not.

hasRole(user, 'Member');
Returns a boolean. True if the user already has the role, false if they don't.
                        
addRole(user, 'Member');
Adds the role you specified to the user. Returns true if it succeeded, false if it didn't. If it can't add the role, it will also log that in the bot-log channel if bot logs are enabled. Use v-config bot_log to configure the bot logs.

rand(number)
Returns a random number between 0 and [number], exclusive.
\`\`\`
If you feel there are methods missing to make it easier to create a command, please get in touch with \`Marin#7122\`.`);
                    return;
                }
                else{
                    args.splice(0, 2);
                    var msg = args.join(' ');
                    if (!msg.contains(':')){
                        message.channel.send(`Invalid command format. Separator \`:\` was not found.`);
                        return;
                    }
                    if (args[0].startsWith('"') || args[0].startsWith("'")){
                        args[0] = args[0].substr(1);
                    }
                    if (args[0].endsWith('"') || args[0].endsWith("'")){
                        args[0] = args[0].substr(0, str.length - 1);
                    }
                    if (args[0].endsWith('":') || args[0].endsWith("':")){
                        args[0] = args[0].substr(0, str.length - 2);
                    }
                    channel.send(args[0]);
                }
            }
            else if (args[1] == "delete"){

            }
            else if (args[1] == "view"){

            }
            else{
                var commands = "";
                var keys = Object.keys(config[id].commands);
                for (i = 0; i < keys.length; i++){
                    commands += `${i+1}.) ${keys[i]}\r\n`;
                }
                message.channel.send(`These are all custom commands currently configured:\`\`\`${keys.length == 0 ? `---` : commands}\`\`\`To create a new command, use \`v-config commands create\`. To delete a command, use \`v-config commands delete [index]\`. To see the code behind a command, use \`v-config commands view [index]\`.`);
            }
        }
        else{
            message.channel.send('To configure the bot for this server, use one of the following commands: ```v-config prefix\nv-config messages\nv-config roles\nv-config reset_to_default\nv-config channels\nv-config show\nv-config bot_log\nv-config commands```')
        }
    }
});

bot.login(process.env.TOKEN);