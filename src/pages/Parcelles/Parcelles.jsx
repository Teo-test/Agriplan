// src/pages/Parcelles/Parcelles.jsx
import React, { useState, useEffect } from 'react';
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
      const coords = e.layer.getLatLngs()[0].map((pt) => [pt.lat, pt.lng]);
      onCreated(coords, e.layerType);
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

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    // Adapter selon votre structure de base de données
    fetchData("exploitations", setExploitations);
    fetchData("emplacements", setEmplacements);
    fetchData("zones", setZones);
    fetchData("sections", setSections);
  };

  const fetchData = async (table, setter) => {
    // Adapter selon votre service API
    try {
      const { data, error } = await supabase.from(table).select("*");
      if (!error) setter(data);
    } catch (error) {
      console.error(`Erreur lors de la récupération des ${table}:`, error);
    }
  };

  // Création d'un nouveau polygone
  const handleCreated = (coords, layerType) => {
    setFormData({
      id: null,
      type: "emplacement", // Par défaut
      nom: "",
      superficie: 0,
      typeEmplacement: "",
      status: "actif",
      exploitation_id: "",
      parent_id: "",
      coords,
    });
    setShowSidebar(true);
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
    }
  };

  // Suppression
  const handleDelete = async () => {
    if (!formData.id) return;
    
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
    }
  };

  // Édition géométrique
  const handleEdited = async (id, type, coords) => {
    const table = type === "emplacement" ? "emplacements" : 
                  type === "zone" ? "zones" : "sections";
    
    await supabase.from(table).update({ coords }).eq("id", id);
    fetchAllData();
  };

  // Clic sur polygone pour édition
  const handlePolygonClick = (item, type) => {
    setFormData({ 
      ...item, 
      type,
      typeEmplacement: item.type_emplacement || "",
      parent_id: item.emplacement_id || item.zone_id || ""
    });
    setShowSidebar(true);
  };

  // Rendu des polygones
  const renderPolygons = (items, color, fillOpacity, type) =>
    items.map((item) => (
      <Polygon
        key={item.id}
        positions={item.coords || []}
        pathOptions={{ color, fillOpacity, weight: 2 }}
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
            <Badge variant={item.status === 'actif' ? 'success' : 'warning'}>
              {item.status}
            </Badge>
          </div>
        </Tooltip>
      </Polygon>
    ));

  return (
    <div className="parcelles-page">
      <div className="parcelles-header">
        <h1>Gestion des Parcelles</h1>
        <div className="view-controls">
          <button 
            className={`btn ${currentView === 'map' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentView('map')}
          >
            Vue Carte
          </button>
          <button 
            className={`btn ${currentView === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentView('list')}
          >
            Vue Liste
          </button>
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 120px)" }}>
        {/* Vue Carte */}
        {currentView === 'map' && (
          <>
            <div style={{ flex: 1 }}>
              <MapContainer 
                crs={L.CRS.Simple} 
                bounds={bounds} 
                style={{ height: "100%" }}
              >
                <ImageOverlay url="src/assets/images/plan.jpg" bounds={bounds} />
                {renderPolygons(emplacements, "#1E90FF", 0.15, "emplacement")}
                {renderPolygons(zones, "#32CD32", 0.25, "zone")}
                {renderPolygons(sections, "#FFD700", 0.35, "section")}
                <DrawControl onCreated={handleCreated} onEdited={handleEdited} />
              </MapContainer>
            </div>

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
          </>
        )}

        {/* Vue Liste */}
        {currentView === 'list' && (
          <div className="parcelles-list" style={{ flex: 1, padding: '20px' }}>
            {emplacements.map(emplacement => (
              <Card key={emplacement.id} title={emplacement.nom} className="parcelle-card">
                <div className="parcelle-info">
                  <p>Type: {emplacement.type_emplacement}</p>
                  <p>Superficie: {emplacement.superficie} m²</p>
                  <Badge variant={emplacement.status === 'actif' ? 'success' : 'warning'}>
                    {emplacement.status}
                  </Badge>
                </div>
                
                <div className="parcelle-actions">
                  <button 
                    className="btn btn-info"
                    onClick={() => handlePolygonClick(emplacement, 'emplacement')}
                  >
                    Modifier
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Sidebar de modification */}
        {showSidebar && formData && (
          <div className="parcelles-sidebar">
            <h3>
              {formData.id ? "✏️ Modifier" : "➕ Nouveau"} {formData.type}
            </h3>

            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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

            <div className="form-group">
              <label>Superficie (m²)</label>
              <input
                type="number"
                value={formData.superficie}
                onChange={(e) => setFormData({ ...formData, superficie: parseInt(e.target.value) || 0 })}
              />
            </div>

            {formData.type === "emplacement" && (
              <>
                <div className="form-group">
                  <label>Type d'emplacement</label>
                  <select
                    value={formData.typeEmplacement}
                    onChange={(e) => setFormData({ ...formData, typeEmplacement: e.target.value })}
                  >
                    <option value="">Choisir le type</option>
                    <option value="serre_verre">Serre Verre</option>
                    <option value="tunnel">Tunnel</option>
                    <option value="plein_champs">Plein Champs</option>
                    <option value="verger">Verger</option>
                  </select>
                </div>

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
              </>
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
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Parcelles;
