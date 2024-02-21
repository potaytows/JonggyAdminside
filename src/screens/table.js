import { StyleSheet, Text, View, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Dragable from '../components/dragable';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Table = ({ route }) => {
    const [obj, setData] = useState([]);
    const [tables, setTableData] = useState([]);
    const updateTable = async (xTrans, yTrans, id) => {
        console.log(id)
        try {
            const response = await axios.put(apiheader + '/tables/edit/' + id, { x: xTrans, y: yTrans });
        } catch (error) {
            console.error(error);
        }
    };
    const getTables = async () => {
        try {
            const response = await axios.get(apiheader + '/tables/getbyRestaurantId/' + route.params.restaurant_id);
            const result = await response.data;
            setData(result)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getTables()

    }, []);



    return (
        <SafeAreaView style={styles.container}>
            
            <View style={styles.dragablecontainer}>
                {obj.map((item,index)=> (
                    <View style={styles.dragableontent} key={index}>
                        <Dragable key={item.tableName} id={item._id} x={item.x} y={item.y} item={item}>
                        </Dragable>
                    </View>
                ))}
            </View>

        </SafeAreaView>



    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dragablecontainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
        width: 350,
        height: 450,
        alignSelf:'center'

    },
    submitcontainer: {
        flexDirection: 'column',
        flex: 1
    }, dragableontent: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default Table