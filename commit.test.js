const constructCommit = require('./commit');

describe('Commit constructor', () => {
    it('Should enclose all inputs, except the message, with []', () => {
        const message = constructCommit({
            reference: '#123456',
            type: 'Feature',
            wip: true,
            areas: [ 'preference', 'a11y' ],
            message: 'High contrast mode',
        });
        expect(message).toBe('[#123456][Feature][WIP][preference][a11y] High contrast mode');
    });

    it('Should trim all inputs', () => {
        const message = constructCommit({
            reference: '  #123456 ',
            type: ' Feature    ',
            wip: true,
            areas: [ 'preference ', '   a11y  ' ],
            message: ' High contrast mode ',
        });
        expect(message).toBe('[#123456][Feature][WIP][preference][a11y] High contrast mode');
    });

    it('Should prepend # to references when required', () => {
        const message = constructCommit({
            reference: '123456',
            type: 'Feature',
            wip: true,
            areas: [ 'preference', 'a11y' ],
            message: 'High contrast mode',
        });
        expect(message).toBe('[#123456][Feature][WIP][preference][a11y] High contrast mode');
    });

    it('Should split the message onto a new line if all inputs length exceeds 64 characters', () => {
        const message = constructCommit({
            reference: '123456',
            type: 'Feature',
            wip: true,
            areas: [ 'preference', 'a11y' ],
            message: 'A user can enable high contrast mode',
        });
        expect(message).toBe('[#123456][Feature][WIP][preference][a11y]\nA user can enable high contrast mode');
    });

    it('Should split the message onto multiple lines if longer than 64 characters', () => {
        const message = constructCommit({
            reference: '123456',
            type: 'Feature',
            wip: true,
            areas: [ 'user', 'preference', 'a11y' ],
            message:
                'A user can enable high contrast mode by configuring their user '+
                'preferences accordingly. Enabling high contrast mode ensures '+
                'that foreground and background colours are displayed with '+
                'increased contrast where necessary.',
        });
        expect(message).toBe(
            '[#123456][Feature][WIP][user][preference][a11y]\n'+
            'A user can enable high contrast mode by configuring their user \n'+
            'preferences accordingly. Enabling high contrast mode ensures \n'+
            'that foreground and background colours are displayed with \n'+
            'increased contrast where necessary.',
        );
    });

    it('Should not split the message onto multiple lines if it already contains multiple lines', () => {
        const message = constructCommit({
            reference: '123456',
            type: 'Feature',
            wip: true,
            areas: [ 'user', 'preference', 'a11y' ],
            message:
                'A user can enable high contrast mode by configuring their user preferences accordingly.\n'+
                'Enabling high contrast mode ensures that foreground and background colours are '+
                'displayed with increased contrast where necessary.',
        });
        expect(message).toBe(
            '[#123456][Feature][WIP][user][preference][a11y]\n'+
            'A user can enable high contrast mode by configuring their user preferences accordingly.\n'+
            'Enabling high contrast mode ensures that foreground and background colours are '+
            'displayed with increased contrast where necessary.',
        );
    });

    it('Should replace shortcodes with their corresponding emoji', () => {
        constructCommit({
            reference: '123456',
            type: ':gem:',
            wip: true,
            areas: [ 'preference', 'a11y' ],
            message: ':fire: :wink: :hammer: :clock: :time:',
        });
        const message = constructCommit({
            reference: '123456',
            type: ':gem:',
            wip: true,
            areas: [ 'preference', 'a11y' ],
            message: 'High contrast mode',
        });
        expect(message).toBe('[#123456][💎][WIP][preference][a11y] High contrast mode');
    });
});