function UserProfile({ currentUser, recipes, favoriteRecipes }) {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{currentUser.username.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h2>{currentUser.username}</h2>
          <p>{currentUser.email}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>{recipes.length}</h3>
          <p>Recipes Created</p>
        </div>
        <div className="stat-card">
          <h3>{favoriteRecipes.length}</h3>
          <p>Favorite Recipes</p>
        </div>
        <div className="stat-card">
          <h3>{recipes.reduce((total, recipe) => total + recipe.comments.length, 0)}</h3>
          <p>Comments Received</p>
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-section">
          <h3>My Recipes</h3>
          {recipes.length === 0 ? (
            <p>You haven't created any recipes yet.</p>
          ) : (
            <div className="recipe-list">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="profile-recipe-item">
                  <h4>{recipe.title}</h4>
                  <div className="recipe-meta">
                    <span>⭐ {recipe.rating.toFixed(1)}</span>
                    <span>❤️ {recipe.favorites}</span>
                    <span>💬 {recipe.comments.length}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Favorite Recipes</h3>
          {favoriteRecipes.length === 0 ? (
            <p>You haven't favorited any recipes yet.</p>
          ) : (
            <div className="recipe-list">
              {favoriteRecipes.map((recipe) => (
                <div key={recipe.id} className="profile-recipe-item">
                  <h4>{recipe.title}</h4>
                  <p>By: {recipe.author}</p>
                  <div className="recipe-meta">
                    <span>⭐ {recipe.rating.toFixed(1)}</span>
                    <span>⏱️ {recipe.cookingTime} min</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
