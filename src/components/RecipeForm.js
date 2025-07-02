"use client"

import { useState, useEffect } from "react"
import ShareButtons from "./ShareButtons"

function RecipeForm({ recipe, onAddRecipe, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [""],
    instructions: "",
    cookingTime: "",
    servings: "",
    category: "Breakfast",
  })

  const [errors, setErrors] = useState({})

  // Pre-fill form if editing
  useEffect(() => {
    if (isEditing && recipe) {
      setFormData({
        title: recipe.title || "",
        description: recipe.description || "",
        ingredients: recipe.ingredients || [""],
        instructions: recipe.instructions || "",
        cookingTime: recipe.cookingTime || "",
        servings: recipe.servings || "",
        category: recipe.category || "Breakfast",
      })
    }
  }, [isEditing, recipe])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index] = value
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }))
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }))
  }

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index)
      setFormData((prev) => ({
        ...prev,
        ingredients: newIngredients,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = "Instructions are required"
    }

    if (!formData.cookingTime || formData.cookingTime <= 0) {
      newErrors.cookingTime = "Cooking time must be greater than 0"
    }

    if (!formData.servings || formData.servings <= 0) {
      newErrors.servings = "Servings must be greater than 0"
    }

    const validIngredients = formData.ingredients.filter((ing) => ing.trim())
    if (validIngredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const recipeData = {
      ...formData,
      ingredients: formData.ingredients.filter((ing) => ing.trim()),
      cookingTime: Number.parseInt(formData.cookingTime),
      servings: Number.parseInt(formData.servings),
    }

    if (isEditing && recipe) {
      // Update existing recipe
      onAddRecipe({
        ...recipe,
        ...recipeData,
      })
    } else {
      // Add new recipe
      onAddRecipe(recipeData)
    }
  }

  return (
    <div className="recipe-form-container">
      <div className="recipe-form-card">
        <h2>{isEditing ? "Edit Recipe" : "Add New Recipe"}</h2>

        <form className="recipe-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Recipe Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? "error" : ""}
              placeholder="Enter recipe title"
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the recipe"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Ingredients *</label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-input">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    className="remove-ingredient-btn"
                    onClick={() => removeIngredient(index)}
                    title="Remove ingredient"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-ingredient-btn" onClick={addIngredient}>
              + Add Ingredient
            </button>
            {errors.ingredients && <span className="error-text">{errors.ingredients}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Instructions *</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              className={errors.instructions ? "error" : ""}
              placeholder="Step-by-step cooking instructions"
              rows="6"
            />
            {errors.instructions && <span className="error-text">{errors.instructions}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cookingTime">Cooking Time (minutes) *</label>
              <input
                type="number"
                id="cookingTime"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleInputChange}
                className={errors.cookingTime ? "error" : ""}
                placeholder="30"
                min="1"
              />
              {errors.cookingTime && <span className="error-text">{errors.cookingTime}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="servings">Servings *</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleInputChange}
                className={errors.servings ? "error" : ""}
                placeholder="4"
                min="1"
              />
              {errors.servings && <span className="error-text">{errors.servings}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange}>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
                <option value="Appetizer">Appetizer</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {isEditing ? "Update Recipe" : "Add Recipe"}
            </button>
          </div>
        </form>

        {/* Only show share buttons if we have a recipe with a title (for editing mode) */}
        {isEditing && recipe && recipe.title && (
          <div className="recipe-preview">
            <h3>Recipe Preview:</h3>
            <ShareButtons recipe={recipe} />
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeForm
