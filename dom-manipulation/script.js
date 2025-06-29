let quotes = [];
let serverQuotes = []; 

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : [];
  saveQuotes();
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function fetchFromServer() {
  
  serverQuotes = [
    { text: "Stay hungry, stay foolish.", category: "Inspiration" },
    { text: "Knowledge is power.", category: "Education" },
  ];
  console.log("Fetched from server:", serverQuotes);
}


function syncWithServer() {
  fetchFromServer();

  const localJSON = JSON.stringify(quotes);
  const serverJSON = JSON.stringify(serverQuotes);

  if (localJSON !== serverJSON) {
    
    quotes = [...serverQuotes]; 
    saveQuotes();
    populateCategories();
    notifyUser("Quotes synced from server. Local changes were overwritten.");
  }
}


function notifyUser(message) {
  const existing = document.getElementById("syncNotice");
  if (existing) existing.remove();

  const notice = document.createElement("div");
  notice.id = "syncNotice";
  notice.textContent = message;
  notice.style.background = "#fff3cd";
  notice.style.border = "1px solid #ffeeba";
  notice.style.padding = "10px";
  notice.style.margin = "10px 0";
  notice.style.borderRadius = "5px";
  notice.style.color = "#856404";

  document.body.insertBefore(notice, document.body.firstChild);

  setTimeout(() => {
    if (notice) notice.remove();
  }, 6000);
}
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastViewedQuote();

  const selected = getFilterPreference();
  document.getElementById("categoryFilter").value = selected;
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  
  setInterval(syncWithServer, 30000); 
});
function syncWithServer() {
  fetchFromServer();
  const hasConflict = JSON.stringify(quotes) !== JSON.stringify(serverQuotes);

  if (hasConflict) {
    if (confirm("Server data differs from local. Overwrite local with server?")) {
      quotes = [...serverQuotes];
      saveQuotes();
      populateCategories();
      notifyUser("Local data replaced with server data.");
    } else {
      notifyUser("Sync skipped. Local data retained.");
    }
  }
}
async function fetchFromServer() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=2');
  const data = await res.json();
  serverQuotes = data.map(post => ({
    text: post.title,
    category: "General"
  }));
}
