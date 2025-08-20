import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ViewRejectedApplicationScreen({ route, navigation }) {
  const { file } = route.params;

  // Mock data: replace with actual data as needed
  const applicationData = {
    personalDetails: {
      fullName: file.userName,
      email: `${file.userId.toLowerCase()}@example.com`,
      phone: "9876543210",
      address: "123 Main Street, Cityville",
      dateOfBirth: "1985-06-15",
    },
    loanDetails: {
      loanAmount: file.loanAmount,
      tenure: 60,
      purpose: "Home Purchase",
      interestRate: "9.5%",
      emi: Math.round(file.loanAmount * 0.024),
    }
  };

  const [activeTab, setActiveTab] = useState('personal');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff7ed' }}>
      <Navbar />
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.headerBox}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#222" />
        </TouchableOpacity>
        <Text style={styles.heading}>Rejected Loan Application</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.appIdBadge}>Application ID: <Text style={styles.bold}>{file.id}</Text></Text>
          <Text style={styles.textRow}>User ID: <Text style={styles.bold}>{file.userId}</Text> | Name: <Text style={styles.bold}>{file.userName}</Text></Text>
          <Text style={styles.statusBadge}>Rejected</Text>
        </View>
        <Text style={styles.rejectedOn}>Application Rejected on {file.rejectionDate}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'personal' && styles.tabActive]}
          onPress={() => setActiveTab('personal')}
        >
          <Text style={[styles.tabText, activeTab === 'personal' && styles.tabTextActive]}>Personal Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'loan' && styles.tabActive]}
          onPress={() => setActiveTab('loan')}
        >
          <Text style={[styles.tabText, activeTab === 'loan' && styles.tabTextActive]}>Loan Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rejection' && styles.tabActive]}
          onPress={() => setActiveTab('rejection')}
        >
          <Text style={[styles.tabText, activeTab === 'rejection' && styles.tabTextActive]}>Rejection Reason</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Personal Details Tab */}
        {activeTab === 'personal' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Details</Text>
            <Detail label="Full Name" value={applicationData.personalDetails.fullName} />
            <Detail label="Email" value={applicationData.personalDetails.email} />
            <Detail label="Phone" value={applicationData.personalDetails.phone} />
            <Detail label="Date of Birth" value={applicationData.personalDetails.dateOfBirth} />
            <Detail label="Address" value={applicationData.personalDetails.address} />
          </View>
        )}

        {/* Loan Details Tab */}
        {activeTab === 'loan' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Loan Details</Text>
            <Detail label="Loan Amount" value={`₹${applicationData.loanDetails.loanAmount.toLocaleString()}`} />
            <Detail label="Tenure" value={`${applicationData.loanDetails.tenure} months`} />
            <Detail label="Interest Rate" value={applicationData.loanDetails.interestRate} />
            <Detail label="Monthly EMI" value={`₹${applicationData.loanDetails.emi.toLocaleString()}`} />
            <Detail label="Purpose of Loan" value={applicationData.loanDetails.purpose} />
          </View>
        )}

        {/* Rejection Reason Tab */}
        {activeTab === 'rejection' && (
          <View style={[styles.card, { borderColor: '#fbbaba' }]}>
            <Text style={[styles.cardTitle, { color: '#d32f2f' }]}>Rejection Details</Text>
            <View style={styles.alertBox}>
              <Ionicons name="close-circle" size={28} color="#d32f2f" />
              <View style={{ marginLeft: 8 }}>
                <Text style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: 15 }}>Reason for Rejection:</Text>
                <Text style={{ color: '#d32f2f', marginTop: 4, fontSize: 14 }}>{file.rejectionReason}</Text>
              </View>
            </View>
            <View style={{ marginTop: 18 }}>
              <Text style={{ color: '#222', fontSize: 13.5 }}>
                <Text style={{ fontWeight: 'bold' }}>Rejection Date:</Text> {file.rejectionDate}
              </Text>
              <Text style={{ color: '#444', marginTop: 8, fontSize: 13.5 }}>
                <Text style={{ fontWeight: 'bold' }}>Note:</Text> You may reapply after addressing the above issues. For more help, contact support.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

// Detail Row Component
function Detail({ label, value }) {
  return (
    <View style={detailStyles.row}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: { backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 7, elevation: 1, borderBottomWidth: 1, borderColor: '#eee' },
  backBtn: { position: 'absolute', left: 4, top: 18, zIndex: 2 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 8, marginTop: 0, textAlign: 'center' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 5, alignItems: 'center', justifyContent: 'space-between' },
  appIdBadge: { backgroundColor: '#f2f2f2', color: '#181818', borderRadius: 7, paddingHorizontal: 9, paddingVertical: 2, fontSize: 13 },
  statusBadge: { backgroundColor: '#d32f2f', color: '#fff', borderRadius: 7, fontWeight: 'bold', fontSize: 13, paddingHorizontal: 9, paddingVertical: 3, overflow: 'hidden' },
  textRow: { color: '#222', fontSize: 13 },
  bold: { fontWeight: 'bold', color: '#111' },
  rejectedOn: { color: '#d32f2f', fontWeight: 'bold', fontSize: 14, marginBottom: 6, marginTop: 3, textAlign: 'left' },
  tabRow: { flexDirection: 'row', marginTop: 0, marginBottom: 0, backgroundColor: '#f7f7f7', borderRadius: 8, marginHorizontal: 12 },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderBottomWidth: 2, borderColor: 'transparent', backgroundColor: 'transparent' },
  tabActive: { borderBottomWidth: 2.5, borderColor: '#d32f2f', backgroundColor: '#fff' },
  tabText: { color: '#aaa', fontWeight: 'bold', fontSize: 15 },
  tabTextActive: { color: '#d32f2f' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 17, marginHorizontal: 11, marginTop: 18, borderWidth: 1, borderColor: '#eee', elevation: 1 },
  cardTitle: { fontWeight: 'bold', color: '#222', fontSize: 17, marginBottom: 14 },
  alertBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fceaea', borderRadius: 7, padding: 10, borderWidth: 1, borderColor: '#fbbaba', marginBottom: 12 },
});

const detailStyles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between', alignItems: 'flex-start' },
  label: { color: '#555', fontWeight: '600', fontSize: 14, flex: 1 },
  value: { color: '#222', fontSize: 14, fontWeight: '500', flex: 1, textAlign: 'right' },
});
