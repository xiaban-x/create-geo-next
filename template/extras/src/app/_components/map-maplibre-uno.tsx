"use client"

import * as React from 'react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapContainer() {
    return (
        <div className={"w-full h-100vh"}>
            <Map
                initialViewState={{
                    longitude: -122.4,
                    latitude: 37.8,
                    zoom: 14
                }}
                mapStyle={`https://demotiles.maplibre.org/style.json`}
            />
        </div>
    );
}