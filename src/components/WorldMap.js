import React, { useState, useRef } from "react";
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

const WorldMap = ( { selectedSatellites, setTracking, disabled } ) => {
    
    const [duration, setDuration] = useState(1);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [progressText, setProgressText] = useState(progressStatus.Idle);
    // cannot use const [timerId, setTimerId], will cause weird flashing errors
    // when doing setTimerId(setInterval(...clearInterval(timerId)...setTimerId(undefined)))?
    // cannot use let timerId = undefined. Somehow, some functions cannot sense the change in timerId
    // useRef is a good wrapper to use here
    const timerIdContainer = useRef(undefined);
    
    const abortOnClick = () => {
        if (timerIdContainer.current) {
            clearInterval(timerIdContainer.current);
            setProgressPercentage(0);
            setProgressText(progressStatus.Idle);
            setTracking(false);
            timerIdContainer.current = undefined;
        }
    }

    const trackOnClick = () => {
        setProgressText(`Tracking for ${duration} minutes`);
        setProgressPercentage(0);
        setTracking(true);
        let curMin = 0;
        // return a timer id
        timerIdContainer.current = setInterval(() => {
            setProgressPercentage((curMin / duration) * 100);
            if (curMin === duration) {
                setProgressText(progressStatus.Complete);
                setTracking(false);
                clearInterval(timerIdContainer.current);
                timerIdContainer.current = undefined;
            }
            curMin++;
        }, 1000);
    }
    
    return (
        <>

            <div className="track-info-panel">
                <Button type="ghost" onClick={trackOnClick} disabled={selectedSatellites.length === 0 || disabled}>Track selected satellites</Button>
                <span style={{ marginLeft: "10px", marginRight: "10px" }}>for</span>
                <InputNumber style={{width: "60px"}} min={1} max={50} defaultValue={1} onChange={(value) => setDuration(value)} disabled={disabled}/>
                <span style={{ marginLeft: "10px", marginRight: "30px" }}>minutes</span>
                <Progress style={{ width: "500px" }} percent={progressPercentage} format={() => progressText}/>
                {/* abort would remain visible at completion if using the line below */}
                {/* { timerIdContainer.current && <Button type="ghost" onClick={abortOnClick} style={{marginLeft: "140px"}}>Abort</Button>} */}
                { disabled && <Button type="ghost" onClick={abortOnClick} style={{marginLeft: "140px"}}>Abort</Button>}

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