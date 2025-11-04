# 🌍 Good News Globe

**Good News Globe** is a modern web app that helps you discover **positive and uplifting news** from around the world.  
It filters out negative or tragic stories using sentiment analysis — bringing light to your day, one story at a time ✨

![Good News Globe Screenshot](./src/assets/screenshot.png)

---

## 🚀 Features

- 📰 **Positive News Only** — powered by sentiment analysis and keyword filtering
- 🌎 **Country-Based Search** — find uplifting stories from your region or around the world
- 📅 **Customizable Time Periods** — filter by last 3, 7, or 30 days
- 💬 **Smart Feedback System** — toast notifications for successful or failed searches
- 💫 **Smooth Animations** — elegant UI transitions powered by TailwindCSS
- 🔮 **Fallback Mock Data** — works even if API key is missing
- 🧭 **Auto Detects Your Country** using IP geolocation

---

## 🧠 Tech Stack

| Category               | Tools & Libraries                                                              |
| ---------------------- | ------------------------------------------------------------------------------ |
| **Frontend Framework** | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)                   |
| **UI Framework**       | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Routing**            | [React Router v6](https://reactrouter.com/)                                    |
| **Data Fetching**      | [TanStack Query](https://tanstack.com/query)                                   |
| **Sentiment Analysis** | [sentiment](https://www.npmjs.com/package/sentiment)                           |
| **Icons**              | [Lucide React](https://lucide.dev/icons)                                       |
| **API Source**         | [NewsAPI.org](https://newsapi.org/)                                            |
| **Geo IP**             | [ipapi.co](https://ipapi.co/)                                                  |

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/good-news-globe.git
cd good-news-globe
```

### 2. Install dependencies

```bash
npm install
# or
yarn install

```

### 3. Create your .env file

```bash
VITE_NEWSAPI_KEY=your_newsapi_key_here
```

You can get a free API key from https://newsapi.org

### 4. Run the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build

```

💡 How It Works

The app detects your location via ipapi.co
Fetches top or relevant news using NewsAPI
Analyzes article sentiment using the sentiment library
Filters out articles that are overly negative or contain harmful keywords
Displays only positive stories 🌈
