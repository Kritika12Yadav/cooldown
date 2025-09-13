const STORAGE_KEY = 'cd_entries';

function getEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function setEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

let selectedEmoji = null;

// Handle emoji selection
function selectEmojiBtn(btn) {
  document.querySelectorAll('.emoji-btn').forEach(el => el.classList.remove('selected'));
  btn.classList.add('selected');
  selectedEmoji = btn.dataset.emoji;

  // Update guided text
  const chosenEmojiEl = document.getElementById('chosen-emoji');
  if (chosenEmojiEl) {
    chosenEmojiEl.textContent = selectedEmoji;
  }
}

// Save entry to localStorage
function saveEntry() {
  const reflection = document.getElementById('reflection').value.trim();
  if (!selectedEmoji || !reflection) {
    alert('Pick emoji + reflection');
    return;
  }

  const now = new Date();
  const entry = {
    date: now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    emoji: selectedEmoji,
    reflection: reflection
  };

  const entries = getEntries();
  entries.unshift(entry); // newest first
  setEntries(entries);

  // Reset UI
  document.getElementById('reflection').value = '';
  const chosenEmojiEl = document.getElementById('chosen-emoji');
  if (chosenEmojiEl) {
    chosenEmojiEl.textContent = "___";
  }
  selectedEmoji = null;
  document.querySelectorAll('.emoji-btn').forEach(btn => btn.classList.remove('selected'));

  alert('Entry saved!');
}

// Render entries on Calendar page
function renderEntries(container) {
  const entries = getEntries();
  if (entries.length) {
    container.innerHTML = '';
    entries.forEach(entry => {
      container.innerHTML += `
        <p><strong>${entry.date}</strong> ${entry.emoji}<br>${entry.reflection}</p><hr>
      `;
    });
  } else {
    container.innerHTML = '<p>No entries</p>';
  }
}

// Show correct steps on Steps page
function showSteps() {
  const latest = getEntries()[0];
  if (latest && /[😡🤬😤]/.test(latest.emoji)) {
    document.getElementById('anger-steps').style.display = 'block';
  } else {
    document.getElementById('general-steps').style.display = 'block';
  }
}

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
  // Mood tracker emoji buttons
  document.querySelectorAll('.emoji-btn').forEach(btn =>
    btn.addEventListener('click', () => selectEmojiBtn(btn))
  );

  // Save entry button
  if (document.getElementById('saveEntry')) {
    document.getElementById('saveEntry').addEventListener('click', saveEntry);
  }

  // Calendar page
  if (document.getElementById('entries')) {
    renderEntries(document.getElementById('entries'));
  }

  // Steps page
  if (document.getElementById('steps-gate')) {
    showSteps();
  }
});
