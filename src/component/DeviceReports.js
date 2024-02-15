import React, { useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import "./Reports.css";
import "./Navbar.css"
import calenderImage from "../images/calender.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ApiServices from '../services/apiServices';
import { checkBreaker, getToken, convertDate, getUser } from '../utils/constant';
import { CSVLink } from "react-csv";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function DeviceReports() {
  const [perData, setPerData] = useState(15);
  const [filteredList, setFilteredList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [timeValue, setTimeValue] = useState('12:00');
  const defaultStartDateTime = new Date(new Date().setHours(new Date().getHours() - 1));
  const [startDateTime, setStartDateTime] = useState(defaultStartDateTime);
  const [fromDateTime, setFromDateTime] = useState(defaultStartDateTime.getTime());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [toDateTime, setToDateTime] = useState(Date.now());

  const [deviceAll, setDeviceData] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState({ value: "", text: "" });
  const [loading, setLoading] = useState(false)
  const [userName, setUsername] = useState(getUser())
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);

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

  const handleDownloadCSV = () => {
    setIsReportsDropdownOpen(false);
  }

  const handleExportPDF = () => {
    setIsReportsDropdownOpen(false);
    const fields = [
      { label: "Time Stamp", key: "update_time" },
      { label: "Equipment Status", key: "networkStatus" },
      { label: "Voltage R", key: "voltage_r" },
      { label: "Voltage Y", key: "voltage_y" },
      { label: "Voltage B", key: "voltage_b" },
      { label: "Current R", key: "amp_r" },
      { label: "Current Y", key: "amp_y" },
      { label: "Current B", key: "amp_b" },
      { label: "Load (KW)", key: "kw" },
      { label: "Consumption", key: "kwh" },
    ];

    const records = csvReport.data;

    const pdfdata = [[]];

    fields.forEach((element) => {
      pdfdata[0].push(element.label);
    });

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const data = [];
      records[i]['update_time'] = new Date(records[i]['update_time']).toLocaleString();
      var amp_r = records[i]['amp_r'];
      var amp_y = records[i]['amp_y'];
      var amp_b = records[i]['amp_b'];
      fields.forEach((element) => {
        let value = record[element.key];
        if (element.key === 'voltage_r') {
          value = value / 1000;
        }
        if (element.key === 'voltage_y') {
          value = value / 1000;
        }
        if (element.key === 'voltage_b') {
          value = value / 1000;
        }
        if (element.key === 'supply') {
          var amp = (amp_r + amp_y + amp_b) / 3;
          if (amp > 0.3) {
            value = 'BREAKER ON';
          } else {
            value = 'BREAKER OFF';
          }
        }
        data.push(value);
      });

      pdfdata.push(data);
    }

    const docDefinition = {
      content: [
        { text: 'Device Report', style: 'heading' },
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

    pdfMake.createPdf(docDefinition).download('Device Report.pdf');
  };

  const getDeviceReportAPI = async () => {
    setLoading(true)
    try {
      let body = {
        "accesskey": getToken(),
        "datefrom": convertDate(startDateTime),
        "dateto": convertDate(endDateTime),
        "imei_no": selectedDevice.value
      }
      const data = await ApiServices.callDeviceReportsData(body)
      if (data?.result?.records?.length > 0) {
        if (selectedDevice.text === "6.6KV INCOMER1 FDR-3" || selectedDevice.text === "6.6 KV INCOMER2 FDR-7" || selectedDevice.text === "3.3 KV INCOMER1 FDR-3") {
          let value = [];
          for (let i = 0; i < data?.result?.records.length; i++) {
            let obj = data?.result?.records[i];
            for (let prop in obj) {
              if (prop !== 'update_time') {
                obj[prop] = 'N/A';
              }
            }
            value.push(obj)
          }
          setFilteredList(value);
        }
        else {
          setFilteredList(data?.result?.records)
        }
      } else {
        setFilteredList([])
      }
      setLoading(false)
    } catch (err) {

    }
  }

  const formattedData = filteredList.map(({ _id, ...rest }) => ({
    ...rest,
    networkStatus: checkBreaker(filteredList, "deviceReport") === '0' ? 'BREAKER OFF' : 'BREAKER ON'
  }));

  const csvReport = {
    data: formattedData,

    headers: [
      { label: "Time Stamp", key: "update_time" },
      { label: "Equipment Status", key: "networkStatus" },
      { label: "Voltage R", key: "voltage_r" },
      { label: "Voltage Y", key: "voltage_y" },
      { label: "Voltage B", key: "voltage_b" },
      { label: "Current R", key: "amp_r" },
      { label: "Current Y", key: "amp_y" },
      { label: "Current B", key: "amp_b" },
      { label: "Load (KW)", key: "kw" },
      { label: "Consumption", key: "kwh" },
    ],
    filename: `Device Report.csv`,
  };

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

  const getDeviceInfo = (e) => {
    setSelectedDevice({ value: e.target.value, text: e.target[e.target.selectedIndex].text })
  }

  const handleSubmitReport = () => {
    if (selectedDevice !== "" || selectedDevice !== null || selectedDevice !== undefined) {
      getDeviceReportAPI();
    }
  }

  const handleStartDateTime = (data) => {
    setStartDateTime(data);
    setFromDateTime(data.setFromDateTime);
  }
  const handleEndDateTime = (data) => {
    setEndDateTime(data);
    setToDateTime(data.getTime());
  }

  function findData(event) {
    const selectedValue = parseInt(event.target.value);
    setPerData(selectedValue);
  }

  const handleCalendarChange = (date) => {
    setCalendarValue(date);
  };

  const handleTimeChange = (time) => {
    setTimeValue(time);
  };

  useEffect(() => {
    getAllDevices();
  }, []);

  useEffect(() => {
    const totalPagesCount = Math.ceil(filteredList.length / perData);
    setTotalPages(totalPagesCount);
  }, [filteredList, perData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const loadingSpinner = () => {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  const renderTableData = () => {
    const startIndex = (currentPage - 1) * perData;
    const endIndex = startIndex + perData;
    const currentData = filteredList.slice(startIndex, endIndex);

    if (currentData.length === 0) {
      return (
        <tr>
          <td colSpan="13" className="text-center">No data available</td>
        </tr>
      );
    }

    return currentData.map((iot, index) => {

      return (
        <tr key={index}>
          <td data-label="ID">{startIndex + index + 1}</td>
          <td data-label="Time Stamp">{new Date(iot?.update_time).toLocaleString()}</td>
          <td data-label="Equipment Status"><span className={`badge ${checkBreaker(iot, "deviceReport") === 'OFF' ? 'badge-success' : 'badge-danger'} badge-pill ml-2`}>{checkBreaker(iot, "deviceReport") === 'OFF' ? 'BREAKER OFF' : checkBreaker(iot, "deviceReport") === 'TRIP' ? 'BREAKER TRIP' : 'BREAKER ON'}</span></td>
          <td data-label="Voltage R">{iot?.voltage_r !== 'N/A' ? (iot?.voltage_r / 1000) : 'N/A'}</td>
          <td data-label="Voltage Y">{iot?.voltage_y !== 'N/A' ? (iot?.voltage_y / 1000) : 'N/A'}</td>
          <td data-label="Voltage B">{iot?.voltage_b !== 'N/A' ? (iot?.voltage_b / 1000) : 'N/A'}</td>
          <td data-label="Current R">{iot?.voltage_r !== 'N/A' ? iot?.amp_r : 'N/A'}</td>
          <td data-label="Current Y">{iot?.voltage_r !== 'N/A' ? iot?.amp_y : 'N/A'}</td>
          <td data-label="Current B">{iot?.voltage_r !== 'N/A' ? iot?.amp_b : 'N/A'}</td>
          <td data-label="Load (KW)">{iot?.kw}</td>
          <td data-label="Consumption">{iot?.kwh}</td>
        </tr>
      );
    });
  };


  useEffect(() => {
    if (toDateTime < fromDateTime) {
      notify()
      setEndDateTime(new Date())
      setToDateTime(Date.now())
    }
  }, [fromDateTime, toDateTime])


  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    const paginationItems = [];
    const MAX_VISIBLE_PAGES = 5; // Maximum number of visible page buttons

    let startPage = 1;
    let endPage = totalPages;

    // Adjust startPage and endPage based on the current page
    if (currentPage <= Math.floor(MAX_VISIBLE_PAGES / 2)) {
      endPage = Math.min(MAX_VISIBLE_PAGES, totalPages);
    } else if (currentPage >= totalPages - Math.floor(MAX_VISIBLE_PAGES / 2)) {
      startPage = Math.max(totalPages - MAX_VISIBLE_PAGES + 1, 1);
    } else {
      startPage = currentPage - Math.floor(MAX_VISIBLE_PAGES / 2);
      endPage = startPage + MAX_VISIBLE_PAGES - 1;
    }

    // Render page buttons
    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? 'active' : ''}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    return (
      <ul
        role="menubar"
        aria-disabled="false"
        aria-label="Pagination"
        className="pagination b-pagination pagination-sm justify-content-end b-pagination-pills"
      >
        {currentPage !== 1 && (
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
          </li>
        )}
        {startPage !== 1 && (
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
          </li>
        )}
        {startPage > 2 && (
          <li className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )}
        {paginationItems}
        {endPage < totalPages - 1 && (
          <li className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )}
        {endPage !== totalPages && (
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </li>
        )}
        {currentPage !== totalPages && (
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        )}
      </ul>
    );
  };
  const toggleReportsDropdown = (e) => {
    e.preventDefault();
    setIsReportsDropdownOpen(!isReportsDropdownOpen);
  };

  return (
    <div className="deviceReports" >
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
        <h3 style={{ marginLeft: "1rem" }}>Device Reports</h3>
        {userName === 'admin' && (
          <div className="custom-dropdown csv-btn">
            <button
              className="custom-dropdown-toggle"
              type="button"
              id="reportsDropdown"
              onClick={toggleReportsDropdown}
            >
              Download Report
            </button>
            {isReportsDropdownOpen && (
              <div className="custom-dropdown-menu">
                <button className="custom-dropdown-item" onClick={handleExportPDF}>
                  Download PDF
                </button>
                <CSVLink {...csvReport}>
                  <button className="custom-dropdown-item" onClick={handleDownloadCSV} >Download CSV</button>
                </CSVLink>
              </div>
            )}
          </div>
        )}

      </div>
      <div className="device-info">
        <div className="device-filter">
          <div className="row mt-4">
            <div className="col-lg-9">
              <div className="form-inline device-form">
                <label htmlFor="inline-form-input-name" className="mr-sm-2 labels">Equipments: </label>
                <select className="mr-sm-3 custom-select box-input custom-select-sm" id="__BVID__54" onChange={(e) => getDeviceInfo(e)}>
                  <option defaultValue>Select device</option>
                  {
                    filteredDataArray?.length > 0 && filteredDataArray.map((data, index) => {
                      return (
                        <option key={index} value={data?.imei_no} name={data?.title}>{data?.title}</option>

                      )
                    })
                  }
                </select>
                <div className="items-center justify-end date-Picker">
                  <img src={calenderImage} alt="Calender" width="29em" height="29rem" />
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

                <button onClick={() => handleSubmitReport()} type="button" className="submit-btn btn-danger btn-sm ml-5">Submit</button>
              </div>
            </div>
          </div>
          <div className="device">
            <div className="table-container">
              <Table striped bordered hover>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Time Stamp</th>
                    <th>Equipment Status</th>
                    <th>Voltage R</th>
                    <th>Voltage Y</th>
                    <th>Voltage B</th>
                    <th>Current R</th>
                    <th>Current Y</th>
                    <th>Current B</th>
                    <th>Load (KW)</th>
                    <th>Consumption</th>
                  </tr>
                </thead>

                <tbody>{loading ? <tr>
                  <td colSpan="13" className="text-center">{loadingSpinner()}</td>
                </tr> : renderTableData()}</tbody>
              </Table>
            </div>
          </div>
          {!loading && filteredList?.length > 0 && (
            <div className="row px-3">
              <div className="text-left col-lg-6 entries">
                <span className="mr-2">
                  Showing {((currentPage - 1) * perData) + 1} to{' '}
                  {Math.min(currentPage * perData, filteredList.length)} of {filteredList.length} entries
                </span>
              </div>
              <div className="text-right col-lg-6 entries" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="text-start" style={{ display: "flex", marginBottom: "0.5rem" }}>
                  <span className="mr-2">Show</span>
                  <select
                    id="perPageSelect"
                    className="w-25 custom-select custom-select-sm search-bar"
                    onChange={findData}
                    value={perData}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                  </select>
                  <span className="ml-2" style={{ marginRight: "3rem" }}>entries</span>
                </div>
                {renderPagination()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

}
export default DeviceReports;
