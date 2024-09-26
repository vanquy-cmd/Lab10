import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, Text, Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Lấy dữ liệu từ Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('SERVICES')
      .onSnapshot((querySnapshot) => {
        const serviceList = [];
        querySnapshot.forEach((doc) => {
          serviceList.push({ id: doc.id, ...doc.data() });
        });
        setServices(serviceList);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  // Nếu đang loading thì hiển thị ActivityIndicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="red" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Hàm định dạng tiền theo chuẩn Việt Nam
  const formatCurrency = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  // Hàm rút gọn tên dịch vụ nếu dài hơn 24 ký tự
  const truncateName = (name) => {
    return name.length > 24 ? name.substring(0, 24) + '...' : name;
  };

  // Render item của danh sách dịch vụ
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ServiceDetail', { service: item })} // Điều hướng đến màn hình ServiceDetail và truyền dữ liệu dịch vụ
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.serviceItem}>
            <Text style={styles.serviceName}>{truncateName(item.name)}</Text>
            <Text style={styles.servicePrice}>{formatCurrency(Number(item.price))}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Danh sách dịch vụ</Text>
        <IconButton
          icon="plus-circle"
          iconColor="red"
          size={40}
          onPress={() => navigation.navigate('AddNewService')}
        />
      </View>

      {/* Hiển thị danh sách dịch vụ */}
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ paddingHorizontal: 16 }}
      />
    </View>
  );
};

// Định dạng style
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: '#999',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3, // Tạo đổ bóng cho card
    backgroundColor: '#fff',
  },
  serviceItem: {
    flexDirection: 'row', // Căn theo chiều ngang
    justifyContent: 'space-between', // Tên bên trái, giá bên phải
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1, // Cho phép tên chiếm không gian còn lại
    color: '#333',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50', // Màu xanh lá cây cho giá
    marginLeft: 10, // Tạo khoảng cách với tên dịch vụ
  },
});

export default Services;
