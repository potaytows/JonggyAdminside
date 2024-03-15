import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, FlatList, TextInput, ActivityIndicator, ToastAndroid, TouchableOpacity, Image, Button, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AutoHeightImage from 'react-native-auto-height-image'
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const AddRestaurant = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(false);
    const [restaurantName, onRestaurantNameChange] = React.useState('');
    const [description, onDescriptionChange] = React.useState('');
    const [height, setHeight] = useState(0);
    const [image, setImage] = useState(null);
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to choose an image.');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
        if (!result.canceled) {
            setImage({ uri: result.assets[0].uri, type: 'image/png', name: 'uploadingimg' + Date.now() });
        }
    };





    const fetchAddRestaurant = async () => {
        setLoading(true);
        try {

            const response = await axios.post(apiheader + '/restaurants/addRestaurant',{restaurantName:restaurantName,description:description});
            const result = await response.data;
            if (result.status == "added succesfully") {
                if (image) {
                    const uploadResult = await FileSystem.uploadAsync(apiheader + '/restaurants/uploadImage/' + result.obj._id, image.uri, {
                        httpMethod: 'POST',
                        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                        fieldName: 'image'
                    });
                } else {
                    const response = await axios.post(apiheader + '/restaurants/uploadImage/' + result.obj._id+"/default");
                    
                }
                navigation.navigate("allRestaurants")
                ToastAndroid.showWithGravityAndOffset('Added ' + restaurantName, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)

            }

        } catch (error) {
            console.log(error);
            ToastAndroid.showWithGravityAndOffset('Some error has occured, please try again ', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
        } finally {
            setLoading(false);
            setImage(null)
        }




    }

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && <View style={styles.activityIndicatorBody}>
                <ActivityIndicator size="large" color='#ff8a24' animating={isLoading} />
            </View>}


            <View style={styles.restaurantNameCont}>
                <Text>ชื่อร้านอาหาร</Text>
                <View style={{ width: '100%', height: 40, marginTop: 5, alignContent: 'center' }}>
                    <TextInput
                        style={styles.input}
                        onChangeText={onRestaurantNameChange}
                        value={restaurantName}
                        placeholder='ใส่ชื่อร้านของคุณ'
                    />
                </View>
                <Text>คำอธิบายร้าน (Description)</Text>
                <View style={{ width: '100%', marginTop: 5, alignContent: 'center', height: Math.max(35, height) }}>
                    <TextInput
                        onChangeText={onDescriptionChange}
                        value={description}
                        placeholder='ใส่คำอธิบาย'
                        multiline={true}
                        onContentSizeChange={(event) =>
                            setHeight(event.nativeEvent.contentSize.height)
                        }
                        style={[styles.Descriptioninput, { height: Math.max(35, height) }]}
                    />
                </View>
                <View style={styles.imageButton}>
                    <Button title="เลือกรูปภาพ" onPress={pickImage} style={styles.addImageButton} />
                    {image && <Image source={{ uri: image.uri }} style={styles.previewImage} />}
                </View>





            </View >
            <View style={styles.addButtonCont}>
                <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert('ยืนยันการเพิ่มร้านอาหาร', 'คุณต้องการเพิ่ม ' + restaurantName + " หรือไม่", [
                    {
                        text: 'ยกเลิก',
                    },
                    { text: 'ยืนยัน', onPress: () => fetchAddRestaurant() },
                ])}>
                    <Text style={{ color: "white" }}>ยืนยัน</Text>

                </TouchableOpacity>
            </View>






        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    loadingindi: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }, input: {
        borderWidth: 1,
        flex: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white'
    }, Descriptioninput: {
        borderWidth: 1,
        flex: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white'

    }, restaurantNameCont: {
        marginHorizontal: 20,
        marginTop: 10,
        alignContent: 'center'
    }, addButton: {
        backgroundColor: '#ff8a24',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginBottom: 30

    }, addButtonCont: {
        flex: 1,
        justifyContent: 'flex-end'
    }, activityIndicatorBody: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignSelf: 'center',
        justifyContent: 'center'
    }, imageButton: {
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'center'
    }, previewImage: {
        width: 200, height: 200,
        marginTop: 20

    }, addImageButton: {

    }


})

export default AddRestaurant
