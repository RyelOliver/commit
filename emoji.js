const fs = require('fs');
const path = require('path');

const emojiList = JSON.parse(fs.readFileSync(path.resolve(__dirname, './emoji.json')));

const emojis = new Map(emojiList);

const replacer = shortCode => emojis.has(shortCode) ? emojis.get(shortCode) : shortCode;

module.exports = { replacer };