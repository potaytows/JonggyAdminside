import { View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import Dragable from '../components/dragable';
import React, { useEffect, useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import Text from '../components/Text';

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
                        <View style={styles.itemIcon}>
                        <Image style={styles.profileImage} source={require('../../assets/images/restaurant.png')} />


                            </View>
                        </View>
                        <Text style={styles.itemTitle}>จัดการร้านค้า</Text>


                    </View>

                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("allUsers")}>
                    <View style={{ height: 150 }}>
                        <View style={styles.item}>
                        <View style={styles.itemIcon}>
                        
                        <Image style={styles.profileImage2} source={require('../../assets/images/database.png')} />

                            </View>
                        </View>
                        <Text style={styles.itemTitle}>จัดการผู้ใช้</Text>


                    </View>

                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("promotion")}>
                    <View style={{ height: 150, marginTop:30}}>
                        <View style={styles.item}>
                        <View style={styles.itemIcon}>
                        <Image style={styles.profileImage2} source={require('../../assets/images/checklist.png')} />
                            </View>
                        </View>
                        <Text style={styles.itemTitle}>โปรโมชัน</Text>


                    </View>

                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("UserHelp")}>
                    <View style={{ height: 150, marginTop:30}}>
                        <View style={styles.item}>
                        <View style={styles.itemIcon}>
                        
                        <Image style={styles.profileImage} source={require('../../assets/images/service.png')} />


                            </View>
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

    },
    profileImage:{
    width:80,
    height:80
    },
    profileImage2:{
        width:100,
        height:100
        },
    item: {
        backgroundColor: 'white',
        width: 131,
        height: 131,
        marginTop: 20,
        marginHorizontal: 15,
        justifyContent: 'center',
        borderRadius: 20,
        shadowOffset: {
            width: 0,
            height: 0.1,
        },
        shadowOpacity: 0.23,
        shadowRadius: 0.61,
        elevation: 5,


    },
    itemIcon: {
        alignSelf: 'center',
    },
    itemTitle: {
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