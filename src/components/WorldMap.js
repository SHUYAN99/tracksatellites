import React, { useState, useRef } from "react";
import { ComposableMap, Geographies, Geography, Graticule, Sphere, Marker } from "react-simple-maps";
// progress bar
import { Button, InputNumber, Progress } from "antd";
import { N2YO_API_KEY, N2YO_BASE_URL } from "../constants";

export const POSITION_API_BASE_URL = `${N2YO_BASE_URL}/positions`;

const geoUrl = 
"https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const progressStatus = {
    Idle: 'Idle',
    Tracking: 'Tracking...',
    Complete: 'Complete'
}

const WorldMap = ( { selectedSatellites, setTracking, disabled, observerInfo } ) => {
    
    const [duration, setDuration] = useState(1);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [progressText, setProgressText] = useState(progressStatus.Idle);
    // cannot use const [timerId, setTimerId], will cause weird flashing errors
    // when doing setTimerId(setInterval(...clearInterval(timerId)...setTimerId(undefined)))?
    // cannot use let timerId = undefined. Somehow, some functions cannot sense the change in timerId
    // useRef is a good wrapper to use here
    const timerIdContainer = useRef(undefined);
    const [markersInfo, setMarkersInfo] = useState([]);
    const [currentTimestamp, setCurrentTimestamp] = useState('');
    
    const abortOnClick = () => {
        if (timerIdContainer.current) {
            clearInterval(timerIdContainer.current);
            setProgressPercentage(0);
            setProgressText(progressStatus.Idle);
            setTracking(false);
            timerIdContainer.current = undefined;
        }
    }

    const fetchPositions = () => {
        const { longitude, latitude, altitude } = observerInfo;
        return selectedSatellites.map(
            (sat) => {
                const id = sat.satid;
                return fetch(`${POSITION_API_BASE_URL}/${id}/${latitude}/${longitude}/${altitude}/${duration * 60}/&apiKey=${N2YO_API_KEY}`).then(response => response.json());
            }
        )
    }

    const updateMarker = (data, index) => {
        setMarkersInfo(data.map((sat) => {
            return {
                lon: sat.positions[index].satlongitude,
                lat: sat.positions[index].satlatitude,
                name: sat.info.satname
            }
        }))
    }
    const startTracking = (data) => {
        let index = 59;
        let end = data[0].positions.length - 1;
        setTracking(true);

        setCurrentTimestamp(new Date(data[0].positions[index].timestamp * 1000).toString());
        setProgressPercentage((index / end) * 100);
        updateMarker(data, index);
        
        timerIdContainer.current = setInterval(() => {
            index += 60;
            setProgressPercentage((index / end) * 100);
            if (index >= end) {
                setProgressText(progressStatus.Complete);
                setTracking(false);
                clearInterval(timerIdContainer.current);
                timerIdContainer.current = undefined;
                return; // if not returning, codes below (outside if) will still
                // be executed on the last run, which is unnecessary
            }

            updateMarker(data, index);
            setCurrentTimestamp(new Date(data[0].positions[index].timestamp * 1000).toString());

        }, 1000);
    }

    const trackOnClick = () => {
        setProgressText(progressStatus.Tracking);
        setProgressPercentage(0);

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
        Promise.all(fetchPositions()).then(
            (data) => {
                // console.log(data);
                startTracking(data);
            }
        ).catch(
            () => {
                // TODO: add some fallback UI handler here
            }
        )
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
                { disabled && <Button type="ghost" onClick={abortOnClick} style={{marginLeft: "60px"}}>Abort</Button>}

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
                    {
                        markersInfo.map(
                            (marker) => 
                            <Marker coordinates={[marker.lon, marker.lat]}>
                                <circle r={4} fill="#F53" />
                                <text>{marker.name}</text>
                            </Marker>
                        )
                    }
            </ComposableMap>
            <div className="time-stamp-container" style={{textAlign: "center", marginTop: "60px"}}>
                <b>{currentTimestamp}</b>
            </div>
        </>
    )
}

export default WorldMap;