import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

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
  const [, setMap] = useState<mapboxgl.Map>();
  const [webGLError, setWebGLError] = useState(false);
  const mapNode = useRef(null);

  // https://dev.to/dqunbp/using-mapbox-gl-in-react-with-next-js-2glg
  useEffect(() => {
    if (!webgl_support()) {
      setWebGLError(true);
      return;
    }

    const node = mapNode.current;
    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: AccessToken,
      style: "mapbox://styles/mapbox/streets-v11",
      center: coordinates,
      zoom: 9,
    });

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
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

  return <div ref={mapNode} style={{ width: "100%", height: "400px" }} />;
};

export default MapDisplay;
