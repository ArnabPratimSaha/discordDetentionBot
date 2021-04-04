require("dotenv").config();
const Discord = require('discord.js');
const detention=require("./commands/detention");
const help=require("./commands/help");

const {changeConfig,codeDetention,codeHelp,codeConfig}=require("./config/detentionConfig");


const client = new Discord.Client();


client.on('ready', () => {
    client.user.setActivity("$help for help"); 
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    const massage=msg.content.toString().trim();
    if(massage.startsWith(process.env.PREFIX,0))
    {
        const massageArray=massage.slice(1).split(/\s+/);
        if (massageArray[0]===codeDetention) {
            return detention(client,msg,massageArray);
        }
        else if(massageArray[0]===codeHelp)
        {
            return help(client,msg);
        }
        else
        {
            msg.reply(`wrong command.\nType ${process.env.PREFIX}${code2} for help`);
        }
    }
});

client.login(process.env.TOKEN);