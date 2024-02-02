import { code } from '../messages'
import { notifyError, notifySuccess } from './NotificationService'
import axios from 'axios';
import Cookies from 'universal-cookie';

/************************************************
* this function is to request to register countries
*************************************************/
interface countriesInfo {
    country: string
    isStorage: Boolean
}

interface Country {
    name: { common: string; [key: string]: string };
}

export const registerCountries = async (shipCountry: string[], storageCountry: string[]) => {
    const server_url = process.env.REACT_APP_SERVER_API_URL!
    const register_url = process.env.REACT_APP_REGISTER_COUNTRIES!

    let w_data:countriesInfo[] = []
    shipCountry.map(country => {
        let w_temp_data: countriesInfo = {country: country, isStorage: false}
        w_data.push(w_temp_data)
    })
    storageCountry.map(country => {
        let w_temp_data: countriesInfo = {country: country, isStorage: true}
        w_data.push(w_temp_data)
    })

    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };

    try {
        let w_response = await axios.post(server_url + register_url, {countries: w_data}, headers)
        if(w_response.status === 200){
            let data:any = w_response.data;

            if(data.status){
                notifySuccess(data.message)
            } else {
                notifyError(data.message, data.errors)
            }       
        }
    } catch (error: any) {
        notifyError(code[5011], error)
    }
}

export const getCountries = async() => {
    const server_url = process.env.REACT_APP_SERVER_API_URL!
    const getcountry_url = process.env.REACT_APP_GET_COUNTRIES!
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    try {
        let w_response = await axios.post(server_url + getcountry_url, [], headers)
        if(w_response.status === 200){
            let data:any = w_response.data;
            if(data.status){
                return {
                    ship: data.ship,
                    storage: data.storage
                }
            } else {
                notifyError(data.message, data.errors)
            }       
        }
    } catch(error:any) {
        notifyError(code[5011], error)
    }
    
    return {
        ship: [],
        storage: []
    }
}

export const getAllCountries = async (): Promise<string[]> => {
    let w_country_names = [];
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const countries = await response.json();
        w_country_names = countries.map((country: Country) => country.name.common)
    } catch (error) {
        console.error('Error fetching countries:', error);
        w_country_names = ['Switzerland', 'Germany', 'Austria', 'USA', 'Ukraine', 'Pakistan', 'India']
    }
    return w_country_names
}

export const getPrices = async() => {
    const server_url = process.env.REACT_APP_SERVER_API_URL!
    const getprice_url = process.env.REACT_APP_GET_PRICE!
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    try {
        let w_response = await axios.post(server_url + getprice_url, [], headers)
        if(w_response.status === 200){
            let data:any = w_response.data;
            if(data.status){
                return data.data
            } else {
                notifyError(data.message)
            }      
        } else {
            notifyError('network error')
        }
    } catch(error:any) {
        notifyError(code[5011], error)
    }
    
    return{
        pricePerGram: 0,
        costShip: 0,
        costStorage: 0
    }
}

export const setPrices = async (price: number, type:string) => {
    const server_url = process.env.REACT_APP_SERVER_API_URL!
    const setprice_url = process.env.REACT_APP_SET_PRICE!

    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    let w_temp_obj = {}
    if(type === 'pricepergram') {
        w_temp_obj = {pricePerGram: price}
    } else if(type === 'costship') {
        w_temp_obj = {costShip: price}
    } else {
        w_temp_obj = {costStorage: price}
    }

    try {
        let w_response = await axios.post(server_url + setprice_url, {price: w_temp_obj}, headers)
        if(w_response.status === 200){
            let data:any = w_response.data;

            if(data.status){
                notifySuccess(data.message)
            } else {
                notifyError(data.message, data.errors)
            }       
        }
    } catch (error: any) {
        notifyError(code[5011], error)
    }
}

export const getWeight = async () => {
    const server_url = process.env.REACT_APP_SERVER_API_URL!
    const getweight_url = process.env.REACT_APP_GET_WEIGHT!
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    try {
        let w_response = await axios.post(server_url + getweight_url, [], headers)
        if(w_response.status === 200){
            let data:any = w_response.data;
            if(data.status){
                return data.data
            } else {
                notifyError(data.message)
            }       
        }
    } catch(error:any) {
        notifyError(code[5011], error)
    }
    
    return []
}

export const getWeightObjects = async () => {
    const server_url = process.env.REACT_APP_SERVER_API_URL!
    const getweight_url = process.env.REACT_APP_GET_WEIGHT_OBJECTS!
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    try {
        let w_response = await axios.post(server_url + getweight_url, [], headers)
        if(w_response.status === 200){
            let data:any = w_response.data;
            if(data.status){
                return data.data
            } else {
                notifyError(data.message)
            }       
        }
    } catch(error:any) {
        notifyError(code[5011], error)
    }
    
    return []
}

export const saveWeights = async (weight: string[]) => {
    const server_url = process.env.REACT_APP_SERVER_API_URL!
    const setweight_url = process.env.REACT_APP_SET_WEIGHT!

    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    let w_temp_val = weight.map((val) => { return {weight: val.substring(0, val.length - 1)}})
    try {
        let w_response = await axios.post(server_url + setweight_url, {weight: w_temp_val}, headers)
        if(w_response.status === 200){
            let data:any = w_response.data;

            if(data.status){
                notifySuccess(data.message)
            } else {
                notifyError(data.message, data.errors)
            }       
        }
    } catch (error: any) {
        notifyError(code[5011], error)
    }
}
