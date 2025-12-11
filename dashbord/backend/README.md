1. copy .env.example -> .env and fill DB credentials
2. npm install
3. npm run dev   # for dev with nodemon
4. npm start     # production








GET /contacts/status-count

GET /call_logs/status-count?status=...

GET /call_logs/completed-by-userinput?type=not_null|blank|timeout

GET /call_logs/duration?min=...

GET /call_logs?status=&min_duration=&userinput=&limit=&offset=