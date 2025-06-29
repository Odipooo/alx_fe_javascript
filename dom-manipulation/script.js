let quotes = [];


function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to predict the future is to invent it.", category: "Motivation" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
      { text: "Do or do not. There is no try.", category: "Wisdom" }
    ];
    saveQuotes();
  }
}


function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}


function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}"<br><small>- ${quote.category}</small>`;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}


function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();
    alert("Quote added successfully!");
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}


function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}


function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (error) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}


function createUI() {
  const container = document.createElement("div");

  
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.onclick = addQuote;

  
  const exportBtn = document.createElement("button");
  exportBtn.id = "exportQuotes";
  exportBtn.textContent = "Export Quotes";
  exportBtn.onclick = exportToJsonFile;

  
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.id = "importFile";
  importInput.accept = ".json";
  importInput.onchange = importFromJsonFile;

  
  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(addBtn);
  container.appendChild(document.createElement("br"));
  container.appendChild(exportBtn);
  container.appendChild(importInput);

  document.body.appendChild(container);
}


document.addEventListener("DOMContentLoaded", function () {
  loadQuotes();
  createUI();
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML =
      `"${quote.text}"<br><small>- ${quote.category}</small>`;
  }

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
});