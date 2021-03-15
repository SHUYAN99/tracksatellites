import React from "react";
import { ComposableMap, Geographies, Geography, Graticule, Sphere } from "react-simple-maps";
// progress bar
import { Button, InputNumber, Progress } from "antd";

const geoUrl = 
"https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const WorldMap = () => {
    return (
        <>

            <div className="track-info-panel">
                <Button type="ghost">Track selected satellites</Button>
                <span style={{ marginLeft: "10px", marginRight: "10px" }}>for</span>
                <InputNumber min={1} max={50} defaultValue={1}/>
                <span style={{ marginLeft: "10px", marginRight: "30px" }}>minutes</span>
                <Progress style={{ width: "500px" }}/>
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