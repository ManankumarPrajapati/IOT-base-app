var net = require("net");
var mysql = require("mysql");
var moment = require("moment");
var http = require("http");
var httpserver = http.createServer();
var socketio = require("socket.io")(httpserver);
var empty = require("is-empty");

var schedule = require("node-schedule");
var nodecron = require("node-cron");
var results = require("./results.json");
var resultsfirst = require("./resultsfirst.json");

const pdf = require("html-pdf")
const fs = require("fs")

const nodemailer = require("nodemailer");


function sendmailorg(pdfFilePath) {
    console.log(">pdfFilePath", pdfFilePath)
    // Create a Nodemailer   transporter using your email configuration
    let transporter = nodemailer.createTransport({
        host: "mail.rapiot.in",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "reports@rapiot.in", // your email address
            pass: "vcnil26ylznc", // your email password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // Define email options
    const mailOptions = {
        from: '"Reports" <reports@rapiot.in>',
        to: "manan.p@pyther.com", // Replace with the recipient's email address
        subject: "Monthly Report", // Replace with your subject
        text: "Please find attached monthly report.", // Replace with your email body text
        attachments: [
            {
                filename: "monthly_report.pdf", // The name you want for the attachment
                path: pdfFilePath, // The path to the generated PDF file
            },
        ],
    };

    // Send the email with the attachment
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log("Email sent successfully!");
        }
    });
}

//const ChartJsImage = require('chartjs-to-image');
// const QuickChart = require('quickchart-js');
//const QuickChart = require('chart.js');

//var dateFormat = require('dateformat');
var interval = "";
var sockets = [];
var sockets_info = [];

var connection = mysql.createConnection({
    multipleStatements: true,
    host: "localhost",
    user: "rapiot_user",
    password: "911ibuy7tnhq",
    database: "rapiot_tatawb",
    dateStrings: ["DATE", "DATETIME"],
});

//const job = nodecron.schedule("0 19 23 3 * * *", () => {

const job = nodecron.schedule("0 30 06 1 * * *", () => {
    console.log(new Date().toLocaleString());
    // monthlyreport();
});

// Generate the chart

// function sendmailorg() {
//     //htmlbody +='<img height="200px" width="200px" src="${chart.toDataUrl()}"/>';
//     //bcc: "prathvi.singh@gmail.com",
//     // to: "pkde@tatasteel.com",
//     // cc: "rapiot@rapturous.co.in; pericherla.praneeth@tatasteel.com",
//     // bcc: "prathvi.singh@gmail.com",
// }

const monthlyreport = async () => {
    console.log("current_time");
    var current_time = moment();
    var end_time = moment(moment().format("YYYY-MM-DD") + " 06:05:00").format("YYYY-MM-DD hh:mm:ss");
    var start_time = moment(moment().format("YYYY-MM-DD") + " 06:05:00")
        .subtract(1, "days")
        .format("YYYY-MM-DD hh:mm:ss");
    var diff = current_time.diff(end_time, "seconds");

    if (diff < 0) {
        end_time = moment(moment().format("YYYY-MM-DD") + " 06:05:00")
            .subtract(1, "days")
            .format("YYYY-MM-DD hh:mm:ss");
        start_time = moment(moment().format("YYYY-MM-DD") + " 06:05:00")
            .subtract(2, "days")
            .format("YYYY-MM-DD hh:mm:ss");
    }

    var startdate = moment(start_time).format("YYYY-MM-DD");
    var enddate = moment(end_time).format("YYYY-MM-DD");
    console.log("startdate:: " + startdate);
    console.log("enddate::: " + enddate);

    startdate = "2023-05-16";
    enddate = "2023-05-17";

    var nodemailer = require("nodemailer");
    let transporter = nodemailer.createTransport({
        host: "mail.rapiot.in",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "reports@rapiot.in", // generated ethereal user
            pass: "vcnil26ylznc", // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    var nodemailer = require("nodemailer");

    var sqlfirst =
        "SELECT drd.imei_no, md.title, drd.kwh kwh, DATE(drd.update_time) insert_time FROM device_received_data drd LEFT JOIN master_device md ON drd.imei_no=md.imei_no WHERE DATE(drd.update_time)=(SELECT DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH,'%Y-%m-01'))";

    var sql =
        "SELECT drd.imei_no, md.title, drd.kwh kwh, DATE(drd.update_time) insert_time FROM device_received_data drd LEFT JOIN master_device md ON drd.imei_no=md.imei_no WHERE DATE(drd.update_time)=(SELECT LAST_DAY(now() - INTERVAL 1 MONTH))";

    console.log("---------After Query----------");
    var htmlbody = "";
    if (results.length > 0) {
        if (resultsfirst.length > 0) {
            const headmonthyear = moment().add(-1, "months").format("MMMM-YYYY");
            const startOfMonth = moment().add(-1, "months").startOf("month").format("YYYY-MM-DD");
            const endOfMonth = moment().add(-1, "months").endOf("month").format("YYYY-MM-DD");

            var htmlbody =
                '<table><tr><td><b><h2>Monthly Report</h2></b></td></tr><tr style="text-align:center;"><td><b><h3>Power Consumption Report QSE (' +
                headmonthyear +
                ")</h3></b></td></tr><tr><td><i>" +
                startOfMonth +
                " 00:10:00</i> TO <i>" +
                endOfMonth +
                ' 12:00:00</i></td></tr><tr><td><table style="background-color:#999999;color:#000000;text-align:center;"><tr style="background-color:#ffffff;"><th rowspan="2">Feeder Name</th><th colspan="2">Initial Reading </th><th colspan="2">Final Reading </th><th rowspan="2">Total Consumption(KWH)</th></tr><tr style="background-color:#ffffff;"><th> KWH (Reading) </th><th>&nbsp;&nbsp; Date &nbsp;&nbsp;</th><th> KWH (Reading) </th><th>&nbsp;&nbsp; Date &nbsp;&nbsp;</th></tr>';

            var a = 0;
            for (var i = 0; i < results.length; i++) {
                var data_last = results[i];
                var data_first = resultsfirst[i];

                if (data_first.imei_no == "868626047771624") {
                    var MSS1_title = data_first.title;
                    var MSS1_KWH = data_first.kwh;
                    var MSS1_DATE = data_first.insert_time;
                }
                if (data_first.imei_no == "868618057038580") {
                    var MSS2_title = data_first.title;
                    var MSS2_KWH = data_first.kwh;
                    var MSS2_DATE = data_first.insert_time;
                }
                if (data_first.imei_no == "860936054888346" && data_first.imei_no != undefined) {
                    var Three_KV_title = data_first.title;
                    var Three_KV_KWH = data_first.kwh;
                    var Three_KV_DATE = data_first.insert_time;
                } else {
                    var Three_KV_title = "3.3 KV OUTGOING FDR-1";
                    var Three_KV_KWH = 0;
                    var Three_KV_DATE = "00:00:00";
                }
                if (data_first.imei_no == "868618057038788") {
                    var electrical_sho_title = data_first.title;
                    var electrical_sho_KWH = data_first.kwh;
                    var electrical_sho_DATE = data_first.insert_time;
                }
                if (data_first.imei_no == "868618057038655") {
                    var pump1_title = data_first.title;
                    var pump1_KWH = data_first.kwh;
                    var pump1_DATE = data_first.insert_time;
                }
                if (data_first.imei_no == "868618057038762") {
                    var pump2_title = data_first.title;
                    var pump2_KWH = data_first.kwh;
                    var pump2_DATE = data_first.insert_time;
                }
                if (data_first.imei_no == "868618057038606") {
                    var pump3_title = data_first.title;
                    var pump3_KWH = data_first.kwh;
                    var pump3_DATE = data_first.insert_time;
                }

                //---------------------first end---------------------------

                if (data_last.imei_no == "868626047771624") {
                    var l_MSS1_title = data_last.title;
                    var l_MSS1_KWH = data_last.kwh;
                    var l_MSS1_DATE = data_last.insert_time;
                }
                if (data_last.imei_no == "868618057038580") {
                    var l_MSS2_title = data_last.title;
                    var l_MSS2_KWH = data_last.kwh;
                    var l_MSS2_DATE = data_last.insert_time;
                }
                if (data_last.imei_no == "860936054888346" && data_last.imei_no == undefined) {
                    var l_Three_KV_title = data_last.title;
                    var l_Three_KV_KWH = data_last.kwh;
                    var l_Three_KV_DATE = data_last.insert_time;
                } else {
                    var l_Three_KV_KWH = 0;
                    var l_Three_KV_DATE = "00:00:00";
                }
                if (data_last.imei_no == "868618057038788") {
                    var l_electrical_sho_title = data_last.title;
                    var l_electrical_sho_KWH = data_last.kwh;
                    var l_electrical_sho_DATE = data_last.insert_time;
                }
                if (data_last.imei_no == "868618057038655") {
                    var l_pump1_title = data_last.title;
                    var l_pump1_KWH = data_last.kwh;
                    var l_pump1_DATE = data_last.insert_time;
                }
                if (data_last.imei_no == "868618057038762") {
                    var l_pump2_title = data_last.title;
                    var l_pump2_KWH = data_last.kwh;
                    var l_pump2_DATE = data_last.insert_time;
                }
                if (data_last.imei_no == "868618057038606") {
                    var l_pump3_title = data_last.title;
                    var l_pump3_KWH = data_last.kwh;
                    var l_pump3_DATE = data_last.insert_time;
                }

                var initial_date = MSS1_DATE;
                var last_date = l_MSS1_DATE;

                //htmlbody += '<tr style="background-color:'+bg_color+'"><td style="padding-right:10px">'+d.title+'</td><td style="padding-right:10px">'+(d.avalibility?d.avalibility:'00:00:00')+'</td><td style="padding-right:10px">'+d.on_hours?d.on_hours:'---'+'</td><td style="padding-right:10px">'+(d.kwh?d.kwh:'---')+'</td></tr>';
            }
            var MSS1_sub = 0;
            var MSS2_sub = 0;
            MSS1_sub = parseInt(l_MSS1_KWH) - parseInt(MSS1_KWH);
            // console.log("l_MSS1_KWH :"+l_MSS1_KWH);
            // console.log("MSS1_KWH :"+MSS1_KWH);
            MSS2_sub = parseInt(l_MSS2_KWH) - parseInt(MSS2_KWH);
            //console.log("MSS2_sub :"+MSS2_sub);
            var MSS1plsMSS2 = 0;
            MSS1plsMSS2 = parseInt(MSS1_sub) + parseInt(MSS2_sub);
            //console.log("MSS1_sub :"+MSS1_sub);

            var Three_KV_sub = 0;
            Three_KV_sub = parseInt(l_Three_KV_KWH) - parseInt(Three_KV_KWH);
            // console.log("l_Three_KV_KWH :"+l_Three_KV_KWH);
            // console.log("Three_KV_KWH :"+Three_KV_KWH);
            // console.log("Three_KV_sub :"+Three_KV_sub);

            var electrical_sho_sub = 0;
            electrical_sho_sub = parseInt(l_electrical_sho_KWH) - parseInt(electrical_sho_KWH);
            // console.log("l_electrical_sho_KWH :"+l_electrical_sho_KWH);
            // console.log("electrical_sho_sub :"+electrical_sho_sub);
            // console.log("electrical_sho_sub :"+electrical_sho_sub);

            var pump1_sub = 0;
            var pump2_sub = 0;
            var pump3_sub = 0;

            var pump1_sub = parseInt(l_pump1_KWH) - parseInt(pump1_KWH);
            // console.log("l_pump1_KWH :"+l_pump1_KWH);
            // console.log("pump1_KWH :"+pump1_KWH);
            // console.log("pump1_sub :"+pump1_sub);

            var pump2_sub = parseInt(l_pump2_KWH) - parseInt(pump2_KWH);
            // console.log("l_pump2_KWH :"+l_pump2_KWH);
            // console.log("pump2_KWH :"+pump2_KWH);
            // console.log("pump2_sub :"+pump2_sub);

            var pump3_sub = parseInt(l_pump3_KWH) - parseInt(pump3_KWH);
            // console.log("l_pump3_KWH :"+l_pump3_KWH);
            // console.log("pump3_KWH :"+pump3_KWH);
            // console.log("pump3_KWH :"+pump3_sub);

            //console.log("total_energy_expected_kwh :"+total_energy_expected_kwh);

            var total_energy_expected_kwh;
            total_energy_expected_kwh = parseInt(Three_KV_sub + electrical_sho_sub + pump1_sub + pump2_sub + pump3_sub);

            var light_and_other_load = MSS1plsMSS2 - total_energy_expected_kwh;
            //console.log("light_and_other_load :"+light_and_other_load);

            //return 0;

            //[MSS1plsMSS2, total_energy_expected_kwh,light_and_other_load]
            //['Total Energy Impoted (KWH)', 'Lighting & Other load','Total Energy Exported (KWH)']

            const QuickChart = require("quickchart-js");

            const myChart = new QuickChart();
            myChart
                .setConfig({
                    type: "doughnut",
                    data: {
                        datasets: [
                            {
                                backgroundColor: ["#dbdb16", "#a6f5bb", "#FFB6C1"],
                                data: [MSS1plsMSS2, total_energy_expected_kwh, light_and_other_load],
                            },
                        ],
                        labels: ["Total Energy Import (KWH)", "Total Energy Export (KWH)", "Lighting & Other load"],
                    },
                    options: {
                        plugins: {
                            datalabels: {
                                formatter: (value) => {
                                    return value + " KWH";
                                },
                            },
                        },
                    },
                })
                .setWidth(800)
                .setHeight(400)
                .setBackgroundColor("transparent");

            const chartImageUrl = myChart.getUrl();

            htmlbody +=
                '<tbody style="background-color:white";><tr><td>' +
                MSS1_title +
                "</td><td>" +
                MSS1_KWH +
                "</td><td>" +
                MSS1_DATE +
                "</td><td>" +
                l_MSS1_KWH +
                "</td><td>" +
                l_MSS1_DATE +
                '</td><td style="text-align:center;">' +
                MSS1_sub +
                "</td></tr><tr><td>" +
                MSS2_title +
                "</td><td>" +
                MSS2_KWH +
                "</td><td>" +
                MSS2_DATE +
                "</td><td>" +
                l_MSS2_KWH +
                "</td><td>" +
                l_MSS2_DATE +
                '</td><td style="text-align:center;">' +
                MSS2_sub +
                '</td></tr><tr style="background-color:yellow;"><td colspan="5">Total Energy Import (KWH)</td><td style="text-align:center;">' +
                MSS1plsMSS2 +
                "</td></tr><tr><td>" +
                Three_KV_title +
                "</td><td> " +
                Three_KV_KWH +
                " </td><td>" +
                Three_KV_DATE +
                "</td><td>" +
                l_Three_KV_KWH +
                "</td><td>" +
                l_Three_KV_DATE +
                '</td><td style="text-align:center;">' +
                Three_KV_sub +
                "</td></tr><tr><td>" +
                electrical_sho_title +
                "</td><td>" +
                electrical_sho_KWH +
                "</td><td>" +
                electrical_sho_DATE +
                "</td><td>" +
                l_electrical_sho_KWH +
                "</td><td>" +
                l_electrical_sho_DATE +
                '</td><td style="text-align:center;">' +
                electrical_sho_sub +
                "</td></tr><tr><td>" +
                pump1_title +
                "</td><td>" +
                pump1_KWH +
                "</td><td>" +
                pump1_DATE +
                "</td><td>" +
                l_pump1_KWH +
                "</td><td>" +
                l_pump1_DATE +
                '</td><td style="text-align:center;">' +
                pump1_sub +
                "</td></tr><tr><td>" +
                pump2_title +
                "</td><td>" +
                pump2_KWH +
                "</td><td>" +
                pump2_DATE +
                "</td><td>" +
                l_pump2_KWH +
                "</td><td>" +
                l_pump2_DATE +
                '</td><td style="text-align:center;">' +
                pump2_sub +
                "</td></tr><tr><td>" +
                pump3_title +
                "</td><td>" +
                pump3_KWH +
                "</td><td>" +
                pump3_DATE +
                "</td><td>" +
                l_pump3_KWH +
                "</td><td>" +
                l_pump3_DATE +
                '</td><td style="text-align:center;">' +
                pump3_sub +
                '</td></tr><tr style="background-color:#a6f5bb;"><td colspan="5">Total Energy Export (KWH)</td><td style="text-align:center;">' +
                total_energy_expected_kwh +
                '</td></tr><tr style="background-color:pink;"><td colspan="5">Lighting and other Load</td><td style="text-align:center;">' +
                light_and_other_load +
                '</td></tr><tr><td colspan="6" style="text-align:center"><img height="250px" width="500px" src=' +
                chartImageUrl +
                "/></td></tr>";

            function generatePDF(htmlContent, pdfFilePath) {
                // PDF generation options
                const options = {
                    format: "Tabloid",
                    orientation: "portrait",
                };

                // Generate the PDF
                pdf.create(htmlContent, options).toFile(pdfFilePath, (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("PDF generated successfully!");
                    }
                });
            }

            let htmlContent = `<!DOCTYPE html>
            <html>
            <head>
                <title>Monthly Report</title>
            </head>
            <body>
            <div>
                ${htmlbody}
                </div>
            </body>
            </html>`;

            // Define the path where you want to save the PDF
            const pdfFilePath = "monthly_report.pdf";

            // Generate the PDF
            generatePDF(htmlContent, pdfFilePath);

            sendmailorg(pdfFilePath);

            // console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            /*let mailOptions = {
                    from: 'reports@rapturous.co.in',
                    to: 'prathvi.singh@gmail.com',
                    subject: 'Daily Report',
                    html: htmlbody
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                         return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });*/
        } else {
            htmlbody += "<tr>0 results</tr>";
        }
    }
};


monthlyreport();