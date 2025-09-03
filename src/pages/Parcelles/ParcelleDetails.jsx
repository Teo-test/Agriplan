// // src/pages/Parcelles/ParcelleDetails.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { getParcelleById } from '../../services/parcels';
// import Card from '../../components/UI/Card';
// import Badge from '../../components/UI/Badge';

// const ParcelleDetails = () => {
//   const { id } = useParams();
//   const [parcelle, setParcelle] = useState(null);

//   useEffect(() => {
//     loadParcelle();
//   }, [id]);

//   const loadParcelle = async () => {
//     const data = await getParcelleById(id);
//     setParcelle(data);
//   };

//   if (!parcelle) return <p>Chargement...</p>;

//   return (
//     <div className="parcelle-details-page">
//       <h1>Détails de la Parcelle: {parcelle.emplacement}</h1>
//       <Card>
//         <p>Exploitation: {parcelle.exploitation}</p>
//         <p>Type: {parcelle.type}</p>
//         <p>Superficie: {parcelle.superficieTotale} m²</p>
//         <Badge variant={parcelle.status === 'actif' ? 'success' : 'warning'}>{parcelle.status}</Badge>
        
//         <h2>Zones</h2>
//         {parcelle.zones.map(zone => (
//           <div key={zone.id}>
//             <h3>{zone.nom}</h3>
//             <h4>Sections</h4>
//             {zone.sections.map(section => (
//               <p key={section.id}>{section.nom} - {section.superficie} m² <Badge variant={section.status === 'actif' ? 'success' : 'warning'}>{section.status}</Badge></p>
//             ))}
//           </div>
//         ))}
//       </Card>
//     </div>
//   );
// };

// export default ParcelleDetails;
