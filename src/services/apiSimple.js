const getFromStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]")
  } catch {
    return []
  }
}

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

// Initialize with sample data
const initializeData = () => {
  if (!localStorage.getItem("recipes")) {
    const sampleRecipes = [
      {
        id: 1,
        title: "Spaghetti Bolognese",
        description: "Classic Italian pasta dish",
        ingredients: ["500g spaghetti", "300g ground beef", "400ml tomato sauce"],
        instructions: "Cook pasta, brown beef, add sauce, combine.",
        cookingTime: 45,
        servings: 4,
        category: "Dinner",
        rating: 4.5,
        author: "Chef Mario",
        authorId: 1,
        favorites: 0,
        comments: [],
      },
    ]
    saveToStorage("recipes", sampleRecipes)
  }

  if (!localStorage.getItem("users")) {
    const sampleUsers = [
      {
        id: 1,
        username: "demo",
        email: "demo@example.com",
        password: "password123",
        favorites: [],
      },
    ]
    saveToStorage("users", sampleUsers)
  }
}

initializeData()

export const recipeAPI = {
  getAll: async () => getFromStorage("recipes"),
  create: async (recipe) => {
    const recipes = getFromStorage("recipes")
    const newRecipe = { ...recipe, id: Date.now() }
    recipes.push(newRecipe)
    saveToStorage("recipes", recipes)
    return newRecipe
  },
  update: async (id, recipe) => {
    const recipes = getFromStorage("recipes")
    const index = recipes.findIndex((r) => r.id === id)
    if (index !== -1) {
      recipes[index] = { ...recipes[index], ...recipe }
      saveToStorage("recipes", recipes)
      return recipes[index]
    }
    throw new Error("Recipe not found")
  },
  delete: async (id) => {
    const recipes = getFromStorage("recipes")
    const filtered = recipes.filter((r) => r.id !== id)
    saveToStorage("recipes", filtered)
    return { success: true }
  },
}

export const userAPI = {
  login: async (email, password) => {
    const users = getFromStorage("users")
    const user = users.find((u) => u.email === email && u.password === password)
    if (user) {
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    throw new Error("Invalid credentials")
  },
  create: async (userData) => {
    const users = getFromStorage("users")
    const newUser = { ...userData, id: Date.now(), favorites: [] }
    users.push(newUser)
    saveToStorage("users", users)
    const { password: _, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },
}
