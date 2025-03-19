import React, { useState } from 'react';
import { View, StyleSheet, Button, Image, ActivityIndicator, FlatList, Modal, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Text from '../components/Text';

const apiheader = process.env.EXPO_PUBLIC_apiURI;

const ProofImageScreen = ({ route, navigation }) => {
    const withdraw = route.params.withdraw;
    const restaurantName = route.params.restaurantName;

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedWithdraw, setSelectedWithdraw] = useState(null);
    const [selectedTab, setSelectedTab] = useState('pending');
    const [approvedWithdraw, setApprovedWithdraw] = useState(null);
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('ขออนุญาตเข้าถึงรูปภาพถูกปฏิเสธ');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Set the correct state to the selected image
        }
    };

    const uploadImage = async () => {
        if (!image) {
            alert('กรุณาเลือกภาพก่อน');
            return;
        }

        if (!selectedWithdraw) {
            alert('กรุณาเลือกการถอน');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('image', {
            uri: image,
            type: 'image/jpeg',
            name: 'proof-image.jpg',
        });
        formData.append('withdrawId', selectedWithdraw._id); // ส่ง _id ของ withdrawal เพื่ออัพเดตการถอน

        try {
            const response = await axios.post(apiheader + '/wallet/saveProofImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus('อัพโหลดสำเร็จ');
            Alert.alert('Success', 'หลักฐานการถอนถูกอัพโหลดสำเร็จ');
            navigation.goBack();
        } catch (error) {
            console.error('Error uploading proof image:', error);
            setUploadStatus('ไม่สามารถอัพโหลดได้');
            Alert.alert('Error', 'ไม่สามารถอัพโหลดหลักฐานได้');
        } finally {
            setLoading(false);
        }
    };


    const handleItemPress = (withdrawItem) => {
        setSelectedWithdraw(withdrawItem);
        if (withdrawItem.status === "approved") {
            setApprovedWithdraw(true);
        } else {
            setModalVisible(true);
        }
    };
    const filterWithdrawItem = withdraw.filter(item => {
        if (selectedTab === "pending") return item.status === "pending";
        if (selectedTab === "approved") return item.status === "approved";
    });

    const renderWithdrawItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.withdrawItem}>
                <View style={styles.flexWithdraw}>
                    <Text style={styles.dateTitle}>
                        {new Date(item.date).toLocaleString('th-TH', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })}
                    </Text>
                    <Text style={[styles.amountTitle, item.status === "approved" ? { color: 'green' } : { color: 'blue' }]}>฿{item.amount}</Text>
                </View>
                <Text style={[styles.statusTitle, item.status === "approved" ? { color: 'green' } : { color: 'blue' }]}>{item.status}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{restaurantName}</Text>
            <View style={styles.historys}>
                <TouchableOpacity style={[styles.btuhistory, selectedTab === 'pending' && styles.activeTab]}
                    onPress={() => setSelectedTab('pending')}>
                    <Text style={styles.subTitle}>ยังไม่โอน</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btuhistory, selectedTab === 'approved' && styles.activeTab]}
                    onPress={() => setSelectedTab('approved')}>
                    <Text style={styles.subTitle}>โอนแล้ว</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filterWithdrawItem}  // Use filtered withdraw items
                renderItem={renderWithdrawItem}
                keyExtractor={(item) => item._id.toString()}
            />

            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeader}>ยอดโอน ฿{selectedWithdraw?.amount}</Text>
                    <View style={styles.bankLaout}>
                        <Text style={styles.bank}>ธนาคาร: {selectedWithdraw?.bankName}</Text>
                        <Text style={styles.bank}>ชื่อบัญชี: {selectedWithdraw?.accountName}</Text>
                        <Text style={styles.bank}>เลขบัญชี: {selectedWithdraw?.accountNumber}</Text>
                    </View>

                    {image && <Image source={{ uri: image }} style={styles.image} />}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={pickImage} style={styles.buttonImage}>
                            <Text style={styles.buttonImageText}>เลือกภาพ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={uploadImage} disabled={loading} style={styles.buttonUpload}>
                            <Text style={styles.buttonImageText}>อัพโหลดรูปภาพ</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
                    ) : (
                        uploadStatus && <Text style={styles.statusText}>{uploadStatus}</Text>
                    )}

                    <Button title="ปิด" onPress={() => setModalVisible(false)} color="#DC3545" />
                </View>
            </Modal>
            <Modal visible={approvedWithdraw} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeader}>
                        ใบเสร็จโอนเงิน
                    </Text>


                    {selectedWithdraw?.proofImage ? (
                        <Image source={{ uri: `data:image/jpeg;base64,${selectedWithdraw.proofImage}` }} style={styles.images} />
                    ) : (
                        <Text style={{ textAlign: 'center', color: 'gray' }}>
                            ยังไม่มีภาพหลักฐาน
                        </Text>
                    )}

                    <Button title="ปิด" onPress={() => setApprovedWithdraw(false)} color="#DC3545" />
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
    },
    withdrawItem: {
        backgroundColor: '#f9f9f9',
        margin: 8,
        padding: 10,
        shadowOffset: {
            width: 0,
            height: 0.1,
        },
        shadowOpacity: 0.23,
        shadowRadius: 0.61,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 30,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    images: {
        width: 400,
        height: 400,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonImage: {
        width: 120,
        padding: 10,
        backgroundColor: '#FF8A24',
        margin: 5
    },
    buttonUpload: {
        width: 120,
        padding: 10,
        backgroundColor: '#FF8A24',
        margin: 5
    },
    buttonImageText: {
        textAlign: 'center',
        color: 'white'
    },

    loader: {
        marginTop: 20,
    },
    statusText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
        color: '#28a745', // Green text for success
        textAlign: 'center',
    },
    flexWithdraw: {
        flexDirection: 'row'
    },
    dateTitle: {
        fontSize: 16,
        color: 'gray'
    },
    amountTitle: {
        fontSize: 16,
        marginLeft: 'auto'
    },
    statusTitle: {
        fontSize: 16

    },
    historys: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    activeTab: {
        backgroundColor: '#FF8A24',

    },
    btuhistory: {
        backgroundColor: 'gray',
        width: 150,
        padding: 10,
        borderRadius: 20,
        marginLeft: 5,
        marginRight: 5
    },
    subTitle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15
    },
    bankLaout:{
        justifyContent:'center'
    }


});

export default ProofImageScreen;
