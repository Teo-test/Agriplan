// src/pages/Parcelles/Parcelles.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, ImageOverlay, Polygon, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { supabase } from '../../services/api'; // Adapter selon votre config

import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import '../../assets/styles/parcelles.css';

const bounds = [[0, 0], [750, 750]];

// Hook pour les contrôles de dessin
function DrawControl({ onCreated, onEdited }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        rectangle: true,
        circle: false,
        polyline: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: new L.FeatureGroup(),
      },
    });

    map.addControl(drawControl);

    // Création d'un nouveau polygone
    map.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;
      const coords = layer.getLatLngs()[0].map((pt) => [pt.lat, pt.lng]);
      onCreated(coords, e.layerType, layer);
    });

    // Édition d'un polygone existant
    map.on(L.Draw.Event.EDITED, (e) => {
      e.layers.eachLayer((layer) => {
        const coords = layer.getLatLngs()[0].map((pt) => [pt.lat, pt.lng]);
        const id = layer.options?.dbId;
        const type = layer.options?.dbType;
        if (id && type) onEdited(id, type, coords);
      });
    });

    return () => {
      map.removeControl(drawControl);
    };
  }, [map, onCreated, onEdited]);

  return null;
}

const Parcelles = () => {
  const [exploitations, setExploitations] = useState([]);
  const [emplacements, setEmplacements] = useState([]);
  const [zones, setZones] = useState([]);
  const [sections, setSections] = useState([]);
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [formData, setFormData] = useState(null);
  const [currentView, setCurrentView] = useState('map'); // 'map' ou 'list'
  const [detectedContext, setDetectedContext] = useState(null);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [currentLayer, setCurrentLayer] = useState(null);
  
  const mapContainerRef = useRef(null);

  // Configuration des types et échelles par plan
  const PLAN_CONFIG = {
    'plan.jpg': {
      scale: 1000, // 1 pixel = 1000 mm² (à ajuster selon votre plan)
      pixelsPerMeter: 0.588, // 0.588 pixels = 1 mètre (à calibrer selon votre plan)
      types: {
        emplacement: {
          'Serre Verre': ['Tables', 'Sous-zones'],
          'Tunnel': ['Planches'],
          'Plein Champs': ['Planches'],
          'Vergers': ['Lignes'],
          'Bâtiment': ['Sections'],
          'Zone de stockage': ['Sections']
        }
      }
    }
  };

  useEffect(() => {
    fetchAllData();
    
    // Configuration pour capturer tous les événements de molette
    const mapElement = document.querySelector('.leaflet-container');
    if (mapElement) {
      mapElement.addEventListener('wheel', (e) => {
        e.stopPropagation();
      }, { capture: true });
    }

    // Raccourcis clavier
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        setShowSidebar(false);
        setFormData(null);
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  const fetchAllData = async () => {
    fetchData("exploitations", setExploitations);
    fetchData("emplacements", setEmplacements);
    fetchData("zones", setZones);
    fetchData("sections", setSections);
  };

  const fetchData = async (table, setter) => {
    try {
      const { data, error } = await supabase.from(table).select("*");
      if (!error) setter(data);
    } catch (error) {
      console.error(`Erreur lors de la récupération des ${table}:`, error);
    }
  };

  // Fonction pour vérifier si un point est dans un polygone
  const isPointInPolygon = (point, polygon) => {
    if (!polygon || polygon.length < 3) return false;
    
    const x = point[0], y = point[1];
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  };

  // Fonction pour détecter dans quelle zone on dessine
  const detectContextFromPoint = (latlng) => {
    const point = [latlng.lat, latlng.lng];
    
    // Vérifier dans quelle exploitation on se trouve
    const currentExploitation = exploitations.find(exploitation => 
      isPointInPolygon(point, exploitation.coords)
    );
    
    if (!currentExploitation) return null;

    // Vérifier dans quel emplacement on se trouve
    const currentEmplacement = emplacements.find(emplacement => 
      emplacement.exploitation_id === currentExploitation.id &&
      isPointInPolygon(point, emplacement.coords)
    );

    // Vérifier dans quelle zone on se trouve
    const currentZone = zones.find(zone => 
      zone.emplacement_id === currentEmplacement?.id &&
      isPointInPolygon(point, zone.coords)
    );

    return {
      exploitation: currentExploitation,
      emplacement: currentEmplacement,
      zone: currentZone
    };
  };

  // Fonction pour calculer la surface avec l'échelle
  const calculateSurfaceFromCoordinates = (coordinates) => {
    if (!coordinates || coordinates.length < 3) return 0;
    
    const planConfig = PLAN_CONFIG['plan.jpg'];
    let area = 0;
    
    // Algorithme de shoelace pour calculer l'aire du polygone
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    
    area = Math.abs(area) / 2;
    
    // Conversion en m² selon l'échelle du plan
    const surfaceM2 = area / (planConfig.pixelsPerMeter * planConfig.pixelsPerMeter);
    
    return Math.round(surfaceM2 * 100) / 100; // Arrondi à 2 décimales
  };

  // Fonction pour obtenir les types disponibles selon le contexte
  const getAvailableTypes = (niveau, emplacementType = null) => {
    const planConfig = PLAN_CONFIG['plan.jpg'];
    
    switch (niveau) {
      case 'emplacement':
        return Object.keys(planConfig.types.emplacement);
      
      case 'zone':
        if (emplacementType && planConfig.types.emplacement[emplacementType]) {
          return planConfig.types.emplacement[emplacementType];
        }
        return ['Tables', 'Planches', 'Lignes', 'Sections'];
      
      case 'section':
        return ['Section A', 'Section B', 'Section C', 'Section D'];
      
      default:
        return [];
    }
  };

  // Fonction pour obtenir la couleur par défaut selon le niveau
  const getDefaultColor = (niveau) => {
    const colors = {
      emplacement: '#1E90FF',
      zone: '#32CD32', 
      section: '#FFD700'
    };
    return colors[niveau] || '#666666';
  };

  // Génération d'un nom suggéré
  const generateSuggestedName = (niveau, parentId, availableTypesForLevel) => {
    const levelCounts = {
      emplacement: emplacements.filter(e => e.exploitation_id === parentId).length,
      zone: zones.filter(z => z.emplacement_id === parentId).length,
      section: sections.filter(s => s.zone_id === parentId).length
    };
    
    const count = levelCounts[niveau] + 1;
    const levelNames = {
      emplacement: 'Emplacement',
      zone: availableTypesForLevel[0] || 'Zone',
      section: 'Section'
    };
    
    return `${levelNames[niveau]} ${count}`;
  };

  // Création d'un nouveau polygone avec pré-remplissage intelligent
  const handleCreated = (coords, layerType, layer) => {
    // Calcul automatique de la surface
    const calculatedSurface = calculateSurfaceFromCoordinates(coords);
    
    // Détection du contexte
    const context = detectContextFromPoint(layer.getLatLngs()[0][0]);
    
    // Détermination automatique du niveau à créer
    let suggestedLevel = 'emplacement'; // Par défaut
    let suggestedParentId = null;
    let suggestedParentName = '';
    
    if (context) {
      if (context.zone) {
        suggestedLevel = 'section';
        suggestedParentId = context.zone.id;
        suggestedParentName = context.zone.nom;
      } else if (context.emplacement) {
        suggestedLevel = 'zone';
        suggestedParentId = context.emplacement.id;
        suggestedParentName = context.emplacement.nom;
      } else if (context.exploitation) {
        suggestedLevel = 'emplacement';
        suggestedParentId = context.exploitation.id;
        suggestedParentName = context.exploitation.nom;
      }
    }

    // Types disponibles selon le contexte
    const availableTypesForLevel = getAvailableTypes(
      suggestedLevel, 
      context?.emplacement?.type_emplacement
    );

    setFormData({
      id: null,
      type: suggestedLevel,
      niveau: suggestedLevel,
      nom: generateSuggestedName(suggestedLevel, suggestedParentId, availableTypesForLevel),
      superficie: calculatedSurface,
      typeEmplacement: availableTypesForLevel[0] || '',
      status: "actif",
      exploitation_id: context?.exploitation?.id || "",
      parent_id: suggestedParentId,
      parent_name: suggestedParentName,
      coords,
      couleur: getDefaultColor(suggestedLevel),
      description: `${suggestedLevel} créée automatiquement${context?.exploitation ? ` dans ${context.exploitation.nom}` : ''}`,
      // Champs contextuels
      exploitation_context: context?.exploitation,
      emplacement_context: context?.emplacement,
      zone_context: context?.zone,
      available_types: availableTypesForLevel
    });
    
    setDetectedContext(context);
    setAvailableTypes(availableTypesForLevel);
    setShowSidebar(true);
    setCurrentLayer(layer);
  };

  // Sauvegarde/Mise à jour
  const handleSave = async () => {
    if (!formData.nom || !formData.type) {
      alert("Merci de renseigner le nom et le type");
      return;
    }

    const table = formData.type === "emplacement" ? "emplacements" : 
                  formData.type === "zone" ? "zones" : "sections";
    
    const data = {
      nom: formData.nom,
      superficie: formData.superficie,
      status: formData.status,
      coords: formData.coords,
      description: formData.description || '',
      couleur: formData.couleur || getDefaultColor(formData.type)
    };

    // Ajout de champs spécifiques selon le type
    if (formData.type === "emplacement") {
      data.type_emplacement = formData.typeEmplacement;
      data.exploitation_id = formData.exploitation_id;
    } else if (formData.type === "zone") {
      data.emplacement_id = formData.parent_id;
    } else if (formData.type === "section") {
      data.zone_id = formData.parent_id;
    }

    let result;
    if (formData.id) {
      result = await supabase.from(table).update(data).eq("id", formData.id);
    } else {
      result = await supabase.from(table).insert([data]);
    }

    if (result.error) {
      alert("❌ Erreur: " + result.error.message);
    } else {
      alert(formData.id ? "✅ Mis à jour !" : "✅ Ajouté !");
      fetchAllData();
      setShowSidebar(false);
      setFormData(null);
      setDetectedContext(null);
      setAvailableTypes([]);
      setCurrentLayer(null);
    }
  };

  // Suppression
  const handleDelete = async () => {
    if (!formData.id) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    
    const table = formData.type === "emplacement" ? "emplacements" : 
                  formData.type === "zone" ? "zones" : "sections";
    
    const { error } = await supabase.from(table).delete().eq("id", formData.id);
    
    if (error) {
      alert("❌ Erreur: " + error.message);
    } else {
      alert("🗑️ Supprimé !");
      fetchAllData();
      setShowSidebar(false);
      setFormData(null);
      setDetectedContext(null);
      setAvailableTypes([]);
      setCurrentLayer(null);
    }
  };

  // Édition géométrique
  const handleEdited = async (id, type, coords) => {
    const table = type === "emplacement" ? "emplacements" : 
                  type === "zone" ? "zones" : "sections";
    
    // Recalcul de la surface après édition
    const newSurface = calculateSurfaceFromCoordinates(coords);
    
    await supabase.from(table).update({ 
      coords,
      superficie: newSurface 
    }).eq("id", id);
    
    fetchAllData();
  };

  // Clic sur polygone pour édition
  const handlePolygonClick = (item, type) => {
    // Calcul des types disponibles pour l'édition
    const contextTypes = getAvailableTypes(type, item.type_emplacement);
    
    setFormData({ 
      ...item, 
      type,
      niveau: type,
      typeEmplacement: item.type_emplacement || "",
      parent_id: item.emplacement_id || item.zone_id || "",
      couleur: item.couleur || getDefaultColor(type),
      description: item.description || '',
      available_types: contextTypes
    });
    
    setAvailableTypes(contextTypes);
    setShowSidebar(true);
  };

  // Rendu des polygones
  const renderPolygons = (items, color, fillOpacity, type) =>
    items.map((item) => (
      <Polygon
        key={item.id}
        positions={item.coords || []}
        pathOptions={{ 
          color: item.couleur || color, 
          fillOpacity, 
          weight: 2 
        }}
        eventHandlers={{
          click: () => handlePolygonClick(item, type),
        }}
        dbId={item.id}
        dbType={type}
      >
        <Tooltip sticky>
          <div>
            <strong>{item.nom}</strong><br/>
            {item.superficie && `${item.superficie} m²`}<br/>
            {item.type_emplacement && <span>Type: {item.type_emplacement}<br/></span>}
            <Badge variant={item.status === 'actif' ? 'success' : 'warning'}>
              {item.status}
            </Badge>
          </div>
        </Tooltip>
      </Polygon>
    ));

  // // Fonction pour quitter le plein écran
  // const exitFullscreen = () => {
  //   // Logique pour revenir à la vue normale si nécessaire
  //   setCurrentView('list');
  // };

  // Rendu du formulaire intelligent
  const renderForm = () => {
    if (!formData) return null;

    return (
      <div className="parcelles-sidebar">
        <h3>
          {formData.id ? '✏️ Modifier' : '➕ Nouveau'} {formData.type}
          {detectedContext && (
            <div className="context-info">
              📍 {detectedContext.exploitation?.nom}
              {detectedContext.emplacement && ` > ${detectedContext.emplacement.nom}`}
              {detectedContext.zone && ` > ${detectedContext.zone.nom}`}
            </div>
          )}
        </h3>

        {/* Contexte parent */}
        {formData.parent_name && (
          <div className="form-group context-parent">
            <label>📁 Parent :</label>
            <input 
              type="text" 
              value={formData.parent_name} 
              disabled 
              className="parent-context"
            />
          </div>
        )}

        <div className="form-group">
          <label>Type de niveau</label>
          <select
            value={formData.type}
            onChange={(e) => {
              const newType = e.target.value;
              const newAvailableTypes = getAvailableTypes(newType, formData.emplacement_context?.type_emplacement);
              setFormData({ 
                ...formData, 
                type: newType,
                niveau: newType,
                typeEmplacement: newAvailableTypes[0] || '',
                available_types: newAvailableTypes
              });
              setAvailableTypes(newAvailableTypes);
            }}
            disabled={!!formData.id}
          >
            <option value="emplacement">Emplacement</option>
            <option value="zone">Zone</option>
            <option value="section">Section</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            placeholder="Nom de l'élément"
          />
        </div>

        {/* Type avec options contextuelles */}
        <div className="form-group">
          <label>{formData.type === 'emplacement' ? 'Type d\'emplacement' : 'Type'}</label>
          <select
            value={formData.typeEmplacement}
            onChange={(e) => setFormData({ ...formData, typeEmplacement: e.target.value })}
          >
            <option value="">Sélectionner un type</option>
            {(formData.available_types || availableTypes).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {detectedContext?.emplacement?.type_emplacement && (
            <small className="type-hint">
              💡 Types recommandés pour {detectedContext.emplacement.type_emplacement}
            </small>
          )}
        </div>

        {/* Surface calculée automatiquement */}
        <div className="form-group">
          <label>Superficie (m²)</label>
          <div className="surface-container">
            <input
              type="number"
              step="0.01"
              value={formData.superficie}
              onChange={(e) => setFormData({ ...formData, superficie: parseFloat(e.target.value) || 0 })}
            />
            <small className="surface-info">
              📐 Calculée automatiquement : {formData.superficie} m²
            </small>
          </div>
        </div>

        {/* Sélecteur de parent selon le type */}
        {formData.type === "emplacement" && (
          <div className="form-group">
            <label>Exploitation</label>
            <select
              value={formData.exploitation_id}
              onChange={(e) => setFormData({ ...formData, exploitation_id: e.target.value })}
            >
              <option value="">-- Choisir exploitation --</option>
              {exploitations.map((exp) => (
                <option key={exp.id} value={exp.id}>{exp.nom}</option>
              ))}
            </select>
          </div>
        )}

        {formData.type === "zone" && (
          <div className="form-group">
            <label>Emplacement parent</label>
            <select
              value={formData.parent_id}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            >
              <option value="">-- Choisir emplacement --</option>
              {emplacements.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.nom}</option>
              ))}
            </select>
          </div>
        )}

        {formData.type === "section" && (
          <div className="form-group">
            <label>Zone parent</label>
            <select
              value={formData.parent_id}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            >
              <option value="">-- Choisir zone --</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>{zone.nom}</option>
              ))}
            </select>
          </div>
        )}

        {/* Couleur */}
        <div className="form-group">
          <label>Couleur</label>
          <input
            type="color"
            value={formData.couleur || getDefaultColor(formData.type)}
            onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
          />
        </div>

        {/* Description pré-remplie */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description de la zone..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Statut</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="actif">Actif</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>

        <div className="sidebar-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            {formData.id ? "Mettre à jour" : "Enregistrer"}
          </button>

          {formData.id && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Supprimer
            </button>
          )}

          <button 
            className="btn btn-secondary"
            onClick={() => {
              setShowSidebar(false);
              setFormData(null);
              setDetectedContext(null);
              setAvailableTypes([]);
              setCurrentLayer(null);
            }}
          >
            Annuler
          </button>
        </div>

        {/* Info contextuelle */}
        {detectedContext && (
          <div className="context-details">
            <h4>📋 Informations contextuelles</h4>
            <div className="context-item">
              <strong>Exploitation :</strong> {detectedContext.exploitation?.nom || 'Non détectée'}
            </div>
            {detectedContext.emplacement && (
              <div className="context-item">
                <strong>Emplacement :</strong> {detectedContext.emplacement.nom} 
                <span className="type-badge">({detectedContext.emplacement.type_emplacement})</span>
              </div>
            )}
            {detectedContext.zone && (
              <div className="context-item">
                <strong>Zone :</strong> {detectedContext.zone.nom}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="parcelles-page">
      {/* {currentView === 'map' && (
        <button className="exit-fullscreen" onClick={exitFullscreen}>
          ✕ Quitter le plein écran
        </button>
      )} */}

      <div className="parcelles-header">
        <h1>Gestion des Parcelles</h1>
        <div className="view-controls">
          <button 
            className={`btn ${currentView === 'map' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentView('map')}
          >
            🗺️ Vue Carte
          </button>
          <button 
            className={`btn ${currentView === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentView('list')}
          >
            📋 Vue Liste
          </button>
        </div>
      </div>

      <div style={{ display: "flex", height: "100%" }}>
        {/* Vue Carte */}
        {currentView === 'map' && (
          <>
            <div className="map-container" ref={mapContainerRef}>
              <MapContainer 
                crs={L.CRS.Simple} 
                bounds={bounds} 
                style={{ height: "100%", width: "100%" }}
              >
                <ImageOverlay url="src/assets/images/plan.jpg" bounds={bounds} />
                {renderPolygons(emplacements, "#1E90FF", 0.15, "emplacement")}
                {renderPolygons(zones, "#32CD32", 0.25, "zone")}
                {renderPolygons(sections, "#FFD700", 0.35, "section")}
                <DrawControl onCreated={handleCreated} onEdited={handleEdited} />
              </MapContainer>

              {/* Légende */}
              <div className="map-legend">
                <h4>Légende</h4>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: "#1E90FF" }}></span>
                  Emplacements
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: "#32CD32" }}></span>
                  Zones
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: "#FFD700" }}></span>
                  Sections
                </div>
              </div>
            </div>
          </>
        )}

        {/* Vue Liste */}
        {currentView === 'list' && (
          <div className="parcelles-list" style={{ flex: 1, padding: '20px' }}>
            <h2>📋 Liste des Emplacements</h2>
            {emplacements.map(emplacement => (
              <Card key={emplacement.id} title={emplacement.nom} className="parcelle-card">
                <div className="parcelle-info">
                  <p><strong>Type:</strong> {emplacement.type_emplacement}</p>
                  <p><strong>Superficie:</strong> {emplacement.superficie} m²</p>
                  {emplacement.description && <p><strong>Description:</strong> {emplacement.description}</p>}
                  <Badge variant={emplacement.status === 'actif' ? 'success' : 'warning'}>
                    {emplacement.status}
                  </Badge>
                </div>
                
                <div className="parcelle-actions">
                  <button 
                    className="btn btn-info"
                    onClick={() => handlePolygonClick(emplacement, 'emplacement')}
                  >
                    ✏️ Modifier
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setCurrentView('map')}
                  >
                    🗺️ Voir sur carte
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Sidebar de modification intelligente */}
        {showSidebar && formData && renderForm()}
      </div>
    </div>
  );
};

export default Parcelles;
