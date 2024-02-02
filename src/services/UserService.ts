import { code } from '../messages'
import { notifyError, notifySuccess } from './NotificationService'
import axios from 'axios';
import jwt from 'jwt-decode'
import Cookies from 'universal-cookie';
import { UserData } from '../types/userType';

/************************************************
* this function is to request to server for login
*************************************************/
export const login = async (account: string) => {
    const server_url = process.env.REACT_APP_SERVER_API_URL!
    const user_login = process.env.REACT_APP_USER_LOGIN!

    let w_return: UserData = {
        _id: '',
        authenticated: false,
        account: account,
        role: false
    };
    let w_data = {user_account: account}
    try {
        let w_response =  await axios.post(server_url + user_login, w_data)
        if(w_response.status === 200){
            let data:any = w_response.data;

            if(data.status){
                setCookie(data.token)
                w_return = jwt(data.token);
            } else {
                notifyError(code[5011], data.errors)
            }       
        }
    } catch(error: any) {
        notifyError(code[5011], error)
    }

    return w_return;
}

/************************************************
* this function is to save token to cookie
*************************************************/
const setCookie = (token:string) => {
    const cookie_expire = process.env.REACT_APP_COOKIE_EXPIRE!
    let d = new Date();
    d.setTime(d.getTime() + (parseInt(cookie_expire)*60*1000));
    const cookies = new Cookies();
    cookies.set("token", token, {path: "/", expires: d, sameSite: 'lax'});
}

export const setAdmin = async(newAccount:string, userId: string, userAccount: string) => {
    const server_url = process.env.REACT_APP_SERVER_API_URL!
    const set_admin = process.env.REACT_APP_SET_ADMIN!
    let w_return: UserData = {
        _id: userId,
        authenticated: true,
        account: userAccount,
        role: true
    };
    let w_data = {user_account: newAccount}

    const cookies = new Cookies();
    const headers = {
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ cookies.get('token')
        }
    };

    try {
        let w_response = await axios.post(server_url + set_admin, w_data, headers)
        if(w_response.status === 200){
            let data:any = w_response.data;

            if(data.status){
                setCookie(data.token)
                w_return = jwt(data.token);
                notifySuccess('Updated succeedly. Please login again.')
            } else {
                notifyError(data.message)
            }      
        } else {
            notifyError('network error')
        }
    } catch(error:any) {
        notifyError(code[5011], error)
    }

    return w_return
}