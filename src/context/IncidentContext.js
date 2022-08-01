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
    incident: [],
    commentIncident: '',
    incidenteTipoId: [],
    typeIncident: '',
    images: [],
    rondines: [],
    fetchingData: false
}

const IncidentRedcer = (state = initialState, action) => {

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

        case 'SET_DATA':
            let fieldName = action.payload.fieldName
            return {
                ...state,
                [fieldName]: action.payload.value,

            }
        case 'SET_INCIDENT':
            return {
                ...state,
                incident: action.payload.suggestions,

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

const setIncident = (dispatch) => {
    return async () => {
        dispatch({ type: 'FETCHING_DATA', payload: { fetchingData: true } });
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        const token = user.token
        const response = await httpClient.get(`incidentes/obtenerIncidenteTipos`,
            {
                'Authorization': `Bearer ${token}`,
            }
        );
        const suggestions = response
            .filter(item => item.descripcion.toLowerCase())
            .map(item => ({
                value: item.id,
                description: item.descripcion,

            }))

        dispatch({
            type: 'SET_INCIDENT',
            payload: { suggestions }
        })
    }
}

const store = (dispatch) => {
    return async (params, id, latitude, longitude) => {

        const imagesEvi = params.images.map(item => (
            `data:image/jpeg;base64,${item.source}`
        ))
        const user = JSON.parse(await AsyncStorage.getItem('user'))
        const token = user.token
        const data = prepareData(params, imagesEvi, id, latitude, longitude)
        if (!data.error) {

            Alert.alert(
                "Completado",
                "Incidente creado correctamente",
                [{
                    text: "Aceptar",
                    onPress: () => rootNavigation.goBack()
                }]
            )
            console.log(data.data);
            const response = await httpClient.post(
                'incidentes/crearIncidente',
                data.data,
                {
                    'Authorization': `Bearer ${token}`,
                }
            )
            console.log(response);
        } else {
            dispatch({
                type: 'SET_ERROR',
                payload: data
            })
            Alert.alert(
                "Error",
                data.message,
                [{
                    text: "Aceptar",
                }]
            )
        }
    }
}



const handleInputChange = (dispatch, state) => {
    return async (value, fieldName) => {

        dispatch({
            type: 'SET_DATA',
            payload: { value, fieldName }
        })
    }
}

const prepareData = (data, imagesEvi, id, latitude, longitude) => {
    let ErrorData = { error: false }
    if (data.incidenteTipoId == "")
        return { ...ErrorData, error: true, message: 'Tipo de incidente es requerido.' }
    if (data.images == "")
        return { ...ErrorData, error: true, message: 'Una fotografía de la incidencia es requerida.' }
    if (data.comentarioGuardia == "")
        return { ...ErrorData, error: true, message: 'Comentario de guardia es requerido.' }

    let result = {
        error: false,
        data: {
            latitud: latitude,
            longitud: longitude,
            IncidenteTipoId: data.incidenteTipoId,
            Evidencias: imagesEvi,
            ComentarioGuardia: data.comentarioGuardia,
            RondaId: id,
        }

    }

    return result
}


export const { Context, Provider } = createDataContext(
    IncidentRedcer,
    {
        clearState,
        handleInputChange,
        setIncident,
        store,
    },
    initialState
);