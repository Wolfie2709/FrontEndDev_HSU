"use client"

import { useState } from "react"
import RecipeCard from "./RecipeCard"

function RecipeList({ recipes, currentUser, onUpdateRecipe, onDeleteRecipe, onEditRecipe }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortOption, setSortOption] = useState("newest")
  const [cookingTimeFilter, setCookingTimeFilter] = useState("All")
  const [servingsFilter, setServingsFilter] = useState("All")

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value)
  }

  const handleCookingTimeChange = (e) => {
    setCookingTimeFilter(e.target.value)
  }

  const handleServingsChange = (e) => {
    setServingsFilter(e.target.value)
  }

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const searchMatch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some((ing) => ing.toLowerCase().includes(searchTerm.toLowerCase()))

    const categoryMatch = selectedCategory === "All" || recipe.category === selectedCategory

    const cookingTimeMatch =
      cookingTimeFilter === "All" ||
      (cookingTimeFilter === "Under 30" && recipe.cookingTime < 30) ||
      (cookingTimeFilter === "30-60" && recipe.cookingTime >= 30 && recipe.cookingTime <= 60) ||
      (cookingTimeFilter === "Over 60" && recipe.cookingTime > 60)

    const servingsMatch =
      servingsFilter === "All" ||
      (servingsFilter === "1-2" && recipe.servings <= 2) ||
      (servingsFilter === "3-4" && recipe.servings >= 3 && recipe.servings <= 4) ||
      (servingsFilter === "5+" && recipe.servings >= 5)

    return searchMatch && categoryMatch && cookingTimeMatch && servingsMatch
  })

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt)
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt)
      case "rating-high":
        return b.rating - a.rating
      case "rating-low":
        return a.rating - b.rating
      case "alphabetical":
        return a.title.localeCompare(b.title)
      case "cooking-time":
        return a.cookingTime - b.cookingTime
      default:
        return 0
    }
  })

  return (
    <div className="recipe-list-container">
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search recipes, ingredients..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="filters">
          <select className="filter-select" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="All">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Dessert</option>
            <option value="Snack">Snack</option>
            <option value="Appetizer">Appetizer</option>
          </select>

          <select className="filter-select" value={cookingTimeFilter} onChange={handleCookingTimeChange}>
            <option value="All">All Cooking Times</option>
            <option value="Under 30">Under 30 min</option>
            <option value="30-60">30-60 min</option>
            <option value="Over 60">Over 60 min</option>
          </select>

          <select className="filter-select" value={servingsFilter} onChange={handleServingsChange}>
            <option value="All">All Servings</option>
            <option value="1-2">1-2 servings</option>
            <option value="3-4">3-4 servings</option>
            <option value="5+">5+ servings</option>
          </select>

          <select className="sort-select" value={sortOption} onChange={handleSortChange}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-high">Highest Rated</option>
            <option value="rating-low">Lowest Rated</option>
            <option value="alphabetical">A-Z</option>
            <option value="cooking-time">Cooking Time</option>
          </select>
        </div>
      </div>

      <div className="recipes-grid">
        {sortedRecipes.length === 0 ? (
          <div className="no-recipes">
            <p>No recipes found matching your criteria.</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          sortedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              currentUser={currentUser}
              onUpdateRecipe={onUpdateRecipe}
              onDeleteRecipe={onDeleteRecipe}
              onEditRecipe={onEditRecipe}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default RecipeList
