const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return []
  }
}

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// Initialize with sample data
const initializeData = () => {
  // Initialize users if not exists
  if (!localStorage.getItem("users")) {
    const sampleUsers = [
      {
        id: 1,
        username: "demo",
        email: "demo@example.com",
        password: "password123",
        favorites: [1],
      },
      {
        id: 2,
        username: "john_doe",
        email: "john@example.com",
        password: "password123",
        favorites: [2],
      },
      {
        id: 3,
        username: "jane_smith",
        email: "jane@example.com",
        password: "password123",
        favorites: [1, 3],
      },
    ]
    saveToStorage("users", sampleUsers)
    console.log("Initialized users:", sampleUsers)
  }

  // Initialize recipes if not exists
  if (!localStorage.getItem("recipes")) {
    const sampleRecipes = [
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
        comments: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Chicken Caesar Salad",
        description: "Fresh and crispy salad with grilled chicken",
        ingredients: [
          "2 chicken breasts",
          "1 head romaine lettuce",
          "50g parmesan cheese",
          "croutons",
          "caesar dressing",
        ],
        instructions:
          "1. Grill chicken breasts and slice\n2. Chop romaine lettuce\n3. Toss lettuce with dressing\n4. Add chicken, cheese, and croutons\n5. Serve immediately",
        cookingTime: 20,
        servings: 2,
        category: "Lunch",
        rating: 4.2,
        author: "Healthy Chef",
        authorId: 2,
        favorites: 8,
        comments: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        title: "Chocolate Chip Cookies",
        description: "Soft and chewy homemade cookies",
        ingredients: [
          "2 cups flour",
          "1 cup butter",
          "1/2 cup sugar",
          "1/2 cup brown sugar",
          "2 eggs",
          "1 cup chocolate chips",
          "1 tsp vanilla",
        ],
        instructions:
          "1. Preheat oven to 375°F\n2. Cream butter and sugars\n3. Add eggs and vanilla\n4. Mix in flour gradually\n5. Fold in chocolate chips\n6. Bake for 10-12 minutes",
        cookingTime: 25,
        servings: 24,
        category: "Dessert",
        rating: 4.8,
        author: "Baker Jane",
        authorId: 3,
        favorites: 25,
        comments: [],
        createdAt: new Date().toISOString(),
      },
    ]
    saveToStorage("recipes", sampleRecipes)
    console.log("Initialized recipes:", sampleRecipes)
  }

  // Initialize comments if not exists
  if (!localStorage.getItem("comments")) {
    const sampleComments = [
      {
        id: 1,
        recipeId: 1,
        userId: 2,
        username: "john_doe",
        text: "Absolutely delicious! My family loved it.",
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        recipeId: 3,
        userId: 3,
        username: "jane_smith",
        text: "Perfect recipe! Cookies turned out amazing.",
        timestamp: new Date().toISOString(),
      },
    ]
    saveToStorage("comments", sampleComments)
  }
}

// Initialize data on module load
initializeData()

// Simulate API delay for more realistic experience
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Recipe API functions
export const recipeAPI = {
  getAll: async () => {
    await delay(300) // Simulate network delay
    return getFromStorage("recipes")
  },

  getById: async (id) => {
    await delay(200)
    const recipes = getFromStorage("recipes")
    const recipe = recipes.find((r) => r.id === Number.parseInt(id))
    if (!recipe) {
      throw new Error("Recipe not found")
    }
    return recipe
  },

  create: async (recipe) => {
    await delay(500)
    const recipes = getFromStorage("recipes")
    const newRecipe = {
      ...recipe,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      favorites: 0,
      comments: [],
    }
    recipes.push(newRecipe)
    saveToStorage("recipes", recipes)
    console.log("Created recipe:", newRecipe)
    return newRecipe
  },

  update: async (id, recipe) => {
    await delay(400)
    const recipes = getFromStorage("recipes")
    const index = recipes.findIndex((r) => r.id === Number.parseInt(id))
    if (index === -1) {
      throw new Error("Recipe not found")
    }
    recipes[index] = { ...recipes[index], ...recipe }
    saveToStorage("recipes", recipes)
    console.log("Updated recipe:", recipes[index])
    return recipes[index]
  },

  delete: async (id) => {
    await delay(300)
    const recipes = getFromStorage("recipes")
    const filteredRecipes = recipes.filter((r) => r.id !== Number.parseInt(id))
    saveToStorage("recipes", filteredRecipes)
    console.log("Deleted recipe with id:", id)
    return { success: true }
  },

  search: async (query) => {
    await delay(300)
    const recipes = getFromStorage("recipes")
    const searchTerm = query.toLowerCase()
    return recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some((ing) => ing.toLowerCase().includes(searchTerm)),
    )
  },

  getByCategory: async (category) => {
    await delay(200)
    const recipes = getFromStorage("recipes")
    return recipes.filter((recipe) => recipe.category === category)
  },

  getByAuthor: async (authorId) => {
    await delay(200)
    const recipes = getFromStorage("recipes")
    return recipes.filter((recipe) => recipe.authorId === Number.parseInt(authorId))
  },
}

// User API functions
export const userAPI = {
  getAll: async () => {
    await delay(200)
    return getFromStorage("users")
  },

  getById: async (id) => {
    await delay(200)
    const users = getFromStorage("users")
    const user = users.find((u) => u.id === Number.parseInt(id))
    if (!user) {
      throw new Error("User not found")
    }
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  create: async (userData) => {
    await delay(500)
    const users = getFromStorage("users")

    // Check if email already exists
    const existingUser = users.find((u) => u.email === userData.email)
    if (existingUser) {
      throw new Error("Email already exists")
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      favorites: [],
    }
    users.push(newUser)
    saveToStorage("users", users)

    console.log("Created user:", newUser)

    // Return user without password
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },

  update: async (id, userData) => {
    await delay(400)
    const users = getFromStorage("users")
    const index = users.findIndex((u) => u.id === Number.parseInt(id))
    if (index === -1) {
      throw new Error("User not found")
    }
    users[index] = { ...users[index], ...userData }
    saveToStorage("users", users)

    const { password, ...userWithoutPassword } = users[index]
    return userWithoutPassword
  },

  login: async (email, password) => {
    await delay(800) // Simulate authentication delay
    console.log("Attempting login with:", { email, password })

    const users = getFromStorage("users")
    console.log("Available users:", users)

    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      console.log("Login failed: Invalid credentials")
      throw new Error("Invalid email or password")
    }

    console.log("Login successful:", user)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },
}

// Comments API functions
export const commentAPI = {
  getByRecipe: async (recipeId) => {
    await delay(200)
    const comments = getFromStorage("comments")
    return comments.filter((comment) => comment.recipeId === Number.parseInt(recipeId))
  },

  create: async (comment) => {
    await delay(400)
    const comments = getFromStorage("comments")
    const newComment = {
      ...comment,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    }
    comments.push(newComment)
    saveToStorage("comments", comments)
    return newComment
  },

  delete: async (id) => {
    await delay(300)
    const comments = getFromStorage("comments")
    const filteredComments = comments.filter((c) => c.id !== Number.parseInt(id))
    saveToStorage("comments", filteredComments)
    return { success: true }
  },
}

// Ratings API functions
export const ratingAPI = {
  getByRecipe: async (recipeId) => {
    await delay(200)
    const ratings = getFromStorage("ratings") || []
    return ratings.filter((rating) => rating.recipeId === Number.parseInt(recipeId))
  },

  upsert: async (userId, recipeId, rating) => {
    await delay(400)
    const ratings = getFromStorage("ratings") || []

    const existingRatingIndex = ratings.findIndex(
      (r) => r.userId === Number.parseInt(userId) && r.recipeId === Number.parseInt(recipeId),
    )

    if (existingRatingIndex !== -1) {
      // Update existing rating
      ratings[existingRatingIndex].rating = rating
      saveToStorage("ratings", ratings)
      return ratings[existingRatingIndex]
    } else {
      // Create new rating
      const newRating = {
        id: Date.now(),
        userId: Number.parseInt(userId),
        recipeId: Number.parseInt(recipeId),
        rating,
      }
      ratings.push(newRating)
      saveToStorage("ratings", ratings)
      return newRating
    }
  },
}
