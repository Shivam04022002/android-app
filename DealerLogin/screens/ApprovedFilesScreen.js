import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateFilterBar from '../components/DateFilterBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';

// Helper: convert ISO date (yyyy-mm-dd) to dd/mm/yyyy
const toDDMMYYYY = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

// Sample mock data
const MOCK_APPROVED_FILES = [
  {
    id: 'APR-20240710',
    userId: 'USR101',
    userName: 'Aman Sharma',
    loanAmount: 350000,
    approvalDate: '2025-07-12',
    status: 'Approved',
  },
  {
    id: 'APR-20240711',
    userId: 'USR121',
    userName: 'Priya Kaur',
    loanAmount: 420000,
    approvalDate: '2025-07-15',
    status: 'Approved',
  },
  {
    id: 'APR-20240712',
    userId: 'USR131',
    userName: 'Vikas Kumar',
    loanAmount: 225000,
    approvalDate: '2025-07-17',
    status: 'Approved',
  },
];

export default function ApprovedFilesScreen({ navigation }) {
  const [searchDate, setSearchDate] = useState('');

  // Filter by dd/mm/yyyy
  const filteredFiles = searchDate
    ? MOCK_APPROVED_FILES.filter(f => toDDMMYYYY(f.approvalDate) === searchDate)
    : MOCK_APPROVED_FILES;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff7ed' }}>
      <Navbar />
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Approved Applications</Text>
      </View>

      {/* Date Filter */}
      <DateFilterBar value={searchDate} onChange={setSearchDate} />

      <FlatList
        data={filteredFiles}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.idText}>#{item.id}</Text>
              <Text style={styles.amountText}>₹{item.loanAmount.toLocaleString()}</Text>
            </View>
            <Text style={styles.nameText}>
              {item.userName}{' '}
              <Text style={{ color: '#999', fontWeight: 'normal' }}>({item.userId})</Text>
            </Text>
            <View style={styles.row}>
              <Ionicons name="checkmark-circle" size={17} color="#388e3c" />
              <Text style={styles.approvedText}>Approved</Text>
              <Text style={styles.dateText}>Date: {toDDMMYYYY(item.approvalDate)}</Text>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => navigation.navigate("ViewApprovedApplicationScreen", { file: item })}
              >
                <Ionicons name="eye" size={20} color="#3450A1" />
                <Text style={styles.eyeText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 30 }}>
            No approved files found for this date.
          </Text>
        }
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ececec', marginHorizontal: 12, marginBottom: 13, padding: 15, elevation: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2, alignItems: 'center' },
  idText: { fontWeight: 'bold', color: '#222', fontSize: 15 },
  amountText: { color: '#3450A1', fontWeight: 'bold', fontSize: 15 },
  nameText: { color: '#111', fontSize: 15.5, fontWeight: 'bold', marginTop: 2, marginBottom: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  approvedText: { color: '#388e3c', fontWeight: 'bold', marginLeft: 4, fontSize: 14 },
  dateText: { color: '#444', marginLeft: 15, fontSize: 13 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 11 },
  eyeBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#F5F7FA', borderRadius: 8 },
  eyeText: { marginLeft: 5, color: '#3450A1', fontWeight: 'bold', fontSize: 14 },
});
