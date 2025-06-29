let quotes = [];


function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : [];
}


function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}


async function fetchQuotesFromServer() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  const data = await response.json();
  return data.map(post => ({
    text: post.title,
    category: "Server"
  }));
}


async function postQuoteToServer(quote) {
  await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(quote),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  });
}


async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    const localData = JSON.stringify(quotes);
    const serverData = JSON.stringify(serverQuotes);

    if (localData !== serverData) {
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      notifyUser("Quotes updated from server. Local data was overwritten.");
    }
  } catch (error) {
    console.error("Sync failed:", error);
    notifyUser("Sync failed. Check your connection.");
  }
}


function notifyUser(message) {
  let existing = document.getElementById("syncNotice");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.id = "syncNotice";
  banner.textContent = message;
  banner.style.background = "#eaf4fc";
  banner.style.border = "1px solid #007acc";
  banner.style.padding = "10px";
  banner.style.margin = "10px 0";
  banner.style.borderRadius = "5px";
  banner.style.color = "#004d80";

  document.body.insertBefore(banner, document.body.firstChild);

  setTimeout(() => {
    banner.remove();
  }, 5000);
}


function showRandomQuote() {
  const selected = document.getElementById("categoryFilter").value;
  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const random = Math.floor(Math.random() * filtered.length);
  const quote = filtered[random];

  quoteDisplay.innerHTML = `"${quote.text}"<br><small>- ${quote.category}</small>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  notifyUser("Quote added locally.");


  postQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}


function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const uniqueCats = [...new Set(quotes.map(q => q.category))];
  const selected = localStorage.getItem("selectedCategory") || "all";

  select.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCats.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    if (cat === selected) opt.selected = true;
    select.appendChild(opt);
  });
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  document.getElementById("quoteDisplay").textContent = "";
}

function restoreLastViewedQuote() {
  const last = sessionStorage.getItem("lastViewedQuote");
  if (last) {
    const q = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML =
      `"${q.text}"<br><small>- ${q.category}</small>`;
  }
}


document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastViewedQuote();

  const savedFilter = localStorage.getItem("selectedCategory") || "all";
  document.getElementById("categoryFilter").value = savedFilter;

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  
  syncQuotes(); 
  setInterval(syncQuotes, 30000);
});