import createDataContext from './createDataContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import httpClient from '../services/httpClient'
import * as rootNavigation from '../helpers/rootNavigation';
import { Alert } from 'react-native';

const initialState = {
    error: false,
    message: null,
    name: '',
    rondines: [],
    ronda: '',
    fetchingData: false
}

const PatrolsListRedcer = (state = initialState, action) => {

    switch (action.type) {
        case 'CLEAR_STATE':
            return { ...initialState }
        case 'FETCHING_DATA':
            return {
                ...state,
                error: false,
                message: null,
                fetchingData: action.payload.fetchingData
            }
        case 'SET_RONDINES':
            return {
                ...state,
                fetchingData: false,
                error: false,
                message: "",
                rondines: action.payload.rondines
            }
        case 'SET_RONDA':
            return {
                ...state,
                fetchingData: false,
                error: false,
                message: "",
                ronda: action.payload.ronda
            }
        case 'SET_ERROR':
            return {
                ...initialState,
                fetchingData: false,
                error: action.payload.error,
                message: action.payload.message
            }
        default:
            return state
    }

}

const clearState = (dispatch) => {
    return () => {
        dispatch({ type: 'CLEAR_STATE' });
    }
}

const fetchingData = (dispatch) => {
    return async () => {
        dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: true } });
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        const token = user.token
        let date = moment(new Date()).format('DD-MM-YYYY , h:mm:ss a')
        let expiration = moment(user.expiracion).format('DD-MM-YYYY , h:mm:ss a')
        if (expiration < date) {
            Alert.alert(
                "Tiempo Agotado",
                "Tiempo se sesion acabado.",
                [{
                    text: "Aceptar",
                    onPress: () => rootNavigation.navigate('AuthScreen')
                }]
            )
        } else {
            const rondines = await httpClient.get(`rondas/obtenerRondines`,
                {
                    'Authorization': `Bearer ${token}`,
                }
            );
            dispatch({
                type: 'SET_RONDINES',
                payload: { rondines }
            })
        }
    }
}



const setRonda = (dispatch) => {
    return async (id) => {
        try {
            dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: true } });
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const token = user.token
            const ronda = await httpClient.get(`rondas/crearRonda/${id}`,
                {
                    'Authorization': `Bearer ${token}`,
                });
            if (ronda == `El Rondin ${id}, no existe`) {
                Alert.alert(
                    "Error",
                    `${ronda}`,
                    [{
                        text: "Aceptar",
                        onPress: () => rootNavigation.navigate('PatrolListScreen')
                    }]
                )
            } else {
                dispatch({
                    type: 'SET_RONDA',
                    payload: { ronda }
                })
                rootNavigation.navigate('PointsListScreen')
            }
        } catch {
            Alert.alert(
                "Error",
                "No se encontro ningun rondin.",
                [{
                    text: "Aceptar",
                }]
            )
        }
    }
}



export const { Context, Provider } = createDataContext(
    PatrolsListRedcer,
    {
        clearState,
        setRonda,
        fetchingData,
    },
    initialState
);