const Discord = require('discord.js');
let {rightReaction,wrongReaction,voteTime,detentionTime}=require("../config/detentionConfig");
//function for creating a embeded massage
const embedMassage=(massageArray)=>
{
    var embedMassage = new Discord.MessageEmbed();
    embedMassage.setTitle("voting for detention");
    embedMassage.addField(
      "VOTE",
      `Casting A Pole Against [${massageArray[1]}]`
    );
    embedMassage.setColor("GREY");
    embedMassage.setDescription(
      `Casting a vote against ${massageArray[1]}.\nThis vote will last for ${voteTime} minutes.\nPress ${rightReaction} in favour of the vote and press ${wrongReaction} against the vote`
    );
    const massageOption = {
      embed: embedMassage,
    };
    return massageOption;
}
//function for checking reaction count
const returnResponse=reaction=>
{
    const reactionResult=[];
    for (let i = 0; i < 2; i++) {
        const element = reaction[i];
        reactionResult.push(element.count-1);
    }
    return reactionResult;
}
//find non bot active user in a channel
const activeUsers=msg=>
{
    var activeMembers=[];
    var channelMember=msg.member.voice.channel.members.array();
    for (let i = 0; i < channelMember.length; i++) {
        const element = channelMember[i];
        if(!element.user.bot)
        {
            activeMembers.push(element);
        }
    }
    return activeMembers;
}
//function for mention massage
const mentionMessage=(msg,massage)=>
{
    var finalArray=[];
    var mentionArray=activeUsers(msg);
    for (let i = 0; i < mentionArray.length; i++) {
        const element = mentionArray[i];
        if(element.id!=msg.mentions.users.array()[0].id)
        {
            finalArray.push(element);
        }
    }
    return `${massage} ${finalArray.toString()}`;
}
//function to find users in favour or opposite of the vote
const findInOrOppositeOfFavour=(msg,isInFavour)=>
{
    let finalArray=[];
    const reactionArray=msg.reactions.cache.array();
    for (let i = 0; i < 2; i++) {
        const element = reactionArray[i];
        if (isInFavour) {
            if(element.emoji.name===rightReaction)
            {
               const inFavourArray=element.users.cache.array();
               for (let j = 0; j < inFavourArray.length; j++) {
                    const e = inFavourArray[j];
                    if(!e.bot)
                    {
                        finalArray.push(e);
                    }
               }
            }
        }
        else
        {
            if(element.emoji.name===wrongReaction)
            {
               const inAgainstArray=element.users.cache.array();
               for (let j = 0; j < inAgainstArray.length; j++) {
                    const e = inAgainstArray[j];
                    if(!e.bot)
                    {
                        finalArray.push(e);
                    }
               }
            }
        }
    }
    return finalArray;
}
//function to find the targeted victim
const findUser=(arr,target)=>
{
    for (let i = 0; i < arr.length; i++) {
        const e = arr[i];
        if (e.user.id===target.id) {
            return true;
        }
    }
    return false;
}  
const detention=async(client,msg,massageArray)=>
{
    if(msg.mentions.users.array().length===0)
    {
        return msg.reply("You have to mention someone");
    }
    else if(!msg.member.voice.channel)
    {
        return msg.reply("You have to be in a voice channel");
    }
    else if(msg.mentions.users.array().length>1 || msg.mentions.everyone)
    {
        return msg.reply("You can only vote for one detention pole at a time");
    }
    else if(msg.mentions.channels.array().length!=0)
    {
        return msg.reply("You can not cast a vote for a channel");
    }
    else if(msg.mentions.roles.array().length!=0)
    {
        return msg.reply("You can not cast a vote for a role");
    }
    else if(msg.mentions.users.array()[0].bot)
    {
        return msg.reply("You can not cast a vote for a bot");
    }
    else if(msg.member.voice.channelID!=msg.guild.member(msg.mentions.users.array()[0]).voice.channelID)
    {
        return msg.reply(`You and ${msg.mentions.users.array()[0].username} has to be in a same voice channel`);
    }
    // else if(activeUsers(msg).length<=2)
    // {
    //     return msg.reply(`You need more the 2 persons(non bot) int he voice channel to create a pole`);
    // }
    else
    {
        try {
            const promise=await msg.channel.send(mentionMessage(msg,"VOTE TIME"),embedMassage(massageArray));
            await promise.react(rightReaction);
            await promise.react(wrongReaction);
            //added a event on the reactions
            client.on("messageReactionAdd",(messageReaction,user)=>
            {
                var users=activeUsers(msg);
                if(user.id===msg.mentions.users.array()[0].id || !findUser(users,user))
                {
                    messageReaction.users.remove(user.id);
                }
            });
            setTimeout(async() => {
                reaction=promise.reactions.cache.array();
                try {
                    await msg.delete();
                    await promise.delete();
                    
                } catch (error) {
                    console.error(error);
                }
                if (returnResponse(reaction)[0]>returnResponse(reaction)[1]) {
                    //detetion
                    var embedMassage = new Discord.MessageEmbed();
                    embedMassage.setTitle("voting for detention");
                    embedMassage.setColor("GREEN");
                    embedMassage.setDescription(
                    `\n${msg.mentions.users.array()[0].username.toUpperCase()} is now detained.\n`+
                    `Infavour:${findInOrOppositeOfFavour(promise,true)}.\n`+
                    `InAgainst:${findInOrOppositeOfFavour(promise,false)}`+
                    `\n\nThis message will delete in ${detentionTime} min.\n`
                    );
                    const massageOption = {
                    embed: embedMassage,
                    };
                    const voteLoseMassage=await msg.channel.send(mentionMessage(msg,"VOTE WON"),massageOption);
                    //defen and mute the user
                    const victim=msg.guild.member(msg.mentions.users.array()[0]);
                    let nickName=victim.nickname || victim.user.username;
                    try {
                        await victim.voice.setMute(true);
                        await victim.voice.setDeaf(true);
                        await victim.edit({nick:"i am bad boy"});
                        
                    } catch (error) {
                        console.error(error);
                    }
                    setTimeout(async() => {
                        try {
                            await voteLoseMassage.delete();
                            await victim.voice.setMute(false);
                            await victim.voice.setDeaf(false);
                            await victim.edit({nick:nickName});
                            
                        } catch (error) {
                            console.error(error);
                        }
                    }, detentionTime*60*1000);
                }
                else
                {
                    //no detention
                    var embedMassage = new Discord.MessageEmbed();
                    embedMassage.setTitle("voting for detention");
                    embedMassage.setColor("RED");
                    embedMassage.setDescription(
                    `Casted vote against ${massageArray[1]} was lost.`+
                    `\n${msg.mentions.users.array()[0].username.toUpperCase()} is spared.\n`+
                    `Infavour:${findInOrOppositeOfFavour(promise,true)}.\n`+
                    `InAgainst:${findInOrOppositeOfFavour(promise,false)}`+
                    `\n\nThis message will delete in ${voteTime} min.\n`
                    );
                    const massageOption = {
                    embed: embedMassage,
                    };
                    const voteLoseMassage=await msg.channel.send(mentionMessage(msg,"VOTE LOST"),massageOption);
                    setTimeout(async() => {
                        try {
                            await voteLoseMassage.delete();
                        } catch (error) {
                            console.error(error);
                        }
                    }, voteTime*60*1000);
                }
                
            }, voteTime*60*1000);
        } catch (error) {
            console.log(error);
        }
    }

}
module.exports=detention;