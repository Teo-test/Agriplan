// src/services/api.js
import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Configuration générale de l'API
export const api = {
  baseURL: supabaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`
  }
}

// Fonctions utilitaires pour les requêtes
export const handleApiError = (error) => {
  console.error('Erreur API:', error)
  if (error.message) {
    throw new Error(error.message)
  }
  throw error
}

export const handleApiResponse = (response) => {
  if (response.error) {
    throw new Error(response.error.message || 'Erreur inconnue')
  }
  return response.data
}

// Fonctions génériques CRUD
export const apiGet = async (table, options = {}) => {
  try {
    let query = supabase.from(table).select(options.select || '*')
    
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? true })
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  } catch (error) {
    handleApiError(error)
  }
}

export const apiCreate = async (table, data) => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result
  } catch (error) {
    handleApiError(error)
  }
}

export const apiUpdate = async (table, id, data) => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  } catch (error) {
    handleApiError(error)
  }
}

export const apiDelete = async (table, id) => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  } catch (error) {
    handleApiError(error)
  }
}

// Export par défaut pour la compatibilité
export default {
  supabase,
  api,
  apiGet,
  apiCreate,
  apiUpdate,
  apiDelete,
  handleApiError,
  handleApiResponse
}
