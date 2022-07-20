const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const fs = require('fs')
const config = require('../config/config.js')
const lang = require(`../language/${config.language}.js`)


module.exports = {
    
    data: new SlashCommandBuilder()
        .setName('removechanneldon')
        .setDescription(lang.donation.removechannel.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {

        try{

        const savejson = {
            "channeldon": ``
        }
        
        fs.writeFileSync("./config/channelconfig/donationchannel.json", JSON.stringify(savejson, null, 2))
        interaction.reply({ content: `${lang.donation.removechannel.reply}`, ephemeral: true });
    } catch (error) {
        return console.log(error);
    }
    }
};