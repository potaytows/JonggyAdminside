import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, ToastAndroid, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AutoHeightImage from 'react-native-auto-height-image'
import { useFocusEffect } from '@react-navigation/native';
import { EvilIcons } from '@expo/vector-icons';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import StaticTable from '../components/staticTable';
import Text from '../components/Text';

const apiheader = process.env.EXPO_PUBLIC_apiURI;


const Restaurant = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(false);
    const [Restaurant, setData] = useState([]);
    const [owner, setOwner] = useState("")
    const [newowner, setNewOwner] = useState("");
    const [screenState, setScreenState] = useState("");
    const [isDrafting, setDrafting] = useState(false);
    const [imageuri, setImageUri] = useState("")
    const [tables, setTables] = useState([])

    const getTables = async () => {
        try {
            const response = await axios.get(apiheader + '/tables/getbyRestaurantId/' + route.params.restaurant_id);
            const result = await response.data;
            setTables(result)
        } catch (error) {
            console.error(error);
        }
    };
    const CheckState = () => {
        if (!owner && !newowner) {
            setScreenState("noOwner")
        } if (!owner && newowner) {
            setScreenState("drafting")
        } if (owner) {
            setScreenState("haveowner")
        }
    }
    const ConfirmButton = ({ }) => {
        if (screenState == "drafting") {
            return (
                <View>
                    <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert('ยืนยันการแต่งตั้งเจ้าของร้าน ' + Restaurant.restaurantName, 'กรุณาตรวจสอบว่าคุณต้องการเพิ่ม ' + newowner + " เป็นเจ้าของร้าน " + Restaurant.restaurantName + " หรือไม่ เมื่อทำการยืนยันแล้ว คุณจะไม่สามารถลบผู้ใช้นี้ออกจากการเป็นเจ้าของได้ ต้องทำการเปลี่ยนเจ้าของเท่านั้น", [
                        {
                            text: 'ยกเลิก',
                        },
                        { text: 'ยืนยัน', onPress: () => fetchAddOwner() },
                    ])}>
                        <Text style={{ color: "white" }}>ยืนยัน</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    };
    const OwnerComp = ({ }) => {
        if (screenState == "noOwner") {
            return (
                <View>
                    <Text style={{ marginVertical: 5 }}>ผู้ดูแล:</Text>
                    <TouchableOpacity style={styles.ownerButton} onPress={() => navigation.navigate("addOwner", { restaurant_id: route.params.restaurant_id })}>
                        <Text numberOfLines={1} style={{ color: "black" }}>ร้านนี้ยังไม่มีผู้ดูแล</Text>
                    </TouchableOpacity>
                </View>
            )
        } if (screenState == "drafting") {
            return (
                <View>
                    <Text style={{ marginVertical: 5 }}>ผู้ดูแล:(Drafting)</Text>
                    <View style={styles.ownerButton}>
                        <Text numberOfLines={1} style={{ color: "black" }}>{newowner}</Text>
                        <TouchableOpacity onPress={() => setNewOwner("")}>
                            <EvilIcons name="close" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } if (screenState == "haveowner") {
            return (
                <View>
                    <Text style={{ marginVertical: 5 }}>ผู้ดูแล:</Text>
                    <View style={styles.ownerButton}>
                        <Text numberOfLines={1} style={{ color: "black" }}>{owner}</Text>
                        <TouchableOpacity onPress={() => { setOwner(""); setDrafting(true); }}>
                            <EvilIcons name="close" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    };
    ;
    const fetchAddOwner = async () => {
        setLoading(true)
        try {
            const response = await axios.put(apiheader + '/restaurants/edit/' + route.params.restaurant_id, { owner: newowner });
            const result = await response.data;
            console.log(result);
            setDrafting(false)
            navigation.navigate("allRestaurants")
            ToastAndroid.showWithGravityAndOffset('Added ' + newowner + " as " + Restaurant.restaurantName + "'s owner", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
        } catch (error) {
            console.log(error);
            ToastAndroid.showWithGravityAndOffset('Some error has occured, please try again, ' + error, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
        } finally {
            setLoading(false);
        }
    }
    const getRestaurants = async () => {
        setLoading(true)
        try {
            const response = await axios.get(apiheader + '/restaurants/' + route.params?.restaurant_id);
            const result = await response.data;
            setData(result)
            setOwner(result.owner)
            setImageUri(apiheader + "/image/getRestaurantIcon/" + result._id)
        } catch (error) {
            console.log(error);
            ToastAndroid.showWithGravityAndOffset('Some error has occured, please try again ', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
        } finally {
            setLoading(false);
        }
    };
    const fetchdeleteRestaurant = async () => {
        setLoading(true)
        try {
            const response = await axios.delete(process.env.EXPO_PUBLIC_apiURI + '/restaurants/delete/' + route.params.restaurant_id);
            const result = await response.data;
            ToastAndroid.showWithGravityAndOffset('Deleted ', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
        } catch (error) {
            console.log(error);
            ToastAndroid.showWithGravityAndOffset('Some error has occured, please try again, ' + error, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
        } finally {
            setLoading(false);
            navigation.navigate("allRestaurants")
        }
    }
    useEffect(() => {
        CheckState();
    });
    useEffect(() => {
        getRestaurants();

    }, []);
    useFocusEffect(
        React.useCallback(() => {
            setNewOwner(route.params?.newOwner);
        }, [route.params])

    );
    useFocusEffect(
        React.useCallback(() => {
            getTables();
        }, [])

    );

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && <View style={styles.activityIndicatorBody}>
                <ActivityIndicator size="large" color='#ff8a24' animating={isLoading} />
            </View>}
            <ScrollView>
                {imageuri &&
                    <View style={styles.Logo}>
                        <Image
                            style={{ width: 400, height: 300, borderRadius: 5 }}
                            source={{ uri: imageuri }}
                        />


                    </View>
                }
                <View style={styles.textHeader}>
                    <Text style={styles.restaurantname}>{Restaurant.restaurantName}</Text>
                    <Text style={styles.restaurantID}>ID :{Restaurant._id} </Text>
                    <Text style={styles.restaurantID}>description :{Restaurant.description} </Text>
                    <Text style={styles.restaurantID}>สถานะ : {Restaurant.status == "closed" && <Text>ปิดทำการ</Text>}{Restaurant.status == "open" && <Text>เปิดทำการ</Text>}</Text>
                </View>
                <View style={styles.middle}>
                    <View style={styles.middleleft}>
                        <OwnerComp />
                    </View>
                    <View style={styles.middleright}>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => Alert.alert('ยืนยันการลบ', 'คุณต้องการลบ ' + Restaurant.restaurantName + " หรือไม่", [
                            {
                                text: 'ยกเลิก',
                            },
                            { text: 'ยืนยัน', onPress: () => fetchdeleteRestaurant() },
                        ])}>
                            <Text style={{ color: "white" }}>ลบ</Text>
                            {/* <TouchableOpacity style={styles.tableButton} onPress={() => navigation.navigate("Tables", { restaurant_id: Restaurant._id })}><Text style={{ color: "white" }}>Tables</Text></TouchableOpacity> */}
                        </TouchableOpacity>
                        <ConfirmButton />
                    </View>

                </View>
                <View style={styles.dragablecontainer}>
                    {/* {tables.map((item, index) => (
                        <StaticTable key={index} id={item._id} x={item.x} y={item.y} item={item} >
                        </StaticTable>
                    ))} */}
                </View>
            </ScrollView>
            <View style={styles.addButtonCont}>

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
        alignSelf: 'flex-end'
    }, tableButton: {

        backgroundColor: "blue",
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignContent: "flex-end",
        marginTop: 10

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

    }, ownerButton: {
        backgroundColor: "white",
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderColor: "black",
        borderWidth: 1,
        flexDirection: 'row'

    }, middleleft: {
        flex: 1
    }, middleright: {
        marginRight: 20,
        marginTop: 30,
    }, addButton: {
        backgroundColor: '#ff8a24',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignContent: "flex-end",
        marginTop: 10

    }, addButtonCont: {
        flex: 1,
        justifyContent: 'flex-end',
        zIndex: 2000
    }, DisabledaddButton: {
        backgroundColor: 'gray',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginBottom: 30

    }, activityIndicatorBody: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignSelf: 'center',
        justifyContent: 'center'
    }, Logo: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    dragablecontainer: {
        width: 380,
        height: 450,
        alignSelf: 'center',
        marginTop: 40,
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: 'white',
        borderColor: '#CCCCCC',
        overflow: 'hidden'
    },
    tablecontainer: {
        alignItems: 'center',
        justifyContent: 'center',
    }, dragablecontent: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',

    }


})

export default Restaurant
