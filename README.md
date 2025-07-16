# Marine Typer 🐟⌨️

Welcome to **Marine Typer**, the first fishing + typing game that brings real-life marine animals to your fingertips! Explore the world map, fish for marine creatures based on actual occurrences, and hone your typing skills with quotes from Moby Dick.

## 🚀 Features

- **Interactive World Map**: Click anywhere on the map (powered by Leaflet and OpenStreetMap) to select a fishing location.
- **Dynamic Map Styles**: Switch between different map styles on the fly. Tiles provided by ArcGIS Online. 📍 Tiles © Esri
- **Real Marine Data**: Fetch marine life occurrences within a 40 km radius using the Ocean Biodiversity Information System (OBIS) API.
- **Vernacular Names**: Retrieve localized common names via the MarineSpecies REST API.
- **Encyclopedia Details**: Pull images and descriptions from Wikipedia API for each caught creature.
- **Typing Challenge**: Complete a typing minigame with quotes from _Moby Dick_ to catch your fish.
  - Time limit adapts to your WPM and play count for a personalized challenge.
- **Marine Compendium**: View your collection of caught marine life with stats and details.
- **Persistence**: Game state is saved in local storage. Delete it to reset your compendium.
- **Future Plans**: Introduce a currency (Marine Units, MU), a shop for upgrades, and additional gameplay depth.

## ⚙️ Installation & Running

This project uses React, Vite, and TypeScript. No API keys required 😊 it runs entirely on public APIs.

```bash
# Clone the repo
git clone https://github.com/yourusername/marine-typer.git
cd marine-typer

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open your browser at `http://localhost:5173` (or the URL shown in your terminal) and start fishing!

## 🎮 How to Play

1. **Select a Location**: Click on the world map to choose a fishing spot.
2. **Go Fish**: Hit the **Go Fish** button.
   - If no animals are found, try a different spot.
3. **Typing Minigame**: Type the displayed _Moby Dick_ quote correctly within the time limit.
4. **Catch Your Fish**: Complete the quote to add the marine animal to your compendium.
5. **Explore**: Check your Compendium for stats, images, and descriptions of your catches.

## 🗺️ Map & APIs

- **Map**: Leaflet + OpenStreetMap
- **Map Styles**: ArcGIS Online (Tiles © Esri)
- **Geocoding**: OpenStreetMap Nominatim for location names
- **Marine Occurrences**: Ocean Biodiversity Information System (OBIS) API
- **Vernacular Names**: MarineSpecies REST API
- **Details & Images**: Wikipedia API

## 📋 Attributions

- Bait icons created by Freepik - Flaticon
- Fishing boat icons created by Freepik - Flaticon
- Google maps icons created by Yuju - Flaticon

## 💡 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

## 📜 License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

Happy fishing and typing! 🐬
