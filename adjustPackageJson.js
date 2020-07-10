const fs = require('fs');
//const lineReader = require('line-reader');

let homepageOptionIndex = process.argv.indexOf('--homepage');
if(homepageOptionIndex !== -1) {
    if(homepageOptionIndex+1 < process.argv.length) {
        let homepagePartialKey = process.argv[homepageOptionIndex+1];
        let homepage = null;
        // lineReader.eachLine('package.json', function (line) {
        //     let aRegExp = new RegExp(`"homepage-${homepagePartialKey}"(?:\\s*):(?:\\s*)"(.*)"(?:\\s*)(?:,*)`);
        //     if(aRegExp.test(line)) {
        //         homepage = RegExp.$1;
        //         return false;
        //     }
        // });
        fs.readFile('package.json', 'utf8', function (err, data) {
            if(new RegExp(`"homepage-${homepagePartialKey}"(?:\\s*):(?:\\s*)"(.*)"(?:\\s*)(?:,*)`).test(data)) {
                let subValue = RegExp.$1;
                data = data.replace(
                    /"homepage"(\s*):(\s*)"(.*)"(\s*)(,*)/,
                    `"homepage": "${subValue}"$5`
                );
                fs.writeFile('package.json', data, function (err) {
                    if(err) {
                        console.log('Error occurred when writing to package.json');
                    } else {
                        console.log(`Property "homepage" is changed to "${subValue}"`);
                    }
                });
            } else {
                console.log("Nothing changed as there is no match for the input argument");
            }
        });
    } else {
        console.log('error: no argument for the --homepage option');
    }
} else {
    console.log('error: no --homepage option');
    //process.exit(1);
}

