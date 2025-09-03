// // src/pages/Parcelles/ModifierParcelle.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getParcelleById, updateParcelle } from '../../services/parcels';

// const ModifierParcelle = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState(null);

//   useEffect(() => {
//     loadParcelle();
//   }, [id]);

//   const loadParcelle = async () => {
//     const data = await getParcelleById(id);
//     setFormData(data);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await updateParcelle(id, formData);
//     navigate('/parcelles');
//   };

//   if (!formData) return <p>Chargement...</p>;

//   return (
//     <div className="modifier-parcelle-page">
//       <h1>Modifier la Parcelle</h1>
//       <form onSubmit={handleSubmit}>
//         <input name="emplacement" value={formData.emplacement} onChange={handleChange} required />
//         <select name="type" value={formData.type} onChange={handleChange} required>
//           <option value="serre_verre">Serre Verre</option>
//           <option value="tunnel">Tunnel</option>
//           <option value="plein_champs">Plein Champs</option>
//           <option value="verger">Verger</option>
//         </select>
//         <input name="superficieTotale" type="number" value={formData.superficieTotale} onChange={handleChange} required />
//         <select name="status" value={formData.status} onChange={handleChange}>
//           <option value="actif">Actif</option>
//           <option value="maintenance">Maintenance</option>
//         </select>
//         {/* Ajoutez des champs pour éditer zones et sections si besoin - pour simplifier, on édite seulement les basics ici */}
//         <button type="submit">Enregistrer les modifications</button>
//       </form>
//     </div>
//   );
// };

// export default ModifierParcelle;
