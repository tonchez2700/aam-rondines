import {
    Text, View, ScrollView, StyleSheet,
    TouchableOpacity, FlatList, RefreshControl
} from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import PatrolList from '../components/PatrolList';
import HeadTitleScreen from '../components/HeadTitleScreen';
import { Context as PatrolsListContext } from '../context/PatrolsListContext';
import { Input, Button, Icon } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
const PatrolListScreen = () => {

    const { state, fetchingData, setRonda } = useContext(PatrolsListContext)
    const navigation = useNavigation();
    const [loading, setloading] = useState(false)
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => { setRefreshing(false), setloading(false) });
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchingData()
        });
        return unsubscribe;
    }, [state.rondines, navigation]);


    return (
        <ScrollView
            refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                    fetchingData(),
                        onRefresh()
                }
                }
            />}
            style={styles.container}>
            <HeadTitleScreen title='Listado de rondines' />
            <Button
                title="Recargar"
                loading={loading}
                buttonStyle={{ backgroundColor: '#001F42', marginBottom: 15, justifyContent: 'center' }}
                onPress={() => {
                    fetchingData(),
                        onRefresh(),
                        setloading(true);
                }} />
            <View style={tw`mt-1`}>
                <View style={tw`flex-row`}>
                    <Text style={[tw` flex-auto text-lg text-center border `, { backgroundColor: "#001F42", color: "white", width: '60%' }]}>NOMBRE</Text>
                    <Text style={[tw`flex-auto text-lg text-center  border`, { backgroundColor: "#001F42", color: "white", width: '40%' }]}>ACCIONES</Text>
                </View>
                {
                    state.rondines.map((item, key) => {
                        return (
                            <View key={item.id}
                                style={[tw`flex-row bg-gray-200`, {
                                    borderColor: 'gray',
                                    borderTopWidth: 0.2,
                                    backgroundColor: "#E2F0FF",
                                    color: "white"
                                }]} >
                                <View style={tw`flex-row  `}>
                                    <Text style={[tw`flex-auto  text-lg text-center p-2`, {
                                        borderColor: 'gray',
                                        borderRightWidth: 0.2,
                                        width: '60%',
                                        color: "black"
                                    }]}>{item.nombre}</Text>
                                    <TouchableOpacity
                                        style={[tw`p-2`, { width: '40%' }]}
                                        onPress={() => setRonda(item.id)}>
                                        <Icon
                                            size={35}
                                            name='directions-run'
                                            type='material'
                                            color='#000000' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        </ScrollView >
    )
}




const styles = StyleSheet.create({});

export default PatrolListScreen