"use client"

import * as React from 'react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapContainer() {
    return (
        <Map
            initialViewState={{
                longitude: -122.4,
                latitude: 37.8,
                zoom: 14
            }}
            // className={"w-[600px] h-[400px]"}
            style={{width: "100%", height: "100vh"}}
            mapStyle={`https://demotiles.maplibre.org/style.json`}
        />
    );
}