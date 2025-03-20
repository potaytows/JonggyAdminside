import React, { useEffect, useState, useCallback } from 'react';
import {  View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, ToastAndroid, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AutoHeightImage from 'react-native-auto-height-image'
import { useFocusEffect } from '@react-navigation/native';
import { EvilIcons } from '@expo/vector-icons';
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';

import Text from '../components/Text';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const User = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(true);
    const [User, setData] = useState({});
    const [reservationList, setReservationList] = useState([]);
    const [selectedTab, setSelectedTab] = useState("all");
    const [selectedTab2, setSelectedTab2] = useState("myReport");
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);

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
    const loadReservations = async () => {
        setLoading(true);

        try {
            const response = await axios.get(apiheader + '/reservation/getReservationsByUsername/' + route.params?.username);
            const result = await response.data;
            setReservationList(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getUsers = async () => {
        try {
            const response = await axios.get(apiheader + '/users/getUsers/' + route.params?.username);
            const result = await response.data;
            setData(result)
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
            getUsers()
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getUsers();
        loadReservations();
    }, []);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const filteredReservations = reservationList.filter(item => {
        if (selectedTab === "all") return true;
        if (selectedTab === "success") return item.status === "ยืนยันแล้ว";
        if (selectedTab === "cancel") return item.status === "ยกเลิกการจองแล้ว";
    });

    const filteredReport = reports.filter(item => {
        if (selectedTab2 === "myReport") return true;
        if (selectedTab2 === "reportToMe") return item.status === "ยกเลิกการจองแล้ว";
    });

    const fetchReports = async () => {
        try {
            const response = await axios.get(`${apiheader}/helpCenter/user/${route.params?.username}`);
            setReports(response.data);
            console.log(response.data)
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
    };
    useFocusEffect(
        useCallback(() => {
            fetchReports();
        }, [])
    );
    const renderReservationItem = (item) => (
        <View key={item._id} style={styles.reservationItem}>

            <TouchableOpacity style={styles.buttonToscript}>
                <View style={styles.flexList}>

                    <View style={styles.box}>
                        <View style={styles.flexLists}>
                            <Text style={styles.NameResList}>{item.restaurant_id.restaurantName}</Text>
                            <Text style={[styles.status,
                            item.status === "ยืนยันแล้ว" && { color: '#1FD46D' },
                            item.status === "ยกเลิกการจองแล้ว" && { color: 'gray' }]}>{item.status}</Text>

                        </View>

                        <View style={styles.flexList} >
                            <Text style={styles.tableList}>{item.reservedTables.map(table => table.text).join(', ')}</Text>
                        </View>

                        <View style={styles.flexListss}>
                            <Text style={styles.timeList}> {formatDate(item.createdAt)}</Text>
                            <Text style={styles.TotalList}>฿ {item.total}</Text>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView>

        <SafeAreaView style={styles.container}>

            {User ? (
                <View style={styles.textHeader}>
                    <Text style={styles.restaurantname}>{User.username}</Text>
                    <Text style={styles.restaurantID}>ID: {User._id} </Text>
                    <View style={styles.reservationListContainer}>
                        <View style={styles.flexreserve}>
                            <Text style={styles.history}>รายการจอง</Text>
                            <View style={styles.flexreserve2}>
                                <TouchableOpacity onPress={() => setSelectedTab("all")}>
                                    <Text style={[styles.btuAll, selectedTab === "all" && { color: "blue" }]}>การจองทั้งหมด</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSelectedTab("success")}>
                                    <Text style={[styles.btuSucress, selectedTab === "success" && { color: "blue" }]}>เสร็จสิ้นแล้ว</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSelectedTab("cancel")}>
                                    <Text style={[styles.btuCancle, selectedTab === "cancel" && { color: "blue" }]}>ยกเลิกการจอง</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {filteredReservations.map(renderReservationItem)}
                    </View>
                    <View style={styles.reservationListContainer}>
                        <View style={styles.flexreserve}>
                            <Text style={styles.history}>การรายงาน</Text>
                            <View style={styles.flexreserve2}>
                                <TouchableOpacity onPress={() => setSelectedTab2("myReport")}>
                                    <Text style={[styles.btuAll, selectedTab2 === "myReport" && { color: "blue" }]}>การรายงานของผู้ใข้</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSelectedTab2("reportToMe")}>
                                    <Text style={[styles.btuSucress, selectedTab2 === "reportToMe" && { color: "blue" }]}>เรื่องที่ผู้ใช้ถูกรายงาน</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {filteredReport.map((report) => (
                            <TouchableOpacity
                                key={report._id}
                                style={styles.reportCard}
                            // onPress={() => navigation.navigate('ReportDetail', { report })}
                            >

                                <Text style={styles.NameResList}>
                                {report?.restaurant_id.restaurantName || 'ไม่พบชื่อร้าน'}
                                </Text>
                                <Text style={styles.topic}>{report.topic}</Text>
                                <Text style={styles.details}>{report.details}</Text>
                                <Text style={styles.details}>{new Date(report.createdAt).toLocaleString()}</Text>

                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{User.isBanned}</Text>
                    {User.isBanned == true ? (
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', }} onPress={() => {
                            unbanUser()
                        }}>
                            <MaterialIcons name="autorenew" size={24} color="green" />
                            <Text style={{ marginLeft: 5 }}>ยกเลิกการระงับบัญชี</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', }} onPress={() => {
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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingRight: 20
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

    },
    reservationItem: {
        width: '100%',
    },
    buttonReserve: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FF914D',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
    },
    flexList: {
        flexDirection: 'row'
    },
    flexLists: {
        flexDirection: 'row',
        alignItems: 'center'

    },
    flexListss: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    box: {
        flex: 1,
        alignSelf: 'center',

    },
    logo: {
        width: '25%',
    },
    imgres: {
        width: '100%',
        height: 100,
        margin: 'auto'
    },
    NameResList: {
        fontSize: 18,
        color: '#FF914D',
        fontWeight: 'bold',
    },
    status: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 'auto',
        color: 'gray',


    },
    TotalList: {
        marginLeft: 'auto',
        fontSize: 18,
        fontWeight: 'bold'
    },
    timeList: {
    },
    list: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10

    },
    history: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,

    },
    reservationItem: {
        marginTop: 20
    },
    buttonToscript: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 5,
    },
    tableList: {
        marginTop: 5,

    },
    flexreserve: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center'
    },
    flexreserve2: {
        flexDirection: 'row',
        marginLeft: 'auto',
        marginTop: 10,

    },
    btuAll: {
        marginLeft: 5
    },
    btuSucress: {
        marginLeft: 5

    },
    btuCancle: {
        marginLeft: 5

    },
    reportCard: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    NameResList: {
        fontSize: 18,
        color: '#FF914D',
        fontWeight: 'bold',
    },
    topic: {
        fontSize: 16,
        
    },
    details: {
        fontSize: 14,
        color: '#666',
    },


})

export default User
