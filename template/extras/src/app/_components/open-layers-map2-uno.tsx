"use client";
import { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import StadiaMaps from "ol/source/StadiaMaps";

interface Map2Props {
    setMap2Object: (map: Map | null) => void;
}

const Map2: React.FC<Map2Props> = ({ setMap2Object }) => {
    const map2Container = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!map2Container.current) return;

        // Initialize the map
        const map2 = new Map({
            layers: [
                new TileLayer({
                    source: new StadiaMaps({
                        layer: "stamen_watercolor",
                    }),
                }),
                new TileLayer({
                    source: new StadiaMaps({
                        layer: "stamen_terrain_labels",
                    }),
                }),
            ],
            view: new View({
                // Coordinate System: WGS 84 / Pseudo-Mercator (EPSG:3857)
                center: [8546575.886939, 2137169.681579], // Longitude, Latitude
                zoom: 6,
            }),
        });

        // Set the map target
        map2.setTarget(map2Container.current);

        // Pass the map object to the parent
        setMap2Object(map2);

        // Cleanup on unmount
        return () => {
            map2.setTarget(undefined);
            setMap2Object(null);
        };
    }, [setMap2Object]);

    return <div ref={map2Container} className="absolute inset-0" />;
};

export default Map2;
