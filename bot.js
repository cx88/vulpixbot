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
    config[guild.id.toString()] = {};
    config[guild.id.toString()]["prefix"] = "!";
    config[guild.id.toString()]["messages"] = {};
    config[guild.id.toString()]["messages"]["welcome"] = "Welcome to the server, (user)!";
    var data = JSON.stringify(config, null, 2);
    fs.writeFile('servers.json', data);
    
})

bot.on('guildMemberAdd', member =>{
    let guild = member.guild
    guild.defaultChannel.sendMessage(`Hey there, ${member.user.username} :heart:~`);
});

bot.on('message', message => {
    if (message.content.startsWith(config[message.member.guild.id.toString()]["prefix"])){
        var thisconfig = config[message.guild.id.toString()];
        cmd = message.content.split('!')[1].split(' ')[0];
        args = message.content.split(" ");
        args.splice(0, 1);
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
            console.log(config);
        }

        if (cmd == "config"){
            var param = args[0];
            if (param == "prefix"){
                message.channel.sendMessage('The prefix for commands is currently `'+thisconfig["prefix"]+'`.');
            }
            else if (param == "messages"){
                var arg = args[1];
                if (arg == "welcome"){
                    message.channel.sendMessage('This is what the user welcome message is currently set to: `'+thisconfig["messages"]["welcome"]+'`.')
                }
                else if (arg == "mute"){
                    message.channel.sendMessage('This is the message that will be sent you mute someone and you have it enabled: `'+thisconfig["messages"]["mute"]+'`.')
                }
                else if (arg == "channel"){

                }
                else{
                    message.channel.sendMessage('These are all the messages you can change.\nUser welcome message: `'+thisconfig["messages"]["welcome"]+'`.');
                }
            }
            else if (param == "autorole"){

            }
            else if (param == "allowcommands"){

            }
        }
    }
});

bot.login('MzM5NzM5ODU5NTQ5NjgzNzEy.DFoW6g.LFoDAVvsDq77XIrkt0lBygFqXOw');