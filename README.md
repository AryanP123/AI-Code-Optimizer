# AI-Code-Optimizer
Website that allows users to optimize their code using AI.

https://ai-code-optimizer.onrender.com/ (GEMINI API DISABLED)

Click to view demo:

[![ESP32-S3 / IMU - Based Gesture Controlled UAV Drone](https://img.youtube.com/vi/NOnwGl0Ri7c/0.jpg)](https://www.youtube.com/watch?v=NOnwGl0Ri7c)

## Features

### Code Enhancement Tools
- **Package Dependency Detection**: Identifies and suggests required libraries and dependencies
- **Documentation Generation**: Adds comprehensive comments and documentation to code
- **Performance Optimization**: Suggests improvements for time and memory efficiency
- **Code Refactoring**: Restructures code for better readability while maintaining functionality
- **Security Analysis**: Detects and fixes potential security vulnerabilities
- **Debugging Assistant**: Identifies errors and provides corrected solutions

## Technical Stack

### Backend
- Node.js with Express.js
- Socket.io for real-time communication
- Google Generative AI (Gemini) integration

### Frontend
- HTML/CSS for user interface
- JavaScript for client-side functionality
- Real-time updates via Socket.io client

## Project Structure

website/ 
├── initialize.js # Main server setup and API integration 
├── home.html # Main application interface 
├── prefs.html # User preferences page 


## Setup

1. Clone the repository
2. Create a .env file with:

GOOGLE_API_KEY=your_gemini_api_key 
PORT=4999 (optional)

3. Install dependencies:
npm install

Start the server:
node website/initialize.js
