import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const AddNewService = () => {
  const [service, setService] = useState({
    name: '',
    price: '',
  });
  const [loading, setLoading] = useState(false); // Để xử lý trạng thái loading
  const navigation = useNavigation();

  const handleAddService = async () => {
    if (!service.name || !service.price) {
      alert('Please fill in all fields!');
      return;
    }
  
    setLoading(true);
  
    try {
      // Thêm dữ liệu dịch vụ mới vào Firestore
      await firestore().collection('SERVICES').add({
        name: service.name,
        price: service.price,
        creator: 'John Doe', // Tên của người tạo dịch vụ (có thể là lấy từ authentication)
        createdAt: firestore.FieldValue.serverTimestamp(), // Thời gian tạo
        updatedAt: firestore.FieldValue.serverTimestamp(), // Thời gian cập nhật (ban đầu giống thời gian tạo)
      });
      setLoading(false);
      navigation.goBack(); // Quay về màn hình danh sách dịch vụ sau khi thêm
    } catch (error) {
      console.error('Error adding service: ', error);
      setLoading(false);
    }
  };
  

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        
        <TextInput
          mode="outlined"
          label="Service Name"
          value={service.name}
          onChangeText={(text) => setService({ ...service, name: text })}
          style={styles.input}
          placeholder="Enter service name"
        />

        <TextInput
          mode="outlined"
          label="Price"
          value={service.price}
          onChangeText={(text) => setService({ ...service, price: text })}
          keyboardType="numeric"
          style={styles.input}
          placeholder="Enter price"
        />

        <Button
          mode="contained"
          onPress={handleAddService}
          loading={loading} // Hiển thị loading khi đang xử lý
          disabled={loading} // Vô hiệu hóa nút khi đang loading
          contentStyle={styles.buttonContent}
          style={styles.button}
        >
          {loading ? 'Adding Service...' : 'Add'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
  },
  innerContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: "pink",
  },
  buttonContent: {
    paddingVertical: 10, // Tăng kích thước nút
  },
});

export default AddNewService;
