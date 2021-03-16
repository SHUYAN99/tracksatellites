import React, { useState } from "react";
import { Col, Row } from 'antd';
import ObserverInfo from "./ObserverInfo";
import { SAT_CATEGORY, N2YO_API_KEY, N2YO_BASE_URL } from "../constants";
import SatelliteList from "./SatelliteList";
import WorldMap from "./WorldMap";

export const ABOVE_API_BASE_URL = `${N2YO_BASE_URL}/above`;

const Main = () => {

    const [loading, setLoading] = useState(false);
    const [satList, setSatList] = useState([]);
    const [tracking, setTracking] = useState(false);
    const [observerInfo, setObserverInfo] = useState({});

    const findSatellitesOnClick = (nextObserverInfo) => {
        
        setLoading(true);

        setObserverInfo(nextObserverInfo);
        const { longitude, latitude, altitude, radius } = nextObserverInfo;
        
        fetch(`${ABOVE_API_BASE_URL}/${latitude}/${longitude}/${altitude}/${radius}/${SAT_CATEGORY}/&apiKey=${N2YO_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            setSatList(data.above.map((satellite) => {
                return {
                    ...satellite,
                    selected: false
                }
            }));
            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
            // do things when API call fails
        });
    }

    return (
        <Row>
            <Col span={8}>
                <ObserverInfo
                    findSatellitesOnClick={findSatellitesOnClick} 
                    loading={loading}
                    disabled={tracking}
                />
                <SatelliteList
                    satList={satList}
                    updateSatelliteList={setSatList}
                    loading={loading}
                    disabled={tracking}
                />
            </Col>
            <Col span={16}>
                <WorldMap
                    selectedSatellites={satList.filter(sat => sat.selected)} 
                    setTracking={setTracking}
                    disabled={tracking}
                    observerInfo={observerInfo}
                />
            </Col>
        </Row>
    )
}

export default Main;