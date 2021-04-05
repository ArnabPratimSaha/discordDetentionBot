const detention = require("../commands/detention");

require("dotenv").config();

const codeDetention="det";
const codeHelp="help";
const codeConfig="set";

const defRightReaction="✔️";
const defWrongReaction="❌";
const defVoteTime=1;//in min
const defDetentionTime=5;//in min

var rightReaction="✔️";
var wrongReaction="❌";
var voteTime=1;//in min
var detentionTime=5;//in min

const manageConfig=(config,change)=>
{
    const oldChange=config;
    config=change;
    return oldChange;
}

const changeConfig=(client,msg,massageArray)=>
{
    // varify the command
    if(massageArray.length>3 || massageArray.length<3)
    {
        return msg.reply(`wrong command.\nType ${process.env.PREFIX}${codeHelp} for help`);
    }

    //change the config
    if(massageArray[1]==="voteup")
    {
        const oldConfig=manageConfig(rightReaction,massageArray[2]);
        rightReaction=massageArray[2]
        msg.reply(`Changed voteup reaction from ${oldConfig} to ${rightReaction}`);
    }
    else if(massageArray[1]==="votedown")
    {
        const oldConfig=manageConfig(wrongReaction,massageArray[2]);
        wrongReaction=massageArray[2]
        msg.reply(`Changed votedown reaction from ${oldConfig} to ${wronngReaction}`);
    }
    else if(massageArray[1]==="votetime")
    {
        const oldConfig=manageConfig(voteTime,massageArray[2]);
        voteTime=massageArray[2]
        msg.reply(`Changed voting time from ${oldConfig} min to ${voteTime} min`);
    }
    else if(massageArray[1]==="dettime")
    {
        const oldConfig=manageConfig(voteTime,massageArray[2]);
        detentionTime=massageArray[2]
        msg.reply(`Changed detention time from ${oldConfig} min to ${detentionTime} min`);
    }
    else
    {
        return msg.reply(`wrong command.\nType ${process.env.PREFIX}${codeHelp} for help`);
    }

}

module.exports={rightReaction,wrongReaction,voteTime,detentionTime,changeConfig,codeDetention,codeHelp,codeConfig};