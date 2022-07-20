const config = require('./config.js');
const { Client, BatchThrottler, ClanWarLeagueClan } = require('clashofclans.js');
const clash = new Client({
    retryLimit: 1,
    restRequestTimeout: 10000,
    throttler: new BatchThrottler(30)
});
clash.setKeys([config.apikey]);



module.exports = {
    clash: clash,
}