async function sendMessage() {
  const input = document.getElementById("user-input");
  const msg = input.value;

  if (!msg) return;

  const chatBox = document.getElementById("chat-box");

  // Show user message
  chatBox.innerHTML += `<div class="user">You: ${msg}</div>`;

  // Send to backend
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();

  // Show bot reply
  chatBox.innerHTML += `<div class="bot">Bot: ${data.reply}</div>`;

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}