const fs = require('fs');


let platformOptionIndex = process.argv.indexOf('--platform');
let platform;
if(platformOptionIndex !== -1) {
    platform = process.argv[platformOptionIndex+1];
} else {
    console.log('error: no --platform option');
    process.exit(1);
}

let filesOptionIndex = process.argv.indexOf('--files');
if(filesOptionIndex !== -1) {
    let i = filesOptionIndex;
    let filenames = [];
    while(process.argv[i+1] && process.argv[i+1].indexOf('--')!==0) {
        filenames.push(process.argv[i+1]);
        i++;
    }

    filenames.forEach(function (filename) {
        fs.readFile(filename, 'utf8', function (err, fileContent) {
            if (err) {
                console.log(err);
                return;
            }

            fileContent = fileContent.replace(
                /(<Router.*?>) (\{\/\* RouterBasename:.*?) (\*\/\})/,
                '$2 $1 $3'
            );
            let routerBasename = null;
            switch(platform) {
                case 'dev':
                case 'android':
                case 'ios':
                    routerBasename = 'localDev_mobile';
                    break;
                case 'browser-dev':
                    routerBasename = 'browser-dev';
                    break;
                case 'browser-prod':
                    routerBasename = 'browser-prod';
                    break;
                default:
                    break;
            }
            fileContent = fileContent.replace(
                new RegExp(`(\\{\\/\\* RouterBasename:${routerBasename}) (<Router.*?>) (\\*\\/\\})` ),
                `$2 $1 $3`
            );
            fs.writeFile(filename, fileContent, function (err) {
                if(err) {
                    console.log(`Error occurred when writing to ${filename}`);
                } else {
                    console.log(`Router basename is re-written in "${filename}"`);
                }
            });
        });
    });
} else {
    console.log('error: no --files option');
    process.exit(1);
}