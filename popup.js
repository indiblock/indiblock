const subsEl = document.getElementById("subs");
const kwsEl = document.getElementById("kws");
const pausedEl = document.getElementById("paused");
const status = document.getElementById("status");
const countEl = document.getElementById("count");

const toList = (t) => t.split("\n").map((s) => s.trim()).filter(Boolean);

chrome.storage.local.get({ extraSubs: [], extraKeywords: [], paused: false }, (d) => {
  subsEl.value = d.extraSubs.join("\n");
  kwsEl.value = d.extraKeywords.join("\n");
  pausedEl.checked = !!d.paused;
});

// Ask the active Reddit tab how many posts it has hidden
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs[0]) return;
  chrome.tabs.sendMessage(tabs[0].id, { type: "ib-status" }, (res) => {
    if (chrome.runtime.lastError || !res) return; // not a Reddit tab
    countEl.textContent = res.paused
      ? "Filtering is paused."
      : res.count + " post" + (res.count === 1 ? "" : "s") + " hidden on this page";
  });
});

pausedEl.addEventListener("change", () => {
  chrome.storage.local.set({ paused: pausedEl.checked });
});

document.getElementById("save").addEventListener("click", () => {
  chrome.storage.local.set(
    { extraSubs: toList(subsEl.value), extraKeywords: toList(kwsEl.value) },
    () => {
      status.textContent = "Saved";
      setTimeout(() => (status.textContent = ""), 1500);
    }
  );
});
