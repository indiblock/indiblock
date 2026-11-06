// Built-in block lists. Edit these to change what IndiBlock hides by default.
// Users can add their own entries from the popup without touching this file.
//
// Note: content.js also blocks by PATTERN, so any subreddit whose name contains
// "india" (not Indiana), "bolly", "tollywood", "kollywood", "mollywood",
// "hindi", "tamil", "telugu", "malayalam", "kannada" or "bhojpuri" is hidden
// automatically. This list is for names the patterns can't catch.
globalThis.IB_LISTS = {
  // Subreddit names (lowercase, no "r/"). Exact match.
  subreddits: [
    // country / general
    "india", "unitedstatesofindia", "desi", "abcdesis", "desivideomemes",

    // cities & regions
    "mumbai", "delhi", "newdelhi", "bangalore", "bengaluru", "kolkata", "chennai",
    "hyderabad", "pune", "ahmedabad", "jaipur", "lucknow", "goa", "kerala",
    "punjab", "gujarat", "maharashtra", "tamilnadu", "karnataka",
    "bengali", "marathi",

    // film, TV & entertainment
    "bollywood", "bollywoodmemes", "bollyblindsngossip", "bollywoodgossips",
    "bollywoodrealism", "bollywoodmusic", "bollywoodfashion",
    "tollywood", "tollywoodgossips", "kollywood", "kollygossips",
    "mollywood", "insidemollywood", "malayalammovies", "sandalwood",
    "biggboss",

    // other communities added by hand
    "coconaad", "patahaiaajkyahua", "jkreacts", "frugal_ind"
  ],

  // Whole-word matches in post titles (case-insensitive).
  // Titles are also checked for anything starting with "bolly" (see content.js).
  keywords: [
    "india", "indian", "indians",
    "delhi", "mumbai", "bangalore", "bengaluru", "kolkata", "chennai",
    "hyderabad", "pune", "kerala", "punjab", "ahmedabad", "jaipur", "lucknow",
    "bollywood", "tollywood", "kollywood", "mollywood",
    "hindi", "bhojpuri", "desi", "modi"
  ]
};
