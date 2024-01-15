import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, ToastAndroid, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AutoHeightImage from 'react-native-auto-height-image'

const apiheader = "http://192.168.1.101:8000";

const Restaurant = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(true);
    const [Restaurant, setData] = useState([]);
    const [imagePlace, setImage] = useState("");


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


    const Ifloading = () => {
        if (isLoading) {
            return null;
        }
        return null;
    }
    const showDeleteToast = () => {
        ToastAndroid.showWithGravityAndOffset('Deleted ', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
    }
    const getRestaurants = async () => {
        setLoading(true);
        try {
            const response = await fetch(apiheader + '/restaurants');
            const result = await response.json();
            setData(result[0])
            console.log(Restaurant)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const fetchdeleteRestaurant = async () => {
        setLoading(true);
        try {
            const fetchOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            };
            const response = await fetch(apiheader + '/restaurants/delete/' + route.params.restaurant_id, fetchOptions);
            const result = await response.json();
            console.log(result);
            navigation.navigate("allRestaurants")
            showDeleteToast();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        // loadImage();
        getRestaurants();

    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.textHeader}>
                <Text style={styles.restaurantname}>{Restaurant.restaurantName}</Text>
                <Text style={styles.restaurantID}>ID :{Restaurant._id}</Text>

            </View>
            <View style={styles.middle}>
                <View style={styles.middleleft}>
                    <Text style={{ marginVertical: 5 }}>ผู้ดูแล:</Text>
                    <TouchableOpacity style={styles.ownerButton} onPress={() => navigation.navigate("addOwner")}>
                        <Text numberOfLines={1} style={{ color: "black" }}>ร้านนี้ยังไม่มีผู้ดูแล</Text>

                    </TouchableOpacity>

                </View>
                <View style={styles.middleright}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => fetchdeleteRestaurant()}>
                    <Text style={{ color: "white" }}>ลบ</Text>

                </TouchableOpacity>

                </View>


                
            </View>

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
    }, deleteButton: {
        backgroundColor: "red",
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf:'flex-end'

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
        marginTop:30

    }, ownerButton: {
        backgroundColor: "white",
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderColor: "black",
        borderWidth: 1

    },middleleft:{
        flex:1
    },middleright:{
        marginRight:20,
        flex:1,
        marginTop:30
    }


})

export default Restaurant
