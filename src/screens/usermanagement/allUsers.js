import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AutoHeightImage from 'react-native-auto-height-image'
import { useIsFocused } from "@react-navigation/native";
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const AllUsers = ({ navigation }) => {
    const { linearGradient, restaurantTitle, flatlist, container, loadingindi, restaurantData } = styles
    const [isLoading, setLoading] = useState(true);
    const [usersList, setData] = useState([]);
    const [imagePlace, setImage] = useState("");
    const isFocused = useIsFocused();
    const [searchQuery, setSearchQuery] = useState('');


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

    const List = ({ item }) => (


        <TouchableOpacity onPress={() => navigation.navigate("User", { username: item.username })}>
            <View style={flatlist}>
                <View stlye={restaurantData}>
                    <Text style={restaurantTitle} adjustsFontSizeToFit={true}
                        numberOfLines={2}>
                        {item.username}
                    </Text>
                </View>


            </View>
        </TouchableOpacity>


    );


    const getRestaurants = async () => {
        setLoading(true);
        try {
            const response = await axios.get(apiheader + '/users/getUsers');
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
                const response = await axios.get(apiheader + '/users/getUsers');
                const result = await response.data;
                setData(result)
                
            } else {
                const response = await axios.get(apiheader + '/users/getlikeUsers/' + searchQuery);
                const result = await response.data;
                setData(result)
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
            getRestaurants();
        }, [])
    );


    return (
        // {imagePlace ? (
        //     <Image style={styles.logo}source={{uri: 'data:image/png;base64,'+imagePlace}}/>
        // ) : (
        //     <></>
        // )}


        <SafeAreaView style={container}>
            <View style={loadingindi}>
                <ActivityIndicator size={"large"} animating={isLoading} style={loadingindi} />
            </View>
            <View style={styles.topper}>

            </View>
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
            <FlatList
                data={usersList}
                renderItem={({ item }) => <List item={item} />}
                keyExtractor={item => item._id}
            />
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
        flexDirection: "row",
        flex: 1
    }, topper: {
        flexDirection: "row-reverse",
        marginTop: 20
    }, addButton: {
        backgroundColor: "black",
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 10

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
        marginBottom: 30

    }

})

export default AllUsers
