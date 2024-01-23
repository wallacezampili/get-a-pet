// api
import api from '../utils/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFlashMessage from './useFlashMessage';

export default function useAuth() {
    const { setFlashMessage } = useFlashMessage();
    const [authenticated, setAuthenticated] = useState();
    const navigate = useNavigate()


    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            api.defaults.headers.Authorization = `Bearer ${token}`;
            setAuthenticated(true);
        }
    }, []);


    async function register(user) {

        let msgText = 'Cadastro realizado com sucesso!';
        let msgType = 'success';


        try {
            //Send data to api
            const data = await api.post('/users/register', user).then((response) => {
                return response.data;
            });

            authUser(data);

        } catch (error) {
            msgText = error.response.data.message;
            msgType = 'error';

            console.log(error);
        }


        setFlashMessage(msgText, msgType);
    }

    async function authUser(data) {
        setAuthenticated(true);
        localStorage.setItem('token', data.token)
        navigate('/');
    }

    function logout() {

        let msgText = 'Logout realizado com sucesso';
        let msgType = 'success';

        localStorage.removeItem('token');
        setAuthenticated(false);
        api.defaults.headers.Authorization = undefined;

        navigate('/');
        setFlashMessage(msgText, msgType);
    }

    async function login(user) {
        let msgText = 'Login realizado com sucesso';
        let msgType = 'success';

        try {

            const data = await api.post('/users/login', user).then((response) => {
                 return response.data 
                });
            
            authUser(data);

        } catch (error) {
            msgText = error.response.data.message;
            msgType = 'error';

        }

        setFlashMessage(msgText, msgType);
    }
    return { authenticated, register, logout, login }
}