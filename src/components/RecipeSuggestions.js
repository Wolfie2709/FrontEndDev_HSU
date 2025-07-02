"use client"

import { useState, useEffect } from "react"

function RecipeSuggestions({ recipes, currentUser, onUpdateRecipe }) {
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    generateSuggestions()
  }, [recipes, currentUser])

  const generateSuggestions = () => {
    if (!currentUser || recipes.length === 0) {
      setSuggestions([])
      return
    }

    // Get user's favorite categories
    const favoriteRecipes = recipes.filter((recipe) => currentUser.favorites.includes(recipe.id))
    const favoriteCategories = [...new Set(favoriteRecipes.map((r) => r.category))]

    // Get suggestions based on different criteria
    const suggestedRecipes = []

    // 1. Recipes from favorite categories (not already favorited)
    const categoryMatches = recipes.filter(
      (recipe) => favoriteCategories.includes(recipe.category) && !currentUser.favorites.includes(recipe.id),
    )

    // 2. Highly rated recipes (not already favorited)
    const highRated = recipes.filter((recipe) => recipe.rating >= 4.0 && !currentUser.favorites.includes(recipe.id))

    // 3. Recently created recipes (not already favorited)
    const recent = recipes
      .filter((recipe) => !currentUser.favorites.includes(recipe.id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Combine and deduplicate
    const combined = [...categoryMatches.slice(0, 2), ...highRated.slice(0, 2), ...recent.slice(0, 2)]

    // Remove duplicates and limit to 5
    const unique = combined
      .filter((recipe, index, self) => index === self.findIndex((r) => r.id === recipe.id))
      .slice(0, 5)

    setSuggestions(unique)
  }

  const handleFavoriteToggle = (recipe) => {
    const updatedRecipe = { ...recipe }
    const isFavorited = currentUser.favorites.includes(recipe.id)

    if (isFavorited) {
      updatedRecipe.favorites = Math.max(0, updatedRecipe.favorites - 1)
    } else {
      updatedRecipe.favorites = updatedRecipe.favorites + 1
    }

    onUpdateRecipe(updatedRecipe)
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="recipe-suggestions">
      <h3>🌟 Suggested for You</h3>
      <div className="suggestions-carousel">
        {suggestions.map((recipe) => (
          <div key={recipe.id} className="suggestion-card">
            <div className="suggestion-header">
              <h4>{recipe.title}</h4>
              <button
                className={`favorite-btn ${currentUser.favorites.includes(recipe.id) ? "favorited" : ""}`}
                onClick={() => handleFavoriteToggle(recipe)}
                title={currentUser.favorites.includes(recipe.id) ? "Remove from favorites" : "Add to favorites"}
              >
                {currentUser.favorites.includes(recipe.id) ? "❤️" : "🤍"}
              </button>
            </div>

            <p className="suggestion-description">{recipe.description}</p>

            <div className="suggestion-meta">
              <span className="category-badge">{recipe.category}</span>
              <span className="cooking-time">⏱️ {recipe.cookingTime} min</span>
              <span className="rating">⭐ {recipe.rating}</span>
            </div>

            <div className="suggestion-reason">
              {currentUser.favorites.some((fav) => recipes.find((r) => r.id === fav)?.category === recipe.category) &&
                "Based on your favorite category"}
              {recipe.rating >= 4.5 && "Highly rated recipe"}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipeSuggestions
