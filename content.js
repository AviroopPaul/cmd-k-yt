// YouTube Cmd+K Search Extension
// Adds a Mac-like search overlay to YouTube

(function () {
  "use strict";

  let overlay = null;
  let searchInput = null;

  // Create the search overlay
  function createOverlay() {
    if (overlay) return; // Prevent duplicates

    // Create overlay backdrop
    overlay = document.createElement("div");
    overlay.id = "yt-cmdk-overlay";

    // Create search container
    const searchContainer = document.createElement("div");
    searchContainer.id = "yt-cmdk-search-container";

    // Create search input
    searchInput = document.createElement("input");
    searchInput.id = "yt-cmdk-search-input";
    searchInput.type = "text";
    searchInput.placeholder = "Search YouTube...";
    searchInput.autocomplete = "off";
    searchInput.spellcheck = false;

    // Create hint text
    const hint = document.createElement("div");
    hint.id = "yt-cmdk-hint";
    hint.innerHTML =
      'Press <span class="yt-cmdk-kbd">Enter</span> to search or <span class="yt-cmdk-kbd">Esc</span> to close';

    // Assemble the overlay
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(hint);
    overlay.appendChild(searchContainer);

    // Add event listeners
    setupEventListeners();

    // Add to DOM
    document.body.appendChild(overlay);
  }

  // Show the overlay
  function showOverlay() {
    createOverlay();
    overlay.style.display = "flex";

    // Focus the input after a brief delay to ensure animation plays
    setTimeout(() => {
      searchInput.focus();
    }, 100);
  }

  // Hide the overlay
  function hideOverlay() {
    if (!overlay) return;
    overlay.style.display = "none";
    searchInput.value = ""; // Clear the input
  }

  // Handle search submission
  function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) {
      // If empty, just close the overlay
      hideOverlay();
      return;
    }

    // Encode the query and redirect to YouTube search
    const encodedQuery = encodeURIComponent(query);
    window.location.href = `https://www.youtube.com/results?search_query=${encodedQuery}`;
  }

  // Setup event listeners for the overlay
  function setupEventListeners() {
    // Handle Enter key to search
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      } else if (e.key === "Escape") {
        e.preventDefault();
        hideOverlay();
      }
    });

    // Close overlay when clicking on backdrop
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        hideOverlay();
      }
    });

    // Prevent clicks inside search container from closing overlay
    const searchContainer = overlay.querySelector("#yt-cmdk-search-container");
    searchContainer.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // Check if user is currently typing in an input field
  function isTypingInInput() {
    const activeElement = document.activeElement;
    const tagName = activeElement.tagName.toLowerCase();

    // Check if user is typing in an input, textarea, or contenteditable element
    if (tagName === "input" || tagName === "textarea") {
      return true;
    }

    if (activeElement.isContentEditable) {
      return true;
    }

    return false;
  }

  // Global keyboard listener for Cmd+K / Ctrl+K
  document.addEventListener(
    "keydown",
    (e) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key === "k";

      if (isCmdK) {
        // Don't trigger if user is already typing in an input field
        // (unless it's our own search input)
        if (isTypingInInput() && document.activeElement !== searchInput) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        // Toggle overlay
        if (overlay && overlay.style.display === "flex") {
          hideOverlay();
        } else {
          showOverlay();
        }
      }
    },
    true
  ); // Use capture phase to intercept before YouTube's handlers

  // Also listen for Escape key globally to close overlay
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && overlay && overlay.style.display === "flex") {
        // Only handle if our overlay is open and no other input is focused
        if (document.activeElement === searchInput) {
          e.preventDefault();
          e.stopPropagation();
          hideOverlay();
        }
      }
    },
    true
  );

  console.log("YouTube Cmd+K Search extension loaded");
})();
