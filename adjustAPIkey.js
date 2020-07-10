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
            if(err) {
                console.log(err);
                return;
            }
            let APIkeysSectionStartTag_regExp = '\\/\\*-- APIkeys \\(start\\) --\\*\\/\n';
            let APIkeysSectionEndTag_regExp = '\\/\\*-- APIkeys \\(end\\) --\\*\\/\n';

            if(new RegExp(`${APIkeysSectionStartTag_regExp}([\\s\\S]+?)${APIkeysSectionEndTag_regExp}`).test(fileContent)) {
                let APIkeys = RegExp.$1;
                APIkeys = APIkeys
                    .replace('(start) */', '(start) --')
                    .replace(/\/\* APIKEY:(.+) \(end\) \*\//, '-- APIKEY:$1 (end) */');
                switch(platform) {
                    case 'dev':
                        APIkeys = APIkeys
                            .replace('/* APIKEY:LocalDev (start) --', '/* APIKEY:LocalDev (start) */')
                            .replace('-- APIKEY:LocalDev (end) */', '/* APIKEY:LocalDev (end) */');
                        break;
                    case 'browser-dev':
                    case 'browser-prod':
                        APIkeys = APIkeys
                            .replace('/* APIKEY:Praise-web (start) --', '/* APIKEY:Praise-web (start) */')
                            .replace('-- APIKEY:Praise-web (end) */', '/* APIKEY:Praise-web (end) */');
                        break;
                    case 'android':
                    case 'ios':
                        APIkeys = APIkeys
                            .replace('/* APIKEY:Mobile (start) --', '/* APIKEY:Mobile (start) */')
                            .replace('-- APIKEY:Mobile (end) */', '/* APIKEY:Mobile (end) */');
                        break;
                    default:
                        console.log('Error: no such platform');
                        process.exit(1);
                        break;
                }
                fileContent = fileContent.replace(
                    new RegExp(`(${APIkeysSectionStartTag_regExp})([\\s\\S]+?)(${APIkeysSectionEndTag_regExp})`),
                    '$1'+APIkeys+'$3'
                );
                fs.writeFile(filename, fileContent, function (err) {
                    if(err) {
                        console.log(`Error occurred when writing to ${filename}`);
                    } else {
                        console.log(`API key is re-chosen in "${filename}"`);
                    }
                });
            } else {
                console.log('API keys NOT found!!');
                process.exit(1);
            }
        });
    })
} else {
    console.log('error: no --files option');
    process.exit(1);
}