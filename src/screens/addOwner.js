import { Text, View, SafeAreaView, StyleSheet, StatusBar, ToastAndroid, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { StackActions } from '@react-navigation/native';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const AddOwner = ({ navigation, route }) => {
    const [userList, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setLoading] = useState(true);

    const handleSearch = async () => {
        setLoading(true);
        try {

            if (searchQuery == "") {
                const response = await axios.get(apiheader + '/users/getUsers');
                const result = await response.data;
                setUsers(result)

            } else {
                const response = await axios.get(apiheader + '/users/getlikeUsers/' + searchQuery);
                const result = await response.data;
                setUsers(result)
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        handleSearch();

    }, [searchQuery]);
    useFocusEffect(
        React.useCallback(() => {
            handleSearch();
        }, [])
    );

    return (

        <View style={styles.container}>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="ค้นหาผู้ใช้"
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                    }}
                />
            </View>
            
            {userList < 1 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}><Text>ไม่มีผู้ใช้ที่สามารถเลือกได้</Text></View>}
            <ScrollView>
                <View>
                    {userList != undefined ? userList.map((item, index) => (
                        userList && index == undefined ? (
                            <View key={index}><Text>ไม่พบข้อมูลผู้ใช้</Text></View>

                        ) : (
                            <View style={styles.flatlist} key={index}>
                                <View style={styles.left}>
                                    <Text style={styles.userTitle}>
                                        {item.username}
                                    </Text>
                                </View>
                                <View style={styles.right}>
                                    <TouchableOpacity style={styles.addButton} onPress={() => {
                                        navigation.dispatch(StackActions.replace('Tabs',{
                                            screen: 'หน้าหลัก',
                                            params: {
                                                screen: 'Restaurant',
                                                params: { newOwner: item.username, restaurant_id: route.params.restaurant_id },
                                                merge: true
                                            },
                                        }), ToastAndroid.showWithGravityAndOffset('Added ' + item.username + ' as draft', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50));
                                    }}>
                                        <Text style={{ color: 'white' }}>เพิ่ม {item.username}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )

                    )) : <View key={index}><Text>กำลังโหลดข้อมูล!</Text></View>}
                </View>
            </ScrollView>


        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatlist: {
        marginBottom: 15,
        flexDirection: "column",
        flex: 2,
        marginLeft: 20,
        marginTop: 20,
        marginRight: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5

    }, userData: {
        flex: 1,
        flexDirection: "row"

    }, userTitle: {
        width: 200,
        color: "black",
        marginRight: 1,
        fontSize: 15

    }, addButton: {
        backgroundColor: '#ff8a24',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'flex-end',

    }, left: {
        flex: 1

    }, right: {
        flex: 1,

    }, searchInput: {
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingLeft: 10,
        flex: 1,
        marginRight: 5,
    }, searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginRight: '5%',
        marginLeft: '5%',
        marginBottom: 30,
    

    }
});


export default AddOwner