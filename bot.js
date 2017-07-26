const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require('fs');
var servers = fs.readFileSync('servers.json');
var config = JSON.parse(servers);

function hasRole(user, role) {
    var hasrole = false;
    console.log(user.roles[0]);
    for (i = 0; i < user.roles.length; i++) {
        if (user.roles[i].toLowerCase() == role.toLowerCase()) { hasrole = true; }
    }
    return (hasrole);
}

bot.on('ready', () => {
    console.log('Vulpix: online');
});

bot.on('guildCreate', guild =>{
    console.log('Vulpix joined ' + guild.name + ' with ID ' + guild.id.toString());
    guild.defaultChannel.sendMessage('Hello! I am Vulpix. I am here to help you out with utility commands, shortcuts, and more. Contact user `M3rein#7122` for questions and inquiries!');
    config[guild.id] = {};
    config[guild.id]["prefix"] = "!";
    config[guild.id]["messages"] = {};
    config[guild.id]["messages"]["welcome"] = "Welcome to the server, (user)!";
    var data = JSON.stringify(config, null, 2);
    fs.writeFile('servers.json', data);
    
})

bot.on('guildMemberAdd', member =>{
    let guild = member.guild
    guild.defaultChannel.sendMessage(`Hey there, ${member.user.username} :heart:~`);
});

bot.on('message', message => {
    if (message.content.startsWith(config[message.member.guild.id]["prefix"])){
        cmd = message.content.split('!')[1];
        if (cmd == "hello"){
            message.member.guild.defaultChannel.sendMessage('I have been summoned!');
        }
        if (cmd == "test"){
            message.channel.sendMessage('You are ' + (isAdmin(message.member) ? '' : 'not ') + 'an admin.');
        }
        if (cmd == "server"){
            message.channel.sendMessage(message.guild.id);
        }
        if (cmd == "raw"){
            message.channel.sendMessage(config[message.member.guild.id]);
        }
    }
});

bot.login('MzM5NzM5ODU5NTQ5NjgzNzEy.DFoW6g.LFoDAVvsDq77XIrkt0lBygFqXOw');