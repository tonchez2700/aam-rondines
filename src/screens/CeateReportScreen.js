import React, { useContext, useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Alert, View, Text, Modal, Dimensions } from 'react-native'
import { NavigationHelpersContext, useNavigation, } from '@react-navigation/native';
import { Input, Button } from 'react-native-elements'
import { Dropdown } from 'react-native-element-dropdown';
import { Context as LocationContext } from '../context/LocationContext.js';
import { Context as IncidentContext } from '../context/IncidentContext.js';
import { Context as PatrolsListContext } from '../context/PatrolsListContext';
import PermissionWarningDenied from '../components/PermissionWarningDenied.js';
import { IncidentSchema } from './../config/schemas'
import useHandleOnChangeTextInput from '../hooks/useHandleOnChangeTextInput'
import HeadTitleScreen from '../components/HeadTitleScreen.js'
import PhotoAttachmentArea from '../components/PhotoAttachmentArea'
import tw from 'tailwind-react-native-classnames'
import moment from 'moment'



const { width } = Dimensions.get("window");

const CeateReportScreen = (props) => {

    const { state: statePoint } = useContext(PatrolsListContext)
    const { state: stateLocation, requestForegroundPermissions } = useContext(LocationContext)
    const [inputState, handleInputChange] = useHandleOnChangeTextInput(IncidentSchema)
    const { state, handleInput, store, setIncident, clearState } = useContext(IncidentContext)
    const today = new Date();
    const date = moment(today).format('DD-MM-YYYY')
    const horas = moment(today).format('h:mm:ss a')
    const navigation = useNavigation();
    const [flexWrapper, setFlexWrapper] = useState(true);


    useEffect(() => {

        setIncident()
        requestForegroundPermissions()
    }, [])

    return (
        <View style={styles.container}>
            {!stateLocation.hasPermission ?

                <PermissionWarningDenied
                    message={stateLocation.message}
                    requestForegroundPermissions={requestForegroundPermissions} />
                :
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    padding={5}>
                    <HeadTitleScreen title='Visitante' />

                    <Input
                        inputStyle={tw`text-center`}
                        label='Fecha'
                        value={date}
                        disabled={true}
                        labelStyle={{ color: '#133C60' }}
                        multiline={true}
                    />
                    <Input
                        inputStyle={tw`text-center`}
                        label='Hora'
                        value={horas}
                        disabled={true}
                        labelStyle={{ color: '#133C60' }}
                        multiline={true}
                    />
                    <Input
                        inputStyle={tw`text-center`}
                        label='Ubicación'
                        value={`${stateLocation.location?.latitude}, ${stateLocation.location?.longitude} `}
                        disabled={true}
                        labelStyle={{ color: '#133C60' }}
                        multiline={true}
                    />


                    <View style={tw`flex-row ml-1`}>
                        <Text style={[tw`text-black text-base font-bold ml-2`, { color: '#133C60' }]}>Tipo de Incidente:</Text>
                        <Text style={{ color: 'red', fontWeight: 'bold', marginLeft: 5 }}>*</Text>
                    </View>
                    <Dropdown
                        maxHeight={300}
                        search
                        style={styles.dropdown}
                        searchPlaceholder="Buscar..."
                        placeholderStyle={{ color: 'gray' }}
                        selectedTextStyle={{ color: 'black', textAlign: 'center' }}
                        placeholder={'selecciona el incidente'}
                        valueField="value"
                        labelField="description"
                        value={inputState.incidenteTipoId}
                        data={state.incident}
                        onChange={item => {
                            handleInputChange(item.value, 'incidenteTipoId')
                        }}
                    />
                    <View style={tw`flex-row ml-1`}>
                        <Text style={[tw`text-black text-base font-bold ml-2`, { color: '#133C60' }]}>Fotografía:</Text>
                        <Text style={{ color: 'red', fontWeight: 'bold', marginLeft: 5 }}>*</Text>
                    </View>
                    <PhotoAttachmentArea
                        onCameraStart={(isVisible) => {
                            setFlexWrapper(isVisible)
                        }}
                        onTakePicture={(data) => {
                            handleInputChange(data, 'images')
                        }}
                    />

                    <Input
                        inputStyle={[{ padding: 10, paddingBottom: 10 }]}
                        label='Describa el incidente'
                        borderWidth={2}
                        placeholder={'Texto aquí . . .'}
                        borderRadius={2}
                        borderColor={'#002443'}
                        maxLength={512}
                        labelStyle={{ color: '#133C60', marginBottom: 10 }}
                        multiline={true}
                        value={inputState.comentarioGuardia}
                        onChangeText={(value) => handleInputChange(value, 'comentarioGuardia')}
                    />

                    <Button
                        buttonStyle={{ padding: 10, backgroundColor: '#002443', marginBottom: 15, marginTop: 50 }}
                        title="Aceptar"
                        onPress={() => store(inputState, statePoint.ronda.id, stateLocation.location?.latitude, stateLocation.location?.longitude)}
                    />

                    <Button
                        buttonStyle={{ backgroundColor: '#848484', marginBottom: 15 }}
                        onPress={() => { navigation.goBack(), clearState() }}
                        title="Rechazar"
                    />
                </ScrollView>
            }
        </View>
    )
}

export default CeateReportScreen

const styles = StyleSheet.create({

    screen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    viewWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    modalView: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        elevation: 5,
        transform: [{ translateX: -(width * 0.4) },
        { translateY: -90 }],
        height: 250,
        width: width * 0.8,
        backgroundColor: "#fff",
        borderRadius: 7,
    },
    dropdown: {
        margin: 10,
        textAlign: 'center',
        marginBottom: 20,
        borderBottomColor: 'gray',
        borderBottomWidth: .6,
    },
});