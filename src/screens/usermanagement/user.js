import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, ToastAndroid, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AutoHeightImage from 'react-native-auto-height-image'
import { useFocusEffect } from '@react-navigation/native';
import { EvilIcons } from '@expo/vector-icons';
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const User = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(true);
    const [User, setData] = useState({});


    // const loadImage = async (photo_reference) => {
    //     try {
    //         const res = await fetch(
    //             `https://placebear.com/200/300`
    //         )   
    //         const data = await res.blob();
    //         setImage(data);
    //         console.log(data)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // };

    const getUsers = async () => {
        try {
            const response = await axios.get(apiheader + '/users/getUsers/' + route.params?.username);
            const result = await response.data;
            setData(result)
            console.log(result.isBanned)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const banUser = async () => {
        try {
            const response = await axios.get(apiheader + '/users/ban/' + route.params?.username);
            const result = await response.data;
            console.log(result)
            getUsers()

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const unbanUser = async () => {
        try {
            const response = await axios.get(apiheader + '/users/unban/' + route.params?.username);
            const result = await response.data;
            console.log(result)
            getUsers()
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getUsers();

    }, []);


    return (
        <SafeAreaView style={styles.container}>

            {User ? (
                <View style={styles.textHeader}>
                    <Text style={styles.restaurantname}>{User.username}</Text>
                    <Text style={styles.restaurantID}>ID: {User._id} </Text>
                    <Text>{User.isBanned}</Text>
                    {User.isBanned == true ? (
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={()=>{
                            unbanUser()
                        }}>
                            <MaterialIcons name="autorenew" size={24} color="green" />
                            <Text style={{ marginLeft: 5 }}>ยกเลิกการระงับบัญชี</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={()=>{
                            banUser()
                        }}>
                            <MaterialIcons name="block-flipped" size={24} color="red" />
                            <Text style={{ marginLeft: 5 }}>ระงับบัญชีผู้ใช้</Text>

                        </TouchableOpacity>
                    )}

                </View>

            ) : (
                <View style={styles.textHeader}>
                    <Text>ไม่พบข้อมูลผู้ใช้</Text>
                </View>

            )}





        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    loadingindi: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }, textHeader: {
        marginLeft: 20,
        marginTop: 20,
    }, restaurantname: {
        fontSize: 25
    }, restaurantID: {
        fontSize: 13,

    }, middle: {
        marginLeft: 20,
        flex: 1,
        flexDirection: "row",
        marginTop: 30

    }


})

export default User
