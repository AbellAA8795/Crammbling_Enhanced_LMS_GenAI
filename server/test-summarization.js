// Quick test script: sends 20 messages into one chat to trigger
// summarization (SUMMARY_TRIGGER_MESSAGE_COUNT, default 20).
// Run with: node test-summarization.js
//
// Edit the two constants below before running.

const BASE_URL = "http://localhost:5000";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoiYWJlbGxhX2dhYnJpZWxyZXlAcGxwYXNpZy5lZHUucGgiLCJ1c2VybmFtZSI6ImdhYnJpZWxyZXlhYmVsbGEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc5MTEyMjE2MiwiZXhwIjoxNzkxNzI2OTYyfQ.7o-M7Y5fTbSJLIumIWlLAp9gX1uFpIh5m23x4v0mZ4k"; // get this from logging in via Postman first

async function startChat() {
  const res = await fetch(`${BASE_URL}/api/chat/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ message: "Let's talk about the solar system." }),
  });

  // This is an SSE response — just drain it so the request completes.
  const text = await res.text();
  const startMatch = text.match(/"type":"start","chatId":(\d+)/);
  if (!startMatch) {
    console.error("Could not find chatId in response:", text.slice(0, 500));
    process.exit(1);
  }
  return Number(startMatch[1]);
}

async function sendMessage(chatId, message) {
  const res = await fetch(`${BASE_URL}/api/chat/${chatId}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ message }),
  });
  await res.text(); // drain the SSE stream
}

async function main() {
  console.log("Starting chat...");
  const chatId = await startChat();
  console.log(`Chat started: chatId=${chatId}`);

  const topics = [
    "Tell me about Mercury.", "What about Venus?", "Tell me about Earth.",
    "What about Mars?", "Tell me about Jupiter.", "What about Saturn?",
    "Tell me about Uranus.", "What about Neptune?", "Is Pluto a planet?",
    "What's an asteroid belt?", "What's a comet made of?", "How far is the Sun?",
    "What's a light year?", "Do other stars have planets?", "What's a black hole?",
    "How old is the universe?", "What's the Milky Way?", "Are there other galaxies?",
    "What's dark matter?", "Summarize everything we've talked about.",
  ];

  for (let i = 0; i < topics.length; i++) {
    console.log(`Sending message ${i + 1}/${topics.length}: "${topics[i]}"`);
    await sendMessage(chatId, topics[i]);
  }

  console.log(`\nDone. Check the DB now:`);
  console.log(`SELECT summary, summary_covers_up_to_message_id, summary_updated_at FROM chatbot.chats WHERE chat_id = ${chatId};`);
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
