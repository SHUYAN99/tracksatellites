import React, { useState } from "react";
import { Col, Row } from 'antd';
import ObserverInfo from "./ObserverInfo";
import { SAT_CATEGORY, N2YO_API_KEY, N2YO_BASE_URL } from "../constants";

export const ABOVE_API_BASE_URL = "${N2YO_BASE_URL}/above";

const Main = () => {

    const [satList, setSatList] = useState([]);
    const findSatellitesOnClick = (nextObserverInfo) => {
        const { longitude, latitude, altitude, radius } = nextObserverInfo;
        fetch("${ABOVE_API_BASE_URL}/${latitude}/${longitude}/${altitude}/${radius}/${SAT_CATEGORY}&{N2YO_API_KEY}")
        .then(response => response.json())
        .then(data => {
            setSatList(data.above.map((satellite) => {
                return {
                    ...satellite,
                    selected: false
                }
            }));
        })
        .catch(() => {
            // do things when API call fails
        });
    }

    return (
        <Row>
            <Col span={6}>
                <ObserverInfo
                    findSatellitesOnClick={findSatellitesOnClick} 
                />
            </Col>
            <Col span={16}>
                WorldMap
            </Col>
        </Row>
    )
}

export default Main;