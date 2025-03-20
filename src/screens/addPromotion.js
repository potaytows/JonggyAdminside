import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
const apiheader = process.env.EXPO_PUBLIC_apiURI;
import Text from '../components/Text';

const AddPromotion = ({ navigation }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [minCount, setMinCount] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [display, setDisplay] = useState('Hide');
    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!name || !discount || !startDate || !endDate) {
            Alert.alert('Error', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ');
            return;
        }
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description || ''); // ป้องกันค่า null
        formData.append('code', code || '');
        formData.append('discount', parseFloat(discount));
        formData.append('minCount', parseInt(minCount) || 0); // ค่าเริ่มต้นเป็น 0 ถ้าไม่ได้กรอก
        formData.append('usageLimit', parseInt(usageLimit) || 0);
        formData.append('startDate', startDate.toISOString());
        formData.append('endDate', endDate.toISOString());
        formData.append('display', display);
        if (selectedImage) {
            formData.append('image', {
                uri: selectedImage,
                name: selectedImage.split('/').pop(), 
                type: 'image/jpeg', 
            });
        }
    
        try {
            const response = await axios.post(apiheader + '/promotion/addPromotion', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Alert.alert('Success', 'โปรโมชันถูกเพิ่มเรียบร้อย');
            navigation.goBack();
        } catch (error) {
            console.error('Error adding promotion:', error);
            Alert.alert('Error', 'ไม่สามารถเพิ่มโปรโมชันได้');
        }
    };

    const handleStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(false);
        setStartDate(currentDate);
    };

    const handleEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(false);
        setEndDate(currentDate);
    };
    
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>เพิ่มโปรโมชัน</Text>

            <TextInput
                style={styles.input}
                placeholder="ชื่อโปรโมชัน"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="คำอธิบาย"
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="รหัสคูปอง (ถ้ามี)"
                value={code}
                onChangeText={setCode}
            />
            <TextInput
                style={styles.input}
                placeholder="ส่วนลด (%) หรือ จำนวนเงิน"
                value={discount}
                onChangeText={setDiscount}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="ยอดเงินขั้นต่ำ"
                value={minCount}
                onChangeText={setMinCount}
                keyboardType="numeric"
            />
            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
            >
                <Text style={styles.dateButtonText}>
                    {`วันเริ่มต้น ${startDate.toLocaleDateString()}`}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
            >
                <Text style={styles.dateButtonText}>
                    {`วันสิ้นสุด ${endDate.toLocaleDateString()}`}
                </Text>
            </TouchableOpacity>

            {showStartDatePicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleStartDateChange}
                />
            )}

            {showEndDatePicker && (
                <DateTimePicker
                    value={endDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleEndDateChange}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="จำนวนครั้งที่ใช้ได้"
                value={usageLimit}
                onChangeText={setUsageLimit}
                keyboardType="numeric"
            />
            <View style={styles.picker}>
            <Picker
                    selectedValue={display}
                    onValueChange={(itemValue) => setDisplay(itemValue)}
                    style={styles.dropdown}
                >
                    <Picker.Item label="แสดง" value="Show" />
                    <Picker.Item label="ไม่แสดง" value="Hide" />
                </Picker>
            </View>
            <TouchableOpacity
                style={styles.imagePicker} onPress={selectImage}>
                {selectedImage ? (
                    <Image source={{ uri: selectedImage }} style={styles.imagePromotion} />
                ) : (
                    <Text style={styles.SlipTxt}>เลือกรูปภาพ</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>บันทึก</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize:16
    },
    imagePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePickerText: {
        color: '#888',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    saveButton: {
        backgroundColor: '#ff8a24',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom:20
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    imagePromotion: {
        width: 200,
        height: 200,
        margin: 'auto'
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333',
    },
    picker: {
        marginBottom: 15,
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:10
    },
});

export default AddPromotion;
