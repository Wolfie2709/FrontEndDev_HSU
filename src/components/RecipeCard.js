"use client"

import { useState, useEffect } from "react"
import ShareButtons from "./ShareButtons"

function RecipeCard({ recipe, currentUser, onUpdateRecipe, onDeleteRecipe, onEditRecipe }) {
  const [showDetails, setShowDetails] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [comment, setComment] = useState("")
  const [showShareButtons, setShowShareButtons] = useState(false)

  const isFavorited = currentUser.favorites.includes(recipe.id)
  const isOwner = recipe.authorId === currentUser.id

  // Load user's existing rating (nếu có)
  useEffect(() => {
    if (recipe.ratings) {
      const existing = recipe.ratings.find((r) => r.userId === currentUser.id)
      setUserRating(existing?.value || 0)
    }
  }, [recipe, currentUser])

  const handleFavoriteToggle = () => {
    const isFavorited = currentUser.favorites.includes(recipe.id)
    const updatedUser = {
      ...currentUser,
      favorites: isFavorited
        ? currentUser.favorites.filter((id) => id !== recipe.id)
        : [...currentUser.favorites, recipe.id],
    }

    const updatedRecipe = {
      ...recipe,
      favorites: isFavorited
        ? Math.max(0, (recipe.favorites || 1) - 1)
        : (recipe.favorites || 0) + 1,
    }

    // Lưu currentUser vào localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Gửi dữ liệu lên cha để cập nhật cả recipe & user
    onUpdateRecipe(updatedRecipe)

    // Nếu bạn có onUpdateCurrentUser thì gọi luôn:
    // onUpdateCurrentUser?.(updatedUser)
  }


  const handleRatingChange = (newRating) => {
    setUserRating(newRating)

    let updatedRatings = [...(recipe.ratings || [])]
    const existingIndex = updatedRatings.findIndex((r) => r.userId === currentUser.id)

    if (existingIndex !== -1) {
      updatedRatings[existingIndex].value = newRating
    } else {
      updatedRatings.push({ userId: currentUser.id, value: newRating })
    }

    const total = updatedRatings.reduce((sum, r) => sum + r.value, 0)
    const avg = total / updatedRatings.length

    const updatedRecipe = {
      ...recipe,
      ratings: updatedRatings,
      rating: parseFloat(avg.toFixed(1)),
    }

    onUpdateRecipe(updatedRecipe)
  }

  const handleCommentSubmit = () => {
    if (comment.trim() && comment.length <= 500) {
      const newComment = {
        id: Date.now(),
        recipeId: recipe.id,
        userId: currentUser.id,
        username: currentUser.username,
        text: comment.trim(),
        timestamp: new Date().toISOString(),
      }

      const updatedRecipe = {
        ...recipe,
        comments: [...(recipe.comments || []), newComment],
      }

      onUpdateRecipe(updatedRecipe)
      setComment("")
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      onDeleteRecipe(recipe.id)
    }
  }

  const handleShare = () => {
    setShowShareButtons(!showShareButtons)
  }

  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <h3 className="recipe-title">{recipe.title}</h3>
        <div className="recipe-actions">
          <button
            className={`favorite-btn ${isFavorited ? "favorited" : ""}`}
            onClick={handleFavoriteToggle}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorited ? "❤️" : "🤍"}
          </button>

          <button className="share-btn" onClick={handleShare} title="Share recipe">
            📤
          </button>

          {isOwner && (
            <>
              <button className="edit-btn" onClick={() => onEditRecipe(recipe)} title="Edit recipe">
                ✏️
              </button>
              <button className="delete-btn" onClick={handleDelete} title="Delete recipe">
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      <div className="recipe-meta">
        <span className="category-badge">{recipe.category}</span>
        <span className="cooking-time">⏱️ {recipe.cookingTime} min</span>
        <span className="servings">👥 {recipe.servings} servings</span>
        <span className="rating">⭐ {recipe.rating} ({recipe.ratings?.length || 0})</span>
      </div>

      <p className="recipe-description">{recipe.description}</p>

      <div className="recipe-author">By: {recipe.author}</div>

      <div className="recipe-stats">
        <span>❤️ {recipe.favorites} favorites</span>
        <span>💬 {recipe.comments?.length || 0} comments</span>
      </div>

      <button className="toggle-details-btn" onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "Hide Details" : "Show Details"}
      </button>

      {showDetails && (
        <div className="recipe-details">
          <div className="ingredients-section">
            <h4>Ingredients:</h4>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h4>Instructions:</h4>
            <div className="instructions">{recipe.instructions}</div>
          </div>

          {recipe.nutritionalInfo && (
            <div className="nutrition-section">
              <h4>Nutritional Information (per serving):</h4>
              <div className="nutrition-grid">
                <span>Calories: {recipe.nutritionalInfo.calories}</span>
                <span>Protein: {recipe.nutritionalInfo.protein}g</span>
                <span>Fat: {recipe.nutritionalInfo.fat}g</span>
                <span>Carbs: {recipe.nutritionalInfo.carbs}g</span>
              </div>
            </div>
          )}

          <div className="rating-section">
            <h4>Rate this recipe:</h4>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star ${star <= userRating ? "filled" : ""}`}
                  onClick={() => handleRatingChange(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="comments-section">
            <h4>Comments:</h4>
            <div className="add-comment">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment... (max 500 characters)"
                maxLength={500}
              />
              <button onClick={handleCommentSubmit} disabled={!comment.trim()}>
                Add Comment
              </button>
            </div>

            <div className="comments-list">
              {(recipe.comments || []).map((comment) => (
                <div key={comment.id} className="comment">
                  <strong>{comment.username}</strong>
                  <span className="comment-date">{new Date(comment.timestamp).toLocaleDateString()}</span>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          </div>

          {showShareButtons && <ShareButtons recipe={recipe} />}
        </div>
      )}
    </div>
  )
}

export default RecipeCard
