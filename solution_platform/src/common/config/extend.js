const view = require('think-view');
const model = require('think-model');
const session = require('think-session');
const cache = require('think-cache');

module.exports = [
    session,
    cache,
    view,                   // make application support view
    model(think.app),
];
