// src/services/parcels.js
import { supabase, apiGet, apiCreate, apiUpdate, apiDelete } from './api'

// EXPLOITATIONS
export const getExploitations = () => 
  apiGet('exploitations', { orderBy: { column: 'nom' } })

export const createExploitation = (data) => 
  apiCreate('exploitations', data)

export const updateExploitation = (id, data) => 
  apiUpdate('exploitations', id, data)

export const deleteExploitation = (id) => 
  apiDelete('exploitations', id)

// EMPLACEMENTS
export const getEmplacements = () => 
  apiGet('emplacements', { 
    select: `
      *,
      exploitation:exploitations(nom)
    `,
    orderBy: { column: 'nom' }
  })

export const createEmplacement = (data) => 
  apiCreate('emplacements', data)

export const updateEmplacement = (id, data) => 
  apiUpdate('emplacements', id, data)

export const deleteEmplacement = (id) => 
  apiDelete('emplacements', id)

// ZONES
export const getZones = () => 
  apiGet('zones', { 
    select: `
      *,
      emplacement:emplacements(nom, exploitation:exploitations(nom))
    `,
    orderBy: { column: 'nom' }
  })

export const createZone = (data) => 
  apiCreate('zones', data)

export const updateZone = (id, data) => 
  apiUpdate('zones', id, data)

export const deleteZone = (id) => 
  apiDelete('zones', id)

// SECTIONS
export const getSections = () => 
  apiGet('sections', { 
    select: `
      *,
      zone:zones(nom, emplacement:emplacements(nom, exploitation:exploitations(nom)))
    `,
    orderBy: { column: 'nom' }
  })

export const createSection = (data) => 
  apiCreate('sections', data)

export const updateSection = (id, data) => 
  apiUpdate('sections', id, data)

export const deleteSection = (id) => 
  apiDelete('sections', id)

// Fonctions spécifiques
export const getEmplacementsByExploitation = (exploitationId) =>
  apiGet('emplacements', { filters: { exploitation_id: exploitationId } })

export const getZonesByEmplacement = (emplacementId) =>
  apiGet('zones', { filters: { emplacement_id: emplacementId } })

export const getSectionsByZone = (zoneId) =>
  apiGet('sections', { filters: { zone_id: zoneId } })
