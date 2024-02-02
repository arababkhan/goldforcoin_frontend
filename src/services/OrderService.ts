import { code } from '../messages'
import { notifyError, notifySuccess } from './NotificationService'
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Order } from '../types/orderType'

export const addOrder = async (order: Order) => {
    const server_url = process.env.REACT_APP_SERVER_API_URL!
    const addorder_url = process.env.REACT_APP_ADD_ORDER!
    
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };

    try {
        let w_response = await axios.post(server_url + addorder_url, {order: order}, headers)
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

export const getOrders = async() => {
    const server_url = process.env.REACT_APP_SERVER_API_URL!
    const getorders_url = process.env.REACT_APP_GET_ORDERS!
    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    try {
        let w_response = await axios.post(server_url + getorders_url, [], headers)
        if(w_response.status === 200){
            let data:any = w_response.data;
            if(data.status){
                return data.orders
            } else {
                notifyError(data.message, data.errors)
            }       
        }
    } catch(error:any) {
        notifyError(code[5011], error)
    }
    
    return []
}

export const updateOrder = async (orderId: number, orderStatus: string) => {
    const server_url = process.env.REACT_APP_SERVER_API_URL!
    const updatestate_url = process.env.REACT_APP_UPDATE_ORDER!

    const cookies = new Cookies()
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };
    
    try {
        let w_response = await axios.post(server_url + updatestate_url, {orderId: orderId, data: {status: orderStatus}}, headers)
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