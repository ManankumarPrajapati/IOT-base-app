import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'react-bootstrap';
import "jspdf-autotable";
import ApiServices from '../services/apiServices';
import { getToken } from '../utils/constant';
import "./pdf.css";
import ReactApexChart from 'react-apexcharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Pdf = () => {
  const [filteredList, setFilteredList] = useState([]);
  const [month, setMonth] = useState(JSON.stringify(new Date().getMonth()));;
  const [startDate, setStartDate] = useState();
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false)
  const [endDate, setEndDate] = useState();

  const indicesToExtract = [0, 1, 10, 11, 12, 13, 14];
  const updatedArray = indicesToExtract.map((index) => {return filteredList[index]});

  const contentRef = useRef(null);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const formattedStartDate = formatDate(firstDayOfMonth);
  const formattedEndDate = formatDate(lastDayOfMonth);

  const handleExportPDF = () => {
    const content = contentRef.current;

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, 210, 150);
      pdf.save('Monthly Report.pdf');
    });
  };


  const getPdfReportAPI = async () => {
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
          // if (value.title != null) {
            device_data.push(value);
          // }
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
    getPdfReportAPI();
    const interval = setInterval(() => {
      getPdfReportAPI()
    }, 20000);
    return () => clearInterval(interval);
  }, [])

  const [series, setSeries] = useState([44, 55, 13]);
  const [options, setOptions] = useState({
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Team A', 'Team B', 'Team C'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  });

  function getMonthNameFromNumber(monthNumber) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    if (monthNumber >= 1 && monthNumber <= 12) {
      return monthNames[monthNumber - 1];
    } else {
      return " ";
    }
  }
  const monthNumber = new Date().getMonth();
  const monthName = getMonthNameFromNumber(monthNumber);
  return (
    <>
      <div className='pdf-container' ref={contentRef}>
        <h2 className="pdf-header">Monthly Report</h2>
        <h3 className="report-head text-center">Power Consumption Report QSE ({monthName} - {year})</h3>
        <div className="pdf-table">
          <h5>From ({formattedStartDate} AM) To ({formattedEndDate} PM)</h5>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Feeder Name</th>
                <th colSpan="2">Initial Reading (KWH)</th>
                <th colSpan="2">Final Reading (KWH)</th>
                <th>Total Consumption (KWH)</th>
              </tr>
              <tr>
                <th></th>
                <th>Reading</th>
                <th>Date</th>
                <th>Reading</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {updatedArray.map((iot, index) => {
                return (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{iot?.title}</td>
                      <td>{iot?.kwh}</td>
                      <td>{iot?.on_hours}</td>
                      <td>{iot?.kwh}</td>
                      <td>{iot?.availability}</td>
                      <td>{iot?.kwh - iot?.kwh}</td>
                    </tr>
                    {index === 1 && (
                      <tr style={{ background: "yellow" }}>
                        <td>Total Energy Imported (KWH)</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>...</td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              <tr style={{ background: "skyblue" }}>
                <td>Total Energy Exported (KWH)</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>...</td>
              </tr>
              <tr style={{ background: "lightgreen" }}>
                <td>Lighting and other Load</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>...</td>
              </tr>
            </tbody>
          </Table>

        </div>
        <h3 className='pdfChart-header' style={{ display: "flex", justifyContent: "center" }}>Monthly Data Pie Chart ({monthName} - {year})</h3>
        <br />
        <br />
        <div className="pie-chart" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ReactApexChart options={options} series={series} type="pie" width={490} height={450}/>
        </div>
      </div>
    </>
  )
}

export default Pdf
