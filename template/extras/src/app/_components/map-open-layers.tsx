'use client';

import { useEffect, useState } from "react";
// @ts-ignore
import Synchronize from "ol-ext/interaction/Synchronize";
import Map1 from "~/app/_components/map1";
import Map2 from "~/app/_components/map2";
import "ol-ext/dist/ol-ext.css";
import Map from "ol/Map";

const MapContainer= () => {
    const [map1Object, setMap1Object] = useState<Map | null>(null);
    const [map2Object, setMap2Object] = useState<Map | null>(null);

    useEffect(() => {
        if (!map1Object || !map2Object) return;

        // Synchronize interactions between maps
        const synchronize12 = new Synchronize({ maps: [map2Object] });
        const synchronize21 = new Synchronize({ maps: [map1Object] });

        map1Object.addInteraction(synchronize12);
        map2Object.addInteraction(synchronize21);

        return () => {
            map1Object.removeInteraction(synchronize12);
            map2Object.removeInteraction(synchronize21);
        };
    }, [map1Object, map2Object]);

    return (
        <div className="map-container">
            <div className="map-wrapper">
                <Map1 setMap1Object={setMap1Object}/>
            </div>
            <div className="map-wrapper">
                <Map2 setMap2Object={setMap2Object}/>
            </div>
        </div>
    );
};

export default MapContainer;