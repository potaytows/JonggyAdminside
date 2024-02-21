import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AutoHeightImage from 'react-native-auto-height-image'
import { useIsFocused } from "@react-navigation/native";
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Index = ({ navigation }) => {
    const { linearGradient, restaurantTitle, flatlist, container, loadingindi, restaurantData } = styles
    const [isLoading, setLoading] = useState(false);
    const [RestaurantList, setData] = useState([]);
    const [imagePlace, setImage] = useState("");
    const [searchQuery, setSearchQuery] = useState('');

    const Ifloading = () => {
        if (isLoading) {
            return null;
        }
        return null;
    }
    const getRestaurants = async () => {
        setLoading(true);
        try {
            const response = await axios.get(apiheader + '/restaurants');
            const result = await response.data;
            setData(result)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const handleSearch = async () => {
        setLoading(true);
        try {

            if (searchQuery == "") {
                getRestaurants();

            } else {
                const response = await axios.get(apiheader + '/restaurants/getlikeRestaurants/' + searchQuery);
                const result = await response.data;
                setData(result)
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getRestaurants();
        }, [])
    );
    useEffect(() => {
        handleSearch();

    }, [searchQuery]);


    return (



        <SafeAreaView style={container}>
            {isLoading && <View style={styles.activityIndicatorBody}>
                <ActivityIndicator size="large" color='#ff8a24' animating={isLoading} />
            </View>}


            <View style={styles.topper}>

                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("addRestaurant")}>
                    <Text style={{ color: "white" }}>เพิ่มร้านอาหาร</Text>

                </TouchableOpacity>

            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="ค้นหาร้านค้า"
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                    }}
                />
            </View>
            {/* <FlatList
                data={RestaurantList}
                renderItem={({ item }) => <List item={item} />}
                keyExtractor={item => item._id}
            /> */}
            <ScrollView>
                <View style={flatlist}>
                    {RestaurantList != undefined ? RestaurantList.map((item, index) => (
                        RestaurantList && index == undefined ? (
                            <View key={item}><Text>ไม่พบร้านอาหาร</Text></View>
                        ) : (
                            <TouchableOpacity key={index} onPress={() => navigation.navigate("Restaurant", { restaurantName: item.restaurantName, restaurant_id: item._id, newOwner: "" })}>
                                <View style={styles.listitem} key={item}>
                                    <View style={styles.Logo}>
                                        <AutoHeightImage
                                            width={90}
                                            height={90}
                                            source={{ uri: apiheader + '/image/getRestaurantIcon/' + item._id }}
                                            borderRadius={5}
                                        />
                                    </View>
                                    <View stlye={restaurantData}>
                                        <Text style={restaurantTitle} adjustsFontSizeToFit={true}
                                            numberOfLines={2}>
                                            {item.restaurantName}
                                        </Text>
                                        <Text style={styles.restaurantdesc} adjustsFontSizeToFit={true}
                                            numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    )) : <View key={item}><Text>กำลังโหลดข้อมูล!</Text></View>}
                </View>
            </ScrollView>
        </SafeAreaView>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingindi: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    restaurantData: {
        marginRight: 5,
        flexDirection: 'column',
        flex: 1,

    },
    linearGradient: {
        flex: 1
    },
    restaurantTitle: {
        color: "black",
        flex: 1,
        marginRight: 1,
        marginLeft: 20,
        fontSize: 15,
        width: 230,
        fontWeight: 'bold',
    }, restaurantdesc: {
        color: "black",
        flex: 1,
        marginRight: 1,
        marginLeft: 20,
        fontSize: 13,
        width: 230,
    },
    Logo: {
        justifyContent: 'center',
        maxHeight: 300,
        maxWidth: 120,
        alignItems: 'center'

    },
    flatlist: {
        minHeight: 70,
        marginLeft: 15,
        marginBottom: 15,
        flexDirection: "column",
        flex: 1
    }, topper: {
        flexDirection: "row-reverse",
        marginTop: 10
    }, addButton: {
        backgroundColor: "black",
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 10

    }, activityIndicatorBody: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignSelf: 'center',
        justifyContent: 'center'
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
        marginBottom: 20
    },
    Logo: {
        justifyContent: 'center',
        maxHeight: 300,
        maxWidth: 120,
        alignItems: 'center'

    }, listitem: {
        marginVertical: 10,
        flexDirection:'row',
        height:100,

    }

})

export default Index
