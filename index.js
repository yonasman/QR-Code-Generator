/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
// inquirer
// ***************
import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';
inquirer.prompt([
    {
        type : 'input',
        name : 'text',
        message : 'Enter the url to generate the qr-code: '
    }
]).then((answer) => {
    const qrCode = qr.image(answer.text,{type : "png"});
    const outputFile = 'generated_qrCode.png';

    // writing the qr-code to a file
    qrCode.pipe(fs.createWriteStream(outputFile))
    .on('finish', () => {
        console.log(`QR code generated and saved to ${outputFile}`);
    })
    .on('error', (err) => {
        console.error("Error writing QR code file:", err);
    });

    // writing the user input on file
    fs.appendFile("userInput.txt",answer.text + "\n", (err) => {
        if(err) {
            console.log("error",err);
        } else {
            console.log("File written successfully");
        }
    })

}).catch((err) => {
    console.log(err);
})
