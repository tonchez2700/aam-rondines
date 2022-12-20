import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions, } from 'react-native'
import { Context as PointsListContext } from '../../context/PointsListContext';
import { Context as PatrolsListContext } from '../../context/PatrolsListContext';
import { Input, Button, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames'


const { width } = Dimensions.get("window");

const ModalCancel = () => {


    const navigation = useNavigation();
    const { state, RondaDelete, handleInputChange, clearState, isVisibleModal } = useContext(PointsListContext);
    const { state: stateRonda, } = useContext(PatrolsListContext);
   
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
                visible={state.isVisibleCancel}
                presentationStyle="overFullScreen"
                onRequestClose={() =>
                    isVisibleModal('isVisibleCancel')
                }>
                <View style={styles.viewWrapper}>
                    <View style={styles.modalView}>
                        <Text style={tw`font-bold text-xl`}>Cancelar Ronda</Text>
                        <Input
                            label='Motivo de visita:'
                            borderWidth={2}
                            padding={40}
                            value={state.comentario}
                            onChangeText={(value) => handleInputChange(value, 'comentario')}
                            labelStyle={{ color: '#133C60' }}
                            multiline={true}
                        />
                        <View style={tw`flex-row justify-between`}>
                            <Button
                                title="Cancelar"
                                buttonStyle={{ backgroundColor: '#848484', marginBottom: 15 }}
                                onPress={() => isVisibleModal('isVisibleCancel')} />

                            <Button
                                title="Aceptar"
                                buttonStyle={{ marginLeft: 50, backgroundColor: '#002443', marginBottom: 15 }}
                                onPress={() => {
                                    RondaDelete(stateRonda.ronda.id, state.comentario)
                                    isVisibleModal('isVisibleCancel')
                                }} />
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

export default ModalCancel


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

