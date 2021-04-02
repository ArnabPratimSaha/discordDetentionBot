const Discord = require('discord.js');
const rightReaction="✔️";
const wrorngReaction="❌";
//function for creating a embeded massage
const embedMassage=massageArray=>
{
    var embedMassage=new Discord.MessageEmbed();
    embedMassage.addField("voting against",massageArray[1])
    embedMassage.setTitle("voting for detention");
    embedMassage.setColor("GREY");
    const massageOption={
        embed:embedMassage
    }
    return massageOption;
}
//function for checking reaction count
const returnResponse=reaction=>
{
    const reactionResult=[];
    for (let i = 0; i < reaction.length; i++) {
        const element = reaction[i];
        reactionResult.push( element.count);
    }
    return reactionResult;
}
const detention=async(client,msg,massageArray)=>
{
    if(massageArray.length<2)
    {
        return msg.reply("Worng Command");
    }
    else if(massageArray.length>3)
    {
        return msg.reply("You can only one detention pole at a time");
    }
    else
    {
        try {
            const promise=await msg.channel.send("Vote Time @everyone",embedMassage(massageArray));
            await promise.react(rightReaction);
            await promise.react(wrorngReaction);
            setTimeout(() => {
                reaction=promise.reactions.cache.array();
                if (returnResponse(reaction)[0]>returnResponse(reaction)[1]) {
                    //detetion
                    console.log("detention");
                }
                else
                {
                    //no detention
                    console.log("no detention");
                }
                
            }, 5000);
        } catch (error) {
            console.log(error);
        }
    }

}
module.exports=detention;