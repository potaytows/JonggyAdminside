import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';


const apiheader = "http://192.168.1.101:8000";

const AddOwner = ({ navigation }) => {
    const [userList, setUsers] = useState([]);


    
    const getUsers = async () => {
        console.log(process.env.apiURI)
        try {
            const response = await fetch(apiheader + '/users/getUsers');
            const result = await response.json();
            setUsers(result)
        } catch (error) {
            console.error(error);
        }
    };
    const List = ({ item }) => (


        
            <View style={styles.flatlist}>
                <View stlye={styles.usertData}>
                    <Text style={styles.userTitle}>
                        {item.username}
                    </Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Tabs", { username: item.username})}>
                        <Text style={{color:'white'}}>เพิ่ม</Text>
                    </TouchableOpacity>
                </View>


            </View>
        


    );
    useFocusEffect(
        React.useCallback(() => {
          getUsers();
        }, [])
      );

    
    return (
        <View style={styles.container}>
            <FlatList
                data={userList}
                renderItem={({ item }) => <List item={item} />}
                keyExtractor={item => item._id}
            />
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
        flex: 1,
        marginLeft:10,
        marginTop:20,
        backgroundColor:"green",
        
    },userData: {
        marginRight: 5,
        flexDirection: 'row',
        flex: 1,

    },userTitle: {
        color: "black",
        marginRight: 1,
        fontSize: 15,
        backgroundColor:'red'
    }, addButton: {
        backgroundColor: "red",
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf:'flex-end',

    }
});


export default AddOwner