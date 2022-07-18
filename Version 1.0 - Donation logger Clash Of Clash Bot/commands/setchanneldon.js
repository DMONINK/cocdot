const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const fs = require('fs')
const lang = require(`../language/${config.language}.js`)


module.exports = {
    
    data: new SlashCommandBuilder()
        .setName('setchanneldon')
        .setDescription(lang.donation.setchannel.description)
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription(lang.donation.setchannel.optdescription)
                .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {

        try{

        const channel = interaction.options.getChannel('channel');
        const savejson = {
            "channeldon": `${channel.id}`
        }
        
        fs.writeFileSync("./config/autoconfig.json", JSON.stringify(savejson, null, 2))
        interaction.reply({ content: `${lang.donation.setchannel.reply} ${channel}`, ephemeral: true });
    } catch (error) {
        return console.log(error);
    }
    }
};