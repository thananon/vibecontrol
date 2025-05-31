# Streamlabs Alert Control

A web application for controlling Streamlabs alerts during live streams.

## Features

- Control page for managing alert settings
- Display page for showing current alert status
- Real-time status updates
- Green screen background for easy overlay

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run setup
   ```
3. Create a `.env` file in the root directory with your Streamlabs API credentials:
   ```
   VITE_STREAMLABS_API_KEY=your_api_key_here
   VITE_STREAMLABS_API_URL=https://streamlabs.com/api/v2.0
   VITE_STREAMLABS_CLIENT_ID=your_client_id_here
   VITE_STREAMLABS_CLIENT_SECRET=your_client_secret_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```  
   Start the server with open url:  
   ```bash  
   npm run app  
   ```  

## Usage

- Control Page (`/`): Use this page to toggle alert muting and suppression
- Display Page (`/display`): Use this page as an overlay in your streaming software

## Notes

- The display page has a green background for easy chroma keying
- The control page updates the Streamlabs API in real-time
- The display page polls the API every 5 seconds for status updates
