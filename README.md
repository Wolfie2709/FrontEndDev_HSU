# Recipe Sharing Website

A full-featured React-based Recipe Sharing Platform that supports user authentication, recipe CRUD operations, filtering, drag-and-drop meal planning, local data storage, and more — all without a backend server.

---

## Features Overview

- User Authentication (login/logout)
- Add, Edit, Delete Recipes
- Favorite and Rate Recipes
- Comment on Recipes
- User Profile Management
- Meal Planning (Drag-and-Drop by Day)
- Search, Filter & Sort Recipes
- Theme Toggle (Dark/Light)
- Data persistence with localStorage
- Fully Responsive Design
- Social Media Sharing
- Nutritional Information Tracking

---

## Architecture

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

## Project Setup

### Prerequisites

- Visual Studio Code: https://code.visualstudio.com/
- Node.js v18 or higher: https://nodejs.org/en

To check versions:
```bash
node -v
npm -v
```

### Installation

```bash
git clone https://github.com/Wolfie2709/FrontEndDev_HSU.git
cd recipe-sharing-website
npm install
npm run start
```

Open http://localhost:3000 in your browser.

---

## Mock API Setup (services/api.js)

All data interactions are mocked using localStorage. APIs are simulated with delay and CRUD support.

### Recipe API

```javascript
recipeAPI.getAll()
recipeAPI.getById(id)
recipeAPI.create(recipe)
recipeAPI.update(id, updatedRecipe)
recipeAPI.delete(id)
```

### User API

```javascript
userAPI.getAll()
userAPI.login(email, password)
userAPI.create(user)
```

### Comment and Rating API

```javascript
commentAPI.create(comment)
ratingAPI.rate(recipeId, score)
```

---

## Core Functionality

### Authentication

```javascript
const handleLogin = (email, password) => {
  const user = users.find(u => u.email === email && u.password === password)
  if (user) {
    setCurrentUser(user)
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}
```

### Adding a Recipe

```javascript
const handleAddRecipe = (recipeData) => {
  const newRecipe = {
    ...recipeData,
    id: generateId(),
    author: currentUser.username,
    createdAt: new Date().toISOString(),
    rating: 0,
    favorites: 0
  }
  setRecipes([...recipes, newRecipe])
}
```

### Filtering

```javascript
const filteredRecipes = recipes.filter(recipe =>
  recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
  (selectedCategory === "All" || recipe.category === selectedCategory)
)
```

---

## Meal Planner (Drag-and-Drop)

```javascript
const mealPlan = {
  Monday: [1, 2],
  Tuesday: [3]
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

## Component Highlights

- `RecipeCard`: Displays recipe information with favorite, rate, and comment options
- `RecipeForm`: Form for adding or editing recipes with validation
- `RecipeList`: Displays a list of recipes with filters and sorting
- `MealPlanner`: Weekly meal planning interface with drag-and-drop
- `ThemeToggle`: Light and dark mode toggle switch

---

## Dark Mode Support

```javascript
useEffect(() => {
  document.body.className = darkMode ? "dark-mode" : ""
}, [darkMode])
```

---

## Sample Data Structures

### Recipe Object

```javascript
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

```javascript
{
  id: 1,
  username: "john_doe",
  email: "john@example.com",
  password: "password123",
  favorites: [1, 2]
}
```

---

## Future Improvements

- Backend integration (e.g., Firebase or Express API)
- Social login (Google, GitHub)
- Real-time comments or chat
- PWA support for mobile usage
- Image upload and cloud storage

---

## License

MIT License. You are free to use, modify, and distribute this project.
