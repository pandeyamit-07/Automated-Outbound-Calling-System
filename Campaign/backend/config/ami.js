
// // config/ami.config.js
// const AsteriskManager = require('asterisk-manager');
// const { pool } = require('./db.config');
// const EventEmitter = require('events');

// const callEmitter = new EventEmitter();
// const AMI_HOST = process.env.AMI_HOST || '127.0.0.1';
// const AMI_PORT = process.env.AMI_PORT ? Number(process.env.AMI_PORT) : 5038;
// const AMI_USER = process.env.AMI_USER || 'amituser';
// const AMI_PASS = process.env.AMI_PASS || 'Admin@1234';
// const AMI_SECURE = true; // set true if using TLS etc.

// const ami = new AsteriskManager(AMI_PORT, AMI_HOST, AMI_USER, AMI_PASS, AMI_SECURE);
// ami.keepConnected();

// console.log("AMI Connected:", AMI_HOST, AMI_PORT);

// // channel -> call_log_id map
// const channelMap = new Map();

// function parseCallLogId(str) {
//   if (!str) return null;
//   const m = String(str).match(/CALL_ID\s*=\s*(\d+)/i) || String(str).match(/CallID[:=]\s*(\d+)/i);
//   return m ? Number(m[1]) : null;
// }

// function norm(evt) {
//   return {
//     event: (evt.Event || evt.event || '').toLowerCase(),
//     channel: (evt.Channel || evt.channel || '').toString(),
//     variable: (evt.Variable || evt.variable || '').toString(),
//     value: (evt.Value || evt.value || '').toString(),
//     appdata: (evt.AppData || evt.appdata || '').toString(),
//     uniqueid: (evt.Uniqueid || evt.uniqueid || '').toString(),
//   };
// }


// async function originateNumber(number) {
//   try {
//     // normalize
//     let phone = number.phone_number;
//     let contactId = number.id;

//     if (typeof number === 'object' && number !== null) {
//       contactId = number.id || null;
//       phone = number.phone_number || number.phone || number;
//     } else {
//       phone = String(number || '').trim();
//     }

//     if (!phone) throw new Error('Invalid phone number for originate');

// // Insert call log first
    

//     // insert into call_logs
//     const [insertRes] = await pool.query(
//       'INSERT INTO call_logs (contact_id, phone_number, status) VALUES (?, ?, ?)',
//       [contactId, phone, 'initiated']
//     );
//     const callLogId = insertRes.insertId;

//     // update contact last_call_id and status if contactId present
   
//      await pool.query(
//       "UPDATE contacts SET status='calling', last_call_id=? WHERE id=?",
//       [callLogId, contactId]
//     );

//     console.log(`📞 ORIGINATE → ${phone}, CALL_ID=${callLogId}`);

//     // perform AMI originate
//     return await new Promise((resolve, reject) => {
//       ami.action({
//         Action: 'Originate',
//         Channel: `Dongle/dongle0/${phone}`,
//         Context: 'outgoing-call-play',
//         Exten: 's',
//         Priority: 1,
//         CallerID: 'Campaign',
//         Async: 'true',
//         Variable: `CALL_ID=${callLogId}`
//       }, (err, res) => {
//         if (err) {
//           console.error('AMI originate error', err);
//           return reject(err);
//         }
//         console.log('AMI originate queued', { phone, callLogId, res });
//         resolve({ res, callLogId });
//       });
//     });
//   } catch (err) {
//     console.error('originateNumber error:', err);
//     throw err;
//   }
// }

// // AMI event handling
// ami.on('managerevent', async (evt) => {
//   try {
//     const e = norm(evt);
//     console.log(`AMI EVENT: ${e.event} | chan=${e.channel || '-'} | app=${e.appdata || '-'}`);

//     // Map CALL_ID from AppData or Variable to channel
//     const parsed = parseCallLogId(e.appdata);
//     if (parsed) {
//       channelMap.set(e.channel, parsed);
//       console.log('Mapped CALL_ID', parsed, 'to channel', e.channel);
//     }

//     // VarSet events for user input (USERINPUT variable)
//     if (e.event === 'varset') {
//       const varName = (evt.Variable || evt.variable || '').toString().toUpperCase();
//       if (varName.includes('USERINPUT')) {
//         const inputVal = (evt.Value || evt.value || '').toString();
//         const callId = channelMap.get(e.channel) || null;
//         if (callId) {
//           await pool.query('INSERT INTO dtmf_responses (call_id, user_input) VALUES (?, ?)', [callId, inputVal]);
//           await pool.query('UPDATE call_logs SET user_input = ? WHERE id = ?', [inputVal, callId]);
//           console.log(`Saved USERINPUT=${inputVal} for call_id=${callId}`);
//         }
//       }
//     }

//     // Handle custom UserEvent(UserInputReceived)
//     if ((evt.Event || '').toLowerCase() === 'userevent') {
//       const userEvt = (evt.UserEvent || evt.userevent || '').toLowerCase();
//       if (userEvt === 'userinputreceived') {
//         const callIdRaw = evt.CallID || evt.callid || evt['CallId'] || '';
//         const inputRaw = evt.Input || evt.input || '';
//         const callId = parseInt(callIdRaw, 10);
//         const inputVal = String(inputRaw || '').trim();
//         if (callId && inputVal) {
//           await pool.query('INSERT INTO dtmf_responses (call_id, user_input) VALUES (?, ?)', [callId, inputVal]);
//           await pool.query('UPDATE call_logs SET user_input = ? WHERE id = ?', [inputVal, callId]);
//           console.log(`UserEvent saved input='${inputVal}' for call_id=${callId}`);
//         } else {
//           console.log('UserEvent missing CallID/Input', evt);
//         }
//       }
//     }

//     // Newstate/newexten -> call start detection
//     if (e.event === 'newstate' || e.event === 'newexten') {
//       const state = (evt.channelstatedesc || evt.channelstate || '').toString().toLowerCase();
//       if (state.includes('up') || state === '6') {
//         const callId = channelMap.get(e.channel);
//         if (callId) {
//           await pool.query('UPDATE call_logs SET call_start_time = NOW() WHERE id = ? AND call_start_time IS NULL', [callId]);
//           console.log('Set call_start_time for id=', callId);
//         }
//       }
//     }

// // ---------------------------
//     // DongleCEND (Preferred hangup)
//     // ---------------------------
//     if (e.event === "donglecend") {
//       const callId = channelMap.get(e.channel);
//       if (callId) {
//         await handleCallEnd(callId, evt);
//       }
//     }

//     // ---------------------------
//     // Hangup (Backup)
//     // ---------------------------
//     if (e.event === "hangup") {
//       const callId = channelMap.get(e.channel);
//       if (callId) {
//         await handleCallEnd(callId, evt);
//       }
//     }
//   } catch (err) {
//     console.error("AMI EVENT ERROR:", err);
//   }
// });

// // ========================================
// // HANDLE CALL END (common for Hangup + DongleCEND)
// // ========================================
// async function handleCallEnd(callId, evt) {
//   const cause = evt['cause-txt'] || evt.Cause || "";
//   const [rows] = await pool.query(
//     "SELECT contact_id, call_start_time FROM call_logs WHERE id=?",
//     [callId]
//   );

//   if (!rows[0]) return;

//   const started = !!rows[0].call_start_time;
//   const status = started ? "completed" : "not_answered";

//   await pool.query(
//     `UPDATE call_logs 
//      SET call_end_time=NOW(),
//          call_duration=TIMESTAMPDIFF(SECOND, call_start_time, NOW()),
//          status=?, end_status=? 
//      WHERE id=?`,
//     [status, cause, callId]
//   );

//   if (rows[0].contact_id) {
//     await pool.query("UPDATE contacts SET status=? WHERE id=?", [
//       status,
//       rows[0].contact_id,
//     ]);
//   }

//   console.log(`📴 CALL ENDED → ${callId}, status=${status}`);

//   // Signal controller to start next number
//   callEmitter.emit("callCompleted", { callId, status });
// }

// module.exports = {
//   originateNumber,
//   callEmitter,
//   ami,
// };



























// config/ami.js
import AsteriskManager from "asterisk-manager";
import { pool } from "./db.js";
import EventEmitter from "events";

export const callEmitter = new EventEmitter();

const AMI_HOST = process.env.AMI_HOST || "127.0.0.1";
const AMI_PORT = process.env.AMI_PORT ? Number(process.env.AMI_PORT) : 5038;
const AMI_USER = process.env.AMI_USER || "amituser";
const AMI_PASS = process.env.AMI_PASS || "Admin@1234";
const AMI_SECURE = true;

export const ami = new AsteriskManager(
  AMI_PORT,
  AMI_HOST,
  AMI_USER,
  AMI_PASS,
  AMI_SECURE
);

ami.keepConnected();
console.log("✅ AMI Connected:", AMI_HOST, AMI_PORT);

// channel → call_log_id
const channelMap = new Map();

function parseCallLogId(str) {
  if (!str) return null;
  const m =
    String(str).match(/CALL_ID\s*=\s*(\d+)/i) ||
    String(str).match(/CallID[:=]\s*(\d+)/i);
  return m ? Number(m[1]) : null;
}

function norm(evt) {
  return {
    event: (evt.Event || evt.event || "").toLowerCase(),
    channel: (evt.Channel || evt.channel || "").toString(),
    variable: (evt.Variable || evt.variable || "").toString(),
    value: (evt.Value || evt.value || "").toString(),
    appdata: (evt.AppData || evt.appdata || "").toString(),
    uniqueid: (evt.Uniqueid || evt.uniqueid || "").toString(),
  };
}

// ORIGINATE NUMBER
export async function originateNumber(number) {
  try {
    let phone = number.phone_number;
    let contactId = number.id;

    if (typeof number === "object" && number !== null) {
      contactId = number.id || null;
      phone = number.phone_number || number.phone || number;
    } else {
      phone = String(number || "").trim();
    }

    if (!phone) throw new Error("Invalid phone number for originate");

    // Insert call log
    const [insertRes] = await pool.query(
      "INSERT INTO call_logs (contact_id, phone_number, status) VALUES (?, ?, ?)",
      [contactId, phone, "initiated"]
    );
    const callLogId = insertRes.insertId;

    // Update contact
    await pool.query(
      "UPDATE contacts SET status='calling', last_call_id=? WHERE id=?",
      [callLogId, contactId]
    );

    console.log(`📞 ORIGINATE → ${phone}, CALL_ID=${callLogId}`);

    // AMI originate
    return await new Promise((resolve, reject) => {
      ami.action(
        {
          Action: "Originate",
          Channel: `Dongle/dongle0/${phone}`,
          Context: "outgoing-call-play",
          Exten: "s",
          Priority: 1,
          CallerID: "Campaign",
          Async: "true",
          Variable: `CALL_ID=${callLogId}`,
        },
        (err, res) => {
          if (err) {
            console.error("AMI originate error", err);
            return reject(err);
          }
          console.log("AMI originate queued", { phone, callLogId, res });
          resolve({ res, callLogId });
        }
      );
    });
  } catch (err) {
    console.error("originateNumber error:", err);
    throw err;
  }
}

// COMMON CALL END HANDLER
async function handleCallEnd(callId, evt) {
  const cause = evt["cause-txt"] || evt.Cause || "";
  const [rows] = await pool.query(
    "SELECT contact_id, call_start_time FROM call_logs WHERE id=?",
    [callId]
  );
  if (!rows[0]) return;

  const started = !!rows[0].call_start_time;
  const status = started ? "completed" : "not_answered";

  await pool.query(
    `UPDATE call_logs 
       SET call_end_time=NOW(),
           call_duration=TIMESTAMPDIFF(SECOND, call_start_time, NOW()),
           status=?, end_status=? 
     WHERE id=?`,
    [status, cause, callId]
  );

  if (rows[0].contact_id) {
    await pool.query("UPDATE contacts SET status=? WHERE id=?", [
      status,
      rows[0].contact_id,
    ]);
  }

  console.log(`📴 CALL ENDED → ${callId}, status=${status}`);
  callEmitter.emit("callCompleted", { callId, status });
}

// AMI EVENTS
ami.on("managerevent", async (evt) => {
  try {
    const e = norm(evt);
    // console.log("AMI EVENT:", e.event);

    const parsedId = parseCallLogId(e.appdata);
    if (parsedId) {
      channelMap.set(e.channel, parsedId);
    }

    // VarSet USERINPUT
    if (e.event === "varset") {
      const varName = (evt.Variable || evt.variable || "")
        .toString()
        .toUpperCase();
      if (varName.includes("USERINPUT")) {
        const inputVal = (evt.Value || evt.value || "").toString();
        const callId = channelMap.get(e.channel) || null;
        if (callId) {
          await pool.query(
            "INSERT INTO dtmf_responses (call_id, user_input) VALUES (?, ?)",
            [callId, inputVal]
          );
          await pool.query(
            "UPDATE call_logs SET user_input = ? WHERE id = ?",
            [inputVal, callId]
          );
        }
      }
    }

    // Newstate / newexten for start time
    if (e.event === "newstate" || e.event === "newexten") {
      const state = (
        evt.channelstatedesc ||
        evt.channelstate ||
        ""
      ).toString().toLowerCase();
      if (state.includes("up") || state === "6") {
        const callId = channelMap.get(e.channel);
        if (callId) {
          await pool.query(
            "UPDATE call_logs SET call_start_time = NOW() WHERE id = ? AND call_start_time IS NULL",
            [callId]
          );
        }
      }
    }

    // Hangup events
    if (e.event === "donglecend" || e.event === "hangup") {
      const callId = channelMap.get(e.channel);
      if (callId) await handleCallEnd(callId, evt);
    }
  } catch (err) {
    console.error("AMI EVENT ERROR:", err);
  }
});
