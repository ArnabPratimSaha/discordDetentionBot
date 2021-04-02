require("dotenv").config();
const Discord = require('discord.js');
const detention=require("./commands/detention");

const client = new Discord.Client();
const code1="det";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    const massage=msg.content.toString().trim();
    if(massage.startsWith(process.env.PREFIX,0))
    {
        const massageArray=massage.slice(1).split(/\s+/);
        if (massageArray[0]===code1) {
            return detention(client,msg,massageArray);
        }
    }
});

client.login(process.env.TOKEN);