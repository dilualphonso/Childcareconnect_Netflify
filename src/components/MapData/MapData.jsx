import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
import { Icon } from "@iconify/react";
import "./MapData.scss"

import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

const MapData = ({ daycares }) => {

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMarkerClick = (childCare) => {
    setSelectedLocation(childCare);
  };

  const handleInfoClose = () => {
    setSelectedLocation(null);
  };
        return (
          <section className="map">
            <div className="map__google">
               <APIProvider apiKey={""} libraries={["marker"]}>
      <Map
        mapId={"bf51a910020fa25a"}
        defaultZoom={12}
        defaultCenter={{ lat: 43.77887, lng: -79.17282 }}
        gestureHandling={"greedy"}
        disableDefaultUI
      >
        {daycares &&
          daycares.map((childCare, key) => {

            /* Convert your longitude and latitude into a float first
             since your data stored it as a string. */

            const floatLat = parseFloat(childCare.latitude);
            const floatLng = parseFloat(childCare.longitude);
            return (
              <AdvancedMarker
                key={key}
                position={{ lat: floatLat, lng: floatLng }}
                title={childCare.childcare_name}
                onClick={() => handleMarkerClick(childCare)}
              >


                <div
                  style={{
                    width: 16,
                    height: 16,
                    position: "absolute",
                    background: "#1dbe80",
                    border: "2px solid #0e6443",
                    borderRadius: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  </div>
                 {selectedLocation === childCare && (
                    <div
                      style={{
                        position: "absolute",
                        background: "#fff",
                        padding: "10px",
                        borderRadius: "5px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        zIndex: 1000,
                        left: "-50%",
                        top: "-120%",
                        transform: "translate(-50%, -50%)",

                      }}
                    >
                      <h3>{childCare.childcare_name}</h3>
                      <p>{childCare.address}</p>
                      <button onClick={handleInfoClose}>Close</button>
                    </div>
                 )}
              </AdvancedMarker>
            );
          })}
      </Map>
    </APIProvider>
            </div>

            </section>
        );



}

export default MapData;