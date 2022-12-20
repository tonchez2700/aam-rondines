import {
    Text, View, ScrollView, StyleSheet,
    TouchableOpacity, Alert, Modal, Dimensions,
    ActivityIndicator, FlatList, LogBox
} from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Context as PointsListContext } from '../context/PointsListContext';
import { Context as PatrolsListContext } from '../context/PatrolsListContext';
import { Input, Button, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Context as LocationContext } from '../context/LocationContext.js';
import PermissionWarningDenied from '../components/PermissionWarningDenied.js';
import tw from 'tailwind-react-native-classnames';
import HeadTitleScreen from '../components/HeadTitleScreen';
import ModalIncident from '../components/Modal/ModalIncident';
import ModalCancel from '../components/Modal/ModalCancel';
import ModalCheck from '../components/Modal/ModalCheck';
import moment from 'moment'

const { width } = Dimensions.get("window");


const PointsListScreen = () => {


    const navigation = useNavigation();
    const { state: stateLocation, requestForegroundPermissions } = useContext(LocationContext)
    const { state, setPointsList, clearStateList, isVisibleModal, storeCheck } = useContext(PointsListContext);
    const { state: stateRonda, } = useContext(PatrolsListContext);
    const [modalData, setModalData] = useState(null);
    const [modalID, setModalID] = useState(null);
    const [modalLatitud, setModalLatitud] = useState(null);
    const [modalLongitud, setModalLongitud] = useState(null);
    const today = new Date();
    const todayFormat = moment(today).format('DD-MM-YYYY , h:mm:ss a')

    const full_initial_date = new Date(stateRonda.ronda?.fechaHoraInicio);
    const initial_date = moment(full_initial_date).format('DD-MM-YYYY');
    useEffect(() => {

        requestForegroundPermissions()

    }, [stateLocation.location])
    useEffect(() => {

        if (state.statusFetchingData != false) {
            setPointsList(stateRonda.ronda.id);
        }
    }, [stateLocation.location]);
    // useEffect(() => {
    //     setInterval(() => {
    //         const today = new Date();
    //         setClockState(moment(today).format('h:mm:ss a'))
    //     }, 1000);
    // }, []);

    return (


        <ScrollView resizeMode="cover" >
            <View style={styles.container}>
                {!stateLocation.hasPermission ?

                    <PermissionWarningDenied
                        message={stateLocation.message}
                        requestForegroundPermissions={requestForegroundPermissions} />
                    :


                    <View Style={{ paddingBottom: 100 }}>
                        <HeadTitleScreen title='Listado de rondines' />

                        <View style={tw` flex-col items-center`}>
                            <View style={tw`flex-row `}>
                                <Text style={[tw`flex-1 text-black font-bold text-lg`]}>ID: </Text>
                                <Text style={[tw`flex-1 text-black text-lg`]}> {stateRonda.ronda?.id}</Text>
                            </View>
                            <View style={tw`flex-row `}>
                                <Text style={[tw` flex-1 text-black font-bold text-lg `]}>Fecha de inicio: </Text>
                                <Text style={[tw` flex-1 text-black text-lg`]}> {initial_date}</Text>
                            </View>
                            <View style={tw`flex-row `}>
                                <Text style={[tw`flex-1 text-black font-bold text-lg `]}>Rondin: </Text>
                                <Text style={[tw`flex-1 text-black text-lg`]}> {stateRonda.ronda.rondinNombre}</Text>
                            </View>
                            <View style={tw`flex-row mb-5`}>
                                <Text style={[tw`flex-1 text-black font-bold text-lg `]}>Tiempo Acumulado: </Text>
                                <Text style={[tw`flex-1 text-black text-lg`]}> {initial_date}</Text>
                            </View>

                        </View>
                        {
                            !state.fetchingData
                                ?

                                <View>
                                    {
                                        state.point.map((item, key) => {
                                            return (
                                                <View key={key}>
                                                    {
                                                        state.point[0].id == item.id
                                                            ?
                                                            <View style={tw`flex-row  pt-5 pb-5 items-center border-b border-t border-gray-200`}>
                                                                <View style={tw`flex-initial`}>
                                                                </View>
                                                                <View style={tw`flex-row`}>
                                                                    <Text style={[tw`flex-initial w-64  font-bold`, { color: '#002443' }]}>{item.descripcion}</Text>
                                                                    <TouchableOpacity
                                                                        style={tw`flex-none mr-1`}>
                                                                        <Icon
                                                                            name='location-on'
                                                                            type='material'
                                                                            color='#002443' />
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity
                                                                        style={tw`flex-none`}
                                                                        onPress={() => {
                                                                            isVisibleModal('isVisible')
                                                                            setModalData(item.descripcion)
                                                                            setModalID(item.id)
                                                                            setModalLatitud(item.latitud)
                                                                            setModalLongitud(item.longitud)
                                                                        }}>
                                                                        <Icon
                                                                            name='circle'
                                                                            type='material'
                                                                            color='#D6A51C' />
                                                                    </TouchableOpacity>
                                                                </View>


                                                            </View>
                                                            :
                                                            <View style={tw`flex-row  pt-5 pb-5 items-center border-b border-t border-gray-200`}>
                                                                <View style={tw`flex-initial`}>
                                                                </View>
                                                                <View style={tw`flex-row`}>
                                                                    <Text style={[tw`flex-initial w-64  font-bold`, { color: '#002443' }]}>{item.descripcion}</Text>
                                                                    <Icon
                                                                        style={tw`flex-none`}
                                                                        name='location-on'
                                                                        type='material'
                                                                        color='#002443' />
                                                                    <Icon
                                                                        style={tw`flex-none`}
                                                                        name='circle'
                                                                        type='material'
                                                                        color='green' />

                                                                </View>


                                                            </View>
                                                    }
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                :
                                <ActivityIndicator size="large" color="#118EA6" style={tw`mt-5`} />
                        }
                        <Modal
                            animationType="slide"
                            transparent
                            visible={state.isVisible}
                            presentationStyle="overFullScreen"
                            onRequestClose={() =>
                                isVisibleModal('isVisible')
                            }>
                            <View style={styles.viewWrapper}>
                                <View style={styles.modalView}>
                                    <Text style={[tw`mr-2 font-bold text-lg justify-center`, { color: '#002443' }]}>Check-In</Text>
                                    <View >
                                        <View style={tw`flex-row `}>
                                            <Text style={[tw`mr-2 font-bold`, { color: '#002443' }]}>Punto:</Text>
                                            <Text style={{ flex: 1 }} numberOfLines={1}>{modalData}</Text>
                                        </View>
                                        <View style={tw`flex-row  `}>
                                            <Text style={[tw`mr-2 font-bold`, { color: '#002443' }]}>Fecha y Hora:</Text>
                                            <Text numberOfLines={1}>{todayFormat}</Text>
                                        </View>
                                        <View style={tw`flex-row `}>
                                            <Text style={[tw`mr-2 font-bold`, { color: '#002443' }]}>Ubicación:</Text>
                                            <Text style={{ flex: 1 }} numberOfLines={1}>{`${stateLocation.location?.latitude}, ${stateLocation.location?.longitude}`} </Text>
                                        </View>
                                    </View>

                                    <View style={tw`flex-row justify-center  mt-5`}>
                                        <Button
                                            title="Aceptar"
                                            buttonStyle={{ backgroundColor: '#002443', marginBottom: 15 }}
                                            onPress={() => {
                                                stateLocation.location.latitude == null
                                                    ?
                                                    Alert.alert(
                                                        "Error",
                                                        "Esperar a que se cargue la localización",
                                                        [{
                                                            text: "OK",

                                                        }]
                                                    )
                                                    :
                                                    storeCheck(modalID, stateRonda.ronda.alcance, stateLocation.location.latitude, stateLocation.location.longitude, modalLatitud, modalLongitud)
                                                    , isVisibleModal('isVisible')
                                            }} />
                                        <Button
                                            title="Cancelar"
                                            buttonStyle={{ marginLeft: 50, backgroundColor: '#848484', marginBottom: 15 }}
                                            onPress={() => {
                                                isVisibleModal('isVisible')
                                            }} />


                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <ModalIncident />
                        <ModalCancel />

                        <Button
                            buttonStyle={{ backgroundColor: '#A2A2A2', marginBottom: 10 }}
                            title={"Regresar"}
                            onPress={() => navigation.goBack()}>
                        </Button>
                    </View>
                }
            </View>

        </ScrollView>
    )
}

export default PointsListScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#fff'
    },
    viewWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    modalView: {
        alignItems: "center",
        justifyContent: "space-evenly",
        position: "absolute",
        top: "50%",
        left: "50%",
        elevation: 5,
        transform: [{ translateX: -(width * 0.4) },
        { translateY: -90 }],
        height: 250,
        width: width * 0.8,
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 5
    },
})