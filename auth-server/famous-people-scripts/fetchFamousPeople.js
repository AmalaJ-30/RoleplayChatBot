// fetchFamousPeople.js
import fs from "fs";
import fetch from "node-fetch";

// Output file path (this will be created or overwritten)
/*const OUTPUT_FILE = new URL("../famousPeople.json", import.meta.url);

async function fetchUSPresidents() {
  console.log("Fetching US Presidents from Wikipedia...");

  const url =
    "https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Presidents_of_the_United_States&format=json&cmlimit=500";

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  const data = await res.json();
   const presidents = data.query.categorymembers
    .map((p) => p.title)
    .filter((title) => 
      !title.startsWith("Category:") && 
      !title.startsWith("List of") && 
      !title.includes("Bibliographies") && 
      !title.includes("Project") && 
      !title.includes("Fictional") &&
      title.trim().length > 0
    );

  console.log(`✅ Found ${presidents.length} US Presidents`);

  return presidents;
}

async function main() {
  try {
    const presidents = await fetchUSPresidents();

    // For now, our famous people list is just the presidents
    const famousPeopleList = presidents;

    // Save to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(famousPeopleList, null, 2));
    console.log(`💾 Saved ${famousPeopleList.length} names to famousPeople.json`);
  } catch (err) {
    console.error("❌ Error fetching famous people:", err);
  }
}

main(); */

const OUTPUT_FILE = new URL("../famousPeople.json", import.meta.url);

// ✅ Categories to fetch
const categories = [
  "Category:Presidents_of_the_United_States",
  "Category:Hollywood_actors",
  "Category:Nobel_laureates_in_Physics",
  "Category:Famous_musicians"
];

async function fetchCategory(title) {
  console.log(`Fetching ${title} from Wikipedia...`);

  const url =
    `https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(title)}&format=json&cmlimit=500`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  const data = await res.json();
  return data.query.categorymembers
    .map((p) => p.title)
    .filter(
      (title) =>
        !title.startsWith("Category:") &&
        !title.startsWith("List of") &&
        !title.includes("Bibliographies") &&
        !title.includes("Project") &&
        !title.includes("Fictional") &&
        title.trim().length > 0
    );
}

async function main() {
  try {
    let allPeople = new Set();

    for (const category of categories) {
      const names = await fetchCategory(category);
      names.forEach((name) => allPeople.add(name));
    }

    const famousPeopleList = Array.from(allPeople).sort();

    // Save to JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(famousPeopleList, null, 2));
    console.log(`💾 Saved ${famousPeopleList.length} names to famousPeople.json`);
  } catch (err) {
    console.error("❌ Error fetching famous people:", err);
  }
}

main();
