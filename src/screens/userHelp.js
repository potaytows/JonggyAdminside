import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Text from '../components/Text';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const UserHelpScreen = ({ navigation }) => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("userReport");

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get(`${apiheader}/helpCenter`);
                setForms(response.data);
            } catch (error) {
                console.error('Error fetching forms:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchForms();
    }, []);

    const handleSupport = (formID) => {
        navigation.navigate('userTicket', { formid: formID });
    };

    // กรองข้อมูลตามแท็บที่เลือก
    const filteredReport = forms.filter(item => {
        if (selectedTab === "userReport") return item.whosend === "user";
        if (selectedTab === "restaurantreport") return item.whosend === "restaurant";
        return false;
    });

    const renderFormItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleSupport(item._id)}>
            {item.reservationId && (
                <View style={styles.flexTitle}>
                    <Text style={styles.label}>หมายเลขการจอง:</Text>
                    <Text style={styles.value}>{item.reservationId._id}</Text>
                </View>
            )}
            <View style={styles.flexTitle}>
                {item.whosend === "restaurant" ? (
                    <>
                        <Text style={styles.label}>ร้านอาหาร:</Text>
                        <Text style={styles.value}>{item.restaurant_id.restaurantName}</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.label}>ชื่อผู้ใช้:</Text>
                        <Text style={styles.value}>{item.username}</Text>
                    </>

                )}
            </View>
            <View style={styles.flexTitle}>
                <Text style={styles.label}>หัวข้อ:</Text>
                <Text style={styles.value}>{item.topic}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.flexNav}>
                <TouchableOpacity
                    style={[styles.ss1, selectedTab === "userReport" && styles.activeTab]}
                    onPress={() => setSelectedTab("userReport")}
                >
                    <Text style={styles.btu}>การรายงานของผู้ใช้</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.ss1, selectedTab === "restaurantreport" && styles.activeTab]}
                    onPress={() => setSelectedTab("restaurantreport")}
                >
                    <Text style={styles.btu}>การรายงานของร้านอาหาร</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#00C853" />
            ) : filteredReport.length > 0 ? (
                <FlatList
                    data={filteredReport}
                    renderItem={renderFormItem}
                    keyExtractor={item => item._id}
                />
            ) : (
                <Text style={styles.emptyText}>ไม่มีข้อมูล</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        color: '#888888',
        marginBottom: 4,
        marginRight: 10
    },
    value: {
        fontSize: 16,
        color: '#000000',
    },
    flexTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    flexNav: {
        flexDirection: 'row'
    },
    btu: {
        textAlign: 'center',
        fontSize: 15,
        color: 'white'
    },
    ss1: {
        flex: 1,
        backgroundColor: 'gray',
        width: 190,
        height: 30,
        justifyContent: 'center',
        margin: 5,
        borderRadius: 10
    },
    activeTab: {
        backgroundColor: '#FF8A24',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20
    }
});

export default UserHelpScreen;
