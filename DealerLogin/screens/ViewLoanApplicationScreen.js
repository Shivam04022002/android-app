import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Navbar from '../components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const PROGRESS_LABELS = [
  'Contact Creation',
  'Cibil',
  'Housevisit',
  'Documents Collection',
  'Credit Sanction',
  'Agreement',
  'Pre-Disbursement Documentation',
  'Disbursed'
];

// Util for rendering a circle step with green/gray styles
function renderStepCircle(idx, currentStep) {
  if (idx < currentStep - 1) {
    // Completed step
    return (
      <View key={idx} style={styles.stepWrapper}>
        <View style={[styles.progressCircleGrid, styles.stepDone]}>
          <Text style={[styles.progressCircleTextGrid, { color: '#fff' }]}>✓</Text>
        </View>
        <Text style={styles.progressStepLabelGrid}>
          {PROGRESS_LABELS[idx]}
        </Text>
      </View>
    );
  } else if (idx === currentStep - 1) {
    // Current step
    return (
      <View key={idx} style={styles.stepWrapper}>
        <View style={[styles.progressCircleGrid, styles.stepCurrent]}>
          <Text style={[styles.progressCircleTextGrid, { color: '#16C172' }]}>{idx + 1}</Text>
        </View>
        <Text style={styles.progressStepLabelGrid}>
          {PROGRESS_LABELS[idx]}
        </Text>
      </View>
    );
  } else {
    // Future step
    return (
      <View key={idx} style={styles.stepWrapper}>
        <View style={[styles.progressCircleGrid, styles.stepPending]}>
          <Text style={[styles.progressCircleTextGrid, { color: '#BDBDBD' }]}>{idx + 1}</Text>
        </View>
        <Text style={styles.progressStepLabelGrid}>
          {PROGRESS_LABELS[idx]}
        </Text>
      </View>
    );
  }
}

export default function ViewLoanApplicationScreen({ route, navigation }) {
  const { fileId } = route.params;
  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const loadUser = async () => {
      const userJson = await AsyncStorage.getItem('userInfo');
      if (userJson) setUser(JSON.parse(userJson));
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace with actual fetch
        setApplication({
          _id: 'LN-2025-001',
          applicantName: 'John Smith',
          userId: 'USR001',
          date: '2025-07-25',
          status: 'Housevisit',
          step: 3,
          amount: '₹2,00,000',
          tenure: '24 Months',
          vehicle: 'Maruti Suzuki Swift',
          email: 'usr001@example.com',
          phone: '9876543210',
        });
      } catch (err) {
        Alert.alert('Could not fetch application data.');
      }
      setLoading(false);
    };
    fetchData();
  }, [fileId]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    navigation.replace("Login");
  };

  if (loading || !application) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#212121" />
      </View>
    );
  }

  const currentStep = application.step || 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff7ed' }}>
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Navbar user={user} onLogout={handleLogout} />
      <ScrollView contentContainerStyle={{ padding: 0, paddingBottom: 30 }}>
        <Text style={styles.heading}>Loan Application Form</Text>

        <View style={styles.badgeRow}>
          <Text style={styles.badgeLabel}>Application ID:</Text>
          <View style={styles.appIdBadge}>
            <Text style={styles.appIdText}>{application._id}</Text>
          </View>
        </View>

        <Text style={styles.useridRow}>
          <Text style={{ color: '#222' }}>User ID: <Text style={{ fontWeight: 'bold' }}>{application.userId}</Text></Text>
          <Text> | </Text>
          <Text style={{ color: '#222' }}>Name: <Text style={{ fontWeight: 'bold' }}>{application.applicantName}</Text></Text>
        </Text>

        <Text style={styles.progressLabel}>Application Progress</Text>
        <View style={styles.progressGrid}>
          <View style={styles.progressRow}>
            {renderStepCircle(0, currentStep)}
            {renderStepCircle(1, currentStep)}
            {renderStepCircle(2, currentStep)}
          </View>
          <View style={styles.progressRow}>
            {renderStepCircle(3, currentStep)}
            {renderStepCircle(4, currentStep)}
            {renderStepCircle(5, currentStep)}
          </View>
          <View style={[styles.progressRow, { justifyContent: 'center' }]}>
            {renderStepCircle(6, currentStep)}
            {renderStepCircle(7, currentStep)}
          </View>
        </View>

        {/* Status Box with green border */}
        <View style={styles.statusBox}>
          <View style={{ borderLeftWidth: 5, borderLeftColor: '#16C172', paddingLeft: 13 }}>
            <Text style={styles.statusText}>
              Current Status: <Text style={{ fontWeight: 'bold', color: '#111' }}>{application.status}</Text>
            </Text>
          </View>
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

        <View style={styles.detailsCard}>
          {activeTab === 'personal' ? (
            <>
              <Text style={styles.sectionTitle}>Personal Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Full Name</Text>
                <Text style={styles.detailValue}>{application.applicantName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{application.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{application.phone}</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Loan Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Application ID</Text>
                <Text style={styles.detailValue}>{application._id}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount</Text>
                <Text style={styles.detailValue}>{application.amount}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tenure</Text>
                <Text style={styles.detailValue}>{application.tenure}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Vehicle</Text>
                <Text style={styles.detailValue}>{application.vehicle}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>{application.status}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#181818',
    marginTop: 16,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeLabel: {
    fontWeight: '600',
    color: '#222',
    fontSize: 13.5,
    marginRight: 5,
  },
  appIdBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  appIdText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  useridRow: {
    textAlign: 'center',
    fontSize: 14.8,
    marginBottom: 8,
    color: '#222',
    fontWeight: '500',
  },
  progressLabel: {
    fontWeight: '700',
    color: '#222',
    fontSize: 14.8,
    marginTop: 10,
    marginBottom: 7,
    textAlign: 'center',
  },
  progressGrid: {
    marginTop: 5,
    marginBottom: 18,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
    minWidth: 90,
    maxWidth: 110,
  },
  progressCircleGrid: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  progressCircleTextGrid: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  progressStepLabelGrid: {
    fontSize: 11.6,
    color: '#222',
    textAlign: 'center',
    fontWeight: '600',
    maxWidth: 96,
  },
  // Step styles
  stepDone: {
    backgroundColor: '#16C172',
    borderColor: '#16C172',
  },
  stepCurrent: {
    backgroundColor: '#fff',
    borderColor: '#16C172',
  },
  stepPending: {
    backgroundColor: '#fff',
    borderColor: '#BDBDBD',
  },
  statusBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 0,
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 14,
    elevation: 1,
  },
  statusText: {
    fontSize: 15,
    color: '#111',
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#EEE',
    marginHorizontal: 15,
    borderRadius: 7,
    marginBottom: 0,
    overflow: 'hidden',
    marginTop: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
    borderBottomWidth: 2.5,
    borderBottomColor: '#16C172',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#999',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#16C172',
  },
  detailsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginTop: 18,
    borderRadius: 9,
    padding: 16,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 17,
    marginBottom: 11,
    textAlign: 'left',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    flex: 1.1,
    color: '#666',
    fontWeight: 'bold',
    fontSize: 15,
  },
  detailValue: {
    flex: 2,
    color: '#222',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
  },
});
