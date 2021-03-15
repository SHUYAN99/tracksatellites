import React from "react";
import Title from "antd/lib/typography/Title";
import { List, Checkbox, Avatar } from "antd";
import satelliteImage from "../images/satellite.svg";

const SatelliteList = ({
    satList,
    updateSatelliteList
}) => {

    // function to update selected / unselected satellites
    const onSelectionChange = (checked, targetSatellite) => {

        // get the next version of satellite list
        const nextSatelliteList = satList.map((satellite) => {
            if (satellite.satid === targetSatellite.satid) {
                return {
                    ...satellite,
                    selected: checked
                }
            } else {
                return {
                    ...satellite
                }
            }
        });

        updateSatelliteList(nextSatelliteList);
    }

    return (
        <div className="satellite-list-container">
            <Title level={5}>&nbsp; Select satellites. ({satList? satList.length : 0})</Title>
            {/* <hr /> */}
            <List
                className="sat-list"
                itemLayout="horizontal"
                dataSource={satList}
                renderItem={
                    item => (
                        <List.Item actions={[<Checkbox onChange={(e) => onSelectionChange(e.target.checked, item)} checked={item.selected} />]}>
                            <List.Item.Meta
                                avatar={<Avatar src={satelliteImage} size="large" alt="satellite"/>}
                                title={<p>{item.satname}</p>}
                                // template string below using ` instead of single or double quotes
                                // https://stackoverflow.com/questions/33679732/difference-if-there-is-any-between-and-in-javascript
                                description={`Launch Date: ${item.launchDate}`}
                            />
                        </List.Item>
                    )
                }/>
        </div>
    )
}

export default SatelliteList;