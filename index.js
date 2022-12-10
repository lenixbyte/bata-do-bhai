#!/usr/bin/env node
const filename= process.argv[2];
const fs=require('fs');
const path=require('path');
const prompt = require("prompt-sync")({ sigint: true });


// Read the file
const readFile = async (filename) => {
    const file = await fs.promises
        .readFile(filename, 'utf-8')
        .catch((err) => {
            console.log('Error reading file from disk:', err);
        }
    );
    return file;
};

// Write the file
const writeFile = async (filename, data) => {
    await fs.promises
        .writeFile(filename, data)
        .catch((err) => {
            console.log('Error writing file:', err);
        }
    );
}

// parse the keyword enclosed with ${} and replace it with the value
const parse = (file, data) => {
    let parsedFile = file;
    const regex = /(?<=\${).+?(?=\})/g;
    const matches = file.match(regex);
    matches.forEach((match) => {
        parsedFile = parsedFile.replace(`\${${match}}`, data[match]);
    });
    return parsedFile;
}

// parse the keywords list enclosed with ${} and return the list
const parseList = (file) => {
    const regex = /(?<=\${).+?(?=\})/g;
    const matches = file.match(regex);
    return matches;
}

// run shell command
const run = async (command) => {
    const { exec } = require("child_process");
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`${stdout}`);
    });
}

// Main function
const main = async () => {
    const file = await readFile(filename);
    const varlist = parseList(file);
    const data = {}
    if(varlist.length > 0) {
        console.log('Number even ya odd hai bhai?');
        varlist.forEach((varname) => {
            data[varname] = prompt(`${varname} bta do Bhai : `);
        });
    }
    const parsedFile = parse(file, data);
    await writeFile(filename.split('.')[0]+'.bhailang', parsedFile);
    await run(`bhailang ${filename.split('.')[0]+'.bhailang'}`);
    setTimeout(() => {
     run(`rm ${filename.split('.')[0]+'.bhailang'}`);
    }, 1000);
}
main()
    
