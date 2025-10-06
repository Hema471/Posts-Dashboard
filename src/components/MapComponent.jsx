import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapComponent = ({ location, handleDragEnd }) => {

  // Fix marker icons for Leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  // Market icon
  const googlePin = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // nice modern red pin
    iconSize: [38, 38], // slightly bigger, scalable
    iconAnchor: [19, 38], // anchor at bottom center
    popupAnchor: [0, -35], // popup above the pin
  });

  return (
    <MapContainer
      center={[40.7128, -74.006]}
      zoom={6}
      style={{
        height: "250px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {location && (
        <Marker
          draggable={true}
          position={location}
          icon={googlePin}
          eventHandlers={{
            dragend: handleDragEnd,
          }}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
