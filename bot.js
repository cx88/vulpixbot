const Discord = require('discord.js');
const bot = new Discord.Client();
var paste = require('better-pastebin');
var url = "https://pastebin.com/4cAUChCC";
var fs = require('fs');
var dlt = fs.readFileSync('database/delet_this.json');
var delet_this = JSON.parse(dlt)["memes"];
var vids = fs.readFileSync('database/thundaga.json');
var eps = JSON.parse(vids);
var config = "";
var main_color = 10876925;
var commandlog = "https://pastebin.com/wZE2rymj";
var pbuser = process.env.PASTEBIN.split('|')[0];
var pbpass = process.env.PASTEBIN.split('|')[1];
paste.setDevKey('14924a0dad25e921a08ff536acfabc88');
paste.login(pbuser, pbpass, function(success, data){
    if (!success){
        console.log(`Failed (${data})`);
    }
    paste.get(url, function(success, data){
        if (success){
            config = JSON.parse(data);
        }
    });
});
const level_curve = [ 0,
  24,    54,    93,    135,   183,   // 1  - 5
  234,   288,   351,   420,   495,   // 6  - 10
  582,   684,   771,   867,   984,   // 11 - 15
  1092,  1260,  1476,  1716,  1953,  // 16 - 20
  2181,  2436,  2742,  3159,  3576,  // 21 - 25
  4155,  4788,  5589,  6435,  7452,  // 26 - 30
  8643,  9999,  11676, 13734, 15597, // 31 - 35
  17898, 20496, 23163, 26721, 30000  // 35 - 40
]

const fortune = [
    "Most certainly.",
    "I dare say so.",
    "I can say that that is so.",
    "Naturally.",
    "Without a doubt.",
    "Obviously.",
    "Destined to be.",
    "Yes.",
    "Of course.",

    "Not a chance.",
    "Never.",
    "I estimate your chance at circa 0.1%.",
    "No.",
    "How could you even think so.",
    "I have yet to see something this ridiculous.",
    "The sun is rather to burn out this era.",
    "You would have lost a lot of money if you bet.",
    "Four eagles. That means no."
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
    "delet", "rank", "fortune", "8ball",
    "eval", "quote", "user", "bug", "spoon",
    "channel"
]

/*
{
  CREATE_INSTANT_INVITE: true,
  KICK_MEMBERS: true,
  BAN_MEMBERS: true,
  ADMINISTRATOR: true,
  MANAGE_CHANNELS: true,
  MANAGE_GUILD: true,
  ADD_REACTIONS: true,
  READ_MESSAGES: true,
  SEND_MESSAGES: true,
  SEND_TTS_MESSAGES: true,
  MANAGE_MESSAGES: true,
  EMBED_LINKS: true,
  ATTACH_FILES: true,
  READ_MESSAGE_HISTORY: true,
  MENTION_EVERYONE: true,
  EXTERNAL_EMOJIS: true,
  CONNECT: true,
  SPEAK: true,
  MUTE_MEMBERS: true,
  DEAFEN_MEMBERS: true,
  MOVE_MEMBERS: true,
  USE_VAD: true,
  CHANGE_NICKNAME: true,
  MANAGE_NICKNAMES: true,
  MANAGE_ROLES_OR_PERMISSIONS: true,
  MANAGE_WEBHOOKS: true,
  MANAGE_EMOJIS: true
}
*/

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
    if (json.construcor == Array){
        return `[\n    "${json.join('",\n    "')}"\n]`
    }
    else{
        return JSON.stringify(json, null, 4);
    }
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

function getUser(guild, user){
    try{
        return guild.members.find(m => m.user.username.toLowerCase() === user.toLowerCase()).user;
    }
    catch (err){
        return null;
    }
}

function tryGetChannel(message){
    args = message.content.split(' ');
    var channel;
    for (i = 0; i < args.length; i++){
        if (channel != null && channel != undefined) break;
        if (message.mentions.channels.first() != undefined){
            channel = message.mentions.channels.first();
        }
        else{
            if (channelExists(message.guild, args[i])){
                channel = getChannel(message.guild, args[1]);
            }
        }
    }
    return channel;
}

function tryGetUser(message){
    args = message.content.split(' ');
    var user;
    for (i = 0; i < args.length; i++){
        if (user != null && user != undefined) break;
        if (message.mentions.users.first() != undefined){
            user = message.mentions.users.first();
        }
        else{
            var name = args[i];
            while (name.contains('%20')){
                name = name.replace('%20', ' ');
            }
            if (userExists(message.guild, name)){
                user = getUser(message.guild, name);
            }
            else{
                var name = message.guild.members.find('nickname', name);
                if (name != null && name != undefined){
                    user = name.user;
                }
            }
        }
    }
    return user;
}

function channelExists(guild, channel){
    var chnl = getChannel(guild, channel);
    return chnl != null && chnl != undefined;
}

function getChannel(guild, channel){
    return guild.channels.find('name', channel);
}

function isBotAdmin(member){
    return hasRole(member, "Vulpix Admin") || member.user.id == member.guild.ownerID || member.user.id == '270175313856561153';
}

function setDefaults(guild){
    var g = guild.id.toString(); // Default Config settings.
    config[g] = {
        "prefix": "?",
        "ignored_channels": [
        ],
        "disabled_commands": [

        ],
        "ranks": {

        },
        "users": {

        },
        "channels": {

        },
        "messages": {
            "welcome": {
                "msg": "Welcome to the server, (user)!",
                "status": "on",
                "role": "Member",
                "channel": "general"
            },
            "mute": {
                "msg": "(user) has been muted!",
                "status": "on",
                "role": "Muted",
                "channel": "general"
            }
        },
        "quotes": {

        },
        "bugs": {

        }
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
    var str = jsonToString(config);
    paste.setDevKey('14924a0dad25e921a08ff536acfabc88');
    paste.login(pbuser, pbpass, function(success, data){
        paste.edit(url, {
            contents: str
        });
    });
}

function logMessage(message){
    console.log(message);
}

function rand(int){
    return Math.floor(Math.random() * parseInt(int));
}

function command(channel, arg, cmd){
    try{
        return arg == cmd && !config[channel.guild.id].channels[channel.id].disabled_commands.contains(cmd);
    }
    catch (err){
        config[channel.guild.id].channels = {};
        config[channel.guild.id].channels[channel.id] = {};
        config[channel.guild.id].channels[channel.id].disabled_commands = [];
        saveConfig();
        return true;
    }
}

function getBugEmbed(title, description, username, url){
    return {embed: {
        color: main_color,
        author: {
            name: username,
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

setInterval(saveConfig, 30000);

bot.on('ready', () => {
    console.log('Vulpix online');
    bot.user.setGame("Type v-config");
});

bot.on('guildCreate', guild =>{
    logMessage('Vulpix joined "' + guild.name + '" server with ID "' + guild.id.toString() + '" at date: ' + Date.now() + '.');
    guild.defaultChannel.send('Hello! I am Vulpix. I am here to help you out with utility commands, shortcuts, and more. Contact user `M3rein#7122` for questions and inquiries!');
    setDefaults(guild);
})

bot.on('guildMemberAdd', member =>{
    if (config[member.guild.id.toString()] == undefined){
        setDefaults(member.guild);
    }
    if (config[member.guild.id.toString()]["messages"]["welcome"]["status"] == "on"){
        var channel = config[member.guild.id.toString()]["messages"]["welcome"]["channel"];
        var msg = config[member.guild.id.toString()]["messages"]["welcome"]["msg"];
        msg = msg.replace('(user)', member.user);
        if (channelExists(member.guild, channel)){
            getChannel(member.guild, channel).send(msg);
        }
        else{
            member.guild.defaultChannel.send(`Channel '${channel}' does not exist as referred to in \`v-config messages welcome channel\`. Welcome either way, ` + member.user + `!`);
        }
    }
});

bot.on('message', message => {
    if (message.member.user.bot) return;
    var guild = message.guild;
    var id = guild.id;
    var channel = message.channel;
    if (config[id] == undefined) return;
    if (!message.content.startsWith(config[id].prefix) && !message.content.startsWith("v-")){
        if (config[id]["ranks"] == undefined){
            config[id]["ranks"] = {};
        }
        if (config[id]["ranks"][message.member.user.id] == undefined){
            config[id]["ranks"][message.member.user.id] = 0;
        }
        else{
           config[id]["ranks"][message.member.user.id]++;
            if (level_curve.contains(config[id]["ranks"][message.member.user.id])){
                message.channel.send(`${message.member.user} leveled up to level ${level_curve.indexOf(config[id]["ranks"][message.member.user.id])}!`);
            }
        }
    }
    if (!config[id]["ignored_channels"].contains(message.channel.name)){
        if (message.content.startsWith(config[id]["prefix"])){
            cmd = message.content.substr(1).split(' ')[0];
            args = message.content.split(" ");
            args.splice(0, 1);
            logMessage(dateNow() + ' ' + message.author.username + `: ` + message.content);
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
                message.channel.send(delet_this[rand(delet_this.length)]);
            }
            else if (command(channel, cmd, "rank")){
                var user = message.member.user;
                if (message.mentions.users.first() != undefined){
                    user = message.mentions.users.first();
                }
                if (user.bot){
                    message.channel.send(`Bots do not have a rank.`);
                    return;
                }
                var rank = 0;
                var req = 16;
                for (i = 0; i < level_curve.length; i++){
                    if (config[id]["ranks"][user.id] == undefined) { break; }
                    if (level_curve[i] > config[id]["ranks"][user.id]){
                        rank = i - 1;
                        req = level_curve[i];
                        break;
                    }
                }
                var exp = config[id]["ranks"][user.id] * 7 + " / " + req * 7;
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
                        value: "  " + rank
                    },{
                        name: "**Experience**",
                        value: exp
                    },{
                        name: "**Rank**",
                        value: `${getRank(guild, user)}/${guild.memberCount}`
                    }]
                }})
            }
            else if (command(channel, cmd, "fortune")){
                message.channel.send(fortune[rand(fortune.length)]);
            }
            else if (command(channel, cmd, "8ball")){
                message.channel.send(magic8ball[rand(magic8ball.length)]);
            }
            else if (command(channel, cmd, "eval")){
                var str = message.content.split(`${config[id].prefix}eval `)[1];
                try{
                   message.channel.send(eval(str));
                }
                catch (err){
                    message.channel.send(`Failed to evaluate expression.`);
                }
            }
            else if (command(channel, cmd, "quote")){
                if (args[0] == undefined) {
                    message.channel.send(`Use \`${config[id].prefix}quote [user]\` to see someone's quotes. Use \`${config[id].prefix}quote [user] [message]\` to add a quote to that user. Note that [user] should be one word if it isn't a tag. \`%20\` will be substituted with a space.`);
                    return;
                }
                var user = tryGetUser(message);
                if (user == undefined){
                    message.channel.send(`User not found.`);
                }
                else{
                    var msg = message.content.split(' ')
                    msg.splice(0, 2);
                    msg = msg.join(' ');
                    if (msg != "" && msg != null && msg != undefined && msg != " "){
                        if (config[id]["quotes"][user.id] == undefined){
                            config[id]["quotes"][user.id] = [
                                msg
                            ];
                            saveConfig();
                            message.channel.send(`Quote saved!`);
                        }
                        else{
                            config[id]["quotes"][user.id].push(msg);
                            saveConfig();
                            message.channel.send(`Quote saved!`);
                        }
                    }
                    else if (config[id]["quotes"][user.id] == undefined || config[id]["quotes"][user.id].length == 0){
                        message.channel.send(`This user doesn't have any quotes saved!`);
                    }
                    else{
                        message.channel.send(`"${config[id]["quotes"][user.id][rand(config[id]["quotes"][user.id].length)]}"\n - ${user.username}`);
                    }
                }
            }
            else if (command(channel, cmd, "user")){
                if (args[0] == undefined) return;
                var user;
                if (message.mentions.users.first() != undefined){
                    user = message.mentions.users.first();
                }
                else if (args[0] != undefined){
                    var tmp = message.content.split(`${config[id].prefix}user `)[1];
                    if (userExists(guild, tmp)){
                        user = getUser(guild, tmp);
                    }
                }
                if (user != undefined && user != null){
                    message.channel.send({embed: {
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
                    }});
                }
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
                    if (config[id].users != undefined){
                        if (config[id].users[message.member.user.id] != undefined){
                            if (!config[id].users[message.member.user.id].can_submit_bugs){
                                message.channel.send(`You are not authorized to submit bugs.`);
                                return;
                            }
                        }
                    }
                    if (args[1] == undefined){
                        message.channel.send(`Submit a bug using the following command: \`\`\`\n${config[id].prefix}bug submit name:"Bug title"; description:"A descriptive description of the bug. Give as much relevant information as possible."\`\`\`Note that you cannot use the \`"\` character in the title or description.`);
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
                        var user = tryGetUser(message);
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
                        var user = tryGetUser(message);
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
                var msg = message.content.split(`${config[id].prefix}mock `)[1];
                if (msg != undefined && msg != null){
                    for (i = 0; i < msg.length; i++){
                        if (rand(2) == 0){
                            msg[i] = msg[i].toUpperCase();
                        }
                        else{
                            msg[i] = msg[i].toLowerCase();
                        }
                    }
                    message.channel.send(msg[i]);
                }
            }
            else if (command(channel, cmd, "top")){
                var page = 0;
                try{
                    page = parseInt(args[0]) - 1;
                }
                catch (err) {}
                var sortable = [];
                for (var id in config[guild.id].ranks) {
                    sortable.push([id, config[guild.id].ranks[id]]);
                }
                sortable.sort(function(a, b) {
                    return b[1] - a[1]
                });
                var shown = sortable.slice(0, 10);
                console.log(shown);
            }
            else if (command(channel, cmd, "channel")){
                var chnl = tryGetChannel(message);
                if (chnl == undefined){
                    chnl = channel;
                }
                var user = guild.members.find(m => m.user.id === guild.ownerID).user;
                var embed = {embed: {
                    author: {
                        name: user.tag,
                        icon_url: user.avatarURL
                    },
                    thumbnail: {
                        url: guild.iconURL
                    },
                    title: `${guild.name}: #${chnl.name}`
                }};
                if (chnl.type == 'text'){
                    embed["embed"].description = chnl.topic;
                    embed["embed"].fields = [{
                        name: `NSFW`,
                        value: chnl.nsfw,
                        inline: true
                    },{
                        name: `Channel Position`,
                        value: chnl.position + 1,
                        inline: true
                    },{
                        name: `Channel Type`,
                        value: chnl.type.capitalize()
                    },{
                        name: `Created At`,
                        value: chnl.createdAt,
                        inline: true
                    },{
                        name: `Channel ID`,
                        value: chnl.id,
                        inline: true
                    }];

                }
                else{

                }
                message.channel.send(embed);
            }
            if (isBotAdmin(message.member)){
                if (cmd == "say"){
                    if (args[0] != undefined){
                        if (channelExists(message.guild, args[0])){
                            getChannel(message.guild, args[0]).send(message.content.split(`${config[id].prefix}say ${args[0]} `)[1]);
                        }
                    }
                }
                else if (cmd == "clearquotes"){
                    if (args[0] == undefined){
                        message.channel.send(`Specificy a user to clear all of their quotes.`);
                        return;
                    }
                    var user = tryGetUser(message);
                    if (user == undefined){
                        message.channel.send(`User not found.`);
                    }
                    else{
                        if (config[id].quotes[user.id] == undefined || config[id].quotes[user.id].length == 0){
                            message.channel.send(`This user does not have any quotes yet.`);
                            return;
                        }
                        config[id]["quotes"][user.id] = [];
                        message.channel.send(`Successfully cleared all ${user.username}'s quotes.`);
                    }
                }
                else if (cmd == "reload"){
                    if (args[0] == undefined){
                        dlt = fs.readFileSync('database/delet_this.json');
                        delet_this = JSON.parse(dlt)["memes"];
                        vids = fs.readFileSync('database/thundaga.json');
                        eps = JSON.parse(vids);
                        message.channel.send('Successfully reloaded `memes` and `thundaga`.');
                    }
                    else if (args[0] == "memes"){
                        dlt = fs.readFileSync('database/delet_this.json');
                        delet_this = JSON.parse(dlt)["memes"];
                        message.channel.send('Successfully reloaded `memes`.');
                    }
                    else if (args[0] == "thundaga"){
                        vids = fs.readFileSync('database/thundaga.json');
                        eps = JSON.parse(vids);
                        message.channel.send('Successfully reloaded `thundaga`.');
                    }
                }
                else if (cmd == "id"){
                    if (args[0] == "channel"){
                        if (args[1] == undefined){
                            message.channel.send(message.channel.id);
                        }
                        else if (channelExists(guild, args[1])){
                            message.channel.send(`ID of channel "${args[1]}": ${getChannel(guild, args[1]).id}`);
                        }
                    }
                    else if (args[0] == "server"){
                        message.channel.send(message.guild.id);
                    }
                    else if (args[0] == "user"){
                        if (message.mentions.users.first() != undefined){
                            message.channel.send(`ID of user "${message.mentions.users.first().username}": ${message.mentions.users.first().id}`)
                        }
                        if (args[1] == undefined){
                            message.channel.send(`ID of user "${message.member.user.username}": ${message.member.user.id}`);
                        }
                        else if (userExists(guild, args[1])){
                            message.channel.send(`ID of user "${getUser(guild, args[1]).username}": ${getUser(guild, args[1]).id}`);
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
        logMessage(`${dateNow()} ${message.author.username}: ${message.content}`);
        if (cmd == "prefix"){
            if (setting != undefined){
                if (setting == "v-"){
                    message.channel.send(`\`v-\` cannot be used as a command prefix.`);
                }
                else{
                    config[id]["prefix"] = setting;
                    saveConfig();
                    message.channel.send(`Successfully set active command prefix to \`${config[id]["prefix"]}\`.`);
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
                    if (msg == null || msg == undefined || msg == "" || msg == " "){
                        message.channel.send(`The current welcoming message is: \`\`\`${config[id]["messages"]["welcome"]["msg"]}\`\`\`\nUse this command to change the message: \
                        \`\`\`v-config messages welcome msg [message]\`\`\`Keep in mind that \`(user)\` inside the message will be replaced with the joining player's name.`);
                    }
                    else{
                        config[id]["messages"]["welcome"]["msg"] = msg;
                        saveConfig();
                        message.channel.send(`Successfully set welcome message to: \`\`\`${config[id]["messages"]["welcome"]["msg"]}\`\`\``);
                    }
                }
                else if (setting == "on"){
                    if (config[id]["messages"]["welcome"]["status"] == "on"){
                        message.channel.send(`The welcome message was already enabled. Nothing happened.`);
                    }
                    else{
                        config[id]["messages"]["welcome"]["status"] = "on";
                        saveConfig();
                        message.channel.send(`The welcome message will now be sent for every new member that joins the server.`);
                    }
                }
                else if (setting == "off"){
                    if (config[id]["messages"]["welcome"]["status"] == "off"){
                        message.channel.send(`The welcome message was already disabled. Nothing happened.`);
                    }
                    else{
                        config[id]["messages"]["welcome"]["status"] = "off";
                        saveConfig();
                        message.channel.send(`The welcome message will no longer be sent for every new member that joins the server.`);
                    }
                }
                else if (setting == "channel"){
                    if (args[3] != undefined){
                        config[id]["messages"]["welcome"]["channel"] = args[3];
                        saveConfig();
                        message.channel.send('The welcome message will now be sent in `' + config[id]["messages"]["welcome"]["channel"] + '`.');
                    }
                    else{
                        message.channel.send('The channel the welcome message will be sent in. Currently set to ```' + config[id]["messages"]["welcome"]["channel"] + '```Use the following command to change it: ```v-config messages welcome channel [channelname]```Note that it should be the channel **name**, not a hyperlink or id.');
                    }
                }
                else{
                    message.channel.send('The message that is sent whenever a new user joins.```Message: '+config[id]["messages"]["welcome"]["msg"]+'\nStatus: '+config[id]["messages"]["welcome"]["status"]+'\nChannel: '+config[id]["messages"]["welcome"]["channel"]+'```\nUse one of the following commands to change the settings:```v-config messages welcome msg [message]\nv-config messages welcome on\nv-config messages welcome off\nv-config messages welcome channel [channelname]```In the welcome message, `(user)` will be replaced with the username.');
                }
            }
            else if (arg == "mute"){
                message.channel.send('When you mute someone via the bot, this is the message that will be displayed. ```Mute message: '+config[id]["messages"]["mute"]["msg"]+'\r\nStatus: '+config[id]["messages"]["mute"]["status"]+'```');
            }
            else{
                message.channel.send('These are messages the bot will send under specific circumstances. You can turn them on/off, change the messages, and choose in which channel they should be sent. Use one of the following commands for more information:```v-config messages welcome\nv-config messages mute```');
            }
        }
        else if (cmd == "autorole"){
            message.channel.send('When a new user joins, you can choose for the bot to give them a role.```Role given: '+config[id]["autorole"]+'\r\nStatus: '+config[id]["autorole"]+'```Use one of the following commands to change the settings:```v-config autorole on\nv-config autorole off\nv-config autorole set (rolename)```');
        }
        else if (cmd == "ignored_channels"){
            if (args[1] == "add"){
                if (args[2] == undefined){
                    message.channel.send(`Use \`v-config ignored_channels add [channelname]\` to disable Vulpix commands in a channel (other than v-config). Note that "channelname" should be JUST the name of the channel; not the id or tag.`);
                }
                else{
                    var index = config[id].ignored_channels.indexOf(args[2]);
                    if (index != -1){
                        message.channel.send(`Vulpix commands are already disabled in that channel or it doesn't exist.`);
                    }
                    else{
                        config[id].ignored_channels.push(args[2]);
                        saveConfig();
                        message.channel.send(`Vulpix commands are now disabled in channel "${args[2]}".`);
                    }
                }
            }
            else if (args[1] == "remove"){
                if (args[2] == undefined){
                    message.channel.send(`Use \`v-config ignored_channels remove [channelname]\` to enable Vulpix commands in a channel. Note that "channelname" should be just the name of the channel; not the id or tag.`);
                }
                else{
                    var index = config[id].ignored_channels.indexOf(args[2]);
                    if (index == -1){
                        message.channel.send(`Vulpix commands are already enabled in that channel or it doesn't exist.`);
                    }
                    else{
                        config[id].ignored_channels.splice(index, 1);
                        saveConfig();
                        message.channel.send(`Vulpix commands are now enabled in channel "${args[2]}".`);
                    }
                }
            }
            else{
                var msg = 'If a command other than v-config is executed in any of the following channels, it will be ignored:```\n';
                if (config[id]["ignored_channels"].length == 0) { msg += "---"; }
                else{
                    for (i = 0; i < config[id]["ignored_channels"].length; i++){
                        msg += config[id]["ignored_channels"][i];
                        if (i != config[id]["ignored_channels"].length - 1) { msg += '\n'; }
                    }
                }
                msg += '``` Add or remove a channel with one of the following commands:```v-config ignored_channels add [channelname]\nv-config ignored_channels remove [channelname]```Channelname is the actual name of the channel, not a hyperlink or id.';
                message.channel.send(msg);
            }
        }
        else if (cmd == "channels"){
            if (config[id].channels == undefined){
                config[id].channels = {};
            }
            var channels = [];
            for (i = 0; i < guild.channels.array().length; i++){
                if (guild.channels.array()[i].type == 'text') { channels.push(guild.channels.array()[i].name); }
            }
            if (channels.contains(args[1])){
                channelid = getChannel(message.guild, args[1]).id;
                if (config[id].channels[channelid] == undefined){
                    config[id].channels[channelid] = {
                        "disabled_commands": []
                    };
                }
                if (args[2] == "disablecommand" || args[2] == "disable_command"){
                    if (args[3] != undefined){
                        if (!commands.contains(args[3])){
                            message.channel.send(`Command "${args[3]}" is not a valid Vulpix command.`);
                            return;
                        }
                        if (config[id].channels[channelid].disabled_commands.contains(args[3])){
                            message.channel.send(`"${args[3]}" is already disabled in channel "${args[1]}".`);
                        }
                        else{
                            config[id].channels[channelid].disabled_commands.push(args[3]);
                            saveConfig();
                            message.channel.send(`"${args[3]}" is now disabled in channel "${args[1]}".`);
                        }
                    }
                    else{
                        message.channel.send(`To disable one of the following Vulpix commands: \`\`\`\n${commands.join('\n')}\`\`\`\nType the following: \`\`\`\nv-config channels [channel] disable_command [command]\`\`\`You should not write a prefix before the command, only the name.`);
                    }
                }
                else if (args[2] == "enablecommand" || args[2] == "enable_command"){
                    if (args[3] != undefined){
                        if (!commands.contains(args[3])){
                            message.channel.send(`Command "${args[3]}" is not a valid Vulpix command.`);
                            return;
                        }
                        if (!config[id].channels[channelid].disabled_commands.contains(args[3])){
                            message.channel.send(`"${args[3]}" is already enabled in channel "${args[1]}".`);
                        }
                        else{
                            config[id].channels[channelid].disabled_commands.splice(config[id].channels[channelid].disabled_commands.indexOf(args[3]), 1);
                            saveConfig();
                            message.channel.send(`"${args[3]}" is now enabled in channel "${args[1]}".`);
                        }
                    }
                    else{
                        message.channel.send(`To enable one of the following Vulpix commands: \`\`\`\n${commands.join('\n')}\`\`\`Type the following: \`\`\`\nv-config channels [channel] enable_command [command]\`\`\`You should not write a prefix before the command, only the name.`);
                    }
                }
                else if (args[2] == "disable_all"){
                    config[id].channels[channelid].disabled_commands = [];
                    for (i = 0; i < commands.length; i++){
                        config[id].channels[channelid].disabled_commands.push(commands[i]);
                    }
                    saveConfig();
                    message.channel.send(`All public Vulpix commands besides "v-config" are now disabled in channel "${args[1]}".`)
                }
                else if (args[2] == "enable_all"){
                    config[id].channels[channelid].disabled_commands = [];
                    saveConfig();
                    message.channel.send(`All public Vulpix commands are now enabled in channel "${args[1]}".`)
                }
                else{
                    message.channel.send(`${`These commands are currently disabled in channel "${args[1]}": \`\`\`\n${config[id].channels[channelid].disabled_commands.length == 0 ? "---" : config[id].channels[channelid].disabled_commands.join('\n')}\`\`\``} To disable or enable a command/all commands for a channel, use one of the following commands:\`\`\`\nv-config channels [channel] disable_command\nv-config channels [channel] enable_command\nv-config channels [channel] disable_all\nv-config channels [channel] enable_all\`\`\``);
                }
            }
            else if (args[1] == undefined){
                channels.splice(channels.indexOf('General'), 1);
                var msg = 'v-config channels ' + channels.join('\nv-config channels ');
                message.channel.send(`Use one of the following commands to configure commands for a channel: \`\`\`\n${msg}\`\`\``);
            }
            else{
                message.channel.send(`Channel "${args[1]}" doesn't exist.`);
            }
        }
        else if (cmd == "default"){
            setDefaults(message.guild);
            message.channel.send(`The configurations have been reset to the default.`);
        }
        else if (cmd == "show"){
            var msg = "";
            if (args[1] == "prefix"){
                msg = config[id].prefix;
            }
            else if (args[1] == "ignored_channels"){
                msg = jsonToString(config[id].ignored_channels);
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
                message.channel.send(`Use one of the following values to show: \`\`\`v-config show prefix\nv-config show ignored_channels\nv-config show messages\nv-config show quotes\nv-config show ranks\nv-config show channels\nv-config show bugs\nv-config show users\`\`\``);
                return;
            }
            message.channel.send('```JavaScript\n'+msg+'```');
        }
        else{
            message.channel.send('To configure the bot for this server, use one of the following commands: ```v-config prefix\nv-config messages\nv-config autorole\nv-config ignored_channels\nv-config default\nv-config channels\nv-config show```')
        }
    }
});

bot.login(process.env.TOKEN);