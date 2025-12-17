# Rowan University Academic Advisor Chatbot

A web-based chatbot that helps Rowan University students with course selection, major requirements, and academic planning.

## Features

- 🤖 AI-powered academic advisor assistant
- 📚 Course selection guidance
- 🎓 Major requirements explanation
- 📅 Academic planning assistance
- 💬 Interactive chat interface
- ⚡ Quick prompt buttons for common questions

## Prerequisites

   - Python 3 installed
   - Google Gemini API key

## Setup & Installation
1. **Backend Setup:**
Backend manages the connection to Google Gemini securely.
   1. Navigate to folder containing project files.
   2. Install the required python libraries
   pip install flask flask-cors requests python-dotenv
   3. Open .env file and paste your API key inside
   4. Start backend server
   

## Usage

1. Simply open 'index.html' in your web browser
2. Start chatting! You can:
   - Type your questions in the input field
   - Click the quick prompt buttons for common questions
   - Press Enter to send messages

## Files

- 'index.html' - Main HTML file with React and Tailwind CSS
- 'app.js' - React chatbot component
- 'README.md' - This file
- 'api.py' - Flask server that handles API requests to Gemini 

## Technologies

- React 18
- Python Flask
- Tailwind CSS
- Google Gemini API

## Customization

You can customize the chatbot by editing 'app.js':
- Change the system prompt to modify the chatbot's behavior
- Update the quick prompts
- Modify the styling and UI components

## Security Note

- The API key is stored on the backend server to prevent exposing it in the browser.

## License

This project is open source and available for educational purposes.

