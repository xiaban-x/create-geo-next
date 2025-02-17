"use client"

import * as React from 'react';
import Map from 'react-map-gl/mapbox';
// If using with mapbox-gl v1:
// import Map from 'react-map-gl/mapbox-legacy';
import 'mapbox-gl/dist/mapbox-gl.css';
import {env} from "~/env"

export default function MapContainer() {
    return (
        <div className={"w-full h-100vh"}>
            <Map
                mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                initialViewState={{
                    longitude: -122.4,
                    latitude: 37.8,
                    zoom: 14
                }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            />
        </div>
    );
}