const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config()

//app.use(express.static(__dirname + '/home.html')); // html
app.use(express.static(path.join(__dirname, "midware"))); // js, css, images


const server = app.listen(process.env.PORT || 4999);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/home.html'));
});

app.get('/home.html', function(req, res) {
    res.sendFile(path.join(__dirname, '/home.html'));
});

app.get('/prefs.html', function(req, res) {
    res.sendFile(path.join(__dirname, '/prefs.html'));
});


const io = require('socket.io')(server);
io.on('connection', function(socket){
    socket.on("message", (m)=>{
        console.log(m);
        console.log("message activated");
        io.emit("output", m);
    })

    socket.on("alert", (m)=>{
        console.log("Client message:", m);
    });
    socket.on("p", (m) =>{
        console.log("returning completion on package dependencies"); 
        let prompt = m.i + "\n" + m.c;
        prompt += "\nProvide code that I can put in terminal to download the necessary libraries or package dependencies that I need for this code";
        runCompletion(prompt).then(text => {
            io.emit("gtp", text);
        });
    })    
    socket.on("pr", (m) =>{
        let prompt = m.i + "\n" + m.c;
        prompt += "\nRewrite this code with documentation in it. (Comments).";
        runCompletion(prompt).then(text => {
            io.emit("gtp", text);
        });
    })
    socket.on("t", (m) =>{
        let prompt = m.i + "\n" + m.c;
        prompt += "\nRewrite this code to optimize time and memory. Explain what was changed as well.";
        runCompletion(prompt).then(text => {
            io.emit("gtp", text);
        });
    })
    socket.on("r", (m) =>{
        let prompt = m.i + "\n" + m.c;
        prompt += "\nRefactor the code to make it cleaner and more concise by changing the spacing, structuring, and/or implemenation. Make sure the functionality does not change though.";
        runCompletion(prompt).then(text => {
            io.emit("gtp", text);
        });
    })
    socket.on("s", (m) =>{
        let prompt = m.i + "\n" + m.c;
        prompt += "\nIf there are any security vulnerabilities, rewrite the code to fix them.";
        runCompletion(prompt).then(text => {
            io.emit("gtp", text);
        });
    })
    socket.on("d", (m) =>{
        let prompt = m.i + "\n" + m.c;
        prompt += "\nThere is an error in this code, debug it and provide the corrected solution. Also explain what was changed.";
        runCompletion(prompt).then(text => {
            io.emit("gtp", text);
        });
    })
});


const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function runCompletion(prompt) {

    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    let response;
    let attempts = 0;

    while (attempts < 10) {
        try {
            const result = await model.generateContent(prompt);
            response = await result.response;
            break; // if successful, break the loop
        } catch (error) {
            console.error(error);
            attempts++;
            console.log(`Attempt ${attempts} failed. Retrying...`);
        }
    }

    if (response) {
        return response.text();
    } else {
        throw new Error('Failed to generate content after 10 attempts');
    }
}







