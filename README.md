# 🍽️ Recipe Sharing Website

A full-featured **React-based Recipe Sharing Platform** that supports user authentication, recipe CRUD operations, filtering, drag-and-drop meal planning, local data storage, and more — all without a backend server.

---

## 🚀 Features Overview

- 🔐 User Authentication (login/logout)
- 🍝 Add, Edit, Delete Recipes
- ❤️ Favorite and ⭐ Rate Recipes
- 💬 Comment on Recipes
- 🧑‍🍳 User Profile Management
- 🧩 Meal Planning (Drag-and-Drop by Day)
- 🔍 Search, Filter & Sort Recipes
- 🌗 Theme Toggle (Dark/Light)
- 📦 Data persistence with `localStorage`
- 📱 Fully Responsive (Mobile-friendly)
- 📤 Social Media Sharing
- 🍽️ Nutritional Info Tracking

---

## 🧠 Architecture

```
App.js (Main Container)
├── Authentication (Login/Register)
├── Header (Navigation)
├── Main Content (Dynamic Views)
│   ├── Recipe List
│   ├── Recipe Form (Add/Edit)
│   ├── Meal Planner
│   ├── Favorites
│   └── Profile Page
└── Data Handling (localStorage via api.js)
```

---

## ⚙️ Project Setup

### 🔧 Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js v18+](https://nodejs.org/en)

Check your versions:
```bash
node -v
npm -v
```

### 📦 Installation

```bash
git clone https://github.com/your-username/recipe-sharing-website.git
cd recipe-sharing-website
npm install
npm run start
```

Then go to: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Mock API Setup (`services/api.js`)

All data interactions are mocked using `localStorage`. APIs are simulated with delay and CRUD support:

### Recipe API
```js
recipeAPI.getAll()
recipeAPI.getById(id)
recipeAPI.create(recipe)
recipeAPI.update(id, updatedRecipe)
recipeAPI.delete(id)
```

### User API
```js
userAPI.getAll()
userAPI.login(email, password)
userAPI.create(user)
```

### Comment & Rating API
```js
commentAPI.create(comment)
ratingAPI.rate(recipeId, score)
```

---

## 🧭 Core Functionality

### 🔐 Authentication

```js
const handleLogin = (email, password) => {
  const user = users.find(u => u.email === email && u.password === password)
  if (user) {
    setCurrentUser(user)
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}
```

### 🍳 Adding a Recipe

```js
const handleAddRecipe = (recipeData) => {
  const newRecipe = {
    ...recipeData,
    id: generateId(),
    author: currentUser.username,
    createdAt: new Date().toISOString(),
    rating: 0,
    favorites: 0,
  }
  setRecipes([...recipes, newRecipe])
}
```

### 🔎 Filtering

```js
const filteredRecipes = recipes.filter(recipe =>
  recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
  (selectedCategory === "All" || recipe.category === selectedCategory)
)
```

---

## 🗓️ Meal Planner (Drag-and-Drop)

```js
const mealPlan = {
  Monday: [1, 2],
  Tuesday: [3],
  ...
}

const handleDragStart = (e, recipeId) => {
  e.dataTransfer.setData("text/plain", recipeId.toString())
}

const handleDrop = (e, day) => {
  const recipeId = parseInt(e.dataTransfer.getData("text/plain"))
  addToMealPlan(recipeId, day)
}
```

---

## 🧑‍💻 Component Highlights

- `RecipeCard`: Shows individual recipe info with favorite, rate, comment actions
- `RecipeForm`: Add/Edit recipe form with validation
- `RecipeList`: Grid layout of recipes with filters
- `MealPlanner`: Weekly planner with drag-and-drop
- `ThemeToggle`: Switch between light and dark mode

---

## 🌓 Dark Mode Support

```js
useEffect(() => {
  document.body.className = darkMode ? "dark-mode" : ""
}, [darkMode])
```

---

## 📊 Sample Data Structures

### Recipe Object
```js
{
  id: 1,
  title: "Spaghetti Bolognese",
  description: "Classic Italian dish",
  ingredients: ["500g spaghetti", "300g beef"],
  cookingTime: 45,
  servings: 4,
  category: "Dinner",
  rating: 4.5,
  author: "chef_mario",
  favorites: 12,
  createdAt: "2024-01-15T10:30:00Z",
  comments: [],
  nutritionalInfo: {
    calories: 600,
    protein: 25
  }
}
```

### User Object
```js
{
  id: 1,
  username: "john_doe",
  email: "john@example.com",
  password: "password123",
  favorites: [1, 2]
}
```

---

## 🧹 Future Improvements

- ✅ Backend integration (e.g., Firebase or Express API)
- ✅ Social login (Google/GitHub)
- ✅ Real-time comments or chat
- ✅ PWA support for mobile app
- ✅ Image upload & cloud storage

---

## 📄 License

MIT License. Free to use and modify.
