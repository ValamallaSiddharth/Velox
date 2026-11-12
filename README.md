# Velox ⚡

> Discover, filter, and launch 126+ curated AI tools with a rule-based project recommendation assistant designed for everyday users.

---

## 📖 Overview

Artificial Intelligence is growing rapidly, but for non-technical everyday people—students, writers, small business owners, designers, and creators—finding the right tool without being overwhelmed by technical jargon is difficult.

**Velox** bridges that gap. It is a curated directory and intelligent assistant designed to help non-technical users discover, explore, compare, and choose AI tools tailored to their everyday needs, specific skill levels, and budgets.

---

## ✨ Key Features

- **Curated 126+ AI Tools Directory**: Comprehensive catalog covering 12 distinct categories with direct access links, ratings, estimated user base, and pricing tiers.
- **Search with Live Suggestions**: Dynamic search bar featuring keyword matching and autocomplete suggestions across tool names and categories.
- **Multi-dimensional Filtering**:
  - **Category Filter**: Instant single-click filtering across Chatbot, Image Generator, Video, Coding, Writing, PPT, Marketing, Audio, Design, Research, SEO, and Productivity.
  - **Pricing Filter**: Filter tools by *Free*, *Freemium*, or *Paid* badges.
- **Smart Sorting**: Sort tools dynamically by **⭐ Top Rated**, **🔥 Most Popular** (user volume), or **🔤 A–Z**.
- **Curated Highlights**:
  - **⭐ Featured Tools**: Hand-picked tools highlighted for reliability and performance.
  - **🏆 Top 10 AI Tools**: Leaderboard based on community rating and user volume.
- **Tool Detail Pages (`/tool/:id`)**: Dedicated overview page for every tool displaying detailed descriptions, pricing, user statistics, official links, and dynamically recommended similar tools within the same category.
- **Save / Favorite Tools**: One-click bookmarking (`♥`) persisted locally in `localStorage`.
- **User Authentication**:
  - Email and password registration with client-side password strength validation.
  - Email/password login and optional Google OAuth sign-in via Firebase.
- **Velox AI Chatbot Assistant**: Floating, slide-over recommendation assistant accessible anytime from the navigation bar.

---

## 🤖 How the Rule-Based Chatbot Works

The **Velox AI** chatbot (`frontend/src/chatbot/`) is a deterministic, rule-based recommendation engine. It runs entirely on the client side with zero external AI API costs or latency.

### 1. Text Normalization (`normalize`)
Every user prompt undergoes text cleaning:
- Expands informal slang and common English contractions (e.g., `what's` → `what is`, `can't` → `cannot`, `pls` → `please`, `wanna` → `want to`).
- Strips special punctuation symbols while preserving alphanumeric keywords.
- Collapses extra whitespace and converts input to lowercase.

### 2. Context & Preference Memory (`extractContextHints`)
The assistant analyzes messages across the conversation and retains preferences in state:
- **Skill Level**: Detects keywords like `beginner`, `newbie`, `intermediate`, `advanced`, `senior`.
- **Budget**: Detects `free`, `no budget`, `cheap` (flagged as `low`) or `paid`, `premium` (flagged as `high`).
- **Tech Stack**: Detects technology keywords (`React`, `Firebase`, `Next.js`, `Python`, `Node.js`).
- *A visual context pill appears in the chat header ("🧠 Remembering: beginner · free tools") to indicate remembered preferences.*

### 3. Intent Classification (`intent`)
The input is classified into one of several predefined intents via regular expressions:
- **`greeting`**: Standard greetings (`hi`, `hello`, `hey`) → returns welcome prompt and suggested queries.
- **`identity`**: Bot capability and persona questions (`who are you`, `what is your name`) → describes bot capabilities.
- **`casual`**: Time-of-day greetings and casual chatter (`how are you`, `good morning`).
- **`gratitude`**: User thank-you messages (`thanks`, `thank you`, `awesome`).
- **`capability`**: Capability discovery questions (`what can you do`).
- **`comparison`**: Matches patterns like `X vs Y`, `compare X and Y`, or `difference between X and Y`. Extracts tool names via fuzzy matching and displays a side-by-side comparison card showing categories, ratings, descriptions, and a rating-based winner summary.
- **`project`**: Matches requests containing verbs (`build`, `create`, `make`) or project keywords (`saas`, `study app`, `fitness tracker`, `portfolio`, `ecommerce`, `dashboard`, `social media`, `game`, `website`, `content creator`, `productivity app`).
- **`category`**: Matches requests like `best tools for coding`, `design tools`, `video AI`.
- **`general`**: Matches tool lookups or "top rated" inquiries.
- **`fallback`**: Default safety net when no pattern matches.

### 4. Project Stack Generation (`projectType`)
When a project intent is detected, Velox scores the prompt across 13 archetypes:
1. `fitness`: Fitness & health tracker stack
2. `study`: Student study assistant & PDF question-answering stack
3. `portfolio`: Personal showcase & resume website stack
4. `dashboard`: Analytics & administrative business intelligence stack
5. `ecommerce`: Online store, product photography & copy stack
6. `ai_app`: Custom LLM & chatbot application stack
7. `game`: Indie game development & asset generation stack
8. `blog`: Content publishing & CMS stack
9. `website`: Landing page & corporate website stack
10. `social`: Community & social networking platform stack
11. `creator`: YouTube, podcast & short-form video creation stack
12. `productivity_app`: Task manager, habit tracker & planner stack
13. `saas`: Default software-as-a-service MVP stack

Each stack dynamically adapts to the user's detected **skill level** (e.g., offering no-code/browser-based builders like *Bolt.new* or *Framer AI* for beginners vs. *Cursor* for advanced developers) and **budget** (favoring tools with generous free tiers like *Gemini API* and *Replit*).

### 5. Fallback Behavior (`r_fallback`)
If an input does not match any recognized rule, intent, or keyword, the assistant gracefully falls back:
- Displays a polite guidance message: *"🤔 I'm not sure what you need — but here are some trending AI tools to explore:"*
- Presents a curated set of top trending tools with direct clickable launch links.
- Supplies clear clickable chips/prompts showing valid example questions.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) (Single Page Application)
- **Bundler & Dev Server**: [Vite 5](https://vitejs.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Authentication**: [Firebase v12](https://firebase.google.com/) (Google OAuth Popup)
- **Styling**: Vanilla CSS with custom neon design tokens (`#8B2FE8` purple & `#22D3EE` cyan palette)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 4](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 8](https://mongoosejs.com/)
- **Authentication**: JSON Web Tokens ([jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Security & Utilities**: CORS, dotenv

---

## 📁 Folder Structure

```text
Velox/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── Item.js               # Mongoose schema for workspace items
│   │   └── User.js               # Mongoose schema for user accounts
│   ├── routes/
│   │   ├── auth.js               # /api/auth routes (register, login, social)
│   │   └── items.js              # /api/items protected CRUD routes
│   ├── .env.example              # Template for backend environment variables
│   ├── package.json              # Backend dependencies and scripts
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── logo.png              # Browser favicon & public assets
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Configured Axios instance with auth interceptor
│   │   ├── assets/
│   │   │   ├── backgrounds/      # Background art and patterns
│   │   │   ├── icons/            # SVG and UI icons
│   │   │   ├── logos/
│   │   │   │   └── logo.png      # Velox high-resolution branding logo
│   │   │   ├── screenshots/      # Application usage screenshots
│   │   │   └── tool-images/      # Dedicated AI tool imagery
│   │   ├── chatbot/
│   │   │   ├── Chatbot.jsx       # Chatbot main container & state orchestrator
│   │   │   ├── ChatbotContext.jsx# Chatbot drawer open/close context provider
│   │   │   ├── ChatInput.jsx     # Input textarea and quick suggestion chips
│   │   │   ├── ChatMessage.jsx   # Bubble renderer, tool chips & comparison cards
│   │   │   ├── chatResponder.js  # Rule-based NLP logic, intents & stack generators
│   │   │   └── ChatWindow.jsx    # Scrollable chat feed & typing indicator
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar, brand badge & assistant trigger
│   │   │   └── ToolCard.jsx      # AI Tool card with rating, pricing badge & save button
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # User session rehydration, login, register & logout
│   │   ├── data/
│   │   │   └── tools.js          # Catalog of 126 AI tools, categories & emoji mappings
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Main directory, hero, search, filters & grids
│   │   │   ├── Login.jsx         # Sign-in page with email and Google OAuth
│   │   │   ├── Register.jsx      # Sign-up page with password strength indicator
│   │   │   └── ToolDetail.jsx    # Detailed view for individual AI tools
│   │   ├── styles/
│   │   │   └── index.css         # Global design system, typography & animations
│   │   ├── unused/
│   │   │   ├── AddItemModal.jsx  # Legacy workspace modal component
│   │   │   ├── Dashboard.jsx     # Legacy workspace dashboard page
│   │   │   ├── ItemCard.jsx      # Legacy workspace item card component
│   │   │   └── Signup.jsx        # Legacy standalone signup page
│   │   ├── App.jsx               # Client-side router & provider setup
│   │   ├── firebase.js           # Firebase app initialization & OAuth client
│   │   └── main.jsx              # React DOM entry point
│   ├── .env.example              # Template for frontend environment variables
│   ├── index.html                # HTML entry point with Google Fonts
│   ├── package.json              # Frontend dependencies and build scripts
│   └── vite.config.js            # Vite configuration
│
├── .firebaserc                   # Firebase project descriptor
├── .gitignore                    # Git ignore rules for dependencies and secrets
├── firebase.json                 # Firebase hosting configuration
└── README.md                     # Comprehensive project documentation
```

---

## 📋 Prerequisites

Before running the project locally, ensure you have installed:
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (version 9.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or a remote MongoDB Atlas connection string)

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/v-siddharth/velox.git
cd Velox
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your MongoDB connection string and JWT secret.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
4. Configure your optional Firebase API keys and backend API URL in `.env`.

---

## 💻 How to Run

### Start the Backend Server
From the `backend/` directory:
```bash
npm run dev
```
*The backend API will start on `http://localhost:5000`.*

### Start the Frontend Application
From the `frontend/` directory:
```bash
npm run dev
```
*The Vite development server will start on `http://localhost:5173`.*

### Production Build
To create an optimized production build of the frontend:
```bash
cd frontend
npm run build
```
The output will be placed in `frontend/dist/`.

---

## 🔐 Environment Variables

Velox uses environment variables to isolate credentials and runtime configurations. Never commit real `.env` files to source control.

### Backend (`backend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port number on which Express listens | `5000` |
| `MONGO_URI` | MongoDB database connection URI | `mongodb://127.0.0.1:27017/velox` |
| `JWT_SECRET` | Secret key used for signing JWT tokens | `your_jwt_secret_key` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL for the Express backend API | `http://localhost:5000/api` |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project identifier | `project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Cloud Storage bucket name | `project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`| Firebase Cloud Messaging sender ID | `1234567890` |
| `VITE_FIREBASE_APP_ID` | Firebase Web Application ID | `1:123:web:abc` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics measurement ID | `G-XXXXXXX` |

---

## 🖼️ Screenshots & Interface

<div align="center">
  <img src="frontend/src/assets/logos/logo.png" alt="Velox Brand Logo" width="120" style="border-radius: 50%;" />
  <p><em>Velox — Modern AI Discovery & Recommendation Platform</em></p>
</div>

- **Directory & Filtering**: Browse through 126+ curated tools with real-time text matching, category chips, and pricing selectors.
- **AI Recommendation Assistant**: Click **✦ AI Assistant** on the top navigation bar to open the slide-out panel, ask for project stacks, or compare tools.

---

## ➕ How to Add a New AI Tool

All tools data lives in a single source of truth at [`frontend/src/data/tools.js`](frontend/src/data/tools.js).

To add a new tool:
1. Open `frontend/src/data/tools.js`.
2. Locate the `tools` array and add an entry using the helper function `mk`:
   ```javascript
   mk(
     127,                      // Unique sequential numeric ID
     'ToolName',               // Display Name
     'Coding',                 // Category (must match an entry in 'categories')
     'Description of what the tool does for users.', // Short description
     'https://tool-website.com', // Official website URL
     'Freemium',               // Pricing: 'Free' | 'Freemium' | 'Paid'
     4.8,                      // Rating between 1.0 and 5.0
     1500000,                  // Estimated active users (number)
     false,                    // top10: true | false
     false                     // featured: true | false
   ),
   ```
3. Save the file. The tool will automatically appear in search, category views, pricing filters, and the chatbot knowledge base.

---

## ➕ How to Add a New Chatbot Rule

Chatbot logic is located in [`frontend/src/chatbot/chatResponder.js`](frontend/src/chatbot/chatResponder.js).

To add a new keyword trigger or response:
1. Open `frontend/src/chatbot/chatResponder.js`.
2. **Define a response handler function** (returning the response object with `type`, `intro`, `sections`, and `outro`):
   ```javascript
   function r_customTopic(ctx) {
     return {
       type: 'stack',
       intro: '💡 Here is a tailored stack for **Your Custom Topic**:',
       sections: [
         {
           label: 'Recommended Tools',
           tools: byIds(1, 2, 44).map(snippet),
           note: 'Ideal tools for this workflow'
         }
       ],
       outro: 'Try asking: *"Compare Tool A vs Tool B"*'
     };
   }
   ```
3. **Register keyword detection** in `intent(msg)`:
   ```javascript
   if (/\b(custom keyword|custom topic)\b/.test(msg)) return 'custom_topic';
   ```
4. **Map the intent** inside `generateResponse(message, context)`:
   ```javascript
   if (it === 'custom_topic') return r_customTopic(context);
   ```

---

## 🔮 Future Improvements

- Add server-side pagination and infinite scroll for the tool grid.
- Implement community reviews and user ratings stored in MongoDB.
- Expand tool bookmarking to sync across devices when logged in.
- Introduce dark/light theme switching.
- Add advanced comparison metrics (API availability, export formats, context window).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Siddharth**
- GitHub: [@v-siddharth](https://github.com/v-siddharth)
