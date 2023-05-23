import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
});

function Map(props) {
  const [zone, setZone] = useState({ center: [33.74059917546109, -7.238578523576559] });
  const [zoom, setZoom] = useState(6);
  useEffect(() => {
    const zone_Id = props.zoneId;

    // récupération des données de la zone depuis l'API
    axios
      .get(`https://resto-api-dun.vercel.app/api/zones/${zone_Id}`)
      .then(response => {
        setZone(response.data);
        setZoom(14);
      })
      .catch(error => {
        console.log(error);
        setZoom(6)
        setZone({ center: [33.74059917546109, -7.238578523576559] });
      });
  }, [props.zoneId]);




  return (
    <>

      {zone && (
        
        <MapContainer
          key={`${zone.center}`}
          center={zone.center}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ height: "400px", width: "65%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          {props.restoCord && props.restoCord.map((coord, index) => (
            <Marker position={coord} icon={customIcon} key={index}>
              <Popup>{props.restoName[index]}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

    </>
  );
}


export default Map;
