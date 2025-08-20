import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import Navbar from '../components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockFiles = [
  {
    id: 'LN-2025-001',
    userId: 'USR001',
    name: 'John Smith',
    date: '2025-05-10'
  },
  {
    id: 'LN-2025-002',
    userId: 'USR002',
    name: 'Maria Garcia',
    date: '2025-05-12'
  },
  {
    id: 'LN-2025-003',
    userId: 'USR003',
    name: 'Robert Johnson',
    date: '2025-05-14'
  },
  {
    id: 'LN-2025-004',
    userId: 'USR004',
    name: 'Sarah Williams',
    date: '2025-05-15'
  }
];

export default function PendingFilesScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const userJson = await AsyncStorage.getItem('userInfo');
      if (userJson) setUser(JSON.parse(userJson));
    };
    loadUser();

    setFiles(mockFiles);
  }, []);

  const getFilteredFiles = () => {
    if (!startDate && !endDate) return files;
    return files.filter(f => {
      if (startDate && f.date < startDate) return false;
      if (endDate && f.date > endDate) return false;
      return true;
    });
  };

  const filteredFiles = getFilteredFiles();

  const handleRowPress = (file) => {
    navigation.navigate('ViewLoanApplicationScreen', { fileId: file.id });
  };

  return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff7ed' }}>

    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Navbar user={user} onLogout={() => navigation.replace('Login')} />

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.heading}>Pending Files</Text>
        <View style={styles.filterRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.filterLabel}>Start Date</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#888"
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.filterLabel}>End Date</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#888"
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>Application ID</Text>
            <Text style={[styles.th, { flex: 1 }]}>User ID</Text>
            <Text style={[styles.th, { flex: 2 }]}>Name</Text>
            <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Date</Text>
          </View>
          {
            filteredFiles.length === 0
              ? <Text style={styles.noFilesText}>No pending files found.</Text>
              : filteredFiles.map((file, idx) => (
                <TouchableOpacity key={file.id} onPress={() => handleRowPress(file)} activeOpacity={0.65}>
                  <View style={[
                    styles.tableRow,
                    idx === filteredFiles.length - 1 ? { borderBottomWidth: 0 } : {}
                  ]}>
                    <Text style={[styles.td, { flex: 2, fontWeight: 'bold' }]}>{file.id}</Text>
                    <Text style={[styles.td, { flex: 1 }]}>{file.userId}</Text>
                    <Text style={[styles.td, { flex: 2 }]}>{file.name}</Text>
                    <Text style={[styles.td, { flex: 2, textAlign: 'right' }]}>{file.date}</Text>
                  </View>
                </TouchableOpacity>
              ))
          }
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
    marginLeft: 18,
    letterSpacing: 0.16,
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 18,
    marginTop: 4,
    justifyContent: 'space-between',
  },
  filterLabel: {
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 15,
    marginLeft: 2,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 10,
    fontSize: 15.5,
    backgroundColor: '#fff',
    color: '#212121',
  },
  table: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 10,
    overflow: 'hidden',
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 12,
  },
  th: {
    color: '#111',
    fontWeight: '700',
    fontSize: 15.5,
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    backgroundColor: '#fff',
  },
  td: {
    fontSize: 15.2,
    color: '#222',
    flex: 1,
  },
  noFilesText: {
    textAlign: 'center',
    padding: 24,
    color: '#757575',
    fontSize: 16,
  }
});
