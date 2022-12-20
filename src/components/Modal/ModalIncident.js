import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions, } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements';
import { Context as PointsListContext } from '../../context/PointsListContext';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames'


const { width } = Dimensions.get("window");
const ModalIncident = () => {

    const navigation = useNavigation();
    const { state, isVisibleModal } = useContext(PointsListContext);
    return (
        <View>
            <Button
                buttonStyle={{ backgroundColor: '#002443', marginBottom: 10, marginTop: 50 }}
                title={"Reportar incidente"}
                onPress={() => isVisibleModal('isVisibleIncident')}>
            </Button>

            <Modal
                animationType="slide"
                transparent
                visible={state.isVisibleIncident}
                presentationStyle="overFullScreen"
                onRequestClose={() =>
                    isVisibleModal('isVisibleIncident')
                }>
                <View style={styles.viewWrapper}>
                    <View style={styles.modalView}>
                        <Text style={tw`font-bold text-xl`}>¿Reportar incidente?</Text>

                        <View style={tw`flex-row justify-between`}>
                            <Button
                                title="Cancelar"
                                buttonStyle={{ backgroundColor: '#848484', marginBottom: 15 }}
                                onPress={() => isVisibleModal('isVisibleIncident')} />

                            <Button
                                title="Aceptar"
                                buttonStyle={{ marginLeft: 50, backgroundColor: '#002443', marginBottom: 15 }}

                                onPress={() => { isVisibleModal('isVisibleIncident'), navigation.navigate('CeateReportScreen') }} />
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

export default ModalIncident


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
