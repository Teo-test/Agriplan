import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import corrigé
import { useNotifications } from '../../context/NotificationContext'; // Import corrigé
import Card from '../../components/UI/Card';
import Alert from '../../components/UI/Alert';
import Badge from '../../components/UI/Badge';
import '../../assets/styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [dashboardData, setDashboardData] = useState({
    parcelles: [],
    tachesUrgentes: [],
    culturesEnCours: [],
    stocksFaibles: [],
    meteo: null,
    statistiques: {
      totalParcelles: 0,
      totalCultures: 0,
      tachesEnRetard: 0,
      rendementMoyen: 0
    }
  });

  useEffect(() => {
    // Charger les données du dashboard
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulation des données - à remplacer par vos appels API
      setDashboardData({
        parcelles: [
          { id: 1, nom: 'Serre A1', type: 'serre_verre', superficie: 200, status: 'actif' },
          { id: 2, nom: 'Tunnel B2', type: 'tunnel', superficie: 150, status: 'maintenance' },
          { id: 3, nom: 'Champ Nord', type: 'plein_champs', superficie: 2000, status: 'actif' }
        ],
        tachesUrgentes: [
          { id: 1, titre: 'Arrosage Tomates', parcelle: 'Serre A1', echeance: '2024-01-15', priorite: 'haute' },
          { id: 2, titre: 'Récolte Laitues', parcelle: 'Tunnel B2', echeance: '2024-01-16', priorite: 'moyenne' }
        ],
        culturesEnCours: [
          { id: 1, nom: 'Tomates Cerises', parcelle: 'Serre A1', stade: 'Floraison', progression: 65 },
          { id: 2, nom: 'Laitues', parcelle: 'Tunnel B2', stade: 'Récolte', progression: 90 },
          { id: 3, nom: 'Carottes', parcelle: 'Champ Nord', stade: 'Croissance', progression: 40 }
        ],
        stocksFaibles: [
          { id: 1, nom: 'Engrais NPK', quantite: 2, unite: 'sacs', seuil: 5 },
          { id: 2, nom: 'Graines de Radis', quantite: 1, unite: 'paquets', seuil: 3 }
        ],
        meteo: {
          temperature: 22,
          humidite: 65,
          precipitation: 0,
          vent: 12,
          prevision: 'Ensoleillé'
        },
        statistiques: {
          totalParcelles: 12,
          totalCultures: 8,
          tachesEnRetard: 3,
          rendementMoyen: 87
        }
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case 'haute': return 'danger';
      case 'moyenne': return 'warning';
      case 'basse': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'actif': return 'success';
      case 'maintenance': return 'warning';
      case 'inactif': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="dashboard">
      {/* En-tête */}
      <div className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Bonjour {user?.nom}, bienvenue sur votre exploitation</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Notifications importantes */}
      {notifications && notifications.length > 0 && (
        <div className="dashboard-alerts">
          {notifications.slice(0, 2).map(notification => (
            <Alert 
              key={notification.id}
              type={notification.type}
              title={notification.titre}
            >
              {notification.message}
            </Alert>
          ))}
        </div>
      )}

      {/* Statistiques rapides */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌾</div>
          <div className="stat-content">
            <h3>{dashboardData.statistiques.totalParcelles}</h3>
            <p>Parcelles actives</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <div className="stat-content">
            <h3>{dashboardData.statistiques.totalCultures}</h3>
            <p>Cultures en cours</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{dashboardData.statistiques.tachesEnRetard}</h3>
            <p>Tâches en retard</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{dashboardData.statistiques.rendementMoyen}%</h3>
            <p>Rendement moyen</p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="dashboard-content">
        <div className="dashboard-left">
          {/* Tâches urgentes */}
          <Card title="Tâches urgentes" className="dashboard-card">
            <div className="taches-list">
              {dashboardData.tachesUrgentes.length > 0 ? (
                dashboardData.tachesUrgentes.map(tache => (
                  <div key={tache.id} className="tache-item">
                    <div className="tache-info">
                      <h4>{tache.titre}</h4>
                      <p>📍 {tache.parcelle}</p>
                      <p>📅 {new Date(tache.echeance).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <Badge variant={getPriorityColor(tache.priorite)}>
                      {tache.priorite}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="no-data">Aucune tâche urgente</p>
              )}
            </div>
          </Card>

          {/* Cultures en cours */}
          <Card title="Cultures en cours" className="dashboard-card">
            <div className="cultures-list">
              {dashboardData.culturesEnCours.length > 0 ? (
                dashboardData.culturesEnCours.map(culture => (
                  <div key={culture.id} className="culture-item">
                    <div className="culture-info">
                      <h4>{culture.nom}</h4>
                      <p>📍 {culture.parcelle}</p>
                      <p>🌱 {culture.stade}</p>
                    </div>
                    <div className="culture-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${culture.progression}%` }}
                        ></div>
                      </div>
                      <span>{culture.progression}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">Aucune culture en cours</p>
              )}
            </div>
          </Card>
        </div>

        <div className="dashboard-right">
          {/* Météo */}
          {dashboardData.meteo && (
            <Card title="Conditions météo" className="dashboard-card">
              <div className="meteo-info">
                <div className="meteo-main">
                  <div className="meteo-temp">
                    <span className="temp">{dashboardData.meteo.temperature}°C</span>
                    <span className="condition">{dashboardData.meteo.prevision}</span>
                  </div>
                  <div className="meteo-icon">☀️</div>
                </div>
                <div className="meteo-details">
                  <div className="meteo-detail">
                    <span>💧 Humidité</span>
                    <span>{dashboardData.meteo.humidite}%</span>
                  </div>
                  <div className="meteo-detail">
                    <span>🌬️ Vent</span>
                    <span>{dashboardData.meteo.vent} km/h</span>
                  </div>
                  <div className="meteo-detail">
                    <span>☔ Précipitations</span>
                    <span>{dashboardData.meteo.precipitation} mm</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Parcelles */}
          <Card title="Vue d'ensemble des parcelles" className="dashboard-card">
            <div className="parcelles-list">
              {dashboardData.parcelles.length > 0 ? (
                dashboardData.parcelles.map(parcelle => (
                  <div key={parcelle.id} className="parcelle-item">
                    <div className="parcelle-info">
                      <h4>{parcelle.nom}</h4>
                      <p>{parcelle.superficie} m² • {parcelle.type.replace('_', ' ')}</p>
                    </div>
                    <Badge variant={getStatusColor(parcelle.status)}>
                      {parcelle.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="no-data">Aucune parcelle</p>
              )}
            </div>
          </Card>

          {/* Stocks faibles */}
          <Card title="Stocks faibles" className="dashboard-card">
            <div className="stocks-list">
              {dashboardData.stocksFaibles.length > 0 ? (
                dashboardData.stocksFaibles.map(stock => (
                  <div key={stock.id} className="stock-item">
                    <div className="stock-info">
                      <h4>{stock.nom}</h4>
                      <p>Reste {stock.quantite} {stock.unite} (seuil: {stock.seuil})</p>
                    </div>
                    <Badge variant="warning">Faible</Badge>
                  </div>
                ))
              ) : (
                <p className="no-data">Tous les stocks sont suffisants</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
