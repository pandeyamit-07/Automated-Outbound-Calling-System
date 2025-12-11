
📞 Automated Outbound Calling System + Campaign Engine + Analytics Dashboard

(Asterisk + Node.js + MySQL + React)

This project is a complete end-to-end automated calling platform built using Asterisk PBX, Node.js, MySQL, and a React-based dashboard.
It includes:

1. Asterisk GSM Calling Engine (SIM-based calling, audio playback, DTMF input)
2. Node.js Campaign Controller (sequential calling, audio upload, event-driven architecture)
3. Call Analytics Dashboard (React, charts, filters, live metrics)

Together, they form a production-style telephony automation system suitable for surveys, IVR flows, confirmation calls, lead follow-ups, feedback collection, and call analytics.

---

Core Features (Combined)

### 📟 1. GSM-Based Outbound Calling (Asterisk)

 SIM-based calls using USB GSM Modem (Huawei/ZTE)
 Plays pre-recorded audio messages when the call is answered
 Captures DTMF user input (key press detection)
 Fully customizable dialplan logic
 Works without VoIP providers, SIP trunks, or internet
 Modular configuration using chan_dongle, extensions.conf 
 Support for call logging & integration with external scripts

### 🔄 2. Node.js Campaign Calling Engine

 Sequential auto-calling (one-by-one queue)
 Automatic next call after hangup (event-driven)
 Upload MP3 → auto-convert → GSM 8000Hz
 Originate calls programmatically via Asterisk AMI
 MySQL integration for storing contacts & call logs

### 📊 3. Full Analytics Dashboard (React + Vite)

 Filter calls by status, duration, user-input, date range
 Real-time totals (completed, initiated, timeouts, blanks, etc.)
 Charts for call distribution & time-series trends
 Fast UI with TailwindCSS + Recharts
 Admin login with JWT

---

# 🧩 Technologies Used

### Backend & Telephony

 Ubuntu 22.04 LTS
 Asterisk PBX (source build)
 USB GSM Modem (Huawei)
 chan_dongle (GSM modem driver)
 Asterisk AMI (manager interface)
 Node.js + Express
 FFmpeg (audio conversion)
 MySQL

### Frontend

 React (Vite)
 TailwindCSS
 Recharts

---


# 🧱 High-Level System Architecture

```
USB GSM Modem (SIM)
        |
   Asterisk PBX
        |
  (Dialplan + DTMF)
        |
   Asterisk AMI
        |
   Node.js Server
  ├── Audio Upload & Conversion
  ├── Call Queue / Campaign Engine
  ├── Contact Management
  ├── Logs & Reports
        |
     MySQL
        |
    React Dashboard
```

---

# 🔁 End-to-End Workflow (Merged Overview)

### 1️⃣ USB GSM modem is connected to the Ubuntu server and detected as /dev/ttyUSBX. 
   The chan_dongle driver initializes the modem and registers it inside Asterisk as Dongle/dongle0. 
   A script or CLI command triggers an Originate Call: originate Dongle/dongle0/<phone-number> extension s@outgoing-call-play 
   Asterisk dials the number through the SIM and waits for the remote user to answer. 
   After the call is answered: The call jumps into the dialplan context outgoing-call-play. Asterisk plays a custom audio prompt (Playback()). 
  The system captures DTMF keypresses using Read(). Based on the pressed key, Asterisk routes the call to different logic branches: 
   Save data Play another message Trigger API calls End the call Asterisk logs call details and results for reporting or automation.
 

### 2️⃣ Campaign Setup in Node.js

 Upload MP3 → converted to GSM using FFmpeg
 Add contacts to MySQL
 Start/STOP campaign → system begins sequential calling

### 3️⃣ Asterisk Call Handling

When remote user answers:

 Asterisk enters `outgoing-call-play` context
 Plays GSM audio
 Reads DTMF input
 Logs response
 Ends call

### 4️⃣ AMI Events → Node.js Logic

 Node.js listens to AMI events:

   originateResponse
   hangup
   fullybooted
 `callCompleted` event fires → triggers next call
 Queue continues until all contacts are done

### 5️⃣ Dashboard & Analytics

Frontend uses backend APIs to:

 Fetch call logs
 Filter by date, duration, status, user-input
 Load statistics cards
 Display charts
 Provide admin-level insights

---

# 📂 Suggested Project Structure (Unified)

```
/asterisk
   ├── chan_dongle.conf
   ├── extensions.conf
   └── sounds/custom/.gsm

/backend
   ├── controllers/
   ├── routes/
   ├── config/ami.config.js
   ├── services/audioConverter.js
   ├── scripts/originate_call.sh
   ├── database/
   └── app.js

/dashboard
   ├── src/
   │    ├── components/
   │    ├── pages/
   │    ├── charts/
   │    ├── api/
   └── dist/
```

---

# 📞 Example Call Flow (Short Summary)

1. System dials user through SIM
2. User picks up
3. Audio plays: “Press 1 for Yes, 2 for No”
4. System captures input
5. Saves response in DB
6. Node.js triggers next number in queue

---

# 🎯 What This Project Demonstrates

### 📌 Telephony Engineering

 Asterisk dialplan design
 GSM modem integration
 DTMF capture
 AMI call origination

### 📌 Backend Engineering

 REST APIs
 File handling + FFmpeg conversion
 EventEmitter-driven architecture
 Queue processing

### 📌 Full-Stack System Design

 Database schema for call logs
 Filtering, pagination, analytics
 Modern frontend with charts

---

