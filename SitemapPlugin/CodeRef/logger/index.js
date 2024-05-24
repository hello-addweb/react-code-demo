import dotenv from "dotenv";
dotenv.config();

/***
 * Basic logger, currently just output to console
 * @param data
 */
const { REACT_APP_DEBUG, REACT_APP_ERROR_DEBUG } = process.env


const logError = (data, message = "") => {
    var debug = REACT_APP_ERROR_DEBUG ? REACT_APP_ERROR_DEBUG : false;
    if(debug===true){
        if (message) {
            console.error(message + ":");
        }
        console.error(data);
    }
};

function customLogger() {
    var debug = REACT_APP_DEBUG ? REACT_APP_DEBUG : false;
    if (debug) {
        console.log(...arguments)
    }
}
export {
    logError,
    customLogger
};
