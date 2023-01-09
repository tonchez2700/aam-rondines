import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions, } from 'react-native'
import { Context as PointsListContext } from '../../context/PointsListContext';
import { Context as PatrolsListContext } from '../../context/PatrolsListContext';
import { Input, Button, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames'


const { width } = Dimensions.get("window");

const ModalCheckOut = () => {


    const navigation = useNavigation();
    const { state: stateLocation, requestForegroundPermissions } = useContext(LocationContext)
    const { state, setPointsList, clearStateList, isVisibleModal, storeCheck } = useContext(PointsListContext);
    const { state: stateRonda, } = useContext(PatrolsListContext);
    const [modalData, setModalData] = useState(null);
    const [modalID, setModalID] = useState(null);
    const [clockState, setClockState] = useState();
    const [modalLatitud, setModalLatitud] = useState(null);
    const [modalLongitud, setModalLongitud] = useState(null);
    useEffect(() => {
        clearState()
    }, [])


    return (
        <View>
            <Button
                buttonStyle={{ backgroundColor: '#B80A0A', marginBottom: 10 }}
                title={"Cancelar Ronda"}
                onPress={() => isVisibleModal('isVisibleCancel')}>
            </Button>

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
                                        storeCheck(
                                            modalID, stateRonda.ronda.alcance,
                                            stateLocation.location.latitude,
                                            stateLocation.location.longitude,
                                            modalLatitud, modalLongitud,
                                            setPointsList(stateRonda.ronda.id))
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

        </View>
    )
}

export default ModalCheckOut


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

