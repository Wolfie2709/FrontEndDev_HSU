"use client"

function MealPlanPage({ recipes, mealPlan, addToMealPlan, removeFromMealPlan }) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const getTotalNutrition = () => {
    const total = { calories: 0, protein: 0, fat: 0, carbs: 0 }

    Object.values(mealPlan)
      .flat()
      .forEach((recipeId) => {
        const recipe = recipes.find((r) => r.id === recipeId)
        if (recipe && recipe.nutritionalInfo) {
          total.calories += recipe.nutritionalInfo.calories || 0
          total.protein += recipe.nutritionalInfo.protein || 0
          total.fat += recipe.nutritionalInfo.fat || 0
          total.carbs += recipe.nutritionalInfo.carbs || 0
        }
      })

    return total
  }

  const totalNutrition = getTotalNutrition()

  const handleDragStart = (e, recipeId) => {
    e.dataTransfer.setData("text/plain", recipeId.toString())
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, day) => {
    e.preventDefault()
    const recipeId = Number.parseInt(e.dataTransfer.getData("text/plain"))
    if (recipeId) {
      addToMealPlan(recipeId, day)
    }
  }

  return (
    <div className="meal-plan-container">
      <h2>Weekly Meal Planner</h2>
      <p>Drag recipes to plan your week</p>

      {/* Nutrition Summary */}
      <div className="nutrition-summary">
        <h3>Weekly Nutrition Summary</h3>
        <div className="nutrition-grid">
          <div className="nutrition-item">
            <div className="nutrition-value calories">{totalNutrition.calories}</div>
            <div className="nutrition-label">Calories</div>
          </div>
          <div className="nutrition-item">
            <div className="nutrition-value protein">{totalNutrition.protein}g</div>
            <div className="nutrition-label">Protein</div>
          </div>
          <div className="nutrition-item">
            <div className="nutrition-value fat">{totalNutrition.fat}g</div>
            <div className="nutrition-label">Fat</div>
          </div>
          <div className="nutrition-item">
            <div className="nutrition-value carbs">{totalNutrition.carbs}g</div>
            <div className="nutrition-label">Carbs</div>
          </div>
        </div>
      </div>

      {/* Meal Plan Grid */}
      <div className="meal-plan-grid">
        {/* Recipe Library */}
        <div className="recipe-library">
          <h3>Recipe Library</h3>
          <div className="recipe-library-list">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="draggable-recipe"
                draggable
                onDragStart={(e) => handleDragStart(e, recipe.id)}
              >
                <div className="recipe-name">{recipe.title}</div>
                <div className="recipe-time">{recipe.cookingTime} min</div>
              </div>
            ))}
          </div>
        </div>

        {/* Days of Week */}
        <div className="meal-plan-days">
          {daysOfWeek.map((day) => (
            <div key={day} className="meal-plan-day">
              <h4>{day}</h4>
              <div className="meal-plan-drop-zone" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, day)}>
                {(mealPlan[day] || []).map((recipeId) => {
                  const recipe = recipes.find((r) => r.id === recipeId)
                  return recipe ? (
                    <div
                      key={`${day}-${recipeId}`}
                      className="planned-recipe"
                      onClick={() => removeFromMealPlan(recipeId, day)}
                      title="Click to remove"
                    >
                      <div className="recipe-name">{recipe.title}</div>
                      <div className="recipe-time">{recipe.cookingTime} min</div>
                    </div>
                  ) : null
                })}
                {(mealPlan[day] || []).length === 0 && <div className="drop-zone-placeholder">Drop recipes here</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MealPlanPage
