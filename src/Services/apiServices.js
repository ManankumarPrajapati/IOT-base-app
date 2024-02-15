import { logout } from "../utils/constant";

const apiUrl = "http://tatawb.rapiot.in:3000/scada-api/"
const ApiServices = {
    callLoginUsersData: async (apiBody) => {
        return await new Promise(async (resolve, reject) => {
            await fetch(apiUrl + 'login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiBody)
            })
                .then((response) => {
                        return response.json();
                })
                .then((response, error) => {
                    if (response) {
                        return resolve(response)
                    } else {
                        return reject(error)
                    }
                }).catch((err) => { console.log("CALL GET USERS DATA ERROR ==> ", err) })
        }).catch((err) => { console.log("CALL GET USERS DATA ERROR ===>", err) })
    },
    callDashboardData: async (apiBody) => {
        return new Promise(async (resolve, reject) => {
            await fetch(apiUrl + 'dashboard', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiBody)
            })
                .then((response) => {
                    if (response && response.status == 401) {
                        logout();
                    } else {
                        return response.json();
                    }
                })
                .then((response, error) => {
                    if (response) {
                        return resolve(response)
                    } else {
                        return reject(error)
                    }
                }).catch((err) => { console.log("ERROR DASHBOARD ==> ", err) })
        }).catch((err) => { console.log("ERROR===>", err) })
    },
    callDeviceData: async (apiBody) => {
        return new Promise(async (resolve, reject) => {
            await fetch(apiUrl + 'device-record', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiBody)
            })
                .then((response) => {
                    if (response && response.status == 401) {
                        logout();
                    } else {
                        return response.json();
                    }
                })
                .then((response, error) => {
                    if (response) {
                        return resolve(response)
                    } else {
                        return reject(error)
                    }
                }).catch((err) => { console.log("ERROR device-record ==> ", err) })
        }).catch((err) => { console.log("device-record ===>", err) })
    },
    callUIReportsData: async (apiBody) => {
        return new Promise(async (resolve, reject) => {
            await fetch(apiUrl + 'ui-report', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiBody)
            })
                .then((response) => {
                    if (response && response.status == 401) {
                        logout();
                    } else {
                        return response.json();
                    }
                })
                .then((response, error) => {
                    if (response) {
                        return resolve(response)
                    } else {
                        return reject(error)
                    }
                }).catch((err) => { console.log("ERROR UI reports ==> ", err) })
        }).catch((err) => { console.log("UI reports ===>", err) })
    },
    callDeviceInfoData: async (apiBody) => {
        return new Promise(async (resolve, reject) => {
            await fetch(apiUrl + 'device-all', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiBody)
            })
                .then((response) => {
                    if (response && response.status == 401) {
                        logout();
                    } else {
                        return response.json();
                    }
                })
                .then((response, error) => {
                    if (response) {
                        return resolve(response)
                    } else {
                        return reject(error)
                    }
                }).catch((err) => { console.log("ERROR DeviceInfo ==> ", err) })
        }).catch((err) => { console.log("DeviceInfo ===>", err) })
    },
    callDeviceReportsData: async (apiBody) => {
        return new Promise(async (resolve, reject) => {
            await fetch(apiUrl + 'device-report', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiBody)
            })
                .then((response) => {
                    if (response && response.status == 401) {
                        logout();
                    } else {
                        return response.json();
                    }
                })
                .then((response, error) => {
                    if (response) {
                        return resolve(response)
                    } else {
                        return reject(error)
                    }
                }).catch((err) => { console.log("ERROR Device reports ==> ", err) })
        }).catch((err) => { console.log("Device reports ===>", err) })
    },
    callDailyReportsData: async (apiBody) => {
        return new Promise(async (resolve, reject) => {
            await fetch(apiUrl + 'daily-report', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiBody)
            })
                .then((response) => {
                    if (response && response.status == 401) {
                        logout();
                    } else {
                        return response.json();
                    }
                })
                .then((response, error) => {
                    if (response) {
                        return resolve(response)
                    } else {
                        return reject(error)
                    }
                }).catch((err) => { console.log("ERROR Daily reports ==> ", err) })
        }).catch((err) => { console.log("Daily reports ===>", err) })
    },
    callMonthlyReportsData: async (apiBody) => {
        return new Promise(async (resolve, reject) => {
            await fetch(apiUrl + 'monthly-report', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiBody)
            })
                .then((response) => {
                    if (response && response.status == 401) {
                        logout();
                    } else {
                        return response.json();
                    }
                })
                .then((response, error) => {
                    if (response) {
                        return resolve(response)
                    } else {
                        return reject(error)
                    }
                }).catch((err) => { console.log("ERROR monthly reports ==> ", err) })
        }).catch((err) => { console.log("Monthly reports ===>", err) })
    },
    callPdfData: async (apiBody) => {
        return new Promise(async (resolve, reject) => {
            await fetch(apiUrl + 'pdf', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiBody)
            })
                .then((response) => {
                    if (response && response.status === 401) {
                        logout();
                    } else {
                        return response.json();
                    }
                })
                .then((response, error) => {
                    if (response) {
                        return resolve(response)
                    } else {
                        return reject(error)
                    }
                }).catch((err) => { console.log("ERROR pdf reports data ==> ", err) })
        }).catch((err) => { console.log("Pdf reports data ===>", err) })
    }
}

export default ApiServices;