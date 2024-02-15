import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import "./Devices.css"
import ApiServices from '../services/apiServices';
import { checkColor, checkDateDifferences, checkOneDayDifferences, getToken } from '../utils/constant';

export default function Devices() {
    let navigate = useNavigate()
    const { id } = useParams();
    const location = useLocation();
    const deviceNameData = location.state;

    const [deviceData, setDeviceData] = useState();

    useEffect(() => {
        const getDeviceDataAPI = async () => {
            try {
                let body = {
                    "accesskey": getToken(),
                    "imeino": id
                }
                const data = await ApiServices.callDeviceData(body)
                if (!data?.result?.device) {
                    navigate(`/dashboard`)
                } else {
                    if (deviceNameData.device_info == "6.6 KV INCOMER2 FDR-7" || deviceNameData.device_info == "6.6KV INCOMER1 FDR-3" || deviceNameData.device_info == "3.3 KV INCOMER1 FDR-3") {
                        setDeviceData({
                            "device_info": deviceNameData?.device_info, "update_time": deviceNameData?.update_time,
                            "datalength": "N/A",
                            "voltage_r": "N/A",
                            "voltage_y": "N/A",
                            "voltage_b": "N/A",
                            "amp_r": "N/A",
                            "amp_y": "N/A",
                            "amp_b": "N/A",
                            "kw": "N/A",
                            "pf": "N/A",
                            "frequency": "N/A",
                            "kva": "N/A",
                            "kwh": "N/A",
                            "spare_1": "N/A",
                            "spare_2": "N/A",
                            "input_1": "N/A",
                            "input_2": "N/A",
                            "input_3": "N/A",
                            "supply": "N/A"
                        });
                    }
                    else {
                        setDeviceData(data?.result?.device)
                    }

                }
            } catch (err) {
                console.log(">>deviceData err")
            }
        }
        getDeviceDataAPI();
        const interval = setInterval(() => {
            getDeviceDataAPI()
        }, 20000);
        return () => clearInterval(interval);
    }, [])



    return (
        <div className="row mt-3 mb-2 justify-content-around" style={{ top: "6rem", position: "relative", margin: "0" }}>
            <svg style={{ width: "30%" }} version="1.1" id="Layer_1" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 800 1000" xmlSpace="preserve">
                <polygon points="398.8,825.2 389.5,802.4 408.6,802.3 " className="st0"></polygon>
                <circle cx="399.2" cy="152.7" r="4" className="st1"></circle>
                <path data-v-a9df0050="" d="M277.9,123.9v14.8l0.3,2.1c0.2,1.5,0.8,3,1.6,4.3l0.4,0.7c1.3,1.6,2.4,3,4.1,3.9l0.6,0.2
            c2.2,0.8,4.5,1.3,6.9,1.6l2.3,0.3H508c2.5,0,5.1-0.3,7.5-0.8v0c1.4-0.3,2.6-0.9,3.6-1.9v0c1.3-1.2,2.1-2.8,2.4-4.6l0-0.1
            c0.3-1.9,0.5-3.8,0.6-5.8l0,0v-14.8" className="st1"></path>
                <line data-v-a9df0050="" x1="399.7" y1="152.3" x2="399.7" y2="322" className="st1"></line>
                <line data-v-a9df0050="" x1="399.7" y1="583.1" x2="399.7" y2="350" className="st1"></line>
                <line data-v-a9df0050="" x1="399.7" y1="806.5" x2="399.7" y2="644.5" className="st1"></line>
                <text data-v-a9df0050="" transform="matrix(1 0 0 1 50 121.0147)" className="st3 st4">
                    <tspan data-v-a9df0050="" id="C_TEXT_TOP" x="40" y="-40" fontSize="4rem" className="st3 st4">{deviceData?.device_info}</tspan>
                </text>
                <rect x="350" y="300" width="100" height="100" className={deviceNameData?.update_time ? deviceNameData?.imei_no == id && checkOneDayDifferences(deviceNameData?.update_time) ? 'color-black-fast' : checkDateDifferences(deviceNameData?.update_time) ? 'color-black' : checkColor(deviceNameData?.input_1, deviceNameData?.input_3) : 'color-black'} />
                <text data-v-a9df0050="" transform="matrix(1 0 0 1 475 360)" className="rtu">IoT-{deviceNameData?.map_id.split('C_')[1]} ({!deviceNameData?.update_time || checkDateDifferences(deviceNameData?.update_time) ? 'Disconnected' : 'Connected'})</text>
                <text data-v-a9df0050="" id="BREAKER_RTU" transform="matrix(1 0 0 1 310 625)" className="poweron">Power ON</text>
                <rect x="210" y="850" width="400" height="60" rx="10" ry="10" style={{ fill: "#dc3545", strokeWidth: "3", stroke: "#dc3545", cursor: "pointer" }} />
                <text x="410" y="890" textAnchor="middle" fill="white" className="breaker-btn">EMERGENCY BREAKER OFF</text>
            </svg>

            <h3 className="text-center device-header-data" style={{ color: "rgb(204, 0, 0)", position: "absolute", fontSize: "2rem" }}>{deviceData?.device_info} METER DATA</h3>
            <div className="col-md-4 col-sm-6 col-xs-6 text-right table-data">
                <div className="table-responsive" style={{ margin: "5rem 0" }}>
                    <table role="table" className="table b-table table-hover table-sm b-table-caption-top" id="__BVID__28">
                        <thead role="rowgroup" className="thead-dark">
                            <tr role="row" className="">
                                <th role="columnheader" scope="col" className="text-left">Parameters</th>
                                <th role="columnheader" scope="col" className="">Value</th>
                            </tr>
                        </thead>
                        <tbody role="rowgroup">
                            <tr role="row" className="" style={{ backgroundColor: "lightgrey", color: '#800000' }}>
                                <th role="rowheader" scope="row" className="text-left">Last Available Date & Time</th>
                                <td role="cell" className=""> {deviceData?.update_time ? new Date(deviceData?.update_time).toLocaleDateString() + ' ' + new Date(deviceData?.update_time).toLocaleTimeString() : 'N/A'}</td>
                            </tr>
                            <tr role="row" className="">
                                <th role="rowheader" scope="row" className="text-left">Voltage R</th>
                                <td role="cell" className="">{checkDateDifferences(deviceNameData?.update_time) || deviceData?.voltage_r === 'N/A' ? 'N/A' : (deviceData?.voltage_r / 1000)}</td>
                            </tr>
                            <tr role="row" className="">
                                <th role="rowheader" scope="row" className="text-left">Voltage Y</th>
                                <td role="cell" className="">{checkDateDifferences(deviceNameData?.update_time) || deviceData?.voltage_y === 'N/A' ? 'N/A' : (deviceData?.voltage_y / 1000)}</td>
                            </tr>
                            <tr role="row" className="">
                                <th role="rowheader" scope="row" className="text-left">Voltage B</th>
                                <td role="cell" className="">{checkDateDifferences(deviceNameData?.update_time) || deviceData?.voltage_b === 'N/A' ? 'N/A' : (deviceData?.voltage_b / 1000)}</td>
                            </tr>
                            <tr role="row" className="">
                                <th role="rowheader" scope="row" className="text-left">Current R</th>
                                <td role="cell" className="">{checkDateDifferences(deviceNameData?.update_time) || deviceData?.amp_r === 'N/A' ? 'N/A' : deviceData?.amp_r}</td>
                            </tr>
                            <tr role="row" className="">
                                <th role="rowheader" scope="row" className="text-left">Current Y</th>
                                <td role="cell" className="">{checkDateDifferences(deviceNameData?.update_time) || deviceData?.amp_y === 'N/A' ? 'N/A' : deviceData?.amp_y}</td>
                            </tr>
                            <tr role="row" className="">
                                <th role="rowheader" scope="row" className="text-left">Current B</th>
                                <td role="cell" className="">{checkDateDifferences(deviceNameData?.update_time) || deviceData?.amp_b === 'N/A' ? 'N/A' : deviceData?.amp_b}</td>
                            </tr>
                            <tr role="row" className="">
                                <th role="rowheader" scope="row" className="text-left">Total KW</th>
                                <td role="cell" className="">{checkDateDifferences(deviceNameData?.update_time) || deviceData?.kw === 'N/A' ? 'N/A' : deviceData?.kw}</td>
                            </tr>
                            <tr role="row" className="">
                                <th role="rowheader" scope="row" className="text-left">Total PF</th>
                                <td role="cell" className="">{checkDateDifferences(deviceNameData?.update_time) || deviceData?.pf === 'N/A' ? 'N/A' : deviceData?.pf}</td>
                            </tr>
                            <tr role="row" className="">
                                <th role="rowheader" scope="row" className="text-left">Frequency</th>
                                <td role="cell" className="">{checkDateDifferences(deviceNameData?.update_time) || deviceData?.frequency === 'N/A' ? 'N/A' : (deviceData?.frequency / 100)}</td>
                            </tr>
                            <tr role="row" className="">
                                <th role="rowheader" scope="row" className="text-left">Total KVA</th>
                                <td role="cell" className="">{checkDateDifferences(deviceNameData?.update_time) || deviceData?.kva === 'N/A' ? 'N/A' : deviceData?.kva}</td>
                            </tr>
                            <tr role="row" className="">
                                <th role="rowheader" scope="row" className="text-left">KWH IMP</th>
                                <td role="cell" className="">{checkDateDifferences(deviceNameData?.update_time) || deviceData?.kwh === 'N/A' ? 'N/A' : deviceData?.kwh}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

