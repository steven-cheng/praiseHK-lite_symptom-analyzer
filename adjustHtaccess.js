const fs = require('fs');


let platformOptionIndex = process.argv.indexOf('--platform');
let platform;
if(platformOptionIndex !== -1) {
    platform = process.argv[platformOptionIndex+1];
} else {
    console.log('error: no --platform option');
    process.exit(1);
}

// This script is for 'browser' platform only
if(platform.indexOf('browser') !== 0) {
    return;
}

let filename = 'public/.htaccess';
fs.readFile(filename, 'utf8', function (err, fileContent) {
    if (err) {
        console.log(err);
        return;
    }

    fileContent = fileContent.replace(
        new RegExp(`(\\n\\s*)(RewriteBase .*\\n)`),
        '$1# $2'
    );
    fileContent = fileContent.replace(
        new RegExp(`(# rewriteBase:${platform}.*\\n\\s*)# (RewriteBase .*\\n)`),
        '$1$2'
    );
    fs.writeFile(filename, fileContent, function (err) {
        if(err) {
            console.log(`Error occurred when writing to ${filename}`);
        } else {
            console.log(`RewriteBase is changed in "${filename}"`);
        }
    });
});