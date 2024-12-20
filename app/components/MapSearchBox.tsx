import { SearchBox } from "@mapbox/search-js-react";
import { useState } from "react";
import type { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";

const AccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "something";

// https://docs.mapbox.com/mapbox-search-js/api/react/search/#searchboxprops
interface MapSearchBoxProps {
  onSelectLocation: (location: {
    address: string;
    full_address: string;
    latitude: number;
    longitude: number;
    mapbox_id: string;
  }) => void;
}

const MapSearchBox = ({ onSelectLocation }: MapSearchBoxProps) => {
  const [value, setValue] = useState("");

  const handleChange = (result: SearchBoxRetrieveResponse) => {
    console.log(result.features[0]);
    if (result && result.features && result.features[0]) {
      const feature = result.features[0];

      const fa =
        feature.properties.full_address === ""
          ? feature.properties.full_address
          : feature.properties.name;
      const locationData = {
        address: feature.properties.name || "",
        full_address: fa || "",
        latitude: feature.geometry.coordinates[1] || 0,
        longitude: feature.geometry.coordinates[0] || 0,
        mapbox_id: feature.properties.mapbox_id,
      };
      onSelectLocation(locationData);
      setValue(locationData.address);
    }
  };

  const theme = {
    variables: {
      padding: "1em",
      borderRadius: "0.5rem",
      boxShadow: "0 0 0 1px silver",
      width: "100%",
      duration: "150ms",
      unit: "14px",
      unitHeader: "18px",
      lineHeight: "2.0",
    },
  };

  return (
    <div>
      {/* @ts-expect-error Server Component */}
      <SearchBox
        accessToken={AccessToken}
        options={{
          language: "en",
          country: "US",
        }}
        value={value}
        onRetrieve={handleChange}
        theme={theme}
      />
    </div>
  );
};

export default MapSearchBox;
