import React, { useEffect, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";

const AccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "something";
interface MiniMapProps {
  coordinates: [number, number];
  mapboxId?: string;
}

// https://stackoverflow.com/questions/11871077/proper-way-to-detect-webgl-support
const webgl_support = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (error) {
    console.log(error);
    return false;
  }
};

const MapDisplay = ({ coordinates }: MiniMapProps) => {
  const [webGLError, setWebGLError] = useState(false);

  // https://dev.to/dqunbp/using-mapbox-gl-in-react-with-next-js-2glg
  useEffect(() => {
    if (!webgl_support()) {
      setWebGLError(true);
      return;
    }
  }, [coordinates]);

  if (webGLError) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        <p>
          WebGL is not supported or failed to initialize. (and yes I dont like
          WebGL)
        </p>
      </div>
    );
  }

  return (
    <Map
      initialViewState={{
        latitude: coordinates[0],
        longitude: coordinates[1],
        zoom: 14,
      }}
      mapboxAccessToken={AccessToken}
      style={{ width: "100%", height: "400px" }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    >
      <Marker
        latitude={coordinates[0]}
        longitude={coordinates[1]}
        color="red"
      />
      <NavigationControl />
    </Map>
  );
};

export default MapDisplay;
