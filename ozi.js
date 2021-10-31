const Discord = require('discord.js');
const ayarlar = require("./ozicik.json");


const ozi = [];
for (let index = 0; index < ayarlar.oziwelcometokenler.length; index++) {
    const token = ayarlar.oziwelcometokenler[index];
    const client = new Discord.Client();
    client.login(token);

    let ozicik;
    client.on('ready', async () => {
        setInterval(() => {
        const welcomeaktivite = Math.floor(Math.random() * (ayarlar.botdinliyor.length));
        client.user.setActivity(`${ayarlar.botdinliyor[welcomeaktivite]}`, {type: "LISTENING"});
    }, 10000);
        client.user.setStatus("idle");
        console.log(`${client.user.tag} olarak giriş yapıldı.`);
        ozicik = await client.channels.cache.get(ayarlar.welcomeseskanalları[index]).join().catch(err => console.error("Botların Welcome Sesine Girerken Sorun Oluştu."));
    });

    let ses;
    client.on('voiceStateUpdate', async (prev, cur) => {
        if (cur.member.user.bot) return;
        if (cur.channel && (cur.channel.id === ayarlar.welcomeseskanalları[index])) {
            if (cur.channelID === prev.channelID) return;
            if (ozi.includes(cur.member.id) && (cur.member.roles.highest.rawPosition < cur.guild.roles.cache.get(ayarlar.enaltyetkili).rawPosition)) {
                ses = await ozicik.play('./welcome.mp3');
                return;
            }
            if ((cur.member.roles.highest.rawPosition < cur.guild.roles.cache.get(ayarlar.enaltyetkili).rawPosition)) {
                ses = await ozicik.play('./welcome.mp3');
                ozi.push(cur.member.user.id);
                console.log(ozi);
            } else if (cur.member.roles.highest.rawPosition > cur.guild.roles.cache.get(ayarlar.enaltyetkili).rawPosition) {
                ses = await ozicik.play('./yetkili.mp3');
                ozi.push(cur.member.user.id);
                console.log(ozi);
            }
        }
        if (prev.channel && (prev.channel.id === ayarlar.welcomeseskanalları[index]) && (prev.channel.members.size === 1) && ses) ses.end();
    });
    
    client.on('voiceStateUpdate', async (cur) => {
        if (cur.member.id === client.user.id) ozicik = await client.channels.cache.get(ayarlar.welcomeseskanalları[index]).join();
    })

    client.on('voiceStateUpdate', async (___, newState) => {
        if (
        newState.member.user.bot &&
        newState.channelID &&
        newState.member.user.id == client.user.id &&
        !newState.selfDeaf
        ) {
        newState.setSelfDeaf(true);
        }
        });

}
