import { StyleSheet, Text, View, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Dragable from '../components/dragable';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const apiheader = process.env.EXPO_PUBLIC_apiURI;

const Table = ({ route }) => {
    const [obj, setData] = useState([]);
    const [tables, setTableData] = useState([]);
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
        
            
            <View style={styles.dragablecontainer}>
                {obj.map((item,index)=> (
                    <View style={styles.dragablecontent} key={index}>
                        <Dragable key={item.tableName} id={item._id} x={item.x} y={item.y} item={item}>
                        </Dragable>
                    </View>
                ))}
            </View>




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
        alignSelf:'center',
        marginTop:40

    },
    submitcontainer: {
        flexDirection: 'column',
        flex: 1
    }, dragablecontent: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default Table