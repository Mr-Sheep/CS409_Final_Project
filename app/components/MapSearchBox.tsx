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
      const locationData = {
        address: feature.properties.name || "",
        full_address: feature.properties.full_address || "",
        latitude: feature.geometry.coordinates[1] || 0,
        longitude: feature.geometry.coordinates[0] || 0,
        mapbox_id: feature.properties.mapbox_id,
      };
      onSelectLocation(locationData);
      setValue(locationData.address);
    }
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
      />
    </div>
  );
};

export default MapSearchBox;
