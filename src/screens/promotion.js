import { Text, View, SafeAreaView, StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Promotion = ({ navigation }) => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await axios.get(apiheader + '/promotion/getAllPromotions');
                setPromotions(response.data);
            } catch (error) {
                console.error('Error fetching promotions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPromotions();
    }, []);

    const renderPromotionCard = (item) => (
        <View style={styles.card} key={item._id}>
            {item.image && (
                <Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={styles.cardImage} />
            )}
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text numberOfLines={1} style={styles.cardDescription}>{item.description}</Text>
                <Text style={styles.cardDiscount}>
                    ส่วนลด: ฿{item.discount}
                </Text>
                <Text style={styles.cardDate}>
                    {`${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}`}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.promotionButton}
                onPress={() => navigation.navigate('addPromotion')}
            >
                <Text style={styles.addPromotionButton}>เพิ่มโปรโมชัน</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="orange" style={styles.loader} />
            ) : (
                <TouchableOpacity style={styles.listContainer}>
                    {promotions.map((item) => renderPromotionCard(item))}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10,
    },
    promotionButton: {
        alignSelf: 'flex-end',
        padding: 10,
        backgroundColor: 'orange',
        borderRadius: 10,
        margin: 10,
    },
    addPromotionButton: {
        color: 'white',
        fontWeight: 'bold',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingHorizontal: 10,
    },
    card:{
        flexDirection:'row',
        borderLeftWidth: 10,
        borderLeftColor:'orange',
        borderRadius: 10,
        marginHorizontal: 5,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 5,
        alignItems:'center'
    },
    cardImage:{
        width:120,
        height:120
    },
    cardContent:{
        flex:1,
        marginLeft:10,
        marginRight:10,
    },
    cardTitle:{
        fontSize:16,
        fontWeight:'bold'
    },
    cardDescription:{
        color:'gray'
    },
    cardDiscount:{
        color:'green'
    },
    cardDate:{
        color:'gray'
    }
    
});

export default Promotion;
