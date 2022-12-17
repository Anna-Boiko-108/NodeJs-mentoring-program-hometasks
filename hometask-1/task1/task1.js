import { stdin, stdout } from 'node:process';

const reverseString = (str) => {
    return [...str].reverse().join('');
}

stdin.on('data', (data) => {
    stdout.write(reverseString(data.toString()));
    stdout.write('\n');
});
