const { Client, GatewayIntentBits, Partials, Activity, ActivityType, EmbedBuilder, Collection, InteractionCollector, InteractionType } = require('discord.js');
const config = require('./config/config.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });
const clash = require('./config/clan.js').clash;
const chalk = require('chalk');
const emoji = require('./config/emoji.js');
const embed = require('./config/embed.js');
const fs = require('fs');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const lang = require(`./language/${config.language}.js`);



//ADD SLASH COMMAND
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(config.discordtoken);
    (async () => {
        try {
            if (!config.guildID) {
                await rest.put(
                    Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    },
                );
                console.log(chalk.cyan(lang.slashcommand.guilds));
            } else {
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, config.guildID), {
                        body: commands
                    },
                );
                console.log(chalk.cyan(lang.slashcommand.oneguild));
            }
        } catch (error) {
            if (error) console.error(error);
        }
    })();
});

client.on('interactionCreate', async interaction => {
    if (!InteractionType.ApplicationCommand) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({ content: lang.slashcommand.problem, ephemeral: true });
    }
});
//ADD CLASH OF CLAN EVENT -> DONATION
clash.events.addClans([config.clantag])
clash.events.setClanEvent({
	name:'ClanDonationChange',
	filter : (oldClan, newClan) => {
		var olddone = [];
		oldClan.members.forEach(me => {
			var olddon = me.donations
			olddone.push(olddon)
		})
		var newdone = [];
		newClan.members.forEach(me => {
			var newdon = me.donations
			newdone.push(newdon)
		})
		

		var oldrecue = [];
		oldClan.members.forEach(me => {
			var oldrecu = me.received
			oldrecue.push(oldrecu)
		})
		var newrecue = [];
		newClan.members.forEach(me => {
			var newrecu = me.received
			newrecue.push(newrecu)
		})
		return `${olddone}` !== `${newdone}`;
	}
})

clash.on('ClanDonationChange', async (oldClan, newClan) => {

const clan = await clash.getClan(config.clantag);
		var olddon = [];
		oldClan.members.forEach(me => {
			const aa = me.donations;
			olddon.push(aa)
		})
		var znewdone = [];
		var newdone = [];
		var i = 0;
		await newClan.members.forEach(me => {
			var newdon = me.donations
			newdone.push(`${newdon}` -  `${olddon[i]}`)
			var calc = `${newdon}` - `${olddon[i]}`;
			if(calc == "0" || 0){}else{var finalcalc = `${emoji.fleche_droite}ㅤㅤㅤ${calc}\n`}
			znewdone.push(finalcalc)
			i++;
		})
		var namee = [];
		newClan.members.forEach(me => {
			var name = me.name
			namee.push(`${name}`)
		})
	
		var finaldone = [];
		var x = 0;
		newdone.forEach(me => {
			if(me == "0" || 0 ){}else{var finaldon = `${namee[x]}\n`}
			finaldone.push(finaldon)
			x++;
		})
		//
		var oldrecu = [];
		oldClan.members.forEach(me => {
			const aa = me.received;
			oldrecu.push(aa)
		})
		var znewrecue = [];
		var newrecue = [];
		var ib = 0;
		 
		await newClan.members.forEach(me => {
			var newrecu = me.received
			newrecue.push(`${newrecu}` - `${oldrecu[ib]}`)
			var calc = `${newrecu}` - `${oldrecu[ib]}`;
			if(calc == "0" || 0){}else{var finalcalc = `${emoji.fleche_gauche}ㅤㅤㅤ${calc}\n`}
			znewrecue.push(finalcalc)
			ib++;
		})



	
		var finalrecue = [];
		var xb = 0;
		newrecue.forEach(me => {
			if(me == "0" || 0 ){}else{var finalrecu = `${namee[xb]}\n`}
			finalrecue.push(finalrecu)
			xb++;
		})
		//
		const embeddon = new EmbedBuilder()
		.setTitle(clan.name + `(${clan.tag})`)
		.setURL(clan.shareLink)
		.addFields(
			{name: lang.donation.send, value: `${finaldone.join(``)}`, inline: true},
			{name: `ㅤ`, value: `**${znewdone.join(``)}**`, inline: true},
			{name: '\u200B', value: '\u200B', inline:true},
			{name: lang.donation.receive, value: `${finalrecue.join(``)}`, inline: true},
			{name: `ㅤ`, value: `**${znewrecue.join(``)}**`, inline: true},
			{name: '\u200B', value: '\u200B', inline:true},
		)
		.setColor(embed.color.donationauto)
		.setThumbnail(clan.badge.url);


		
		var data = fs.readFileSync("./config/channelconfig/donationchannel.json", "utf-8")
		var test = (((((data.replace(`"channeldon": "`, '')).replace('"', '')).replace(`{\n`, '')).replace(`\n}`, '')).replace("  ",""));
		if(test == ""){console.log(chalk.grey("New donation ! but the donation has not activad"))}else{
		client.channels.cache.get(test).send({embeds: [embeddon]})
		}
})	


//CONSOLE CONFIRMATION + BOT ACTIVITIES
client.once('ready', async () => {
	console.log(chalk.blueBright(lang.ready.client + client.user.username ));
	if(clash.inMaintenance){
		return console.log(chalk.redBright("l'API est en maintenance"))
	}
	const clan = await clash.getClan(config.clantag);
	console.log(chalk.blueBright(lang.ready.clash + clan.name));

	
	client.user.setActivity(`${lang.ready.activity} ${clan.name}`, {type: ActivityType.Watching})
	
});


//START CLASH OF CLAN EVENT
(async function () {
    await clash.events.init();
})();


//LOGIN THE BOT
client.login(config.discordtoken);