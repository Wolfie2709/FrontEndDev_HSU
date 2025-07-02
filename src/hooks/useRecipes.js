"use client"

import { useState, useEffect } from "react"
import { recipeAPI } from "../services/api"

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const data = await recipeAPI.getAll()
      setRecipes(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch recipes")
      console.error("Error fetching recipes:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  const addRecipe = async (recipe) => {
    try {
      const newRecipe = await recipeAPI.create({
        ...recipe,
        createdAt: new Date().toISOString(),
        favorites: 0,
        rating: 0,
      })
      setRecipes((prev) => [...prev, newRecipe])
      return newRecipe
    } catch (err) {
      setError("Failed to add recipe")
      throw err
    }
  }

  const updateRecipe = async (id, recipe) => {
    try {
      const updatedRecipe = await recipeAPI.update(id, recipe)
      setRecipes((prev) => prev.map((r) => (r.id === id ? updatedRecipe : r)))
      return updatedRecipe
    } catch (err) {
      setError("Failed to update recipe")
      throw err
    }
  }

  const deleteRecipe = async (id) => {
    try {
      await recipeAPI.delete(id)
      setRecipes((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      setError("Failed to delete recipe")
      throw err
    }
  }

  const searchRecipes = async (query) => {
    try {
      setLoading(true)
      const data = await recipeAPI.search(query)
      setRecipes(data)
      setError(null)
    } catch (err) {
      setError("Failed to search recipes")
      console.error("Error searching recipes:", err)
    } finally {
      setLoading(false)
    }
  }

  return {
    recipes,
    loading,
    error,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    refetch: fetchRecipes,
  }
}
