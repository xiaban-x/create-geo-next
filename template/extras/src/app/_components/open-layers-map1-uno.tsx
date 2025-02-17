"use client";
import { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

interface Map1Props {
    setMap1Object: (map: Map | null) => void;
}

const Map1: React.FC<Map1Props> = ({ setMap1Object }) => {
    const map1Container = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!map1Container.current) return;

        // Initialize the map
        const map1 = new Map({
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                // Coordinate System: WGS 84 / Pseudo-Mercator (EPSG:3857)
                center: [8546575.886939, 2137169.681579], // Longitude, Latitude
                zoom: 6,
            }),
        });

        // Set the map target
        map1.setTarget(map1Container.current);

        // Pass the map object to the parent
        setMap1Object(map1);

        // Cleanup on unmount
        return () => {
            map1.setTarget(undefined);
            setMap1Object(null);
        };
    }, [setMap1Object]);

    return <div ref={map1Container} className="absolute inset-0" />;
};

export default Map1;
