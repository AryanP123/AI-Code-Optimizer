const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config()

console.log("Starting server...");
console.log("API Key present:", !!process.env.GOOGLE_API_KEY);
console.log("API Key length:", process.env.GOOGLE_API_KEY?.length);
console.log("Port:", process.env.PORT || 4999);


if (!process.env.GOOGLE_API_KEY) {
    console.error("Missing GOOGLE_API_KEY in .env");
    process.exit(1);
}



//app.use(express.static(__dirname + '/home.html')); // html
app.use(express.static(path.join(__dirname, "midware"))); // js, css, images


const server = app.listen(process.env.PORT || 4999, () => {
    console.log(`Server running on port ${process.env.PORT || 4999}`);
});

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


// Main Gemini completion function
async function runCompletion(prompt) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Main Gemini API Error:", error);
        throw error;
    }
}

// Socket.io handler
io.on('connection', (socket) => {
    socket.on('prompt', async (prompt) => {
        try {
            const response = await runCompletion(prompt);
            socket.emit('gtp', response);
        } catch (error) {
            console.error('Socket handler error:', error);
            socket.emit('error', 'Failed to process request');
        }
    });
});







