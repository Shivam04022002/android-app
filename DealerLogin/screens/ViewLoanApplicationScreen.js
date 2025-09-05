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

// ✅ Mapping for API workflow stages
const STAGE_MAP = {
  'contact creation': 'Contact Creation',
  'cibil': 'Cibil',
  'house visit': 'Housevisit',
  'housevisit': 'Housevisit',
  'documents collection': 'Documents Collection',
  'credit sanction': 'Credit Sanction',
  'agreement': 'Agreement',
  'pre-disbursement documentation': 'Pre-Disbursement Documentation',
  'disbursed': 'Disbursed'
};

// ✅ Render Step Circle with Completed, Current, and Pending States
function renderStepCircle(idx, currentStep) {
  if (idx < currentStep - 1) {
    // Completed step
    return (
      <View key={idx} style={styles.stepWrapper}>
        <View style={[styles.progressCircleGrid, styles.stepDone]}>
          <Text style={[styles.progressCircleTextGrid, { color: '#fff' }]}>✓</Text>
        </View>
        <Text style={styles.progressStepLabelGrid}>{PROGRESS_LABELS[idx]}</Text>
      </View>
    );
  } else if (idx === currentStep - 1) {
    // Current step
    return (
      <View key={idx} style={styles.stepWrapper}>
        <View style={[styles.progressCircleGrid, styles.stepCurrent]}>
          <Text style={[styles.progressCircleTextGrid, { color: '#16C172' }]}>{idx + 1}</Text>
        </View>
        <Text style={styles.progressStepLabelGrid}>{PROGRESS_LABELS[idx]}</Text>
      </View>
    );
  } else {
    // Future step
    return (
      <View key={idx} style={styles.stepWrapper}>
        <View style={[styles.progressCircleGrid, styles.stepPending]}>
          <Text style={[styles.progressCircleTextGrid, { color: '#BDBDBD' }]}>{idx + 1}</Text>
        </View>
        <Text style={styles.progressStepLabelGrid}>{PROGRESS_LABELS[idx]}</Text>
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
    const fetchApplication = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`http://192.168.29.138:5000/api/pending-files/${fileId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch application data');
        }

        const data = await response.json();
        setApplication(data);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Could not fetch application data.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [fileId]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    navigation.replace('Login');
  };

  if (loading || !application) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#212121" />
      </View>
    );
  }

  // ✅ Calculate current step dynamically
  const cleanStage = application.workflowStage.replace(/"/g, '').toLowerCase();
  const mappedStage = STAGE_MAP[cleanStage] || '';
  const stepIndex = PROGRESS_LABELS.findIndex(label => label === mappedStage);
  const currentStep = stepIndex >= 0 ? stepIndex + 1 : 1;

  console.log('✅ Current Step:', currentStep, 'Workflow Stage:', cleanStage);

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff7ed' }}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Navbar user={user} onLogout={handleLogout} />
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <Text style={styles.heading}>Loan Application Form</Text>

          <View style={styles.badgeRow}>
            <Text style={styles.badgeLabel}>Application ID:</Text>
            <View style={styles.appIdBadge}>
              <Text style={styles.appIdText}>{application._id}</Text>
            </View>
          </View>

          <Text style={styles.useridRow}>
            <Text style={{ color: '#222' }}>Form ID: <Text style={{ fontWeight: 'bold' }}>{application.formId}</Text></Text>
            <Text> | </Text>
            <Text style={{ color: '#222' }}>Name: <Text style={{ fontWeight: 'bold' }}>{application.applicant.applicant.name}</Text></Text>
          </Text>

          <Text style={styles.progressLabel}>Application Progress</Text>
          <View style={styles.progressGrid}>
            {chunkArray(PROGRESS_LABELS, 3).map((chunk, rowIndex) => (
              <View
                key={rowIndex}
                style={[
                  styles.progressRow,
                  rowIndex === 2 ? { justifyContent: 'center' } : {},
                ]}
              >
                {chunk.map((label, index) =>
                  renderStepCircle(rowIndex * 3 + index, currentStep)
                )}
              </View>
            ))}
          </View>

          {/* Status Box */}
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
                  <Text style={styles.detailValue}>{application.applicant.applicant.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Father's Name</Text>
                  <Text style={styles.detailValue}>{application.applicant.applicant.fatherName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>DOB</Text>
                  <Text style={styles.detailValue}>{new Date(application.applicant.applicant.dateOfBirth).toLocaleDateString()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Aadhar No</Text>
                  <Text style={styles.detailValue}>{application.applicant.applicant.aadharNo}</Text>
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
                  <Text style={styles.detailLabel}>Vehicle</Text>
                  <Text style={styles.detailValue}>{application.vehicleDetails.brandName} {application.vehicleDetails.modelName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Price</Text>
                  <Text style={styles.detailValue}>{application.vehicleDetails.priceOfVehicle}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Finance Required</Text>
                  <Text style={styles.detailValue}>{application.vehicleDetails.financeRequired}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tenure</Text>
                  <Text style={styles.detailValue}>{application.vehicleDetails.tenure} months</Text>
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
  heading: { fontSize: 26, fontWeight: 'bold', color: '#181818', marginTop: 16, marginBottom: 6, textAlign: 'center', letterSpacing: 0.2 },
  badgeRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  badgeLabel: { fontWeight: '600', color: '#222', fontSize: 13.5, marginRight: 5 },
  appIdBadge: { backgroundColor: '#F5F5F5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  appIdText: { color: '#222', fontWeight: 'bold', fontSize: 14, letterSpacing: 0.2 },
  useridRow: { textAlign: 'center', fontSize: 14.8, marginBottom: 8, color: '#222', fontWeight: '500' },
  progressLabel: { fontWeight: '700', color: '#222', fontSize: 14.8, marginTop: 10, marginBottom: 7, textAlign: 'center' },
  progressGrid: { marginTop: 5, marginBottom: 18 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 16 },
  stepWrapper: { alignItems: 'center', flex: 1, minWidth: 90, maxWidth: 110 },
  progressCircleGrid: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 5, backgroundColor: '#fff' },
  progressCircleTextGrid: { fontWeight: 'bold', fontSize: 17 },
  progressStepLabelGrid: { fontSize: 11.6, color: '#222', textAlign: 'center', fontWeight: '600', maxWidth: 96 },
  stepDone: { backgroundColor: '#16C172', borderColor: '#16C172' },
  stepCurrent: { backgroundColor: '#fff', borderColor: '#16C172' },
  stepPending: { backgroundColor: '#fff', borderColor: '#BDBDBD' },
  statusBox: { backgroundColor: '#F8F8F8', borderRadius: 8, padding: 0, marginHorizontal: 18, marginTop: 10, marginBottom: 14, elevation: 1 },
  statusText: { fontSize: 15, color: '#111', fontWeight: 'bold', paddingVertical: 10 },
  tabRow: { flexDirection: 'row', backgroundColor: '#EEE', marginHorizontal: 15, borderRadius: 7, marginBottom: 0, overflow: 'hidden', marginTop: 4 },
  tab: { flex: 1, paddingVertical: 9, backgroundColor: 'transparent', alignItems: 'center' },
  tabActive: { backgroundColor: '#fff', borderBottomWidth: 2.5, borderBottomColor: '#16C172' },
  tabText: { fontWeight: 'bold', color: '#999', fontSize: 15 },
  tabTextActive: { color: '#16C172' },
  detailsCard: { backgroundColor: '#fff', marginHorizontal: 14, marginTop: 18, borderRadius: 9, padding: 16, elevation: 1, borderWidth: 1, borderColor: '#E0E0E0' },
  sectionTitle: { fontWeight: 'bold', color: '#222', fontSize: 17, marginBottom: 11, textAlign: 'left' },
  detailRow: { flexDirection: 'row', marginBottom: 10 },
  detailLabel: { flex: 1.1, color: '#666', fontWeight: 'bold', fontSize: 15 },
  detailValue: { flex: 2, color: '#222', fontSize: 15, fontWeight: '500', textAlign: 'right' },
});
