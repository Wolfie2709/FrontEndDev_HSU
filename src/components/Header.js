"use client"

function Header({ currentUser, currentView, setCurrentView, onLogout, darkMode, setDarkMode }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">🍳 Recipe Share</div>

        <nav className="nav">
          <button
            className={`nav-btn ${currentView === "recipes" ? "active" : ""}`}
            onClick={() => setCurrentView("recipes")}
          >
            All Recipes
          </button>
          <button
            className={`nav-btn ${currentView === "add-recipe" ? "active" : ""}`}
            onClick={() => setCurrentView("add-recipe")}
          >
            Add Recipe
          </button>
          <button
            className={`nav-btn ${currentView === "meal-plan" ? "active" : ""}`}
            onClick={() => setCurrentView("meal-plan")}
          >
            📅 Meal Plan
          </button>
          <button
            className={`nav-btn ${currentView === "favorites" ? "active" : ""}`}
            onClick={() => setCurrentView("favorites")}
          >
            ❤️ Favorites
          </button>
          <button
            className={`nav-btn ${currentView === "profile" ? "active" : ""}`}
            onClick={() => setCurrentView("profile")}
          >
            My Profile
          </button>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <div className="user-info">
            <span>Welcome, {currentUser.username}!</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
