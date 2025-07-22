import axios from 'axios';

export async function getEnterpriseName () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/enterprisename');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getCurrent () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/current');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getLow () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/low');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getHigh () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/high');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getLastOpen () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/opendata');
        return parseFloat(result.data[result.data.length - 1].toFixed(2));
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getOpenData () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/opendata');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getLastClose () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/closedata');
        return parseFloat(result.data[result.data.length - 2].toFixed(2));
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getCloseData () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/closedata');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getVolumeData () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/volumedata');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
}

export async function getMinData () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/mindata');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getMaxData () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/maxdata');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getMin () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/min');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getMax () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/max');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getDateData () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/date');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getMean () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/mean');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getSMA (period) {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/sma_' + period);
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getMACD () {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/macd');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
}

export async function getEMA (period) {
    try {
        let result = await  axios.get(import.meta.env.VITE_API_URL + '/ema_' + period);
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
} 

export async function getBollingerBand () {
    try {
        let result = await axios.get(import.meta.env.VITE_API_URL + '/bollingerband');
        return result.data;
    }
    catch (err) {
        console.log(err.response.data);
        return null;
    }
}