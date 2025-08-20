import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';

export default function ViewApprovedApplicationScreen({ route, navigation }) {
    const { file } = route.params;
  // Mock (or use from file) application data
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
      interestRate: "8.5%",
      emi: Math.round(file.loanAmount * 0.022),
    },
    employmentDetails: {
      employerName: "Tech Solutions Inc.",
      designation: "Senior Engineer",
      monthlyIncome: 95000,
      employmentType: "Full-time",
      yearsOfExperience: 10,
    }
  };

  const [activeTab, setActiveTab] = useState('personal');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff7ed' }}>
      <Navbar />
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ padding: 15, paddingBottom: 70 }}>
      <View style={styles.headerBox}>
        <Text style={styles.heading}>Approved Loan Application</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.appIdBadge}>Application ID: <Text style={styles.bold}>{file.id}</Text></Text>
          <Text style={styles.textRow}>User ID: <Text style={styles.bold}>{file.userId}</Text> | Name: <Text style={styles.bold}>{file.userName}</Text></Text>
          <Text style={styles.statusBadge}>Approved</Text>
        </View>
        <Text style={styles.approvedOn}>Application Approved on {file.approvalDate}</Text>
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
      </View>

      {/* Content */}
      <View style={styles.card}>
        {activeTab === 'personal' ? (
          <>
            <Text style={styles.cardTitle}>Personal Details</Text>
            <Detail label="Full Name" value={applicationData.personalDetails.fullName} />
            <Detail label="Email" value={applicationData.personalDetails.email} />
            <Detail label="Phone" value={applicationData.personalDetails.phone} />
            <Detail label="Date of Birth" value={applicationData.personalDetails.dateOfBirth} />
            <Detail label="Address" value={applicationData.personalDetails.address} />
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>Loan Details</Text>
            <Detail label="Loan Amount" value={`₹${applicationData.loanDetails.loanAmount.toLocaleString()}`} />
            <Detail label="Tenure" value={`${applicationData.loanDetails.tenure} months`} />
            <Detail label="Interest Rate" value={applicationData.loanDetails.interestRate} />
            <Detail label="Monthly EMI" value={`₹${applicationData.loanDetails.emi.toLocaleString()}`} />
            <Detail label="Purpose of Loan" value={applicationData.loanDetails.purpose} />
          </>
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

function Detail({ label, value }) {
  return (
    <View style={detailStyles.row}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: { marginBottom: 14 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4, alignItems: 'center' },
  appIdBadge: { backgroundColor: '#e9ffe9', color: '#109c45', fontWeight: '600', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, fontSize: 13.5 },
  statusBadge: { backgroundColor: '#16C172', color: '#fff', borderRadius: 7, fontWeight: 'bold', fontSize: 13, paddingHorizontal: 9, paddingVertical: 3 },
  textRow: { color: '#222', fontSize: 13.5 },
  bold: { fontWeight: 'bold', color: '#111' },
  approvedOn: { color: '#16C172', fontWeight: '600', fontSize: 14, marginTop: 3, marginBottom: 6 },
  tabRow: { flexDirection: 'row', backgroundColor: '#eee', borderRadius: 8, overflow: 'hidden', marginVertical: 7 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: 'transparent' },
  tabActive: { backgroundColor: '#fff', borderBottomWidth: 2.5, borderBottomColor: '#16C172' },
  tabText: { color: '#aaa', fontWeight: 'bold', fontSize: 15 },
  tabTextActive: { color: '#16C172' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 1, marginTop: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  cardTitle: { fontWeight: 'bold', color: '#16C172', fontSize: 17, marginBottom: 12, textAlign: 'left' },
});

const detailStyles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: 9, justifyContent: 'space-between' },
  label: { color: '#555', fontWeight: '600', fontSize: 14 },
  value: { color: '#181818', fontSize: 14, fontWeight: '500', maxWidth: 180, textAlign: 'right' },
});
