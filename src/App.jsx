// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './components/Layout/PrivateRoute';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

// Pages
import Connexion from './pages/Auth/Connexion';
import Inscription from './pages/Auth/Inscription';
import MotDePasseOublie from './pages/Auth/MotDePasseOublie';
import Dashboard from './pages/Dashboard/Dashboard';

// Pages Parcelles
import Parcelles from './pages/Parcelles/Parcelles';
// import AjouterParcelle from './pages/Parcelles/AjouterParcelle';
// import ModifierParcelle from './pages/Parcelles/ModifierParcelle';
// import ParcelleDetails from './pages/Parcelles/ParcelleDetails';

// Autres pages
import Cultures from './pages/Cultures/Cultures';
import AjouterCulture from './pages/Cultures/AjouterCulture';
import ModifierCulture from './pages/Cultures/ModifierCulture';
import CultureDetails from './pages/Cultures/CultureDetails';
import Calendrier from './pages/Calendrier/Calendrier';
import CalendrierJour from './pages/Calendrier/CalendrierJour';
import Taches from './pages/Taches/Taches';
import AjouterTache from './pages/Taches/AjouterTache';
import ModifierTache from './pages/Taches/ModifierTache';
import TacheDetails from './pages/Taches/TacheDetails';
import Stocks from './pages/Stocks/Stocks';
import AjouterStock from './pages/Stocks/AjouterStock';
import ModifierStock from './pages/Stocks/ModifierStock';
import StockDetails from './pages/Stocks/StockDetails';
import HistoriqueStocks from './pages/Stocks/HistoriqueStocks';
import Utilisateurs from './pages/Utilisateurs/Utilisateurs';
import AjouterUtilisateur from './pages/Utilisateurs/AjouterUtilisateur';
import ModifierUtilisateur from './pages/Utilisateurs/ModifierUtilisateur';
import UtilisateurDetails from './pages/Utilisateurs/UtilisateurDetails';
import Rapports from './pages/Rapports/Rapports';
import RapportDetails from './pages/Rapports/RapportDetails';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Routes publiques (sans layout) */}
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />

            {/* Routes privées (avec layout) */}
            <Route path="/*" element={
              <PrivateRoute>
                <div className="app-container">
                  <Header />
                  <div className="app-body">
                    <Sidebar />
                    <main className="main-content">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Parcelles */}
                        <Route path="/parcelles" element={<Parcelles />} />
                        {/* <Route path="/parcelles/ajouter" element={<AjouterParcelle />} />
                        <Route path="/parcelles/:id/modifier" element={<ModifierParcelle />} />
                        <Route path="/parcelles/:id" element={<ParcelleDetails />} /> */}

                        {/* Cultures */}
                        <Route path="/cultures" element={<Cultures />} />
                        <Route path="/cultures/ajouter" element={<AjouterCulture />} />
                        <Route path="/cultures/:id/modifier" element={<ModifierCulture />} />
                        <Route path="/cultures/:id" element={<CultureDetails />} />

                        {/* Calendrier */}
                        <Route path="/calendrier" element={<Calendrier />} />
                        <Route path="/calendrier/:date" element={<CalendrierJour />} />

                        {/* Tâches */}
                        <Route path="/taches" element={<Taches />} />
                        <Route path="/taches/ajouter" element={<AjouterTache />} />
                        <Route path="/taches/:id/modifier" element={<ModifierTache />} />
                        <Route path="/taches/:id" element={<TacheDetails />} />

                        {/* Stocks */}
                        <Route path="/stocks" element={<Stocks />} />
                        <Route path="/stocks/ajouter" element={<AjouterStock />} />
                        <Route path="/stocks/:id/modifier" element={<ModifierStock />} />
                        <Route path="/stocks/:id" element={<StockDetails />} />
                        <Route path="/stocks/historique" element={<HistoriqueStocks />} />

                        {/* Utilisateurs */}
                        <Route path="/utilisateurs" element={<Utilisateurs />} />
                        <Route path="/utilisateurs/ajouter" element={<AjouterUtilisateur />} />
                        <Route path="/utilisateurs/:id/modifier" element={<ModifierUtilisateur />} />
                        <Route path="/utilisateurs/:id" element={<UtilisateurDetails />} />

                        {/* Rapports */}
                        <Route path="/rapports" element={<Rapports />} />
                        <Route path="/rapports/:id" element={<RapportDetails />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
