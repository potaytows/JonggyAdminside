import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import Text from '../components/Text';
import axios from 'axios';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const WalletListScreen = ({ navigation }) => {
    const [withdrawals, setWithdrawals] = useState([]);
    console.log(withdrawals)
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); // สำหรับเก็บข้อความค้นหา

    useEffect(() => {
        const fetchWithdrawals = async () => {
            try {
                const response = await axios.get(`${apiheader}/wallet/withdrawalsRestaurants`);
                setWithdrawals(response.data);
            } catch (error) {
                console.error('Error fetching withdrawals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWithdrawals();
    }, []);

    // ฟังก์ชันสำหรับการกรองข้อมูลตามชื่อร้าน
    const filteredWithdrawals = withdrawals.filter(item =>
        item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }
    
    const handleSupport = (withdraw, restaurantName) => {
        navigation.navigate('ProofImage', { withdraw: withdraw, restaurantName: restaurantName });
    };
    

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="ค้นหาร้านอาหาร..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)} // อัปเดตข้อความค้นหาตามที่พิมพ์
            />
            <Text style={styles.header}>รายการถอนเงินของร้านอาหาร</Text>

            <FlatList
                data={filteredWithdrawals}
                keyExtractor={(item) => item.restaurantName}
                renderItem={({ item }) => {
                    const latestWithdraw = item.withdrawals.length > 0 ? item.withdrawals[item.withdrawals.length - 1] : null;
                    
                    return (
                        <View style={styles.card}>
                            {latestWithdraw ? (
                                <TouchableOpacity onPress={() => handleSupport(item.withdrawals, item.restaurantName)}>
                                    <View style={styles.withdrawItem}>
                                        <View style={styles.flexHeaderTitle}>
                                            <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                                            <Text style={styles.amount}>-฿{latestWithdraw.amount}</Text>
                                        </View>
                                        <Text>
                                            {new Date(latestWithdraw.date).toLocaleString('th-TH', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })}
                                        </Text>
                                        <Text>{latestWithdraw.status}</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.noWithdrawals}>ไม่มีประวัติการถอน</Text>
                            )}
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#f9f9f9',
        marginBottom: 8,
        padding: 10,
        shadowOffset: {
            width: 0,
            height: 0.1,
        },
        shadowOpacity: 0.23,
        shadowRadius: 0.61,
        elevation: 5,
    },
    flexHeaderTitle: {
        flexDirection: 'row',
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 'auto',
    },
    withdrawItem: {
        padding: 8,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        marginBottom: 5,
    },
    noWithdrawals: {
        color: 'gray',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
});

export default WalletListScreen;
