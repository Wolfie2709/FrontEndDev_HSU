"use client"

import { useState, useEffect } from "react"
import LoginForm from "./components/LoginForm"
import Header from "./components/Header"
import RecipeList from "./components/RecipeList"
import RecipeForm from "./components/RecipeForm"
import UserProfile from "./components/UserProfile"
import MealPlanPage from "./components/MealPlanPage"
import LoadingSpinner from "./components/LoadingSpinner"
import ErrorMessage from "./components/ErrorMessage"
import "./App.css"
import RecipeSuggestions from "./components/RecipeSuggestions"

function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // App state
  const [currentView, setCurrentView] = useState("recipes")
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Data state
  const [recipes, setRecipes] = useState([])
  const [users, setUsers] = useState([])
  const [comments, setComments] = useState([])
  const [ratings, setRatings] = useState([])
  const [mealPlan, setMealPlan] = useState({})

  // Editing state
  const [editingRecipe, setEditingRecipe] = useState(null)

  // Initialize app data
  useEffect(() => {
    initializeApp()
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated) {
      saveDataToStorage()
    }
  }, [recipes, users, comments, ratings, mealPlan, isAuthenticated])

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
    }
  }, [])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    document.body.className = darkMode ? "dark-mode" : ""
  }, [darkMode])

  const initializeApp = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load data from localStorage or use initial data
      await loadAppData()

      // Check if user is already logged in
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setCurrentUser(userData)
        setIsAuthenticated(true)
      }
    } catch (err) {
      setError("Failed to initialize app. Please try again.")
      console.error("App initialization error:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadAppData = async () => {
    // Try to load from localStorage first
    const savedRecipes = localStorage.getItem("recipes")
    const savedUsers = localStorage.getItem("users")
    const savedComments = localStorage.getItem("comments")
    const savedRatings = localStorage.getItem("ratings")
    const savedMealPlan = localStorage.getItem("mealPlan")

    if (savedRecipes && savedUsers) {
      // Load from localStorage
      setRecipes(JSON.parse(savedRecipes))
      setUsers(JSON.parse(savedUsers))
      setComments(JSON.parse(savedComments || "[]"))
      setRatings(JSON.parse(savedRatings || "[]"))
      setMealPlan(JSON.parse(savedMealPlan || "{}"))
    } else {
      // Load initial data
      const initialData = {
        users: [
          {
            id: 1,
            username: "john_doe",
            email: "john@example.com",
            password: "password123",
            favorites: [1, 3],
          },
          {
            id: 2,
            username: "demo",
            email: "demo@example.com",
            password: "password123",
            favorites: [],
          },
        ],
        recipes: [
          {
            id: 1,
            title: "Spaghetti Bolognese",
            description: "Classic Italian pasta dish with rich meat sauce",
            ingredients: [
              "500g spaghetti",
              "300g ground beef",
              "400ml tomato sauce",
              "1 onion",
              "2 garlic cloves",
              "herbs",
            ],
            instructions:
              "1. Cook pasta according to package instructions\n2. Brown the ground beef with onions and garlic\n3. Add tomato sauce and herbs, simmer for 20 minutes\n4. Combine with pasta and serve",
            cookingTime: 45,
            servings: 4,
            category: "Dinner",
            rating: 4.5,
            author: "Chef Mario",
            authorId: 1,
            favorites: 12,
            createdAt: "2024-01-15T10:30:00Z",
            nutritionalInfo: {
              calories: 600,
              protein: 25,
              fat: 15,
              carbs: 80,
            },
            comments: [],
          },
          {
            id: 2,
            title: "Avocado Toast",
            description: "Healthy breakfast with smashed avocado",
            ingredients: ["2 slices bread", "1 avocado", "1 egg", "cherry tomatoes", "feta cheese"],
            instructions: "1. Toast bread\n2. Mash avocado\n3. Fry egg\n4. Assemble with toppings",
            cookingTime: 15,
            servings: 1,
            category: "Breakfast",
            rating: 4.2,
            author: "Healthy Chef",
            authorId: 2,
            favorites: 8,
            createdAt: "2024-01-16T14:20:00Z",
            nutritionalInfo: {
              calories: 350,
              protein: 15,
              fat: 20,
              carbs: 25,
            },
            comments: [],
          },
        ],
        comments: [],
        ratings: [],
        mealPlan: {},
      }

      setUsers(initialData.users)
      setRecipes(initialData.recipes)
      setComments(initialData.comments)
      setRatings(initialData.ratings)
      setMealPlan(initialData.mealPlan)

      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(initialData.users))
      localStorage.setItem("recipes", JSON.stringify(initialData.recipes))
      localStorage.setItem("comments", JSON.stringify(initialData.comments))
      localStorage.setItem("ratings", JSON.stringify(initialData.ratings))
      localStorage.setItem("mealPlan", JSON.stringify(initialData.mealPlan))
    }
  }

  const saveDataToStorage = () => {
    localStorage.setItem("recipes", JSON.stringify(recipes))
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("comments", JSON.stringify(comments))
    localStorage.setItem("ratings", JSON.stringify(ratings))
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan))
  }

  // Authentication functions
  const handleLogin = async (email, password) => {
    try {
      setError(null)

      // Find user in our data
      const user = users.find((u) => u.email === email && u.password === password)

      if (!user) {
        throw new Error("Invalid email or password")
      }

      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        favorites: user.favorites || [],
      }

      setCurrentUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("currentUser", JSON.stringify(userData))
    } catch (err) {
      throw new Error(err.message || "Login failed")
    }
  }

  const handleRegister = async (formData) => {
    try {
      setError(null)

      // Check if user already exists
      const existingUser = users.find((u) => u.email === formData.email || u.username === formData.username)

      if (existingUser) {
        throw new Error("User with this email or username already exists")
      }

      // Create new user
      const newUser = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        favorites: [],
      }

      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)

      const userData = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        favorites: [],
      }

      setCurrentUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("currentUser", JSON.stringify(userData))
    } catch (err) {
      throw new Error(err.message || "Registration failed")
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setCurrentView("recipes")
    localStorage.removeItem("currentUser")
  }

  // Recipe functions
  const handleAddRecipe = (recipeData) => {
    const newRecipe = {
      ...recipeData,
      id: Math.max(...recipes.map((r) => r.id), 0) + 1,
      author: currentUser.username,
      authorId: currentUser.id,
      rating: 0,
      favorites: 0,
      createdAt: new Date().toISOString(),
      nutritionalInfo: {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
      },
      comments: [],
    }

    setRecipes([...recipes, newRecipe])
    setCurrentView("recipes")
  }

  const handleUpdateRecipe = (updatedRecipe) => {
    setRecipes(recipes.map((recipe) => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe)))

    // Update current user's favorites if needed
    if (updatedRecipe.favorites !== undefined) {
      const updatedUser = { ...currentUser }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  const handleDeleteRecipe = (recipeId) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== recipeId))

    // Remove from all users' favorites
    const updatedUsers = users.map((user) => ({
      ...user,
      favorites: user.favorites.filter((id) => id !== recipeId),
    }))
    setUsers(updatedUsers)

    // Update current user if needed
    if (currentUser.favorites.includes(recipeId)) {
      const updatedUser = {
        ...currentUser,
        favorites: currentUser.favorites.filter((id) => id !== recipeId),
      }
      setCurrentUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe)
    setCurrentView("edit-recipe")
  }

  // Meal plan functions
  const addToMealPlan = (recipeId, day) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), recipeId],
    }))
  }

  const removeFromMealPlan = (recipeId, day) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: (prev[day] || []).filter((id) => id !== recipeId),
    }))
  }

  // Get user's recipes
  const getUserRecipes = () => {
    return recipes.filter((recipe) => recipe.authorId === currentUser.id)
  }

  // Get user's favorite recipes
  const getFavoriteRecipes = () => {
    return recipes.filter((recipe) => currentUser.favorites.includes(recipe.id))
  }

  // Retry function for error handling
  const handleRetry = () => {
    setError(null)
    initializeApp()
  }

  // Loading state
  if (loading) {
    return (
      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        <LoadingSpinner />
      </div>
    )
  }

  // Error state
  if (error && !isAuthenticated) {
    return (
      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </div>
    )
  }

  // Login state
  if (!isAuthenticated) {
    return (
      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        <LoginForm
          onLogin={handleLogin}
          onRegister={handleRegister}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          error={error}
        />
      </div>
    )
  }

  // Main app
  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <Header
        currentUser={currentUser}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="main">
        {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

        {currentView === "recipes" && (
          <>
            <RecipeSuggestions recipes={recipes} currentUser={currentUser} onUpdateRecipe={handleUpdateRecipe} />
            <RecipeList
              recipes={recipes}
              currentUser={currentUser}
              onUpdateRecipe={handleUpdateRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              onEditRecipe={handleEditRecipe}
            />
          </>
        )}

        {currentView === "add-recipe" && (
          <RecipeForm onAddRecipe={handleAddRecipe} onCancel={() => setCurrentView("recipes")} />
        )}

        {currentView === "edit-recipe" && editingRecipe && (
          <RecipeForm
            recipe={editingRecipe}
            onAddRecipe={handleUpdateRecipe}
            onCancel={() => {
              setCurrentView("recipes")
              setEditingRecipe(null)
            }}
            isEditing={true}
          />
        )}

        {currentView === "favorites" && (
          <div className="favorites-view">
            <h2>My Favorite Recipes</h2>
            {getFavoriteRecipes().length === 0 ? (
              <div className="no-recipes">
                <p>You haven't favorited any recipes yet. Start exploring!</p>
                <button onClick={() => setCurrentView("recipes")} className="cta-btn">
                  Browse Recipes
                </button>
              </div>
            ) : (
              <RecipeList
                recipes={getFavoriteRecipes()}
                currentUser={currentUser}
                onUpdateRecipe={handleUpdateRecipe}
                onDeleteRecipe={handleDeleteRecipe}
              />
            )}
          </div>
        )}

        {currentView === "meal-plan" && (
          <MealPlanPage
            recipes={recipes}
            mealPlan={mealPlan}
            addToMealPlan={addToMealPlan}
            removeFromMealPlan={removeFromMealPlan}
          />
        )}

        {currentView === "profile" && (
          <UserProfile currentUser={currentUser} recipes={getUserRecipes()} favoriteRecipes={getFavoriteRecipes()} />
        )}
      </main>
    </div>
  )
}

export default App
