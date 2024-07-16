import express from "express";
import bodyParser from "body-parser"
import qr from 'qr-image';
import fs from 'fs';
import path from "path"
import { fileURLToPath } from "url";
// initialize the server
const app = express();
const PORT = 2000;


// generating absolute path(Es module) and converting filepath to url path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware to parse input data
app.use(bodyParser.urlencoded({extended: true}));

// middleware to serve static file
app.use(express.static("../FrontEnd"))
app.use(express.static(__dirname))
app.use(express.static("views"));

app.post("/generate", (req,res) => {
        let url = req.body.url;
        const qrCode = qr.image(url,{type : "png"});
        const outputFile = 'generated_qrCode.png';
        
        // writing the user input on file
        fs.appendFile(path.join(__dirname, "userInput.txt"),url + "\n", (err) => {
            if(err) {
                console.log("error",err);
            } else {
                console.log("File written successfully");
            }
        })
        // writing the qr-code to a file
        qrCode.pipe(fs.createWriteStream(outputFile))
        .on('finish', () => {
            console.log(`QR code generated and saved to ${outputFile}`);
            // Render the HTML file with the QR code image
            res.sendFile(path.join(__dirname,'views', 'qrCode.html'));
        })
        .on('error', (err) => {
            console.error("Error writing QR code file:", err);
        });
        
})

app.listen(PORT,() => {
    console.log(`Listening to ${PORT}`);
})

