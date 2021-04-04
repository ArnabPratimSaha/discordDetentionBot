require("dotenv").config();
const Discord = require('discord.js');
let {rightReaction,wrongReaction,voteTime,detentionTime}=require("../config/detentionConfig");

const help=async(client,msg)=>
{
    var embedMassage = new Discord.MessageEmbed();
    embedMassage.setTitle("Help");
    embedMassage.setColor("GREEN");
    embedMassage.setDescription(
        "Type :\t"+process.env.PREFIX+"det [mention someone].\n\n"+
        `voting time :${voteTime}min.\n`+
        `Detention Time :${detentionTime}min.`
    );
    const massageOption = {
    embed: embedMassage,
    };
    const voteLoseMassage=await msg.channel.send("Help Desk",massageOption);
    return;
}
module.exports=help;