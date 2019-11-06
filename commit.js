const { replacer } = require('./emoji');

const constructCommit = ({ reference = '', type = '', wip, areas = [], message = '' }) => {
    let formattedReference = reference.trim();
    if (formattedReference && !formattedReference.startsWith('#'))
        formattedReference = `#${formattedReference}`;

    const formattedType = type.trim();

    let newLineForMessage = false;
    let formattedMessage = message.trim();
    if (formattedMessage.length > 64) {
        newLineForMessage = true;

        if (!formattedMessage.includes('\n')) {
            const wordsOrSpaces = formattedMessage.split(/(\s)/);
            formattedMessage = '';
            let currentLine = '';
            while (wordsOrSpaces.length > 0) {
                const nextWord = wordsOrSpaces.shift();
                if ((currentLine + nextWord).length > 64) {
                    currentLine += '\n';
                    formattedMessage += currentLine;
                    currentLine = nextWord;
                } else {
                    currentLine += nextWord;
                }
            }
            formattedMessage += currentLine;
        }
    }

    const tags = [];
    const addTag = tag => {
        if (tag)
            tags.push(`[${tag}]`);
    };

    addTag(formattedReference);
    addTag(formattedType);
    addTag(wip && 'WIP');

    areas
        .map(area => area.trim())
        .forEach(addTag);

    const commitTags = tags.join('');
    const commitMessage = formattedMessage;
    if (!newLineForMessage && (commitTags.length + commitMessage.length > 64))
        newLineForMessage = true;

    const preEmoji = `${commitTags}${newLineForMessage ? '\n' : ' '}${commitMessage}`;
    const postEmoji = preEmoji.replace(/(:[^:]+:)/g, replacer);

    return postEmoji;
};

module.exports = constructCommit;