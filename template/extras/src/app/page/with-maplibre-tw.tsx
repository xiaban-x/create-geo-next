import * as React from 'react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

function App() {
  const mapKey = process.env.NEXT_PUBLIC_MAP_KEY;
  return (
      <Map
          initialViewState={{
            longitude: -122.4,
            latitude: 37.8,
            zoom: 14
          }}
          className={"w-[600px] h-[400px]"}
          mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${mapKey}`}
      />
  );
}