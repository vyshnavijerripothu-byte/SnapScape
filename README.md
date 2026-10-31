# SnapScape

SnapScape will become a simple image-discovery app where people can search for pictures by topic. I chose a warm coral-and-cream palette with a dark ink background to give the interface an editorial feel instead of copying the reference app. The topic chips make common searches easy to discover, while the empty-state message explains what belongs in the results area before the first search. This first version focuses on the responsive interface; image fetching will be added in the next part.

## Part 2 — Fetch & Render

SnapScape now searches Wikimedia Commons and displays matching images in a responsive gallery.

### How it works
1. The search form listens for the `submit` event and prevents a page reload.
2. Empty searches are ignored.
3. The search term is safely added to the Wikimedia Commons API URL with `encodeURIComponent()`.
4. The app checks `response.ok`, reads the JSON response, and creates an image card for each result.
5. Previous cards are cleared before new results are displayed.

### Extra enhancement
The quick-pick topic chips run searches with one click. The gallery also displays the number of results, and each image opens its Commons source in a new tab.

Open `index.html` in a browser to try SnapScape. An internet connection is required for image search.
