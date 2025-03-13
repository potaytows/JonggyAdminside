import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import Dragable from '../components/dragable';
import React, { useEffect, useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';


const Index = ({ navigation }) => {
    const { container, header, headerTitle, } = styles

    const getLoginInformation = async () => {

        try {
            user = await SecureStore.getItemAsync('userAuth');


        } catch (e) {
            console.log(e)
        };
    };

    useEffect(() => {
        getLoginInformation()


    }, []);


    return (
        <SafeAreaView style={container}>
            <View style={styles.wrapper}>

            </View>
            <View style={header}>
                <Text style={headerTitle}>
                    หน้าหลัก
                </Text>

            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate("allRestaurants")}>
                    <View style={{ height: 150 }}>
                        <View style={styles.item}>

                        </View>
                        <Text style={styles.itemTitle}>จัดการร้านค้า</Text>


                    </View>

                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("allUsers")}>
                    <View style={{ height: 150 }}>
                        <View style={styles.item}>

                        </View>
                        <Text style={styles.itemTitle}>จัดการผู้ใช้</Text>


                    </View>

                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("promotion")}>
                    <View style={{ height: 150, marginTop:30}}>
                        <View style={styles.item}>

                        </View>
                        <Text style={styles.itemTitle}>โปรโมชัน</Text>


                    </View>

                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("petition")}>
                    <View style={{ height: 150, marginTop:30}}>
                        <View style={styles.item}>

                        </View>
                        <Text style={styles.itemTitle}>คำร้อง</Text>


                    </View>

                </TouchableOpacity>
            </View>




        </SafeAreaView>


    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    }, header: {
        backgroundColor: '#ff8a24',
        height: 90,
        justifyContent: 'center'

    }, headerTitle: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',

    }, item: {
        backgroundColor: 'gray',
        width: 150,
        height: 150,
        marginTop: 20,
        marginHorizontal: 15

    }, itemTitle: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 15,
        color: 'black'

    }, wrapper: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: "center",
    }
});


export default Index