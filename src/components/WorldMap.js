import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Graticule, Sphere } from "react-simple-maps";
// progress bar
import { Button, InputNumber, Progress } from "antd";

const geoUrl = 
"https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const progressStatus = {
    Idle: 'Idle',
    Tracking: 'Tracking...',
    Complete: 'Complete'
}

const WorldMap = ( {selectedSatellites} ) => {
    
    const [duration, setDuration] = useState(1);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [progressText, setProgressText] = useState(progressStatus.Idle);

    const trackOnClick = () => {
        setProgressText(`Tracking for ${duration} minutes`);
        setProgressPercentage(0);
        let curMin = 0;
        const timerId = setInterval(() => {
            setProgressPercentage((curMin / duration) * 100);
            if (curMin === duration) {
                setProgressText(progressStatus.Complete);
                clearInterval(timerId);
            }
            curMin++;
        }, 1000);
    }
    
    return (
        <>

            <div className="track-info-panel">
                <Button type="ghost" onClick={trackOnClick} disabled={selectedSatellites.length === 0}>Track selected satellites</Button>
                <span style={{ marginLeft: "10px", marginRight: "10px" }}>for</span>
                <InputNumber min={1} max={50} defaultValue={1} onChange={(value) => setDuration(value)}/>
                <span style={{ marginLeft: "10px", marginRight: "30px" }}>minutes</span>
                <Progress style={{ width: "500px" }} percent={progressPercentage} format={() => progressText}/>
            </div>


            <ComposableMap 
                projectionConfig={{ scale: 145 }} 
                style={{ height: "850px", marginTop: "-10px", marginLeft: "68px", marginBottom: "-200px" }}>
                    <Graticule stroke="#DDD" strokeWidth={0.5} />
                    <Sphere stroke="#DDD" strokeWidth={0.5} />
                    <Geographies geography={geoUrl}>
                        {
                            ({ geographies }) => 
                                geographies.map(geo => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill="#DDD"
                                        stroke="#FFF"
                                    />
                                ))
                        }
                    </Geographies>
            </ComposableMap>

        </>
    )
}

export default WorldMap;