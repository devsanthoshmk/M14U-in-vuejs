# M14U: Vue music streaming client and YouTube Music Vue app

M14U is a web audio player that streams music from YouTube Music through a Python extraction backend.

This Vue music streaming client pairs a reactive single-page interface with a Flask streaming backend. The YouTube Music Vue app lets users search tracks, reorder playback queues with drag-and-drop controls, and stream audio directly in the browser. This project is the original client prototype for M14U, predating the edge streaming architecture in m14u-workers-v4.

## Architecture

M14U divides responsibilities between a Vue 3 frontend and a Python Flask backend.

### Frontend architecture

The frontend runs as a single-page application built with Vue 3 and Vite.

- Interface layout: `index.html` loads Bootstrap 5.3.3 and Font Awesome icons. The root view in `src/app.vue` contains an offcanvas drawer for search and queue controls, alongside a central player card for media controls.
- Queue management: `vuedraggable` version 4.1.0 manages track queue order. Users reorder tracks by dragging queue item handles, delete tracks individually, or clear the queue.
- Audio playback: `src/app.vue` controls an HTML5 Audio instance. The component tracks playback position, computes elapsed and total duration strings, updates progress bar width, and advances to the next track when the `onended` event fires.
- Backend communication: `src/app.vue` issues HTTP fetch requests to `http://127.0.0.1:1234/song_results` for search queries and `http://127.0.0.1:1234/playable_link` for stream URL resolution.

### Backend architecture

The backend runs a Python Flask service inside `python_api/`.

- Query resolution: `python_api/YoutubeMusicAPI.py` queries YouTube Music search, parses video identifiers from the HTML payload with regular expressions, and requests song titles, artist names, and cover thumbnails from the YouTube oEmbed API.
- Stream extraction: `python_api/ytdlp.py` uses `yt_dlp` to extract direct audio stream URLs in webm or m4a format without downloading media files to disk.
- Network launcher: `python_api/start_gunicorn.py` detects the local network IP address through a UDP socket to 8.8.8.8 on port 80, prints a terminal QR code with `qrcode`, and runs Gunicorn on port 8000.

## Setup

### Prerequisites

- Node.js 18 or later with npm
- Python 3.10 or later with pip

### Frontend installation

Install dependencies from the repository root:

```bash
npm install
```

### Backend installation

Navigate to the `python_api` directory and install Python dependencies:

```bash
cd python_api
pip install -r requirements.txt
```

## Usage

### Running the backend

Run the Flask application on port 1234 to match frontend requests:

```bash
cd python_api
python app.py
```

The Flask server listens at `http://127.0.0.1:1234`.

To start the Gunicorn server with local IP QR code output:

```bash
cd python_api
python start_gunicorn.py
```

The Gunicorn server binds to `http://0.0.0.0:8000`.

### Running the frontend

Start the Vite development server from the repository root:

```bash
npm run dev
```

The Vite development server runs at `http://localhost:5173`.

To compile static production assets into `dist/`:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Player controls

- Open the queue: click the music note icon in the top-left corner to toggle the offcanvas drawer.
- Search songs: enter a song title in the search field and press Enter.
- Direct playback: click any song result to load and play the track immediately.
- Queue songs: click the queue icon next to a song result to append it to the queue.
- Reorder queue: drag tracks up or down with the handle icon.
- Playback controls: use the player card buttons to play, pause, skip, go to previous track, toggle favorite status, or seek through the progress bar.

## Configuration

### Backend endpoints

`src/app.vue` defines backend endpoints pointing to port 1234:

- `GET /song_results?input=<query>`: returns search results with title, artist, cover image, and YouTube URL.
- `GET /playable_link?song_url=<url>`: returns the resolved direct audio stream URL.
- `GET /sayhi`: returns a test greeting string.

### Authentication cookies

`python_api/ytdlp.py` specifies `python_api/cookies.txt` for YouTube authentication. Export valid cookies to `cookies.txt` when YouTube enforces verification blocks or rate limits.

### Deployment settings

The repository includes deployment specifications for hosting platforms:

- `vercel.json`: routes incoming requests to `app.py` through the `@vercel/python` builder.
- `python_api/railpack.json`: sets the build engine to `RAILPACK` for Railway deployment.
