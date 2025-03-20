import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Text from '../components/Text';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const UserTickScreen = ({ route }) => {
    const formid = route.params.formid;
    const [loading, setLoading] = useState(true);
    const [formsUse, setformsUse] = useState([]);
    const fetchForms = async () => {
        try {
            const response = await axios.get(`${apiheader}/helpCenter/${formid}`);
            setformsUse(response.data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {


        fetchForms();
    }, []);



    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#00C853" />
            ) : formsUse.whosend === "restaurant" ? (
                // แสดง UI แบบแรก
                <View style={styles.card}>
                    <Text style={styles.label}>ชื่อร้านอาหาร:</Text>
                    <Text style={styles.value}>{formsUse.restaurant_id.restaurantName}</Text>

                    <Text style={styles.label}>อีเมล:</Text>
                    <Text style={styles.value}>{formsUse.email}</Text>

                    <Text style={styles.label}>รายงานไปยังผู้ใช้</Text>
                    <Text style={styles.value}>{formsUse.username}</Text>

                    <Text style={styles.label}>หัวข้อ:</Text>
                    <Text style={styles.value}>{formsUse.topic}</Text>

                    <Text style={styles.label}>รายละเอียด:</Text>
                    <Text style={styles.value}>{formsUse.details}</Text>

                    {formsUse.reservationId && (
                        <>
                            <Text style={styles.label}>หมายเลขการจอง:</Text>
                            <Text style={styles.value}>{formsUse.reservationId._id}</Text>
                        </>
                    )}
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={styles.label}>ชื่อผู้ใช้:</Text>
                    <Text style={styles.value}>{formsUse.username}</Text>

                    <Text style={styles.label}>อีเมล:</Text>
                    <Text style={styles.value}>{formsUse.email}</Text>

                    <Text style={styles.label}>รายงานไปยังร้านอาหาร</Text>
                    <Text style={styles.value}>{formsUse.restaurant_id.restaurantName}</Text>

                    <Text style={styles.label}>หัวข้อ:</Text>
                    <Text style={styles.value}>{formsUse.topic}</Text>

                    <Text style={styles.label}>รายละเอียด:</Text>
                    <Text style={styles.value}>{formsUse.details}</Text>

                    {formsUse.reservationId && (
                        <>
                            <Text style={styles.label}>หมายเลขการจอง:</Text>
                            <Text style={styles.value}>{formsUse.reservationId._id}</Text>
                        </>
                    )}
                </View>
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
        fontSize: 14,
        color: '#888888',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 8,
    },
});

export default UserTickScreen;