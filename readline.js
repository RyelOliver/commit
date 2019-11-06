const readline = require('readline');

const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const { question } = interface;

interface.question = (...args) => {
    if (typeof args[0] === 'string' && !/\s$/.test())
        args[0] += '\n';

    // Promisify
    if (args.length === 1)
        return new Promise(resolve => {
            args.push(answer => resolve(answer));
            question.apply(interface, args);
        });

    return question.apply(interface, args);
};

module.exports = interface;