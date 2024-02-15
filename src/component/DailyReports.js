import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'react-bootstrap';
import "./Reports.css";
import { getTitles, getUser } from '../utils/constant';
import { ImCancelCircle } from 'react-icons/im';
import { getToken } from '../utils/constant';
import ApiServices from '../services/apiServices';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { CSVLink } from "react-csv";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


const DailyReports = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [perData, setPerData] = useState(15);
  const [filteredList, setFilteredList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [showClearButton, setShowClearButton] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [userName, setUsername] = useState(getUser())
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);

  function findData(event) {
    const selectedValue = parseInt(event.target.value);
    setPerData(selectedValue);
  }

  const getDailyReportAPI = async () => {
    try {
      let body = {
        "accesskey": getToken()
      }
      const data = await ApiServices.callDailyReportsData(body)
      if (data?.result) {
        setStartDate(data?.result?.report_start_time)
        setEndDate(data?.result?.report_end_time)
        const sortedSequence = data?.result?.device.sort((a, b) => {
          const indexA = getTitles.indexOf(a.title);
          const indexB = getTitles.indexOf(b.title);
          return indexA - indexB;
        });
        setFilteredList(sortedSequence)
      }
    } catch (err) {
      console.log(">>deviceData err")
    }
  }

  function setPropertiesToNullByIMEI(array, imeiList) {
    for (let i = 0; i < array.length; i++) {
      let obj = array[i];
      if (imeiList.includes(obj.title) || obj?.update_time) {
        for (let prop in obj) {
          if (prop !== 'imei_no' && prop !== 'title') {
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
      { label: "Equipment Name", key: "title" },
      { label: "Network Availability", key: "avalibility" },
      { label: "Equipment on (Hrs)", key: "on_hours" },
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
        { text: 'Daily Report', style: 'heading' },
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

    pdfMake.createPdf(docDefinition).download('Daily Report.pdf');
  };

  const toggleReportsDropdown = (e) => {
    e.preventDefault();
    setIsReportsDropdownOpen(!isReportsDropdownOpen);
  };

  const formattedData = filteredList.map(({ _id, ...rest }) => ({
    ...rest,
  }));

  const csvReport = {
    data: formattedData,

    headers: [
      { label: "Equipment Name", key: "title" },
      { label: "Network UpTime", key: "avalibility" },
      { label: "Equipment on (Hrs)", key: "on_hours" },
      { label: "Power Consumption (KWH)", key: "kwh" },
    ],
    filename: `Daily Report.csv`,
  };

  useEffect(() => {
    getDailyReportAPI();
    const interval = setInterval(() => {
      getDailyReportAPI()
    }, 300000);
    return () => clearInterval(interval);
  }, [])

  const clearSearchInput = () => {
    setSearchValue('');
    setShowClearButton(false);
    getDailyReportAPI();
  };

  const filterSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchValue(query);
    setShowClearButton(query.length > 0);

    const updatedList = filteredList.filter((item) => {
      return (
        item.title.toLowerCase().indexOf(query) !== -1
      );
    });
    setFilteredList(updatedList);
    setCurrentPage(1);
  };

  useEffect(() => {
    const currentDate = new Date();
    setCurrentTime(currentDate.toLocaleString());
  }, []);

  useEffect(() => {
    const totalPagesCount = Math.ceil(filteredList.length / perData);
    setTotalPages(totalPagesCount);
  }, [filteredList, perData]);

  const handlePageChange = (page) => {
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
          <td data-label="Equipment Name">{iot?.title}</td>
          <td data-label="Network UpTime">{iot?.avalibility}</td>
          <td data-label="Equipment on (Hrs)">{iot?.on_hours}</td>
          <td data-label="Power Consumption (KWH)">{iot?.kwh}</td>
        </tr>
      );
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <li
          key={i}
          className={`page-item ${currentPage == i ? 'active' : ''}`}
        >
          <button
            className="page-link"
            onClick={() => handlePageChange(i)}
          >
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
        {paginationItems}
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
    <div className="deviceReports">
      <div className="header-report">
        <h3 style={{ marginLeft: "1rem" }}>Daily Reports <span style={{ fontSize: '1.2rem' }}>({startDate} - {endDate})</span></h3>
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
                <CSVLink {...csvReport}>
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
              <div role="group" className="form-row form-group mb-0" id="__BVID__1705">
                <h6 className="filter-label" style={{ padding: "10px 6px" }}>Filter by:</h6>
                <div className="col">
                  {/* <div role="group" className="input-group input-group-sm"></div> */}
                  {showClearButton && (
                    <ImCancelCircle className="cross-check" onClick={clearSearchInput} />
                  )}
                  <input
                    id="filterInput"
                    value={searchValue}
                    type="search"
                    placeholder="Type to Search"
                    className="form-control"
                    onChange={filterSearch}
                  />
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
                    <th>Equipment Name</th>
                    <th>Network UpTime</th>
                    <th>Equipment on (Hrs)</th>
                    <th>Power Consumption (KWH)</th>
                  </tr>
                </thead>
                <tbody>{renderTableData()}</tbody>
              </Table>
            </div>
          </div>
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
        </div>
      </div>
    </div>
  );
}

export default DailyReports
