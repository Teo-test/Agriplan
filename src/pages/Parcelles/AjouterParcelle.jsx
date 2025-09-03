// // src/pages/Parcelles/AjouterParcelle.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { addParcelle } from '../../services/parcels';

// const AjouterParcelle = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     exploitation: 'Ferme des Collines', // Par défaut
//     emplacement: '',
//     type: '',
//     superficieTotale: 0,
//     status: 'actif',
//     zones: [] // Ajouter des zones dynamiquement
//   });

//   const [currentZone, setCurrentZone] = useState({ nom: '', sections: [] });
//   const [currentSection, setCurrentSection] = useState({ nom: '', superficie: 0, status: 'actif' });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const addZone = () => {
//     setFormData({ ...formData, zones: [...formData.zones, { ...currentZone, id: Date.now().toString() }] });
//     setCurrentZone({ nom: '', sections: [] });
//   };

//   const addSectionToZone = () => {
//     const updatedZones = formData.zones.map((z, index) => 
//       index === formData.zones.length - 1 ? { ...z, sections: [...z.sections, { ...currentSection, id: Date.now().toString() }] } : z
//     );
//     setFormData({ ...formData, zones: updatedZones });
//     setCurrentSection({ nom: '', superficie: 0, status: 'actif' });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await addParcelle(formData);
//     navigate('/parcelles');
//   };

//   return (
//     <div className="ajouter-parcelle-page">
//       <h1>Ajouter une Parcelle</h1>
//       <form onSubmit={handleSubmit}>
//         <input name="emplacement" placeholder="Emplacement (ex: Serre Verre 1)" onChange={handleChange} required />
//         <select name="type" onChange={handleChange} required>
//           <option value="">Type</option>
//           <option value="serre_verre">Serre Verre</option>
//           <option value="tunnel">Tunnel</option>
//           <option value="plein_champs">Plein Champs</option>
//           <option value="verger">Verger</option>
//         </select>
//         <input name="superficieTotale" type="number" placeholder="Superficie totale (m²)" onChange={handleChange} required />
//         <select name="status" onChange={handleChange}>
//           <option value="actif">Actif</option>
//           <option value="maintenance">Maintenance</option>
//         </select>

//         {/* Ajout de zones */}
//         <h2>Ajouter des Zones</h2>
//         <input value={currentZone.nom} onChange={(e) => setCurrentZone({ ...currentZone, nom: e.target.value })} placeholder="Nom de la zone" />
//         <button type="button" onClick={addZone}>Ajouter Zone</button>

//         {/* Ajout de sections à la dernière zone */}
//         {formData.zones.length > 0 && (
//           <>
//             <h3>Ajouter Sections à la dernière Zone</h3>
//             <input value={currentSection.nom} onChange={(e) => setCurrentSection({ ...currentSection, nom: e.target.value })} placeholder="Nom de la section" />
//             <input value={currentSection.superficie} type="number" onChange={(e) => setCurrentSection({ ...currentSection, superficie: parseInt(e.target.value) })} placeholder="Superficie (m²)" />
//             <button type="button" onClick={addSectionToZone}>Ajouter Section</button>
//           </>
//         )}

//         <button type="submit">Enregistrer</button>
//       </form>
//     </div>
//   );
// };

// export default AjouterParcelle;
