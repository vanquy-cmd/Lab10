import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ServiceDetail = ({ route }) => {
  const { service } = route.params;
  const [name, setName] = useState(service.name);
  const [price, setPrice] = useState(service.price);
  const [description, setDescription] = useState(service.description || '');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Hàm cập nhật dịch vụ trong Firestore
  const handleUpdateService = async () => {
    if (!name || !price) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await firestore()
        .collection('SERVICES')
        .doc(service.id)
        .update({
          name,
          price,
          description,
        });
      setLoading(false);
      Alert.alert('Success', 'Service updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating service: ', error);
      setLoading(false);
    }
  };

  // Hàm xóa dịch vụ khỏi Firestore
  const handleDeleteService = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this service?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setLoading(true);
            try {
              await firestore()
                .collection('SERVICES')
                .doc(service.id)
                .delete();
              setLoading(false);
              Alert.alert('Success', 'Service deleted successfully!');
              navigation.goBack(); // Quay lại màn hình trước
            } catch (error) {
              console.error('Error deleting service: ', error);
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Service</Text>

      <TextInput
        mode="outlined"
        label="Service Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        mode="outlined"
        label="Price"
        value={price.toString()}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        mode="outlined"
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        style={styles.input}
        placeholder="Enter description"
      />

      <Text style={styles.dateText}>
        Created At: {service.createdAt ? service.createdAt.toDate().toLocaleString() : 'N/A'}
      </Text>

      <Button
        mode="contained"
        onPress={handleUpdateService}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Update Service
      </Button>

      <Button
        mode="outlined"
        onPress={handleDeleteService}
        loading={loading}
        disabled={loading}
        style={[styles.button, styles.deleteButton]}
      >
        Delete Service
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
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
  },
  deleteButton: {
    borderColor: 'red',
    marginTop: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ServiceDetail;
