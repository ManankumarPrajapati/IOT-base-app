import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import Navbar from './Navbar';
import { ImCancelCircle } from 'react-icons/im';
import { convertDate, getToken, getUser } from '../utils/constant';
import ApiServices from '../services/apiServices';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { CSVLink } from "react-csv";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const MonthlyReports = () => {
  const [perData, setPerData] = useState(15);
  const [filteredList, setFilteredList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [showClearButton, setShowClearButton] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(JSON.stringify(new Date().getMonth()));
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [userName, setUsername] = useState(getUser())
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);

  const monthData = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" }
  ];

  const yearData = [
    { label: "2020", value: "2020" },
    { label: "2021", value: "2021" },
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" }
  ]

  function setPropertiesToNullByIMEI(array, imeiList) {
    for (let i = 0; i < array.length; i++) {
      let obj = array[i];
      if (imeiList.includes(obj.title)) {
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
      { label: "Power Availability (DD:HH:MM)", key: "avalibility" },
      { label: "Equipment on (Hrs) (DD:HH:MM)", key: "on_hours" },
      { label: "Power Consumption (KWH)", key: "kwh" },
    ];

    const records = csvReport.data;

    const pdfdata = [[]];

    fields.forEach((element) => {
      pdfdata[0].push(element.label);
    });

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const data = [];

      fields.forEach((element) => {
        let value = record[element.key];

        if (element.key == 'voltage_r') {
          value = value / 1000;
        }

        data.push(value);
      });

      pdfdata.push(data);
    }

    const docDefinition = {
      content: [
        { text: 'Monthly Report', style: 'heading' },
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

    pdfMake.createPdf(docDefinition).download('Monthly Report.pdf');
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
      { label: "Power Availability (DD:HH:MM)", key: "avalibility" },
      { label: "Equipment on (Hrs) (DD:HH:MM)", key: "on_hours" },
      { label: "Power Consumption (KWH)", key: "kwh" },
    ],
    filename: `Monthly Report.csv`,
  };

  function findData(event) {
    const selectedValue = parseInt(event.target.value);
    setPerData(selectedValue);
  }

  const setMonthData = (e) => {
    setMonth(e.target.value)
  }

  const setYearData = (e) => {
    setYear(e.target.value)
  }

  const getMonthlyReportAPI = async () => {
    setLoading(true)
    try {
      let body = {
        "accesskey": getToken(),
        "month": month.length > 1 ? month : '0' + month,
        "year": year
      }
      const dataReport = await ApiServices.callMonthlyReportsData(body)
      if (dataReport?.result?.device?.length > 0) {
        let data = new Object();
        dataReport?.result?.device.forEach(function (row) {
          if (!data[row.imei_no]) {
            data[row.imei_no] = new Object();
            data[row.imei_no]['kwh'] = 0;
            data[row.imei_no]['power_trips'] = 0;
            data[row.imei_no]['avalibility'] = 0;
            data[row.imei_no]['avalibility_days'] = 0;
            data[row.imei_no]['avalibility_hrs'] = 0;
            data[row.imei_no]['avalibility_mts'] = 0;

            data[row.imei_no]['on_hours'] = 0;
            data[row.imei_no]['on_hours_days'] = 0;
            data[row.imei_no]['on_hours_hrs'] = 0;
            data[row.imei_no]['on_hours_mts'] = 0;
          }
          if (row.kwh > 0) {
            data[row.imei_no]['kwh'] += parseInt(row.kwh);
          }
          data[row.imei_no]['title'] = row.title;
          data[row.imei_no]['power_trips'] += parseInt(row.power_trips);
          var avalibility = row.avalibility.split(":");
          var on_hours = 0;
          if (avalibility.length == 2) {
            data[row.imei_no]['avalibility_hrs'] += parseInt(avalibility[0]);
            data[row.imei_no]['avalibility_mts'] += parseInt(avalibility[1]);

            on_hours = row.on_hours.split(":");
            data[row.imei_no]['on_hours_hrs'] += parseInt(on_hours[0]);
            data[row.imei_no]['on_hours_mts'] += parseInt(on_hours[1]);
          }
          else {
            data[row.imei_no]['avalibility_hrs'] += 0;
            data[row.imei_no]['avalibility_mts'] += 0;

            on_hours = row.on_hours.split(":");
            data[row.imei_no]['on_hours_hrs'] += 0;
            data[row.imei_no]['on_hours_mts'] += 0;
          }
        });
        for (const [key, value] of Object.entries(data)) {
          var v_div_mtr = parseInt(value.avalibility_mts) / 60;
          var v_per_mtr = String(parseInt(value.avalibility_mts) % 60).padStart(2, '0');

          value.avalibility_hrs += parseInt(v_div_mtr);

          var v_div_hrs = parseInt(value.avalibility_hrs) / 24;
          var v_per_hrs = String(parseInt(value.avalibility_hrs) % 24).padStart(2, '0');
          value.avalibility_days += parseInt(v_div_hrs);
          value.avalibility = String(value.avalibility_days).padStart(2, '0') + ':' + v_per_hrs + ':' + v_per_mtr;

          var on_div_mtr = parseInt(value.on_hours_mts) / 60;
          var on_per_mtr = String(parseInt(value.on_hours_mts) % 60).padStart(2, '0');

          value.on_hours_hrs += parseInt(on_div_mtr);

          var on_div_hrs = parseInt(value.on_hours_hrs) / 24;
          var on_per_hrs = String(parseInt(value.on_hours_hrs) % 24).padStart(2, '0');
          value.on_hours_days += parseInt(on_div_hrs);
          value.on_hours = String(value.on_hours_days).padStart(2, '0') + ':' + on_per_hrs + ':' + on_per_mtr;
        }
        var device_data = new Array();
        for (const [key, value] of Object.entries(data)) {
          var o = new Object();
          o.title = value.title;
          o.avalibility = value.avalibility;
          o.on_hours = value.on_hours;
          o.power_trips = value.power_trips;
          o.kwh = value.kwh;
          if (value.title != null) {
            device_data.push(value);
          }
        }
        setFilteredList(device_data)
        setStartDate(dataReport?.result?.report_start_time)
        setEndDate(dataReport?.result?.report_end_time)
      } else {
        setFilteredList([])
      }
      setLoading(false)
    } catch (err) {
      console.log(">>deviceData err")
    }
  }

  useEffect(() => {
    getMonthlyReportAPI()
  }, [])

  const handleSubmitReport = () => {
    getMonthlyReportAPI();
  }

  const clearSearchInput = () => {
    setSearchValue('');
    setShowClearButton(false);
    getMonthlyReportAPI();
  };

  const filterSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchValue(query);
    setShowClearButton(query.length > 0);

    const updatedList = filteredList?.filter((item) => {
      return (
        item.title.toLowerCase().indexOf(query) !== -1
      );
    });
    setFilteredList(updatedList);
    setCurrentPage(1);
  };

  useEffect(() => {
    const totalPagesCount = Math.ceil(filteredList?.length / perData);
    setTotalPages(totalPagesCount);
  }, [filteredList, perData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderTableData = () => {
    const startIndex = (currentPage - 1) * perData;
    const endIndex = startIndex + perData;
    const currentData = filteredList?.length > 0 ? filteredList.slice(startIndex, endIndex) : [];

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
          <td data-label="Network UpTime (DD:HH:MM)">{iot?.avalibility}</td>
          <td data-label="Equipment on (Hrs) (DD:HH:MM)">{iot?.on_hours}</td>
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
          className={`page-item ${currentPage == i ? 'active' : ''}`}
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

  return (
    <div>
      <div className="deviceReports" style={{ marginTop: "5rem" }}>
        <div className="header-report">
          <h3 style={{ marginLeft: "1rem" }}>Monthly Reports <span style={{ fontSize: '1.2rem' }}>({startDate} - {endDate})</span></h3>
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
            <div className="row row-form mt-4">
              <div className="col-lg-4">
                <div role="group" className="form-row input-filter form-group mb-0" id="__BVID__1705">
                  <h6 style={{ padding: "10px 6px" }}>Filter by:</h6>
                  <div className="col">
                    <div role="group" className="input-group input-group-sm"></div>
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
              <div className="form-inline form-lines" >
                <select defaultValue={month.length > 1 ? month : '0' + month} onChange={(e) => setMonthData(e)} className="mr-2 custom-select months" id="__BVID__97">
                  {monthData.length > 0 && monthData.map((data, index) => {
                    return (
                      <option key={index} value={data.value}>{data.label}</option>
                    )
                  })}
                </select>
                <select defaultValue={year} onChange={(e) => setYearData(e)} className="mr-2 custom-select years" id="__BVID__98">
                  {yearData.length > 0 && yearData.map((data, index) => {
                    return (
                      <option key={index} value={data.value}>{data.label}</option>
                    )
                  })}
                </select>
                <button onClick={() => handleSubmitReport()} type="button" className="btn-danger btn-submit submit">Submit</button>
              </div>
            </div>
            <div className="device">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Equipment Name</th>
                    <th>Power UpTime (DD:HH:MM)</th>
                    <th>Equipment on (Hrs) (DD:HH:MM)</th>
                    <th>Power Consumption (KWH)</th>
                  </tr>
                </thead>
                <tbody>{renderTableData()}</tbody>
              </Table>
            </div>
            <div className="row px-3">
              <div className="text-left col-lg-6 entries">
                <span className="mr-2">
                  Showing {((currentPage - 1) * perData) + 1} to{' '}
                  {Math.min(currentPage * perData, filteredList?.length)} of {filteredList?.length} entries
                </span>
              </div>

              <div className="text-right col-lg-6 entries " style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
    </div>
  );
};

export default MonthlyReports;
