import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import "./Reports.css";
import { ImCancelCircle } from 'react-icons/im'
import ApiServices from '../services/apiServices';
import { checkBreaker, checkDateDifferences, getToken, convertDate, getUser } from '../utils/constant';
import { CSVLink } from "react-csv";
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
function UiReports() {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [perData, setPerData] = useState();
  const [filteredList, setFilteredList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [showClearButton, setShowClearButton] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [userName, setUsername] = useState(getUser())
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);

  const getUIReportAPI = async () => {
    try {
      let body = {
        "accesskey": getToken(),
        "datetime": convertDate(new Date())
      }
      const data = await ApiServices.callUIReportsData(body)
      setFilteredList(data?.result?.device)
      setPerData(data?.result?.device?.length)
    } catch (err) {
      console.log(">>deviceData err")
    }
  }

  function setPropertiesToNullByIMEI(array, imeiList) {
    for (let i = 0; i < array.length; i++) {
      let obj = array[i];
      if (imeiList.includes(obj.title) || obj?.update_time && checkDateDifferences(obj?.update_time)) {
        for (let prop in obj) {
          if (prop !== 'imei_no' && prop !== 'title' && prop !== 'update_time' && prop !== 'input_3' && prop !== 'input_1' && prop !== 'input_2' && prop !== 'type_id' && prop !== 'device_info') {
            obj[prop] = 'N/A';
          }
        }
      }
    }
  }
  let imeiList = ['6.6KV INCOMER1 FDR-3', '6.6 KV INCOMER2 FDR-7', '3.3 KV INCOMER1 FDR-3'];

  setPropertiesToNullByIMEI(filteredList, imeiList);

  const handleDownloadCSV = () => {
    setIsReportsDropdownOpen(false);
  }

  const handleExportPDF = () => {
    setIsReportsDropdownOpen(false);
    const fields = [
      { label: "IMEI No", key: "imei_no" },
      { label: "Network Status", key: "networkStatus" },
      { label: "Equipment Name", key: "device_info" },
      { label: "Equipment Status", key: "EquipmentStatus" },
      { label: "Time Stamp", key: "update_time" },
      { label: "Voltage R", key: "voltage_r" },
      { label: "Voltage Y", key: "voltage_y" },
      { label: "Voltage B", key: "voltage_b" },
      { label: "Current R", key: "amp_r" },
      { label: "Current Y", key: "amp_y" },
      { label: "Current B", key: "amp_b" },
      { label: "Load (KW)", key: "kw" },
    ];

    const records = csvReport.data;

    const pdfdata = [[]];

    fields.forEach((element) => {
      pdfdata[0].push(element.label);
    });

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      records[i]['update_time'] = records[i]['update_time'] == 'N/A' ? 'N/A' : new Date(records[i]['update_time']).toLocaleString();
      records[i]['voltage_r'] = records[i]['voltage_r'] == 'N/A' ? 'N/A' : records[i]['voltage_r'];
      records[i]['voltage_y'] = records[i]['voltage_y'] == 'N/A' ? 'N/A' : records[i]['voltage_y'];
      records[i]['voltage_b'] = records[i]['voltage_b'] == 'N/A' ? 'N/A' : records[i]['voltage_b'];
      const data = [];

      fields.forEach((element) => {
        let value = record[element.key];
        if ((element.key == 'voltage_r' || element.key == 'voltage_b' || element.key == 'voltage_y') && value !== 'N/A') {
          value = value / 1000;
        }
        data.push(value);
      });

      pdfdata.push(data);
    }

    const docDefinition = {
      content: [
        { text: 'UI Report', style: 'heading' },
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

    pdfMake.createPdf(docDefinition).download('UI Report.pdf');
  };


  const toggleReportsDropdown = (e) => {
    e.preventDefault();
    setIsReportsDropdownOpen(!isReportsDropdownOpen);
  };


  const formattedData = filteredList.map(({ _id, ...rest }) => {
    const iot = rest.update_time;
    return {
      ...rest,
      update_time: iot == "" || iot == null || iot == 'null' || iot.length < 10 ? 'N/A' : iot,
      networkStatus: (!checkDateDifferences(iot) ? 'CONNECTED' : 'DISCONNECTED'),
      EquipmentStatus: (checkBreaker(rest, "uiReport") == 'OFF' ? 'BREAKER OFF' : checkBreaker(rest, "uiReport") == 'ON' ? 'BREAKER ON' : 'BREAKER TRIP')
    };
  });


  const csvReport = {
    data: formattedData,

    headers: [
      { label: "IMEI No", key: "imei_no" },
      { label: "Network Status", key: "networkStatus" },
      { label: "Equipment Name", key: "device_info" },
      { label: "Equipment Status", key: "EquipmentStatus" },
      { label: "Time Stamp", key: "update_time" },
      { label: "Voltage R", key: "voltage_r" },
      { label: "Voltage Y", key: "voltage_y" },
      { label: "Voltage B", key: "voltage_b" },
      { label: "Current R", key: "amp_r" },
      { label: "Current Y", key: "amp_y" },
      { label: "Current B", key: "amp_b" },
      { label: "Load (KW)", key: "kw" },
    ],
    filename: `UI Report.csv`,
  };

  useEffect(() => {
    getUIReportAPI();
    const interval = setInterval(() => {
      getUIReportAPI()
    }, 20000);
    return () => clearInterval(interval);
  }, [])

  function findData(event) {
    const selectedValue = event.target.value;
    setCurrentPage(1);
    setPerData(parseInt(selectedValue, 10));
  }
  const filterSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchValue(query);
    setShowClearButton(query.length > 0)
    const updatedList = filteredList.filter((item) => {
      return (
        item.title.toLowerCase().indexOf(query) !== -1 ||
        item.imei_no.toLowerCase().indexOf(query) !== -1
      );
    });
    setFilteredList(updatedList);
  };

  const clearSearchInput = () => {
    setSearchValue('');
    setShowClearButton(false);
    getUIReportAPI();
  }

  useEffect(() => {
    const interval = (() => {
      const currentDate = new Date();
      setCurrentTime(currentDate.toLocalString());
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (perData > 0) {
      const totalPagesCount = Math.ceil(filteredList.length / perData);
      setTotalPages(totalPagesCount);
    }
  }, [filteredList, perData]);

  const handlePageChange = (page) => {
    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }
    setCurrentPage(page);
  };

  const renderTableData = () => {
    const startIndex = (currentPage - 1) * perData;
    const endIndex = startIndex + perData;
    const currentData = filteredList.slice(startIndex, endIndex);

    if (currentData.length == 0) {
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
          <td data-label="IMEI No">{iot?.imei_no}</td>
          <td data-label="Equipment Name">{iot?.title}</td>
          <td data-label="Network Status"><span className={`badge ${iot?.update_time && !checkDateDifferences(iot?.update_time) ? 'badge-success' : 'badge-danger'} badge-pill ml-2`}>{iot?.update_time && !checkDateDifferences(iot?.update_time) ? 'CONNECTED' : 'DISCONNECTED'}</span></td>
          <td data-label="Time Stamp">{iot?.update_time ? iot?.update_time == "N/A" ? "N/A" : new Date(iot?.update_time).toLocaleString() : 'N/A'}</td>
          <td data-label="Equipment Status"><span className={`badge ${iot?.update_time && checkBreaker(iot, "uiReport") == 'OFF' ? 'badge-success' : checkBreaker(iot, "uiReport") == 'TRIP' ? 'badge-danger' : 'badge-danger'} badge-pill ml-2`}>{iot?.update_time && checkBreaker(iot, "uiReport") == 'OFF' ? 'BREAKER OFF' : checkBreaker(iot, "uiReport") == 'TRIP' ? 'BREAKER TRIP' : 'BREAKER ON'}</span></td>
          <td data-label="Voltage R">{iot?.voltage_r ? iot?.voltage_r == "N/A" ? "N/A" : iot?.voltage_r / 1000 : 'N/A'}</td>
          <td data-label="Voltage Y">{iot?.voltage_y ? iot?.voltage_y == "N/A" ? "N/A" : iot?.voltage_y / 1000 : 'N/A'}</td>
          <td data-label="Voltage B">{iot?.voltage_b ? iot?.voltage_b == "N/A" ? "N/A" : iot?.voltage_b / 1000 : 'N/A'}</td>
          <td data-label="Current R">{iot?.amp_r}</td>
          <td data-label="Current Y">{iot?.amp_y}</td>
          <td data-label="Current B">{iot?.amp_b}</td>
          <td data-label="Load (KW)">{iot?.kw}</td>
        </tr>
      );
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    const paginationItems = [];
    const MAX_VISIBLE_PAGES = 5; // Maximum number of visible page buttons

    let startPage = 1;
    let endPage = totalPages;

    // Adjust startPage and endPage based on the currdent page
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
          className={`page-item ${currentPage == i ? 'active' : ''}`}
        >
          <button className="page-link"
            onClick={() => handlePageChange(i)}>
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

  return (
    <>
      <div className="deviceReports">
        <div className="header-report">
          <h3 className="UiReport-header" style={{ marginLeft: "1rem" }}>UI Reports</h3>
          {userName == 'admin' && (
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
                  <CSVLink {...csvReport} >
                    <button className="custom-dropdown-item" onClick={handleDownloadCSV}>Download CSV</button>
                  </CSVLink>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="device-info">
          <div className="device-filter">
            <div className="row mt-4">
              <div className="col-lg-4">
                <div role="group" className="form-row form-group mb-0 search-input" id="__BVID__1705">
                  <h6 className="tag">Filter by:</h6>
                  <div className="col">
                    {/* <div role="group" className="input-group input-group-sm search-input"></div> */}
                    {showClearButton &&
                      (<ImCancelCircle className="cross-check" onClick={clearSearchInput} />)}
                    <input id="filterInput" value={searchValue} type="search" placeholder="Type to Search" className="form-control" onChange={filterSearch} />
                  </div>
                </div>
              </div>
            </div>
            <div className="device">
              <div className="table-container">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>IMEI No</th>
                      <th>Equipment Name</th>
                      <th>Network Status</th>
                      <th>Time Stamp</th>
                      <th>Equipment Status</th>
                      <th>Voltage R</th>
                      <th>Voltage Y</th>
                      <th>Voltage B</th>
                      <th>Current R</th>
                      <th>Current Y</th>
                      <th>Current B</th>
                      <th>Load (KW)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTableData()}
                  </tbody>
                </Table>
              </div>
              <div className="row px-3">
                <div className="text-left col-lg-6 entries">
                  <span className="mr-2">Showing 1 to {`${(perData)}`} of {filteredList.length} entries</span>
                </div>
                <div className="text-right col-lg-6 entries" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div c lassName="text-start" style={{ display: "flex", marginBottom: "0.5rem" }}>
                    <      span className="mr-2" style={{ alignSelf: 'center' }}>Show</span>
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
                    <span className="ml-2" style={{ alignSelf: 'center' }}>entries</span>
                  </div>
                  {renderPagination()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UiReports;
