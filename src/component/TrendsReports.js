import React, { useState, useEffect, useRef } from 'react';
import "./Reports.css";
import calenderImage from "../images/calender.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Spinner } from 'react-bootstrap';
import 'chart.js/auto';
import ReactApexChart from 'react-apexcharts';
import ApiServices from '../services/apiServices';
import { getToken, convertDate, getUser } from '../utils/constant';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { CSVLink } from "react-csv";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Row, Col } from 'react-bootstrap';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const optionsKw = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'History KW Graphs',
        },
    },
};

export const optionsCurrent = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'History Current Graphs',
        },
    },
};

export const optionsVoltage = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'History Voltage Graphs',
        },
    },
};

function TrendsReports() {
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [perData, setPerData] = useState(10);
    const [filteredList, setFilteredList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const defaultStartDateTime = new Date(new Date().setHours(new Date().getHours() - 1));
    const [startDateTime, setStartDateTime] = useState(defaultStartDateTime);
    const [fromDateTime, setFromDateTime] = useState(defaultStartDateTime.getTime());
    const [endDateTime, setEndDateTime] = useState(new Date());
    const [toDateTime, setToDateTime] = useState(Date.now());
    const [selectedDevice, setSelectedDevice] = useState("");
    const [loading, setLoading] = useState(false)
    const [deviceAll, setDeviceData] = useState([]);
    const [userName, setUsername] = useState(getUser())
    const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);
    const pdfRef = useRef(null);
    let steps = 1;
    let _labels = [];
    let _volt_r = [];
    let _volt_y = [];
    let _volt_b = [];

    let _amp_r = [];
    let _amp_y = [];
    let _amp_b = [];

    let _kw = [];

    const notify = () => toast.error('Please select valid date!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    const titlesToExclude = [
        "6.6KV INCOMER1 FDR-3",
        "6.6 KV INCOMER2 FDR-7",
        "3.3 KV INCOMER1 FDR-3"
    ];
    const filteredDataArray = deviceAll.filter(item => !titlesToExclude.includes(item.title));

    const handleDownloadGraphPDF = () => {
        setIsReportsDropdownOpen(false);
        const input = pdfRef.current;

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.text('History Report', 10, 22)
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('History Report-Graphs.pdf');
        });
    };

    const getDeviceInfo = (e) => {
        setSelectedDevice(e.target.value)
    }

    const formattedData = filteredList.map(({ _id, ...rest }) => ({
        ...rest,
    }));

    const handleDownloadCSV = () => {
        setIsReportsDropdownOpen(false);
    }

    const csvReport = {
        data: formattedData,

        headers: [
            { label: "Time Stamp", key: "update_time" },
            { label: "Voltage R", key: "voltage_r" },
            { label: "Voltage Y", key: "voltage_y" },
            { label: "Voltage B", key: "voltage_b" },
            { label: "Current R", key: "amp_r" },
            { label: "Current Y", key: "amp_y" },
            { label: "Current B", key: "amp_b" },
            { label: "Load (KW)", key: "kw" },
            { label: "Power Consumption (KWH)", key: "kwh" },
        ],
        filename: `History Report.csv`,
    };

    const handleExportPDF = () => {
        setIsReportsDropdownOpen(false);
        const fields = [
            { label: "Time Stamp", key: "update_time" },
            { label: "Voltage R", key: "voltage_r" },
            { label: "Voltage Y", key: "voltage_y" },
            { label: "Voltage B", key: "voltage_b" },
            { label: "Current R", key: "amp_r" },
            { label: "Current Y", key: "amp_y" },
            { label: "Current B", key: "amp_b" },
            { label: "Load (KW)", key: "kw" },
            { label: "Power Consumption (KWH)", key: "kwh" },
        ];

        const records = csvReport.data;

        const pdfdata = [[]];

        fields.forEach((element) => {
            pdfdata[0].push(element.label);
        });

        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const amp_r = record.amp_r;
            const amp_y = record.amp_y;
            const amp_b = record.amp_b;
            const data = [];

            fields.forEach((element) => {
                let value = record[element.key];

                if (element.key == 'voltage_r') {
                    value = value / 1000;
                }

                if (element.key == 'EquipmentStatus') {
                    const amp = (amp_r + amp_y + amp_b) / 3;
                    value = amp > 0.3 ? 'BREAKER ON' : 'BREAKER OFF';
                }

                data.push(value);
            });

            pdfdata.push(data);
        }

        const docDefinition = {
            content: [
                { text: 'History Report', style: 'heading' },
                {
                    layout: 'lightHorizontalLines',
                    table: {
                        headerRows: 1,
                        body: pdfdata,
                    },
                },
            ],
            styles: {
                heading: {
                    fontSize: 20,
                    alignment: 'center',
                    lineHeight: 2,
                    bold: true,
                },
            },
            defaultStyle: {
                fontSize: 11,
                bold: false,
            },
            pageOrientation: 'landscape',
        };

        pdfMake.createPdf(docDefinition).download('History Report.pdf');

    };

    const toggleReportsDropdown = (e) => {
        e.preventDefault();
        setIsReportsDropdownOpen(!isReportsDropdownOpen);
    };



    const loadingSpinner = () => {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }

    const getAllDevices = async () => {
        try {
            let body = {
                "accesskey": getToken()
            }
            const data = await ApiServices.callDeviceInfoData(body);
            setDeviceData(data?.result?.devices)
        } catch (err) {

        }
    }
    const getDeviceReportAPI = async () => {
        setLoading(true)
        try {
            let body = {
                "accesskey": getToken(),
                "datefrom": convertDate(startDateTime),
                "dateto": convertDate(endDateTime),
                "imei_no": selectedDevice
            }
            const data = await ApiServices.callDeviceReportsData(body)
            if (data?.result?.records?.length > 0) {
                setFilteredList(data?.result?.records)
            } else {
                setFilteredList([])
            }
            setLoading(false)
        } catch (err) {
            console.log(">>deviceData err")
        }
    }

    useEffect(() => {
        getAllDevices();
    }, []);
    const handleSubmitReport = () => {
        if (toDateTime < fromDateTime && fromDateTime > toDateTime) {
            return notify()
        }
        else if (selectedDevice !== "" || selectedDevice !== null || selectedDevice !== undefined) {
            return getDeviceReportAPI();
        }
    }

    filteredList.sort((prev_time, next_time) => new Date(prev_time.update_time) - new Date(next_time.update_time));

    if (filteredList.length > 40) {
        steps = filteredList.length / 40;
    }
    for (let i = 0; i < 40; i++) {
        let point = parseInt(steps * i);
        _labels.push(filteredList[point]?.update_time !== undefined ? new Date(filteredList[point]?.update_time).toLocaleString() : '');
        _volt_r.push(filteredList[point]?.voltage_r / 1000);
        _volt_y.push(filteredList[point]?.voltage_y / 1000);
        _volt_b.push(filteredList[point]?.voltage_b / 1000);

        _amp_r.push(filteredList[point]?.amp_r);
        _amp_y.push(filteredList[point]?.amp_y);
        _amp_b.push(filteredList[point]?.amp_b);

        _kw.push(filteredList[point]?.kw);
    }

    // First Chart 

    const dates_r = _volt_r;
    const dates_y = _volt_y;
    const dates_b = _volt_b;

    const data_volt = {
        labels: _labels,
        datasets: [
            {
                label: ' Voltage R',
                borderColor: '#FF0000',
                backgroundColor: '#FF0000',
                data: dates_r,
                fill: false,
                lineTension: 0,
            },
            {
                label: ' Voltage Y',
                borderColor: '#FFFF00',
                backgroundColor: '#FFFF00',
                data: dates_y,
                fill: false,
                lineTension: 0,
            },
            {
                label: ' Voltage B',
                borderColor: '#0000FF',
                backgroundColor: '#0000FF',
                data: dates_b,
                fill: false,
                lineTension: 0,
            }
        ]
    };

    // Second Chart
    const dates_R = _amp_r;
    const dates_Y = _amp_y;
    const dates_B = _amp_y;

    const data_amp = {
        labels: _labels,
        datasets: [
            {
                label: ' Current R',
                borderColor: '#FF0000',
                backgroundColor: '#FF0000',
                data: dates_R,
                fill: false,
                lineTension: 0,
            },
            {
                label: ' Current Y',
                borderColor: '#FFFF00',
                backgroundColor: '#FFFF00',
                data: dates_Y,
                fill: false,
                lineTension: 0,
            },
            {
                label: ' Current B',
                borderColor: '#0000FF',
                backgroundColor: '#0000FF',
                data: dates_B,
                fill: false,
                lineTension: 0,
            }
        ]
    };

    // Third Chart 
    const dates = _kw;
    const data_kw = {
        labels: _labels,
        datasets: [
            {
                label: ' KW B',
                borderColor: '#0000FF',
                backgroundColor: '#0000FF',
                data: dates,
                fill: false,
                lineTension: 0,
            }
        ]
    };

    const handleStartDateTime = (data) => {
        setStartDateTime(data);
        setFromDateTime(data.getTime());
    }

    const handleEndDateTime = (data) => {
        setEndDateTime(data);
        setToDateTime(data.getTime());
    }

    useEffect(() => {
        const currentDate = new Date();
        setCurrentTime(currentDate.toLocaleString());
    }, []);

    useEffect(() => {
        const totalPagesCount = Math.ceil(filteredList.length / perData);
        setTotalPages(totalPagesCount);
    }, [filteredList, perData]);

    return (
        <div className="deviceReports">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div className="header-report">
                <h3 style={{ marginLeft: "1rem" }}>History Reports</h3>
                {userName == 'admin' && (
                    <div className="custom-dropdown btn-csv">
                        <button
                            className="custom-dropdown-toggle"
                            type="button"
                            id="reportsDropdown"
                            onClick={toggleReportsDropdown}
                        >
                            {/* <img src={Logo} alt="LOGO" width={23} height={23} style={{marginRight:"1rem"}} /> */}
                            Download Report
                        </button>
                        {isReportsDropdownOpen && (
                            <div className="custom-dropdown-menu" style={{ zIndex: '999' }}>
                                <button className='custom-dropdown-item' onClick={handleDownloadGraphPDF}>
                                    {/* <img src={Logo} alt="LOGO" width={23} height={23} style={{marginRight:"0.2rem"}} />  */}
                                    Download Graph</button>
                                <button className="custom-dropdown-item" onClick={handleExportPDF}>
                                    {/* <img src={Logo} alt="LOGO" width={23} height={23} style={{marginRight:"0.5rem"}} /> */}
                                    Download PDF
                                </button>
                                <CSVLink {...csvReport}>
                                    <button className="custom-dropdown-item" onClick={handleDownloadCSV}>
                                        {/* <img src={Logo} alt="LOGO" width={23} height={23} style={{marginRight:"0.5rem"}} />  */}
                                        Download CSV
                                    </button>
                                </CSVLink>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="device-info">
                <div className="device-filter">
                    <div className="device-box" style={{ marginTop: "1rem" }}>
                        <div className="chart">
                            <div className="form-inline device-form">
                                <label htmlFor="inline-form-input-name" className="mr-sm-2 header-label">Equipments: </label>
                                <select className="mr-sm-3 custom-select box-input custom-select-sm" id="__BVID__54" onChange={(e) => getDeviceInfo(e)}>
                                    <option defaultValue>Select device</option>
                                    {
                                        filteredDataArray?.length > 0 && filteredDataArray.map((data, index) => {

                                            return (
                                                <option key={index} value={data?.imei_no}>{data?.title}</option>

                                            )
                                        })
                                    }
                                </select>
                                <div className="items-center justify-end date-Picker">
                                    <img src={calenderImage} alt="Calender" width="29em" height="29rem" style={{ margin: "0 0.5rem" }} />
                                    <DatePicker
                                        id="datevalue"
                                        selected={startDateTime}
                                        maxDate={defaultStartDateTime}
                                        onChange={(date) => handleStartDateTime(date)}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="time"
                                        dateFormat="d MMMM, yyyy HH:mm"
                                        className="h-7 cursor-default ml-2 w-40 bg-white text-black text-sm border-15px-both-side w-100 text-dark opacity-75 datepicker"
                                    />


                                </div>
                                <label htmlFor="inline-form-input-name" className="mr-sm-2 line" style={{ marginLeft: "1.5rem", display: "inline-block" }}> - </label>
                                <div className="last-date-picker">
                                    <DatePicker
                                        id="datevalue"
                                        maxDate={defaultStartDateTime}
                                        selected={endDateTime}
                                        onChange={(date) => handleEndDateTime(date)}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="time"
                                        dateFormat="d MMMM, yyyy HH:mm"
                                        className="h-7 tp cursor-default ml-2 w-40 bg-white text-black text-xlf w-100 text-dark opacity-75 datepicker"
                                    />
                                </div>

                                <button disabled={!selectedDevice ? true : false} style={{ cursor: selectedDevice ? 'pointer' : 'not-allowed' }} download="" onClick={() => handleSubmitReport()} type="button" className=" submit-btn btn-danger btn-sm ml-5">Submit</button>
                            </div>
                            {loading ?
                                <div colSpan="13" className="text-center spinner">{loadingSpinner()}</div> :
                                <div className="chart-container" ref={pdfRef}>

                                    <div>
                                        <div md="12">
                                            <Line options={optionsVoltage} data={data_volt} height={70} className='charts' />
                                        </div>
                                    </div>
                                    <div>
                                        <div md="12">
                                            <Line options={optionsCurrent} data={data_amp} height={70} className='charts' />
                                        </div>
                                    </div>
                                    <div>
                                        <div md="12">
                                            <Line options={optionsKw} data={data_kw} height={70} className='charts' />
                                        </div>
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrendsReports;