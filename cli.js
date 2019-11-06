#! /usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const chalk = require('chalk');
const readline = require('./readline');
const constructCommit = require('./commit');

const newLine = () => console.info('');

(async () => {
    console.info(chalk.dim.italic('Leave any n/a questions blank'));
    newLine();

    const reference = await readline.question('Reference:');
    newLine();

    const type = await readline.question('Type:');
    newLine();

    const workInProgress = await readline.question('WIP: (y/n)');
    newLine();

    const area = await readline.question('Area(s):');
    newLine();

    const message = await readline.question('Message:');
    newLine();

    readline.close();

    const commitMessage = constructCommit({
        reference,
        type,
        wip: workInProgress && [ 'yes', 'y', 'wip' ].includes(workInProgress.toLowerCase()),
        areas: area.split(';'),
        message,
    });

    const { stdout, stderr } = await promisify(exec)(`git commit --message="${commitMessage}"`);
    console.info(stdout);
    console.info(stderr);
})();