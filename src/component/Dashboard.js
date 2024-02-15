import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import photo from "./../images/industry.png"
import apiServices from '../services/apiServices';
import { checkColor, checkDateDifferences, checkOneDayDifferences, getToken,} from "../utils/constant";
import Crane from "../images/excavator.png";
import "./Devices.css"

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState([]);
    const [iot1, IOT_1] = useState([]);
    const [iot2, IOT_2] = useState([]);
    const [iot3, IOT_3] = useState([]);
    const [iot4, IOT_4] = useState([]);
    const [iot5, IOT_5] = useState([]);
    const [iot6, IOT_6] = useState([]);
    const [iot7, IOT_7] = useState([]);
    const [iot8, IOT_8] = useState([]);
    const [iot9, IOT_9] = useState([]);
    const [iot10, IOT_10] = useState([]);
    const [iot11, IOT_11] = useState([]);
    const [iot12, IOT_12] = useState([]);
    const [iot13, IOT_13] = useState([]);
    const [iot14, IOT_14] = useState([]);
    const [iot15, IOT_15] = useState([]);
    let navigate = useNavigate()
    const handleDevice = (data) => {
        const filteredData = dashboardData?.length > 0 && dashboardData?.filter((item) => {
            return item?.imei_no?.toLowerCase().includes(data.toLowerCase());
        });

        navigate(`/devices/${data}`, { state: filteredData[0] })
    };


    useEffect(() => {
        // Move to login.
        if(getToken() == null){
            navigate(`/`);
        }
        const getDashboardAPI = async () => {
            try {
                let body = {
                    "accesskey": getToken(), "state_perm": ""
                }
                const data = await apiServices.callDashboardData(body)
                setDashboardData(data?.result?.devices)
                data?.result?.devices?.length > 0 && data?.result?.devices?.map((data) => {
                    if (data?.map_id == 'C_1') {
                        IOT_1(data)
                    } else if (data?.map_id == 'C_2') {
                        IOT_2(data)
                    } else if (data?.map_id == 'C_3') {
                        IOT_3(data)
                    } else if (data?.map_id == 'C_4') {
                        IOT_4(data)
                    } else if (data?.map_id == 'C_5') {
                        IOT_5(data)
                    } else if (data?.map_id == 'C_6') {
                        IOT_6(data)
                    } else if (data?.map_id == 'C_7') {
                        IOT_7(data)
                    } else if (data?.map_id == 'C_8') {
                        IOT_8(data)
                    } else if (data?.map_id == 'C_9') {
                        IOT_9(data)
                    } else if (data?.map_id == 'C_10') {
                        IOT_10(data)
                    } else if (data?.map_id == 'C_11') {
                        IOT_11(data)
                    } else if (data?.map_id == 'C_12') {
                        IOT_12(data)
                    } else if (data?.map_id == 'C_13') {
                        IOT_13(data)
                    } else if (data?.map_id == 'C_14') {
                        IOT_14(data)
                    } else if (data?.map_id == 'C_15') {
                        IOT_15(data)
                    }
                })
            } catch (err) {
                console.log(">>dashboard err")
            }
        }
        getDashboardAPI();
        const interval = setInterval(() => {
            getDashboardAPI()
        }, 20000);
        return () => clearInterval(interval);
    }, [])


    return (
        <div>
            <div id="device-list" className="mt-30" style={{display:"flex" , flexDirection:"row"}}>

                <svg className="d-sm-block main-image" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1500 1079" style={{ enableBackground: "new 0 0 1500 1079" }} xmlSpace="preserve">

                    <g id="Layer_2">
                        <text transform="matrix(1 0 0 1 240 69.2017)">
                            <tspan x="0" y="0" className="iotdetail">MSS1</tspan>
                            <tspan x="-0.3" y="20.29" className="iotdetail">11 KV</tspan>
                            <tspan x="-1.67" y="40.58" className="iotdetail">VCB-3</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 336 93.7173)" className="iot">IoT-1</text>
                        <text transform="matrix(1 0 0 1 965 69.2027)">
                            <tspan x="0" y="0" className="iotdetail">MSS 2</tspan>
                            <tspan x="1.5" y="20.29" className="iotdetail">11 KV</tspan>
                            <tspan x="0.13" y="40.58" className="iotdetail">VCB-7</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 1071 93.7173)" className="iot">IoT-2</text>
                        <text transform="matrix(1 0 0 1 650 131.9009)" className="transformer bold">11KV BUS COUPLER</text>
                        <text transform="matrix(1 0 0 1 700 203.3697)">
                            <tspan x="0" y="0" className="iotdetail">11 KV</tspan>
                            <tspan x="-1.37" y="20.29" className="iotdetail">VCB-4</tspan>
                        </text>


                        <text transform="matrix(1 0 0 1 156.8462 352.9869)">
                            <tspan x="0" y="0" className="transformer">11 KV / 3.3 KV</tspan>
                            <tspan x="-0.14" y="20.29" className="transformer">2.5 MVA TRF3</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 508 352.9859)">
                            <tspan x="0" y="0" className="transformer">11 KV / 6.6 KV</tspan>
                            <tspan x="-0.14" y="20.29" className="transformer">6.3 MVA TRF1</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 290 802.0562)">
                            <tspan x="0" y="0" className="transformer">6.6 KV / 440V</tspan>
                            <tspan x="1.79" y="20.29" className="transformer">500 KVA TRF</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 1150 352.9869)">
                            <tspan x="0" y="0" className="transformer">11 KV / 6.6 KV</tspan>
                            <tspan x="-1.93" y="20.29" className="transformer">6.3 MVA TRF 2</tspan>
                        </text>




                        <text transform="matrix(1 0 0 1 135.2178 245.5338)" className="iot">IoT-5</text>

                        <text transform="matrix(1 0 0 1 39.5488 231.1627)">
                            <tspan x="0" y="0" className="iotdetail">11 KV</tspan>
                            <tspan x="-1.37" y="20.29" className="iotdetail">VCB-1</tspan>
                        </text>

                        <text transform="matrix(1 0 0 1 37.7744 460.5054)">
                            <tspan x="0" y="0" className="iotdetail">3.3 KV</tspan>
                            <tspan x="0.38" y="20.29" className="iotdetail">VCB-3</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 135.2197 474.8755)" className="iot">IoT-8</text>

                        <text transform="matrix(1 0 0 1 37.7734 610.7457)">
                            <tspan x="0" y="0" className="iotdetail">3.3 KV</tspan>
                            <tspan x="0.38" y="20.29" className="iotdetail">VCB-2</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 128.7129 625.1168)" className="iot">IoT-15</text>

                        <text transform="matrix(1 0 0 1 50.1353 821.2769)" className="transformer bold">DMC NEW SS</text>
                        <svg className="d-sm-block main-image" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1500 1079" style={{ enableBackground: "new 0 0 1500 1079", marginTop: "3.5rem" }} xmlSpace="preserve">
                            <image xlinkHref={photo} width="100" height="100" x="60" y="850" />
                        </svg>
                        <text transform="matrix(1 0 0 1 385 231.1627)">
                            <tspan x="0" y="0" className="iotdetail">11 KV</tspan>
                            <tspan x="-1.37" y="20.29" className="iotdetail">VCB-2</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 485 245.5328)" className="iot">IoT-3</text>

                        <text transform="matrix(1 0 0 1 385 460.5054)">
                            <tspan x="0" y="0" className="iotdetail">6.6 KV</tspan>
                            <tspan x="0.38" y="20.29" className="iotdetail">VCB-3</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 485 474.8755)" className="iot">IoT-6</text>

                        <text transform="matrix(1 0 0 1 260 610.7466)">
                            <tspan x="0" y="0" className="iotdetail">6.6 KV</tspan>
                            <tspan x="0.38" y="20.29" className="iotdetail">VCB-1</tspan>
                        </text>

                        <text transform="matrix(1 0 0 1 544 610.7457)">
                            <tspan x="0" y="0" className="iotdetail">6.6 KV</tspan>
                            <tspan x="0.38" y="20.29" className="iotdetail">VCB-2</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 642 625.1168)" className="iot">IoT-9</text>

                        <text transform="matrix(1 0 0 1 450 763.9693)">
                            <tspan x="0" y="0" className="iotdetail">6.6 KV</tspan>
                            <tspan x="6.3" y="20.29" className="iotdetail">FS-4</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 543 778.3404)" className="iot">IoT-11</text>

                        <text transform="matrix(1 0 0 1 860 583.5855)">
                            <tspan x="0" y="0" className="iotdetail">6.6 KV</tspan>
                            <tspan x="0.38" y="20.29" className="iotdetail">VCB-4</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 800 510.1861)" className="transformer bold">6.6 KV BUS COUPLER</text>


                        <text transform="matrix(1 0 0 1 735 763.9693)">
                            <tspan x="0" y="0" className="iotdetail">6.6 KV</tspan>
                            <tspan x="6.3" y="20.29" className="iotdetail">FS-1</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 835 778.3394)" className="iot">IoT-12</text>



                        <text transform="matrix(1 0 0 1 1300 763.9693)">
                            <tspan x="0" y="0" className="iotdetail">6.6 KV</tspan>
                            <tspan x="6.3" y="20.29" className="iotdetail">FS-3</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 1400 778.3404)" className="iot">IoT-14</text>

                        <text transform="matrix(1 0 0 1 1015 763.9693)">
                            <tspan x="0" y="0" className="iotdetail">6.6 KV</tspan>
                            <tspan x="6.3" y="20.29" className="iotdetail">FS-2</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 1115 778.3404)" className="iot">IoT-13</text>

                        <text transform="matrix(1 0 0 1 1100 610.7466)">
                            <tspan x="0" y="0" className="iotdetail">6.6 KV</tspan>
                            <tspan x="0.38" y="20.29" className="iotdetail">VCB-8</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 1205 625.1168)" className="iot">IoT-10</text>

                        <text transform="matrix(1 0 0 1 1230 460.5035)">
                            <tspan x="-5" y="0" className="iotdetail">6.6 KV</tspan>
                            <tspan x="-5" y="20.29" className="iotdetail">VCB-7</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 1329 474.8755)" className="iot">IoT-7</text>

                        <text transform="matrix(1 0 0 1 1230 231.1627)">
                            <tspan x="0" y="0" className="iotdetail">11KV</tspan>
                            <tspan x="-5" y="20.29" className="iotdetail">VCB-8</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 1329 245.5318)" className="iot">IoT-4</text>

                        <text transform="matrix(1 0 0 1 450 1027.5376)">
                            <tspan x="0" y="0" className="label">6.6 KV ELECTRICAL</tspan>
                            <tspan x="36.98" y="20.29" className="label">SHOVEL</tspan>
                        </text>
                        <text transform="matrix(1 0 0 1 750 1057.6831)" className="label">BARGE HT PUMP-1</text>
                        <text transform="matrix(1 0 0 1 1030 1057.6831)" className="label">BARGE HT PUMP-2</text>
                        <text transform="matrix(1 0 0 1 1310 1057.6831)" className="label">BARGE HT PUMP-3</text>
                    </g>
                    <g id="Layer_1">
                        {/* <!-- IOT 1 --> */}
                        <g transform="matrix(1 0 0 1 100 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="211.93" y1="9.34" x2="211.93" y2="43.15" />
                                    <line className="st4" x1="211.5" y1="42.02" x2="195.72" y2="63.72" />
                                    <line className="st4" x1="211.93" y1="41.6" x2="227.71" y2="63.3" />
                                </g>
                                <g>
                                    <line className="st4" x1="211.93" y1="160.51" x2="211.93" y2="126.7" />
                                    <line className="st4" x1="211.5" y1="127.83" x2="195.72" y2="105.99" />
                                    <line className="st4" x1="211.93" y1="128.25" x2="227.71" y2="106.55" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="212.49" y1="52.45" x2="212.49" y2="68.65" />
                                    <line className="st5" x1="207.56" y1="56.82" x2="213.05" y2="51.88" />
                                    <line className="st5" x1="217" y1="57.52" x2="212.07" y2="51.74" />
                                </g>
                                <g>
                                    <line className="st5" x1="212.49" y1="117.4" x2="212.49" y2="101.2" />
                                    <line className="st5" x1="207.56" y1="113.03" x2="213.05" y2="117.96" />
                                    <line className="st5" x1="217" y1="112.33" x2="212.07" y2="117.96" />
                                </g>
                                <rect id="C_1" className={iot1?.update_time ? iot1?.map_id == 'C_1' && checkOneDayDifferences(iot1?.update_time) ? 'color-black-fast' : checkDateDifferences(iot1?.update_time) ? 'color-black' : checkColor(iot1?.input_1, iot1?.input_3) : 'color-black'} onClick={() => { handleDevice(iot1?.imei_no) }} x="196.29" y="69.21"
                                    width="31" height="31.56" ></rect>
                            </g>
                        </g>
                        {/* <!-- IOT 2 --> */}
                        <g transform="matrix(1 0 0 1 200 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="845.61" y1="9.41" x2="845.61" y2="43.22" />
                                    <line className="st4" x1="845.19" y1="42.09" x2="829.41" y2="63.79" />
                                    <line className="st4" x1="845.61" y1="41.67" x2="861.39" y2="63.37" />
                                </g>
                                <g>
                                    <line className="st4" x1="845.61" y1="160.58" x2="845.61" y2="126.77" />
                                    <line className="st4" x1="845.19" y1="127.9" x2="829.41" y2="106.06" />
                                    <line className="st4" x1="845.61" y1="128.32" x2="861.39" y2="106.62" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="846.17" y1="52.52" x2="846.17" y2="68.72" />
                                    <line className="st5" x1="841.24" y1="56.89" x2="846.74" y2="51.96" />
                                    <line className="st5" x1="850.68" y1="57.59" x2="845.75" y2="51.81" />
                                </g>
                                <g>
                                    <line className="st5" x1="846.17" y1="117.47" x2="846.17" y2="101.27" />
                                    <line className="st5" x1="841.24" y1="113.1" x2="846.74" y2="118.03" />
                                    <line className="st5" x1="850.68" y1="112.4" x2="845.75" y2="118.03" />
                                </g>
                                <rect id="C_2" onClick={() => { handleDevice(iot2?.imei_no) }} x="829.97" y="69.28" className={iot2?.update_time ? iot2?.map_id == 'C_2' && checkOneDayDifferences(iot2?.update_time) ? 'color-black-fast' : checkDateDifferences(iot2?.update_time) ? 'color-black' : checkColor(iot2?.input_1, iot2?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        {/* <!-- BUSCOUPLER --> */}
                        <g transform="matrix(1 0 0 1 150 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="-43" y1="160.84" x2="530.57" y2="160.84" />
                                    <line className="st4" x1="530.07" y1="160.72" x2="551.77" y2="176.5" />
                                    <line className="st4" x1="529.69" y1="160.96" x2="551.39" y2="145.18" />
                                </g>
                                <g>
                                    <line className="st4" x1="615" y1="160.44" x2="1157" y2="160.44" />
                                    <line className="st4" x1="615.87" y1="160.72" x2="594.03" y2="176.5" />
                                    <line className="st4" x1="616.3" y1="160.3" x2="594.6" y2="144.52" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="540.5" y1="159.74" x2="556.7" y2="159.74" />
                                    <line className="st5" x1="544.86" y1="164.67" x2="539.93" y2="159.17" />
                                    <line className="st5" x1="545.57" y1="155.23" x2="539.79" y2="160.16" />
                                </g>
                                <g>
                                    <line className="st5" x1="605.45" y1="159.74" x2="589.24" y2="159.74" />
                                    <line className="st5" x1="601.08" y1="164.67" x2="606.01" y2="159.17" />
                                    <line className="st5" x1="600.37" y1="155.23" x2="606.01" y2="160.16" />
                                </g>
                                <rect x="557.26" y="144.94" className="st4" width="31.56" height="31" />
                            </g>
                        </g>
                        {/* <!-- IOT 5 --> */}
                        <g>
                            <g>
                                <g>
                                    <line className="st4" x1="107.33" y1="160.34" x2="107.33" y2="194.16" />
                                    <line className="st4" x1="106.91" y1="193.03" x2="91.13" y2="214.73" />
                                    <line className="st4" x1="107.33" y1="192.61" x2="123.11" y2="214.3" />
                                </g>
                                <g>
                                    <line className="st4" x1="107.33" y1="311.52" x2="107.33" y2="277.7" />
                                    <line className="st4" x1="106.91" y1="278.83" x2="91.13" y2="256.99" />
                                    <line className="st4" x1="107.33" y1="279.25" x2="123.11" y2="257.56" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="107.9" y1="203.45" x2="107.9" y2="219.66" />
                                    <line className="st5" x1="102.96" y1="207.82" x2="108.46" y2="202.89" />
                                    <line className="st5" x1="112.4" y1="208.53" x2="107.47" y2="202.75" />
                                </g>
                                <g>
                                    <line className="st5" x1="107.9" y1="268.41" x2="107.9" y2="252.2" />
                                    <line className="st5" x1="102.96" y1="264.04" x2="108.46" y2="268.97" />
                                    <line className="st5" x1="112.4" y1="263.33" x2="107.47" y2="268.97" />
                                </g>
                                <rect id="C_5" onClick={() => { handleDevice(iot5?.imei_no) }} x="91.69" y="220.22" className={iot5?.update_time ? iot5?.map_id == 'C_5' && checkOneDayDifferences(iot5?.update_time) ? 'color-black-fast' : checkDateDifferences(iot5?.update_time) ? 'color-black' : checkColor(iot5?.input_1, iot5?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        {/* <!-- IOT 3 --> */}
                        <g transform="matrix(1 0 0 1 100 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="359.86" y1="160.34" x2="359.86" y2="194.16" />
                                    <line className="st4" x1="359.44" y1="193.03" x2="343.66" y2="214.73" />
                                    <line className="st4" x1="359.86" y1="192.61" x2="375.64" y2="214.3" />
                                </g>
                                <g>
                                    <line className="st4" x1="359.86" y1="311.52" x2="359.86" y2="277.7" />
                                    <line className="st4" x1="359.44" y1="278.83" x2="343.66" y2="256.99" />
                                    <line className="st4" x1="359.86" y1="279.25" x2="375.64" y2="257.56" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="360.42" y1="203.45" x2="360.42" y2="219.66" />
                                    <line className="st5" x1="355.49" y1="207.82" x2="360.99" y2="202.89" />
                                    <line className="st5" x1="364.93" y1="208.53" x2="360" y2="202.75" />
                                </g>
                                <g>
                                    <line className="st5" x1="360.42" y1="268.41" x2="360.42" y2="252.2" />
                                    <line className="st5" x1="355.49" y1="264.04" x2="360.99" y2="268.97" />
                                    <line className="st5" x1="364.93" y1="263.33" x2="360" y2="268.97" />
                                </g>
                                <rect id="C_3" onClick={() => { handleDevice(iot3?.imei_no) }} x="344.22" y="220.22" className={iot3?.update_time ? iot3?.map_id == 'C_3' && checkOneDayDifferences(iot3?.update_time) ? 'color-black-fast' : checkDateDifferences(iot3?.update_time) ? 'color-black' : checkColor(iot3?.input_1, iot3?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        {/* <!-- IOT 4 --> */}
                        <g transform="matrix(1 0 0 1 400 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="906.13" y1="160.34" x2="906.13" y2="194.16" />
                                    <line className="st4" x1="905.71" y1="193.03" x2="889.93" y2="214.73" />
                                    <line className="st4" x1="906.13" y1="192.61" x2="921.91" y2="214.3" />
                                </g>
                                <g>
                                    <line className="st4" x1="906.13" y1="311.52" x2="906.13" y2="277.7" />
                                    <line className="st4" x1="905.71" y1="278.83" x2="889.93" y2="256.99" />
                                    <line className="st4" x1="906.13" y1="279.25" x2="921.91" y2="257.56" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="906.69" y1="203.45" x2="906.69" y2="219.66" />
                                    <line className="st5" x1="901.76" y1="207.82" x2="907.26" y2="202.89" />
                                    <line className="st5" x1="911.2" y1="208.53" x2="906.27" y2="202.75" />
                                </g>
                                <g>
                                    <line className="st5" x1="906.69" y1="268.41" x2="906.69" y2="252.2" />
                                    <line className="st5" x1="901.76" y1="264.04" x2="907.26" y2="268.97" />
                                    <line className="st5" x1="911.2" y1="263.33" x2="906.27" y2="268.97" />
                                </g>
                                <rect id="C_4" onClick={() => { handleDevice(iot4?.imei_no) }} x="890.49" y="220.22" className={iot4?.update_time ? iot4?.map_id == 'C_4' && checkOneDayDifferences(iot4?.update_time) ? 'color-black-fast' : checkDateDifferences(iot4?.update_time) ? 'color-black' : checkColor(iot4?.input_1, iot4?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        {/* <!-- IOT 8 --> */}
                        <g>
                            <g>
                                <g>
                                    <line className="st4" x1="107.68" y1="389.93" x2="107.68" y2="423.74" />
                                    <line className="st4" x1="107.26" y1="422.62" x2="91.48" y2="444.31" />
                                    <line className="st4" x1="107.68" y1="422.19" x2="123.46" y2="443.89" />
                                </g>
                                <g>
                                    <line className="st4" x1="107.68" y1="541.11" x2="107.68" y2="507.29" />
                                    <line className="st4" x1="107.26" y1="508.42" x2="91.48" y2="486.58" />
                                    <line className="st4" x1="107.68" y1="508.84" x2="123.46" y2="487.14" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="108.25" y1="433.04" x2="108.25" y2="449.24" />
                                    <line className="st5" x1="103.32" y1="437.41" x2="108.81" y2="432.48" />
                                    <line className="st5" x1="112.76" y1="438.11" x2="107.83" y2="432.34" />
                                </g>
                                <g>
                                    <line className="st5" x1="108.25" y1="497.99" x2="108.25" y2="481.79" />
                                    <line className="st5" x1="103.32" y1="493.63" x2="108.81" y2="498.56" />
                                    <line className="st5" x1="112.76" y1="492.92" x2="107.83" y2="498.56" />
                                </g>
                                <rect id="C_8" onClick={() => { handleDevice(iot8?.imei_no) }} x="92.05" y="449.81" className={iot8?.update_time ? iot8?.map_id == 'C_8' && checkOneDayDifferences(iot8?.update_time) ? 'color-black-fast' : checkDateDifferences(iot8?.update_time) ? 'color-black' : checkColor(iot8?.input_1, iot8?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        {/* <!-- IOT 6 --> */}
                        <g transform="matrix(1 0 0 1 100 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="360.35" y1="389.93" x2="360.35" y2="423.74" />
                                    <line className="st4" x1="359.93" y1="422.62" x2="344.15" y2="444.31" />
                                    <line className="st4" x1="360.35" y1="422.19" x2="376.13" y2="443.89" />
                                </g>
                                <g>
                                    <line className="st4" x1="360.35" y1="541.11" x2="360.35" y2="507.29" />
                                    <line className="st4" x1="359.93" y1="508.42" x2="344.15" y2="486.58" />
                                    <line className="st4" x1="360.35" y1="508.84" x2="376.13" y2="487.14" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="360.91" y1="433.04" x2="360.91" y2="449.24" />
                                    <line className="st5" x1="355.98" y1="437.41" x2="361.48" y2="432.48" />
                                    <line className="st5" x1="365.42" y1="438.11" x2="360.49" y2="432.34" />
                                </g>
                                <g>
                                    <line className="st5" x1="360.91" y1="497.99" x2="360.91" y2="481.79" />
                                    <line className="st5" x1="355.98" y1="493.63" x2="361.48" y2="498.56" />
                                    <line className="st5" x1="365.42" y1="492.92" x2="360.49" y2="498.56" />
                                </g>
                                <rect id="C_6" onClick={() => { handleDevice(iot6?.imei_no) }} x="344.71" y="449.81" className={iot6?.update_time ? iot6?.map_id == 'C_6' && checkOneDayDifferences(iot6?.update_time) ? 'color-black-fast' : checkDateDifferences(iot6?.update_time) ? 'color-black' : checkColor(iot6?.input_1, iot6?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        {/* <!-- IOT 7 --> */}
                        <g transform="matrix(1 0 0 1 400 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="906.13" y1="389.93" x2="906.13" y2="423.74" />
                                    <line className="st4" x1="905.71" y1="422.62" x2="889.93" y2="444.31" />
                                    <line className="st4" x1="906.13" y1="422.19" x2="921.91" y2="443.89" />
                                </g>
                                <g>
                                    <line className="st4" x1="906.13" y1="541.11" x2="906.13" y2="507.29" />
                                    <line className="st4" x1="905.71" y1="508.42" x2="889.93" y2="486.58" />
                                    <line className="st4" x1="906.13" y1="508.84" x2="921.91" y2="487.14" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="906.69" y1="433.04" x2="906.69" y2="449.24" />
                                    <line className="st5" x1="901.76" y1="437.41" x2="907.26" y2="432.48" />
                                    <line className="st5" x1="911.2" y1="438.11" x2="906.27" y2="432.34" />
                                </g>
                                <g>
                                    <line className="st5" x1="906.69" y1="497.99" x2="906.69" y2="481.79" />
                                    <line className="st5" x1="901.76" y1="493.63" x2="907.26" y2="498.56" />
                                    <line className="st5" x1="911.2" y1="492.92" x2="906.27" y2="498.56" />
                                </g>
                                <rect id="C_7" onClick={() => { handleDevice(iot7?.imei_no) }} x="890.49" y="449.81" className={iot7?.update_time ? iot7?.map_id == 'C_7' && checkOneDayDifferences(iot7?.update_time) ? 'color-black-fast' : checkDateDifferences(iot7?.update_time) ? 'color-black' : checkColor(iot7?.input_1, iot7?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        {/* <!-- IOT 15 --> */}
                        <g>
                            <g>
                                <g>
                                    <line className="st4" x1="107.68" y1="541.11" x2="107.68" y2="574.92" />
                                    <line className="st4" x1="107.26" y1="573.79" x2="91.48" y2="595.49" />
                                    <line className="st4" x1="107.68" y1="573.37" x2="123.46" y2="595.07" />
                                </g>
                                <g>
                                    <line className="st4" x1="107.68" y1="692.28" x2="107.68" y2="658.47" />
                                    <line className="st4" x1="107.26" y1="659.6" x2="91.48" y2="637.76" />
                                    <line className="st4" x1="107.68" y1="660.02" x2="123.46" y2="638.32" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="108.24" y1="584.22" x2="108.24" y2="600.42" />
                                    <line className="st5" x1="103.31" y1="588.59" x2="108.81" y2="583.66" />
                                    <line className="st5" x1="112.75" y1="589.29" x2="107.82" y2="583.51" />
                                </g>
                                <g>
                                    <line className="st5" x1="108.24" y1="649.17" x2="108.24" y2="632.97" />
                                    <line className="st5" x1="103.31" y1="644.8" x2="108.81" y2="649.73" />
                                    <line className="st5" x1="112.75" y1="644.1" x2="107.82" y2="649.73" />
                                </g>
                                <rect id="C_15" onClick={() => { handleDevice(iot15?.imei_no) }} x="92.04" y="600.98" className={iot15?.update_time ? iot15?.map_id == 'C_15' && checkOneDayDifferences(iot15?.update_time) ? 'color-black-fast' : checkDateDifferences(iot15?.update_time) ? 'color-black' : checkColor(iot15?.input_1, iot15?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        <g>
                            <polygon points="98.1,776.39 107.26,793.58 117.26,776.11 		" />
                            <line className="st6" x1="107.68" y1="658.47" x2="107.68" y2="777.52" />
                        </g>
                        {/* <!-- 6.6 BUSCOUPLER --> */}
                        <g transform="matrix(1 0 0 1 200 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="140" y1="541.32" x2="639.05" y2="541.32" />
                                    <line className="st4" x1="638.25" y1="541.32" x2="659.95" y2="557.1" />
                                    <line className="st4" x1="637.83" y1="540.89" x2="659.53" y2="525.11" />
                                </g>
                                <g>
                                    <line className="st4" x1="724" y1="541.11" x2="1107" y2="541.11" />
                                    <line className="st4" x1="724.06" y1="541.32" x2="702.22" y2="557.1" />
                                    <line className="st4" x1="724.48" y1="540.89" x2="702.78" y2="525.11" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="648.68" y1="540.33" x2="664.88" y2="540.33" />
                                    <line className="st5" x1="653.05" y1="545.26" x2="648.12" y2="539.77" />
                                    <line className="st5" x1="653.75" y1="535.82" x2="647.98" y2="540.75" />
                                </g>
                                <g>
                                    <line className="st5" x1="713.63" y1="540.33" x2="697.43" y2="540.33" />
                                    <line className="st5" x1="709.26" y1="545.26" x2="714.2" y2="539.77" />
                                    <line className="st5" x1="708.56" y1="535.82" x2="714.2" y2="540.75" />
                                </g>
                                <rect x="665.45" y="525.54" className="st4" width="31.56" height="31" />
                            </g>
                        </g>
                        {/* <!-- IOT --> */}
                        <g transform="matrix(1 0 0 1 40 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="298.91" y1="541.18" x2="298.91" y2="574.99" />
                                    <line className="st4" x1="298.49" y1="573.86" x2="282.71" y2="595.56" />
                                    <line className="st4" x1="298.91" y1="573.44" x2="314.69" y2="595.14" />
                                </g>
                                <g>
                                    <line className="st4" x1="298.91" y1="692.35" x2="298.91" y2="658.54" />
                                    <line className="st4" x1="298.49" y1="659.67" x2="282.71" y2="637.83" />
                                    <line className="st4" x1="298.91" y1="660.09" x2="314.69" y2="638.39" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="299.48" y1="584.29" x2="299.48" y2="600.49" />
                                    <line className="st5" x1="294.54" y1="588.66" x2="300.04" y2="583.73" />
                                    <line className="st5" x1="303.98" y1="589.36" x2="299.05" y2="583.58" />
                                </g>
                                <g>
                                    <line className="st5" x1="299.48" y1="649.24" x2="299.48" y2="633.04" />
                                    <line className="st5" x1="294.54" y1="644.87" x2="300.04" y2="649.8" />
                                    <line className="st5" x1="303.98" y1="644.17" x2="299.05" y2="649.8" />
                                </g>
                                <rect x="283.27" y="601.06" className="st4" width="31" height="31.56" />
                            </g>
                        </g>
                        {/* <!-- IOT 9 --> */}
                        <g transform="matrix(1 0 0 1 100 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="517.88" y1="541.25" x2="517.88" y2="575.06" />
                                    <line className="st4" x1="517.46" y1="573.93" x2="501.68" y2="595.63" />
                                    <line className="st4" x1="517.88" y1="573.51" x2="533.66" y2="595.21" />
                                </g>
                                <g>
                                    <line className="st4" x1="517.88" y1="692.42" x2="517.88" y2="658.61" />
                                    <line className="st4" x1="517.46" y1="659.74" x2="501.68" y2="637.9" />
                                    <line className="st4" x1="517.88" y1="660.16" x2="533.66" y2="638.46" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="518.45" y1="584.36" x2="518.45" y2="600.56" />
                                    <line className="st5" x1="513.52" y1="588.73" x2="519.01" y2="583.8" />
                                    <line className="st5" x1="522.96" y1="589.43" x2="518.03" y2="583.66" />
                                </g>
                                <g>
                                    <line className="st5" x1="518.45" y1="649.31" x2="518.45" y2="633.11" />
                                    <line className="st5" x1="513.52" y1="644.94" x2="519.01" y2="649.87" />
                                    <line className="st5" x1="522.96" y1="644.24" x2="518.03" y2="649.87" />
                                </g>
                                <rect id="C_9" onClick={() => { handleDevice(iot9?.imei_no) }} x="502.25" y="601.13" className={iot9?.update_time ? iot9?.map_id == 'C_9' && checkOneDayDifferences(iot9?.update_time) ? 'color-black-fast' : checkDateDifferences(iot9?.update_time) ? 'color-black' : checkColor(iot9?.input_1, iot9?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        {/* <!-- IOT 10 --> */}
                        <g transform="matrix(1 0 0 1 340 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="838.19" y1="541.18" x2="838.19" y2="574.99" />
                                    <line className="st4" x1="837.77" y1="573.86" x2="821.99" y2="595.56" />
                                    <line className="st4" x1="838.19" y1="573.44" x2="853.97" y2="595.14" />
                                </g>
                                <g>
                                    <line className="st4" x1="838.19" y1="692.35" x2="838.19" y2="658.54" />
                                    <line className="st4" x1="837.77" y1="659.67" x2="821.99" y2="637.83" />
                                    <line className="st4" x1="838.19" y1="660.09" x2="853.97" y2="638.39" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="838.75" y1="584.29" x2="838.75" y2="600.49" />
                                    <line className="st5" x1="833.82" y1="588.66" x2="839.32" y2="583.73" />
                                    <line className="st5" x1="843.26" y1="589.36" x2="838.33" y2="583.58" />
                                </g>
                                <g>
                                    <line className="st5" x1="838.75" y1="649.24" x2="838.75" y2="633.04" />
                                    <line className="st5" x1="833.82" y1="644.87" x2="839.32" y2="649.8" />
                                    <line className="st5" x1="843.26" y1="644.17" x2="838.33" y2="649.8" />
                                </g>
                                <rect id="C_10" onClick={() => { handleDevice(iot10?.imei_no) }} x="822.55" y="601.06" className={iot10?.update_time ? iot10?.map_id == 'C_10' && checkOneDayDifferences(iot10?.update_time) ? 'color-black-fast' : checkDateDifferences(iot10?.update_time) ? 'color-black' : checkColor(iot10?.input_1, iot10?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        <line className="st4" x1="520" y1="692.51" x2="810" y2="692.51" />
                        {/* <!-- IOT 11 --> */}
                        <g transform="matrix(1 0 0 1 100 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="420.76" y1="691.83" x2="420.76" y2="725.64" />
                                    <line className="st4" x1="420.33" y1="724.51" x2="404.55" y2="746.21" />
                                    <line className="st4" x1="420.76" y1="724.09" x2="436.54" y2="745.79" />
                                </g>
                                <g>
                                    <line className="st4" x1="420.76" y1="843" x2="420.76" y2="809.19" />
                                    <line className="st4" x1="420.33" y1="810.32" x2="404.55" y2="788.48" />
                                    <line className="st4" x1="420.76" y1="810.74" x2="436.54" y2="789.04" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="421.32" y1="734.94" x2="421.32" y2="751.14" />
                                    <line className="st5" x1="416.39" y1="739.31" x2="421.88" y2="734.37" />
                                    <line className="st5" x1="425.83" y1="740.01" x2="420.9" y2="734.23" />
                                </g>
                                <g>
                                    <line className="st5" x1="421.32" y1="799.89" x2="421.32" y2="783.69" />
                                    <line className="st5" x1="416.39" y1="795.52" x2="421.88" y2="800.45" />
                                    <line className="st5" x1="425.83" y1="794.82" x2="420.9" y2="800.45" />
                                </g>
                                <rect id="C_11" onClick={() => { handleDevice(iot11?.imei_no) }} x="405.12" y="751.7" className={iot11?.update_time ? iot11?.map_id == 'C_11' && checkOneDayDifferences(iot11?.update_time) ? 'color-black-fast' : checkDateDifferences(iot11?.update_time) ? 'color-black' : checkColor(iot11?.input_1, iot11?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        {/* <!-- IOT 12 --> */}
                        <g transform="matrix(1 0 0 1 200 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="609.89" y1="691.83" x2="609.89" y2="725.64" />
                                    <line className="st4" x1="609.47" y1="724.51" x2="593.69" y2="746.21" />
                                    <line className="st4" x1="609.89" y1="724.09" x2="625.67" y2="745.79" />
                                </g>
                                <g>
                                    <line className="st4" x1="609.89" y1="843" x2="609.89" y2="809.19" />
                                    <line className="st4" x1="609.47" y1="810.32" x2="593.69" y2="788.48" />
                                    <line className="st4" x1="609.89" y1="810.74" x2="625.67" y2="789.04" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="610.46" y1="734.94" x2="610.46" y2="751.14" />
                                    <line className="st5" x1="605.52" y1="739.31" x2="611.02" y2="734.37" />
                                    <line className="st5" x1="614.96" y1="740.01" x2="610.03" y2="734.23" />
                                </g>
                                <g>
                                    <line className="st5" x1="610.46" y1="799.89" x2="610.46" y2="783.69" />
                                    <line className="st5" x1="605.52" y1="795.52" x2="611.02" y2="800.45" />
                                    <line className="st5" x1="614.96" y1="794.82" x2="610.03" y2="800.45" />
                                </g>
                                <rect id="C_12" onClick={() => { handleDevice(iot12?.imei_no) }} x="594.25" y="751.7" className={iot12?.update_time ? iot12?.map_id == 'C_12' && checkOneDayDifferences(iot12?.update_time) ? 'color-black-fast' : checkDateDifferences(iot12?.update_time) ? 'color-black' : checkColor(iot12?.input_1, iot12?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        <line className="st4" x1="1089" y1="692.35" x2="1375" y2="692.35" />
                        {/* <!-- IOT 13 --> */}
                        <g transform="matrix(1 0 0 1 300 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="789.8" y1="691.83" x2="789.8" y2="725.64" />
                                    <line className="st4" x1="789.38" y1="724.51" x2="773.6" y2="746.21" />
                                    <line className="st4" x1="789.8" y1="724.09" x2="805.58" y2="745.79" />
                                </g>
                                <g>
                                    <line className="st4" x1="789.8" y1="843" x2="789.8" y2="809.19" />
                                    <line className="st4" x1="789.38" y1="810.32" x2="773.6" y2="788.48" />
                                    <line className="st4" x1="789.8" y1="810.74" x2="805.58" y2="789.04" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="790.36" y1="734.94" x2="790.36" y2="751.14" />
                                    <line className="st5" x1="785.43" y1="739.31" x2="790.93" y2="734.37" />
                                    <line className="st5" x1="794.87" y1="740.01" x2="789.94" y2="734.23" />
                                </g>
                                <g>
                                    <line className="st5" x1="790.36" y1="799.89" x2="790.36" y2="783.69" />
                                    <line className="st5" x1="785.43" y1="795.52" x2="790.93" y2="800.45" />
                                    <line className="st5" x1="794.87" y1="794.82" x2="789.94" y2="800.45" />
                                </g>
                                <rect id="C_13" onClick={() => { handleDevice(iot13?.imei_no) }} x="774.16" y="751.7" className={iot13?.update_time ? iot13?.map_id == 'C_13' && checkOneDayDifferences(iot13?.update_time) ? 'color-black-fast' : checkDateDifferences(iot13?.update_time) ? 'color-black' : checkColor(iot13?.input_1, iot13?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        {/* <!-- IOT 14 --> */}
                        <g transform="matrix(1 0 0 1 400 0)">
                            <g>
                                <g>
                                    <line className="st4" x1="975.93" y1="691.83" x2="975.93" y2="725.64" />
                                    <line className="st4" x1="975.51" y1="724.51" x2="959.73" y2="746.21" />
                                    <line className="st4" x1="975.93" y1="724.09" x2="991.71" y2="745.79" />
                                </g>
                                <g>
                                    <line className="st4" x1="975.93" y1="843" x2="975.93" y2="809.19" />
                                    <line className="st4" x1="975.51" y1="810.32" x2="959.73" y2="788.48" />
                                    <line className="st4" x1="975.93" y1="810.74" x2="991.71" y2="789.04" />
                                </g>
                            </g>
                            <g>
                                <g>
                                    <line className="st5" x1="976.5" y1="734.94" x2="976.5" y2="751.14" />
                                    <line className="st5" x1="971.57" y1="739.31" x2="977.06" y2="734.37" />
                                    <line className="st5" x1="981.01" y1="740.01" x2="976.07" y2="734.23" />
                                </g>
                                <g>
                                    <line className="st5" x1="976.5" y1="799.89" x2="976.5" y2="783.69" />
                                    <line className="st5" x1="971.57" y1="795.52" x2="977.06" y2="800.45" />
                                    <line className="st5" x1="981.01" y1="794.82" x2="976.07" y2="800.45" />
                                </g>
                                <rect id="C_14" onClick={() => { handleDevice(iot14?.imei_no) }} x="960.29" y="751.7" className={iot14?.update_time ? iot14?.map_id == 'C_14' && checkOneDayDifferences(iot14?.update_time) ? 'color-black-fast' : checkDateDifferences(iot14?.update_time) ? 'color-black' : checkColor(iot14?.input_1, iot14?.input_3) : 'color-black'} width="31" height="31.56" />
                            </g>
                        </g>
                        <g transform="matrix(1 0 0 1 100 0)">
                            <polygon points="411.18,888 420.48,905.19 430.34,887.72 		" />
                            <line className="st6" x1="420.76" y1="808.82" x2="420.76" y2="889.13" />
                        </g>
                        <g transform="matrix(1 0 0 1 200 0)">
                            <rect x="585.31" y="843" className="st4" width="48.89" height="47.62" />
                            <g>
                                <polygon points="600.24,927.4 609.4,944.59 619.26,927.11 			" />
                                <line className="st6" x1="609.82" y1="890.62" x2="609.82" y2="928.52" />
                            </g>
                        </g>
                        <g transform="matrix(1 0 0 1 300 0)">
                            <rect x="765.1" y="842.65" className="st4" width="48.89" height="47.62" />
                            <g>
                                <polygon points="780.04,927.04 789.2,944.23 799.06,926.76 			" />
                                <line className="st6" x1="789.62" y1="890.27" x2="789.62" y2="928.17" />
                            </g>
                        </g>
                        <g transform="matrix(1 0 0 1 400 0)">
                            <rect x="951.49" y="843.59" className="st4" width="48.89" height="47.62" />
                            <g>
                                <polygon points="966.42,927.98 975.58,945.17 985.44,927.7 			" />
                                <line className="st6" x1="976" y1="891.21" x2="976" y2="929.11" />
                            </g>
                        </g>
                        {/* <!-- TRANSFORMER1 --> */}
                        <g>
                            <rect x="69.43" y="341.39" className="st7" width="75.24" height="39.31" />
                            <rect x="78.17" y="381.26" className="st8" width="57.77" height="8.17" />
                            <rect x="84.08" y="390.28" className="st9" width="14.51" height="5.07" />
                            <rect x="116.21" y="390.28" className="st9" width="14.65" height="5.21" />
                            <rect x="84.08" y="341.53" className="st10" width="46.92" height="38.89" />
                            <rect x="84.51" y="347.3" className="st11" width="46.21" height="13.24" />
                            <rect x="84.37" y="366.04" className="st11" width="46.49" height="14.37" />
                            <ellipse className="st12" cx="137.62" cy="347.44" rx="0.99" ry="1.13" />
                            <ellipse className="st12" cx="137.62" cy="353.36" rx="0.99" ry="1.13" />
                            <ellipse className="st12" cx="76.62" cy="369.28" rx="0.99" ry="1.13" />
                            <ellipse className="st12" cx="76.62" cy="375.2" rx="0.99" ry="1.13" />
                            <g>
                                <rect x="79.86" y="336.46" className="st13" width="6.06" height="4.37" />
                                <polygon className="st4" points="91.55,335.75 73.8,335.75 73.8,335.75 			" />
                                <rect x="77.04" y="330.26" className="st14" width="11.69" height="5.07" />
                                <rect x="79.86" y="325.04" className="st15" width="6.06" height="4.23" />
                                <polygon className="st4" points="91.83,324.2 73.52,324.2 73.52,324.2 			" />
                                <rect x="77.04" y="318.14" className="st16" width="11.69" height="5.64" />
                                <rect x="79.15" y="311.24" className="st17" width="7.47" height="6.34" />
                            </g>
                            <g>
                                <rect x="128.18" y="336.46" className="st13" width="6.06" height="4.37" />
                                <polygon className="st4" points="139.88,335.75 122.13,335.75 122.13,335.75 			" />
                                <rect x="125.51" y="330.26" className="st14" width="11.69" height="5.07" />
                                <rect x="128.18" y="325.04" className="st15" width="6.06" height="4.23" />
                                <polygon className="st4" points="140.3,324.2 121.98,324.2 121.98,324.2 			" />
                                <rect x="125.37" y="318.14" className="st16" width="11.69" height="5.64" />
                                <rect x="127.62" y="311.24" className="st17" width="7.47" height="6.34" />
                            </g>
                            <g>
                                <rect x="103.95" y="336.46" className="st13" width="6.06" height="4.37" />
                                <polygon className="st4" points="115.79,335.75 98.03,335.75 98.03,335.75 			" />
                                <rect x="101.27" y="330.26" className="st14" width="11.69" height="5.07" />
                                <rect x="103.95" y="325.04" className="st15" width="6.06" height="4.23" />
                                <polygon className="st4" points="116.07,324.2 97.75,324.2 97.75,324.2 			" />
                                <rect x="101.13" y="318.14" className="st16" width="11.69" height="5.64" />
                                <rect x="103.39" y="311.24" className="st17" width="7.47" height="6.34" />
                            </g>
                            <g>
                                <line className="st4" x1="89.72" y1="347.87" x2="89.72" y2="360.12" />
                                <line className="st4" x1="95.5" y1="347.87" x2="95.5" y2="360.12" />
                                <line className="st4" x1="101.41" y1="347.87" x2="101.41" y2="360.12" />
                                <line className="st4" x1="107.19" y1="347.87" x2="107.19" y2="360.12" />
                                <line className="st4" x1="113.11" y1="347.87" x2="113.11" y2="360.12" />
                                <line className="st4" x1="118.89" y1="347.87" x2="118.89" y2="360.12" />
                                <line className="st4" x1="124.66" y1="347.87" x2="124.66" y2="360.12" />
                            </g>
                            <g>
                                <line className="st4" x1="90" y1="366.89" x2="90" y2="379.99" />
                                <line className="st4" x1="95.78" y1="366.89" x2="95.78" y2="379.99" />
                                <line className="st4" x1="101.56" y1="366.89" x2="101.56" y2="379.99" />
                                <line className="st4" x1="107.47" y1="366.89" x2="107.47" y2="379.99" />
                                <line className="st4" x1="113.25" y1="366.89" x2="113.25" y2="379.99" />
                                <line className="st4" x1="119.17" y1="366.89" x2="119.17" y2="379.99" />
                                <line className="st4" x1="124.94" y1="366.89" x2="124.94" y2="379.99" />
                            </g>
                        </g>
                        {/* <!-- TRANSFORMER2 --> */}
                        <g transform="matrix(1 0 0 1 100 0)">
                            <rect x="322.1" y="341.39" className="st7" width="75.24" height="39.31" />
                            <rect x="330.83" y="381.26" className="st8" width="57.77" height="8.17" />
                            <rect x="336.75" y="390.28" className="st9" width="14.51" height="5.07" />
                            <rect x="368.88" y="390.28" className="st9" width="14.65" height="5.21" />
                            <rect x="336.75" y="341.53" className="st10" width="46.92" height="38.89" />
                            <rect x="337.17" y="347.3" className="st11" width="46.21" height="13.24" />
                            <rect x="337.03" y="366.04" className="st11" width="46.49" height="14.37" />
                            <ellipse className="st12" cx="390.29" cy="347.44" rx="0.99" ry="1.13" />
                            <ellipse className="st12" cx="390.29" cy="353.36" rx="0.99" ry="1.13" />
                            <ellipse className="st12" cx="329.28" cy="369.28" rx="0.99" ry="1.13" />
                            <ellipse className="st12" cx="329.28" cy="375.2" rx="0.99" ry="1.13" />
                            <g>
                                <rect x="332.53" y="336.46" className="st13" width="6.06" height="4.37" />
                                <polygon className="st4" points="344.22,335.75 326.47,335.75 326.47,335.75 			" />
                                <rect x="329.71" y="330.26" className="st14" width="11.69" height="5.07" />
                                <rect x="332.53" y="325.04" className="st15" width="6.06" height="4.23" />
                                <polygon className="st4" points="344.5,324.2 326.19,324.2 326.19,324.2 			" />
                                <rect x="329.71" y="318.14" className="st16" width="11.69" height="5.64" />
                                <rect x="331.82" y="311.24" className="st17" width="7.47" height="6.34" />
                            </g>
                            <g>
                                <rect x="380.85" y="336.46" className="st13" width="6.06" height="4.37" />
                                <polygon className="st4" points="392.55,335.75 374.79,335.75 374.79,335.75 			" />
                                <rect x="378.17" y="330.26" className="st14" width="11.69" height="5.07" />
                                <rect x="380.85" y="325.04" className="st15" width="6.06" height="4.23" />
                                <polygon className="st4" points="392.97,324.2 374.65,324.2 374.65,324.2 			" />
                                <rect x="378.03" y="318.14" className="st16" width="11.69" height="5.64" />
                                <rect x="380.29" y="311.24" className="st17" width="7.47" height="6.34" />
                            </g>
                            <g>
                                <rect x="356.62" y="336.46" className="st13" width="6.06" height="4.37" />
                                <polygon className="st4" points="368.45,335.75 350.7,335.75 350.7,335.75 			" />
                                <rect x="353.94" y="330.26" className="st14" width="11.69" height="5.07" />
                                <rect x="356.62" y="325.04" className="st15" width="6.06" height="4.23" />
                                <polygon className="st4" points="368.73,324.2 350.42,324.2 350.42,324.2 			" />
                                <rect x="353.8" y="318.14" className="st16" width="11.69" height="5.64" />
                                <rect x="356.05" y="311.24" className="st17" width="7.47" height="6.34" />
                            </g>
                            <g>
                                <line className="st4" x1="342.39" y1="347.87" x2="342.39" y2="360.12" />
                                <line className="st4" x1="348.16" y1="347.87" x2="348.16" y2="360.12" />
                                <line className="st4" x1="354.08" y1="347.87" x2="354.08" y2="360.12" />
                                <line className="st4" x1="359.86" y1="347.87" x2="359.86" y2="360.12" />
                                <line className="st4" x1="365.78" y1="347.87" x2="365.78" y2="360.12" />
                                <line className="st4" x1="371.55" y1="347.87" x2="371.55" y2="360.12" />
                                <line className="st4" x1="377.33" y1="347.87" x2="377.33" y2="360.12" />
                            </g>
                            <g>
                                <line className="st4" x1="342.67" y1="366.89" x2="342.67" y2="379.99" />
                                <line className="st4" x1="348.45" y1="366.89" x2="348.45" y2="379.99" />
                                <line className="st4" x1="354.22" y1="366.89" x2="354.22" y2="379.99" />
                                <line className="st4" x1="360.14" y1="366.89" x2="360.14" y2="379.99" />
                                <line className="st4" x1="365.92" y1="366.89" x2="365.92" y2="379.99" />
                                <line className="st4" x1="371.83" y1="366.89" x2="371.83" y2="379.99" />
                                <line className="st4" x1="377.61" y1="366.89" x2="377.61" y2="379.99" />
                            </g>
                        </g>
                        {/* <!-- TRANSFORMER3 --> */}
                        <g transform="matrix(1 0 0 1 400 0)">
                            <rect x="868.37" y="341.39" className="st7" width="75.24" height="39.31" />
                            <rect x="877.1" y="381.26" className="st8" width="57.77" height="8.17" />
                            <rect x="883.02" y="390.28" className="st9" width="14.51" height="5.07" />
                            <rect x="915.14" y="390.28" className="st9" width="14.65" height="5.21" />
                            <rect x="883.02" y="341.53" className="st10" width="46.92" height="38.89" />
                            <rect x="883.44" y="347.3" className="st11" width="46.21" height="13.24" />
                            <rect x="883.3" y="366.04" className="st11" width="46.49" height="14.37" />
                            <ellipse className="st12" cx="936.56" cy="347.44" rx="0.99" ry="1.13" />
                            <ellipse className="st12" cx="936.56" cy="353.36" rx="0.99" ry="1.13" />
                            <ellipse className="st12" cx="875.55" cy="369.28" rx="0.99" ry="1.13" />
                            <ellipse className="st12" cx="875.55" cy="375.2" rx="0.99" ry="1.13" />
                            <g>
                                <rect x="878.79" y="336.46" className="st13" width="6.06" height="4.37" />
                                <polygon className="st4" points="890.49,335.75 872.74,335.75 872.74,335.75 			" />
                                <rect x="875.98" y="330.26" className="st14" width="11.69" height="5.07" />
                                <rect x="878.79" y="325.04" className="st15" width="6.06" height="4.23" />
                                <polygon className="st4" points="890.77,324.2 872.45,324.2 872.45,324.2 			" />
                                <rect x="875.98" y="318.14" className="st16" width="11.69" height="5.64" />
                                <rect x="878.09" y="311.24" className="st17" width="7.47" height="6.34" />
                            </g>
                            <g>
                                <rect x="927.12" y="336.46" className="st13" width="6.06" height="4.37" />
                                <polygon className="st4" points="938.81,335.75 921.06,335.75 921.06,335.75 			" />
                                <rect x="924.44" y="330.26" className="st14" width="11.69" height="5.07" />
                                <rect x="927.12" y="325.04" className="st15" width="6.06" height="4.23" />
                                <polygon className="st4" points="939.24,324.2 920.92,324.2 920.92,324.2 			" />
                                <rect x="924.3" y="318.14" className="st16" width="11.69" height="5.64" />
                                <rect x="926.56" y="311.24" className="st17" width="7.47" height="6.34" />
                            </g>
                            <g>
                                <rect x="902.89" y="336.46" className="st13" width="6.06" height="4.37" />
                                <polygon className="st4" points="914.72,335.75 896.97,335.75 896.97,335.75 			" />
                                <rect x="900.21" y="330.26" className="st14" width="11.69" height="5.07" />
                                <rect x="902.89" y="325.04" className="st15" width="6.06" height="4.23" />
                                <polygon className="st4" points="915,324.2 896.69,324.2 896.69,324.2 			" />
                                <rect x="900.07" y="318.14" className="st16" width="11.69" height="5.64" />
                                <rect x="902.32" y="311.24" className="st17" width="7.47" height="6.34" />
                            </g>
                            <g>
                                <line className="st4" x1="888.66" y1="347.87" x2="888.66" y2="360.12" />
                                <line className="st4" x1="894.43" y1="347.87" x2="894.43" y2="360.12" />
                                <line className="st4" x1="900.35" y1="347.87" x2="900.35" y2="360.12" />
                                <line className="st4" x1="906.13" y1="347.87" x2="906.13" y2="360.12" />
                                <line className="st4" x1="912.05" y1="347.87" x2="912.05" y2="360.12" />
                                <line className="st4" x1="917.82" y1="347.87" x2="917.82" y2="360.12" />
                                <line className="st4" x1="923.6" y1="347.87" x2="923.6" y2="360.12" />
                            </g>
                            <g>
                                <line className="st4" x1="888.94" y1="366.89" x2="888.94" y2="379.99" />
                                <line className="st4" x1="894.72" y1="366.89" x2="894.72" y2="379.99" />
                                <line className="st4" x1="900.49" y1="366.89" x2="900.49" y2="379.99" />
                                <line className="st4" x1="906.41" y1="366.89" x2="906.41" y2="379.99" />
                                <line className="st4" x1="912.19" y1="366.89" x2="912.19" y2="379.99" />
                                <line className="st4" x1="918.1" y1="366.89" x2="918.1" y2="379.99" />
                                <line className="st4" x1="923.88" y1="366.89" x2="923.88" y2="379.99" />
                            </g>
                        </g>
                        {/* <!-- TRANSFORMER4 --> */}
                        <g transform="matrix(1 0 0 1 40 0)">
                            <rect x="261.08" y="722.51" className="st7" width="75.24" height="39.31" />
                            <rect x="269.82" y="762.38" className="st8" width="57.77" height="8.17" />
                            <rect x="275.74" y="771.4" className="st9" width="14.51" height="5.07" />
                            <rect x="307.86" y="771.4" className="st9" width="14.65" height="5.21" />
                            <rect x="275.74" y="722.65" className="st10" width="46.92" height="38.89" />
                            <rect x="276.16" y="728.43" className="st11" width="46.21" height="13.24" />
                            <rect x="276.02" y="747.17" className="st11" width="46.49" height="14.37" />
                            <ellipse className="st12" cx="329.27" cy="728.57" rx="0.99" ry="1.13" />
                            <ellipse className="st12" cx="329.27" cy="734.48" rx="0.99" ry="1.13" />
                            <ellipse className="st12" cx="268.27" cy="750.41" rx="0.99" ry="1.13" />
                            <ellipse className="st12" cx="268.27" cy="756.32" rx="0.99" ry="1.13" />
                            <g>
                                <rect x="271.51" y="717.58" className="st13" width="6.06" height="4.37" />
                                <polygon className="st4" points="283.2,716.87 265.45,716.87 265.45,716.87 			" />
                                <rect x="268.69" y="711.38" className="st14" width="11.69" height="5.07" />
                                <rect x="271.51" y="706.17" className="st15" width="6.06" height="4.23" />
                                <polygon className="st4" points="283.48,705.32 265.17,705.32 265.17,705.32 			" />
                                <rect x="268.69" y="699.26" className="st16" width="11.69" height="5.64" />
                                <rect x="270.8" y="692.36" className="st17" width="7.47" height="6.34" />
                            </g>
                            <g>
                                <rect x="319.83" y="717.58" className="st13" width="6.06" height="4.37" />
                                <polygon className="st4" points="331.53,716.87 313.78,716.87 313.78,716.87 			" />
                                <rect x="317.16" y="711.38" className="st14" width="11.69" height="5.07" />
                                <rect x="319.83" y="706.17" className="st15" width="6.06" height="4.23" />
                                <polygon className="st4" points="331.95,705.32 313.64,705.32 313.64,705.32 			" />
                                <rect x="317.02" y="699.26" className="st16" width="11.69" height="5.64" />
                                <rect x="319.27" y="692.36" className="st17" width="7.47" height="6.34" />
                            </g>
                            <g>
                                <rect x="295.6" y="717.58" className="st13" width="6.06" height="4.37" />
                                <polygon className="st4" points="307.44,716.87 289.68,716.87 289.68,716.87 			" />
                                <rect x="292.92" y="711.38" className="st14" width="11.69" height="5.07" />
                                <rect x="295.6" y="706.17" className="st15" width="6.06" height="4.23" />
                                <polygon className="st4" points="307.72,705.32 289.4,705.32 289.4,705.32 			" />
                                <rect x="292.78" y="699.26" className="st16" width="11.69" height="5.64" />
                                <rect x="295.04" y="692.36" className="st17" width="7.47" height="6.34" />
                            </g>
                            <g>
                                <line className="st4" x1="281.37" y1="728.99" x2="281.37" y2="741.25" />
                                <line className="st4" x1="287.15" y1="728.99" x2="287.15" y2="741.25" />
                                <line className="st4" x1="293.07" y1="728.99" x2="293.07" y2="741.25" />
                                <line className="st4" x1="298.84" y1="728.99" x2="298.84" y2="741.25" />
                                <line className="st4" x1="304.76" y1="728.99" x2="304.76" y2="741.25" />
                                <line className="st4" x1="310.54" y1="728.99" x2="310.54" y2="741.25" />
                                <line className="st4" x1="316.31" y1="728.99" x2="316.31" y2="741.25" />
                            </g>
                            <g>
                                <line className="st4" x1="281.65" y1="748.01" x2="281.65" y2="761.11" />
                                <line className="st4" x1="287.43" y1="748.01" x2="287.43" y2="761.11" />
                                <line className="st4" x1="293.21" y1="748.01" x2="293.21" y2="761.11" />
                                <line className="st4" x1="299.12" y1="748.01" x2="299.12" y2="761.11" />
                                <line className="st4" x1="304.9" y1="748.01" x2="304.9" y2="761.11" />
                                <line className="st4" x1="310.82" y1="748.01" x2="310.82" y2="761.11" />
                                <line className="st4" x1="316.59" y1="748.01" x2="316.59" y2="761.11" />
                            </g>
                        </g>
                        {/* <!-- CRANE --> */}
                        <svg className="d-sm-block main-image" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1500 1079" style={{ enableBackground: "new 0 0 1500 1079", marginTop: "3.5rem" }} xmlSpace="preserve">
                            <image xlinkHref={Crane} width="110" height="110" x="470" y="890" />
                        </svg>
                        {/* <!-- PUMP1 --> */}
                        <g transform="matrix(1 0 0 1 212 0)">
                            <g>
                                <rect x="572.7" y="979.92" className="st24" width="43.85" height="39.27" />
                                <rect x="579.56" y="1019.19" className="st25" width="35.58" height="4.58" />
                                <rect x="577.63" y="1023.24" className="st26" width="38.92" height="4.4" />
                                <rect x="571.99" y="1028" className="st25" width="51.78" height="7.93" />
                                <rect x="571.99" y="1028" className="st27" width="45.97" height="3.87" />
                                <rect x="616.37" y="985.2" className="st28" width="5.64" height="28.18" />
                                <rect x="636.27" y="1031.17" className="st28" width="19.55" height="4.4" />
                                <rect x="622.18" y="991.89" className="st29" width="5.64" height="16.38" />
                                <rect x="636.1" y="1011.79" className="st29" width="19.02" height="4.58" />
                                <rect x="587.49" y="974.46" className="st29" width="19.02" height="5.28" />
                                <rect x="587.31" y="951.91" className="st29" width="19.37" height="5.46" />
                                <rect x="590.84" y="957.73" className="st30" width="11.62" height="16.55" />
                                <rect x="628.35" y="993.65" className="st31" width="22.89" height="11.27" />
                                <rect x="639.8" y="993.65" className="st31" width="11.45" height="17.44" />
                                <rect x="640.15" y="1016.55" className="st31" width="11.98" height="14.44" />
                            </g>
                            <line className="st4" x1="580.09" y1="979.74" x2="580.09" y2="1019.19" />
                            <g>
                                <line className="st4" x1="587.56" y1="988.02" x2="606.41" y2="988.02" />
                                <line className="st4" x1="608.56" y1="985.27" x2="605.92" y2="988.26" />
                                <line className="st4" x1="585.44" y1="985.24" x2="588.08" y2="988.23" />
                            </g>
                            <g>
                                <line className="st4" x1="587.56" y1="993.65" x2="606.41" y2="993.65" />
                                <line className="st4" x1="608.56" y1="990.9" x2="605.92" y2="993.9" />
                                <line className="st4" x1="585.44" y1="990.87" x2="588.08" y2="993.87" />
                            </g>
                            <g>
                                <line className="st4" x1="587.56" y1="999.29" x2="606.41" y2="999.29" />
                                <line className="st4" x1="608.56" y1="996.54" x2="605.92" y2="999.53" />
                                <line className="st4" x1="585.44" y1="996.51" x2="588.08" y2="999.5" />
                            </g>
                            <rect x="583.62" y="1006.16" className="st32" width="12.86" height="7.22" />
                            <line className="st4" x1="599.99" y1="1006.69" x2="610.21" y2="1006.69" />
                            <line className="st4" x1="600.29" y1="1012.22" x2="602.22" y2="1012.22" />
                            <line className="st4" x1="603.66" y1="1012.22" x2="610" y2="1012.22" />
                        </g>
                        {/* <!-- PUMP2 --> */}
                        <g transform="matrix(1 0 0 1 312 0)">
                            <g>
                                <rect x="752.19" y="979.92" className="st24" width="43.85" height="39.27" />
                                <rect x="759.05" y="1019.19" className="st25" width="35.58" height="4.58" />
                                <rect x="757.12" y="1023.24" className="st26" width="38.92" height="4.4" />
                                <rect x="751.48" y="1028" className="st25" width="51.78" height="7.93" />
                                <rect x="751.48" y="1028" className="st27" width="45.97" height="3.87" />
                                <rect x="795.86" y="985.2" className="st28" width="5.64" height="28.18" />
                                <rect x="815.76" y="1031.17" className="st28" width="19.55" height="4.4" />
                                <rect x="801.67" y="991.89" className="st29" width="5.64" height="16.38" />
                                <rect x="815.59" y="1011.79" className="st29" width="19.02" height="4.58" />
                                <rect x="766.98" y="974.46" className="st29" width="19.02" height="5.28" />
                                <rect x="766.8" y="951.91" className="st29" width="19.37" height="5.46" />
                                <rect x="770.33" y="957.73" className="st30" width="11.62" height="16.55" />
                                <rect x="807.84" y="993.65" className="st31" width="22.89" height="11.27" />
                                <rect x="819.29" y="993.65" className="st31" width="11.45" height="17.44" />
                                <rect x="819.64" y="1016.55" className="st31" width="11.98" height="14.44" />
                            </g>
                            <line className="st4" x1="759.58" y1="979.74" x2="759.58" y2="1019.19" />
                            <g>
                                <line className="st4" x1="767.05" y1="988.02" x2="785.9" y2="988.02" />
                                <line className="st4" x1="788.06" y1="985.27" x2="785.41" y2="988.26" />
                                <line className="st4" x1="764.93" y1="985.24" x2="767.57" y2="988.23" />
                            </g>
                            <g>
                                <line className="st4" x1="767.05" y1="993.65" x2="785.9" y2="993.65" />
                                <line className="st4" x1="788.06" y1="990.9" x2="785.41" y2="993.9" />
                                <line className="st4" x1="764.93" y1="990.87" x2="767.57" y2="993.87" />
                            </g>
                            <g>
                                <line className="st4" x1="767.05" y1="999.29" x2="785.9" y2="999.29" />
                                <line className="st4" x1="788.06" y1="996.54" x2="785.41" y2="999.53" />
                                <line className="st4" x1="764.93" y1="996.51" x2="767.57" y2="999.5" />
                            </g>
                            <rect x="763.11" y="1006.16" className="st32" width="12.86" height="7.22" />
                            <line className="st4" x1="779.48" y1="1006.69" x2="789.7" y2="1006.69" />
                            <line className="st4" x1="779.78" y1="1012.22" x2="781.72" y2="1012.22" />
                            <line className="st4" x1="783.15" y1="1012.22" x2="789.49" y2="1012.22" />
                        </g>
                        {/* <!-- PUMP3 --> */}
                        <g transform="matrix(1 0 0 1 417 0)">
                            <g>
                                <rect x="934.51" y="979.92" className="st24" width="43.85" height="39.27" />
                                <rect x="941.38" y="1019.19" className="st25" width="35.58" height="4.58" />
                                <rect x="939.44" y="1023.24" className="st26" width="38.92" height="4.4" />
                                <rect x="933.81" y="1028" className="st25" width="51.78" height="7.93" />
                                <rect x="933.81" y="1028" className="st27" width="45.97" height="3.87" />
                                <rect x="978.19" y="985.2" className="st28" width="5.64" height="28.18" />
                                <rect x="998.09" y="1031.17" className="st28" width="19.55" height="4.4" />
                                <rect x="984" y="991.89" className="st29" width="5.64" height="16.38" />
                                <rect x="997.91" y="1011.79" className="st29" width="19.02" height="4.58" />
                                <rect x="949.31" y="974.46" className="st29" width="19.02" height="5.28" />
                                <rect x="949.13" y="951.91" className="st29" width="19.37" height="5.46" />
                                <rect x="952.65" y="957.73" className="st30" width="11.62" height="16.55" />
                                <rect x="990.16" y="993.65" className="st31" width="22.89" height="11.27" />
                                <rect x="1001.61" y="993.65" className="st31" width="11.45" height="17.44" />
                                <rect x="1001.96" y="1016.55" className="st31" width="11.98" height="14.44" />
                            </g>
                            <line className="st4" x1="941.91" y1="979.74" x2="941.91" y2="1019.19" />
                            <g>
                                <line className="st4" x1="949.38" y1="988.02" x2="968.22" y2="988.02" />
                                <line className="st4" x1="970.38" y1="985.27" x2="967.74" y2="988.26" />
                                <line className="st4" x1="947.25" y1="985.24" x2="949.89" y2="988.23" />
                            </g>
                            <g>
                                <line className="st4" x1="949.38" y1="993.65" x2="968.22" y2="993.65" />
                                <line className="st4" x1="970.38" y1="990.9" x2="967.74" y2="993.9" />
                                <line className="st4" x1="947.25" y1="990.87" x2="949.89" y2="993.87" />
                            </g>
                            <g>
                                <line className="st4" x1="949.38" y1="999.29" x2="968.22" y2="999.29" />
                                <line className="st4" x1="970.38" y1="996.54" x2="967.74" y2="999.53" />
                                <line className="st4" x1="947.25" y1="996.51" x2="949.89" y2="999.5" />
                            </g>
                            <rect x="945.43" y="1006.16" className="st32" width="12.86" height="7.22" />
                            <line className="st4" x1="961.81" y1="1006.69" x2="972.02" y2="1006.69" />
                            <line className="st4" x1="962.1" y1="1012.22" x2="964.04" y2="1012.22" />
                            <line className="st4" x1="965.48" y1="1012.22" x2="971.82" y2="1012.22" />
                        </g>
                    </g>
                </svg>
                
                <div className="box breaker-info">
                <ul className='breaker-boxes'>
                    <li className='breaker-box box-1'>
                    <span className='list-data'>Breaker On</span>
                    </li>
                    <li className='breaker-box box-2'>
                    <span className='list-data'>Breaker Off</span>
                    </li>
                    <li className='breaker-box box-3'>
                    <span className='list-data'>Breaker Trip</span>
                    </li>
                    <li className='breaker-box box-4'>
                    <span className='list-data'>No Network</span>
                    </li>
                    <li className='breaker-box box-5'>
                    <span className='list-data'>Network Not Available
                    <br /> More than 24hrs</span>
                    </li>
                  </ul>
                </div>
            </div>
        </div>
    )
}
