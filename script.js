// SnapScape — Part 2: catch the search, fetch images, and render cards.

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

async function searchImages(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query" +
    "&generator=search&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo" +
    "&iiprop=url&iiurlwidth=500&format=json&origin=*";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Image search request failed: " + response.status);
  }

  const data = await response.json();
  const pages = data.query ? Object.values(data.query.pages || {}) : [];
  return pages.filter((item) =>
    item.imageinfo && item.imageinfo[0] &&
    (item.imageinfo[0].thumburl || item.imageinfo[0].url)
  );
}

function renderResults(items, query) {
  results.innerHTML = "";

  items.forEach((item) => {
    const imageInfo = item.imageinfo[0];
    const imageUrl = imageInfo.thumburl || imageInfo.url;

    const card = document.createElement("article");
    card.className = "card";

    const link = document.createElement("a");
    link.className = "result-link";
    link.href = imageInfo.descriptionurl || imageInfo.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Open " + item.title + " in a new tab");

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = item.title;
    image.loading = "lazy";

    const caption = document.createElement("p");
    caption.className = "result-caption";
    caption.textContent = item.title.replace(/^File:/, "");

    link.appendChild(image);
    card.appendChild(link);
    card.appendChild(caption);
    results.appendChild(card);
  });

  resultCount.textContent = "SHOWING " + items.length +
    " RESULTS FOR “" + query.toUpperCase() + "”";
  emptyState.hidden = items.length > 0;

  if (items.length === 0) {
    emptyState.querySelector(".empty-title").textContent = "No images found yet.";
    emptyState.querySelector(".empty-description").textContent =
      "Try another topic or a shorter search phrase.";
  }
}

async function runSearch(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return;

  resultCount.textContent = "SEARCHING…";
  try {
    const items = await searchImages(cleanQuery);
    renderResults(items, cleanQuery);
  } catch (error) {
    results.innerHTML = "";
    resultCount.textContent = "SEARCH COULD NOT BE COMPLETED";
    emptyState.hidden = false;
    emptyState.querySelector(".empty-title").textContent = "Something went wrong.";
    emptyState.querySelector(".empty-description").textContent =
      "Please check your connection and try searching again.";
    console.error(error);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = input.value;
  if (!query.trim()) return;
  runSearch(query);
});

// Enhancement: the quick-pick topic chips start a search with one click.
document.querySelectorAll(".topic-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.textContent.replace("↗", "").trim();
    runSearch(input.value);
  });
});
