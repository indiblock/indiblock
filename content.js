(() => {
  const LISTS = globalThis.IB_LISTS;

  // Any subreddit name containing "india", except Indiana / Indianapolis etc.
  const INDIA_NAME = /india(?!na)/i;

  let blockedSubs = new Set();
  let keywordRegex = null;
  let paused = false;

  const normSub = (s) =>
    String(s || "").trim().toLowerCase().replace(/^\/?r\//, "").replace(/\/$/, "");
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function loadSettings(done) {
    chrome.storage.local.get({ extraSubs: [], extraKeywords: [], paused: false }, (d) => {
      paused = !!d.paused;
      blockedSubs = new Set(
        [...LISTS.subreddits, ...d.extraSubs].map(normSub).filter(Boolean)
      );
      const kws = [...LISTS.keywords, ...d.extraKeywords]
        .map((k) => String(k).trim())
        .filter(Boolean)
        .map(escapeRe);
      keywordRegex = kws.length ? new RegExp("\\b(?:" + kws.join("|") + ")\\b", "i") : null;
      done && done();
    });
  }

  const isBlockedSub = (name) => {
    const n = normSub(name);
    return !paused && !!n && (blockedSubs.has(n) || INDIA_NAME.test(n));
  };
  const isBlockedTitle = (t) => !paused && !!t && !!keywordRegex && keywordRegex.test(t);

  // ---------- Hiding CSS ----------
  const style = document.createElement("style");
  style.textContent = ".ib-hidden{display:none !important;}";
  (document.head || document.documentElement).appendChild(style);

  // ---------- Post detection ----------
  const POST_SELECTOR = [
    "shreddit-post",              // new Reddit
    "div.thing[data-subreddit]",  // old Reddit feed
    "div.search-result"           // old Reddit search results
  ].join(",");

  function readPost(el) {
    if (el.tagName.toLowerCase() === "shreddit-post") {
      return {
        sub: el.getAttribute("subreddit-name") || el.getAttribute("subreddit-prefixed-name"),
        title: el.getAttribute("post-title")
      };
    }
    if (el.classList.contains("search-result")) {
      return {
        sub: (el.querySelector("a.search-subreddit-link") || {}).textContent,
        title: (el.querySelector("a.search-title") || {}).textContent
      };
    }
    return {
      sub: el.getAttribute("data-subreddit"),
      title: (el.querySelector("a.title") || {}).textContent
    };
  }

  function processPost(el) {
    const { sub, title } = readPost(el);
    el.classList.toggle("ib-hidden", isBlockedSub(sub) || isBlockedTitle(title));
  }

  function scan(root) {
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.matches && root.matches(POST_SELECTOR)) processPost(root);
    root.querySelectorAll && root.querySelectorAll(POST_SELECTOR).forEach(processPost);
  }

  // ---------- Full-page cover when visiting a hidden community ----------
  let overlay = null;
  function checkPage() {
    const m = location.pathname.match(/^\/r\/([^/]+)/i);
    const blocked = !!(m && isBlockedSub(m[1]));
    if (blocked && !overlay) {
      overlay = document.createElement("div");
      overlay.style.cssText =
        "position:fixed;inset:0;z-index:2147483647;background:#f4f4f4;color:#333;" +
        "display:flex;flex-direction:column;align-items:center;justify-content:center;" +
        "font-family:system-ui,sans-serif;text-align:center;gap:16px;";
      overlay.innerHTML =
        "<div style='font-size:20px'>This community is hidden by IndiBlock.</div>";
      const btn = document.createElement("button");
      btn.textContent = "Go back";
      btn.style.cssText = "padding:10px 20px;font-size:16px;cursor:pointer;";
      btn.onclick = () => (history.length > 1 ? history.back() : (location.href = "/"));
      overlay.appendChild(btn);
      document.documentElement.appendChild(overlay);
    } else if (!blocked && overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  // ---------- Run ----------
  loadSettings(() => {
    checkPage();
    scan(document);

    const observer = new MutationObserver((mutations) => {
      for (const mut of mutations) {
        mut.addedNodes.forEach((n) => n.nodeType === 1 && scan(n));
      }
      checkPage(); // new Reddit navigates without full page reloads
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    document.addEventListener("DOMContentLoaded", () => { checkPage(); scan(document); });
  });

  // Re-apply when the user changes settings in the popup
  chrome.storage.onChanged.addListener((_changes, area) => {
    if (area !== "local") return;
    loadSettings(() => {
      document.querySelectorAll(POST_SELECTOR).forEach(processPost);
      checkPage();
    });
  });

  // Popup asks how many posts are hidden on this page
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg && msg.type === "ib-status") {
      sendResponse({ count: document.querySelectorAll(".ib-hidden").length, paused });
    }
  });
})();
