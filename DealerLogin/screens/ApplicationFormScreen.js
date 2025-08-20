
import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Image, Modal, Alert, Platform, KeyboardAvoidingView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Navbar from '../components/Navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';



// --- UI Components ---
const FieldText = React.memo(function FieldText({ label, value, onChange, err, editable = true, multiline = false, keyboardType = 'default' }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value || ''}
        onChangeText={onChange}
        editable={editable}
        multiline={multiline}
        keyboardType={keyboardType}
        style={[styles.input, !editable && { backgroundColor: '#f0f0f0' }]}
      />
      {err ? <Text style={styles.error}>{err}</Text> : null}
    </View>
  );
});

const FieldImage = React.memo(function FieldImage({ label, value, onPick, err }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={onPick} style={styles.imagePicker}>
        {value ? (
          <Image
            source={{ uri: typeof value === 'string' ? value : value?.uri }}
            style={styles.imagePreview}
          />
        ) : (
          <Text style={{ color: '#3450A1' }}>Pick Image</Text>
        )}
      </TouchableOpacity>
      {err ? <Text style={styles.error}>{err}</Text> : null}
    </View>
  );
});

const generateFormId = () => 'FORM-' + Date.now().toString().slice(-6);

export default function ApplicationFormScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const userJson = await AsyncStorage.getItem('userInfo');
        if (userJson) setUser(JSON.parse(userJson));
      };
      loadUser();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    navigation.replace("Login");
  };

  const [applicantFormId] = useState(generateFormId());
  const [coApplicantFormId] = useState(generateFormId());

  const [showVehicleDialog, setShowVehicleDialog] = useState(false);

  const [applicantForm, setApplicantForm] = useState({
    photo: null,
    name: '', fatherName: '', dateOfBirth: null, aadharNo: '', panNo: '',
    address: '', pincode: '', policeStation: '', postOffice: '',
    aadharFront: null, aadharBack: null, panImage: null,
    coApplicantName: '',
  });

  const [coApplicantForm, setCoApplicantForm] = useState({
    photo: null,
    name: '', fatherName: '', dateOfBirth: null, aadharNo: '', panNo: '',
    address: '', pincode: '', policeStation: '', postOffice: '',
    aadharFront: null, aadharBack: null, panImage: null,
    form60: null, relation: '', documentType: '',
  });

  const [vehicleForm, setVehicleForm] = useState({
    brandName: '', modelName: '', priceOfVehicle: '', financeRequired: '', tenure: ''
  });

  const [errors, setErrors] = useState({ applicant: {}, coApplicant: {}, form: '' });
  const [showDatePicker, setShowDatePicker] = useState({ which: '', visible: false });

  const updateApplicantForm = useCallback((field, value) => {
    setApplicantForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, applicant: { ...prev.applicant, [field]: '' } }));
  }, []);
  const updateCoApplicantForm = useCallback((field, value) => {
    setCoApplicantForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, coApplicant: { ...prev.coApplicant, [field]: '' } }));
  }, []);

  // Stable handlers for applicant fields
  const onChangeApplicantName = useCallback((v) => updateApplicantForm('name', v), [updateApplicantForm]);
  const onChangeApplicantFather = useCallback((v) => updateApplicantForm('fatherName', v), [updateApplicantForm]);
  const onChangeApplicantAadhar = useCallback((v) => updateApplicantForm('aadharNo', v), [updateApplicantForm]);
  const onChangeApplicantPAN = useCallback((v) => updateApplicantForm('panNo', v), [updateApplicantForm]);
  const onChangeApplicantAddress = useCallback((v) => updateApplicantForm('address', v), [updateApplicantForm]);
  const onChangeApplicantPincode = useCallback((v) => updateApplicantForm('pincode', v), [updateApplicantForm]);
  const onChangeApplicantPoliceStation = useCallback((v) => updateApplicantForm('policeStation', v), [updateApplicantForm]);
  const onChangeApplicantPostOffice = useCallback((v) => updateApplicantForm('postOffice', v), [updateApplicantForm]);
  const onChangeApplicantCoApplicantName = useCallback((v) => updateApplicantForm('coApplicantName', v), [updateApplicantForm]);

  // Stable handlers for co-applicant fields
  const onChangeCoApplicantName = useCallback((v) => updateCoApplicantForm('name', v), [updateCoApplicantForm]);
  const onChangeCoApplicantFather = useCallback((v) => updateCoApplicantForm('fatherName', v), [updateCoApplicantForm]);
  const onChangeCoApplicantAadhar = useCallback((v) => updateCoApplicantForm('aadharNo', v), [updateCoApplicantForm]);
  const onChangeCoApplicantAddress = useCallback((v) => updateCoApplicantForm('address', v), [updateCoApplicantForm]);
  const onChangeCoApplicantPincode = useCallback((v) => updateCoApplicantForm('pincode', v), [updateCoApplicantForm]);
  const onChangeCoApplicantPoliceStation = useCallback((v) => updateCoApplicantForm('policeStation', v), [updateCoApplicantForm]);
  const onChangeCoApplicantPostOffice = useCallback((v) => updateCoApplicantForm('postOffice', v), [updateCoApplicantForm]);
  const onChangeCoApplicantRelation = useCallback((v) => updateCoApplicantForm('relation', v), [updateCoApplicantForm]);
  const onChangeCoApplicantPAN = useCallback((v) => updateCoApplicantForm('panNo', v), [updateCoApplicantForm]);
  const onChangeCoApplicantDocumentType = useCallback((v) => updateCoApplicantForm('documentType', v), [updateCoApplicantForm]);

  const pickImage = async (onPicked) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need media permission to pick images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const img = result.assets[0];
      const imageObj = {
        uri: img.uri,
        type: 'image/jpeg',
        name: `upload-${Date.now()}.jpg`
      };
      onPicked(imageObj);
    }
  };

  const handleDatePicked = (which, event, date) => {
    setShowDatePicker({ which: '', visible: false });
    if (!date) return;
    if (which === 'applicant') updateApplicantForm('dateOfBirth', date);
    else if (which === 'coApplicant') updateCoApplicantForm('dateOfBirth', date);
  };

  const validateAndProceed = () => {
    const applicantReq = ['photo', 'name', 'fatherName', 'dateOfBirth', 'aadharNo', 'panNo', 'address', 'aadharFront', 'aadharBack', 'panImage', 'postOffice'];
    const coApplicantReq = ['photo', 'name', 'fatherName', 'dateOfBirth', 'aadharNo', 'address', 'aadharFront', 'aadharBack', 'postOffice', 'documentType', 'relation'];

    let appErr = {}, coAppErr = {}, globalErr = '';

    applicantReq.forEach(f => { if (!applicantForm[f]) appErr[f] = 'Required'; });
    coApplicantReq.forEach(f => { if (!coApplicantForm[f]) coAppErr[f] = 'Required'; });

    if (coApplicantForm.documentType === 'pan') {
      if (!coApplicantForm.panNo) coAppErr.panNo = 'PAN required';
      if (!coApplicantForm.panImage) coAppErr.panImage = 'PAN image required';
    } else if (coApplicantForm.documentType === 'form60') {
      if (!coApplicantForm.form60) coAppErr.form60 = 'Form 60 required';
    }

    if (Object.keys(appErr).length > 0 || Object.keys(coAppErr).length > 0) {
      globalErr = 'Fill all required fields.';
      setErrors({ applicant: appErr, coApplicant: coAppErr, form: globalErr });
      Alert.alert('Form Incomplete', globalErr);
      return;
    }

    setErrors({ applicant: {}, coApplicant: {}, form: '' });
    setShowVehicleDialog(true);
  };

  const uploadToCloudinary = async (image) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.name || `upload-${Date.now()}.jpg`,
    });

    const response = await axios.post(
      "http://192.168.1.126:5000/api/applications/upload-image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      }
    );

    return response.data.url;
  };

  const handleFinalSubmit = async () => {
    console.log("final submit", handleFinalSubmit);
    try {
      const uploadImageFields = async (form) => {
        const result = { ...form };
        for (const key in form) {
          if (form[key]?.uri) {
            result[key] = await uploadToCloudinary(form[key]);
          }
        }
        return result;
      };

      const token = await AsyncStorage.getItem('userToken');
      const userInfo = await AsyncStorage.getItem('userInfo');
      const user = JSON.parse(userInfo);

      const applicantUploaded = await uploadImageFields(applicantForm);
      const coApplicantUploaded = await uploadImageFields(coApplicantForm);

      const payload = {
        user: {
          UserId: user.UserId,
          Name: user.Name,
          District: user.District,
          Branch: user.Branch,
          Contact: user.Contact
        },
        applicant: { ...applicantUploaded, formId: applicantFormId },
        coApplicant: { ...coApplicantUploaded, formId: coApplicantFormId },
        vehicleDetails: { ...vehicleForm, formId: applicantFormId }
      };

      const res = await axios.post(
        'http://192.168.1.126:5000/api/applications/submit',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        Alert.alert('Success', 'Application submitted!');
      } else {
        Alert.alert('Error', 'Failed to submit application.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to submit application.');
      console.error(err);
    } finally {
      navigation.replace('Dashboard');
    }
  };

  // Remaining JSX remains unchanged (already complete in your last file)
  // ...



  // --- UI ---
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff7ed' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={{ flex: 1, backgroundColor: "#fff7ed" }}>
          <Navbar user={user} onLogout={handleLogout} />
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Applicant Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Applicant Form</Text>
              <Text style={styles.formId}>Form ID: {applicantFormId}</Text>
              <View style={styles.section}>
                <FieldImage label="Photo (passport size)" value={applicantForm.photo}
                  onPick={useCallback(() => pickImage(url => updateApplicantForm('photo', url)), [updateApplicantForm])} err={errors.applicant.photo} />
                <FieldText label="Name" value={applicantForm.name} onChange={onChangeApplicantName} err={errors.applicant.name} />
                <FieldText label="Father's Name" value={applicantForm.fatherName} onChange={onChangeApplicantFather} err={errors.applicant.fatherName} />
                <View style={styles.row}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowDatePicker({ which: 'applicant', visible: true })}>
                    <FieldText label="Date of Birth" value={applicantForm.dateOfBirth ? applicantForm.dateOfBirth.toISOString().slice(0, 10) : ''} editable={false} err={errors.applicant.dateOfBirth} />
                  </TouchableOpacity>
                  <FieldText label="Age" value={applicantForm.dateOfBirth ? (new Date().getFullYear() - applicantForm.dateOfBirth.getFullYear()).toString() : ''} editable={false} />
                </View>
                <FieldText label="Aadhar Number" value={applicantForm.aadharNo} onChange={onChangeApplicantAadhar} err={errors.applicant.aadharNo} keyboardType="numeric" />
                <FieldText
                  label="PAN Number"
                  value={applicantForm.panNo}
                  onChange={onChangeApplicantPAN} // ✅ use the stable handler
                  err={errors.applicant.panNo}
                />
                <FieldText label="Address" value={applicantForm.address} onChange={onChangeApplicantAddress} err={errors.applicant.address} multiline />
                <FieldText label="Pincode" value={applicantForm.pincode} onChange={onChangeApplicantPincode} err={errors.applicant.pincode} keyboardType="numeric" />
                <FieldText label="Nearby Police Station" value={applicantForm.policeStation} onChange={onChangeApplicantPoliceStation} err={errors.applicant.policeStation} />
                <FieldImage label="Aadhar Image (Front)" value={applicantForm.aadharFront}
                  onPick={useCallback(() => pickImage(url => updateApplicantForm('aadharFront', url)), [updateApplicantForm])} err={errors.applicant.aadharFront} />
                <FieldImage label="Aadhar Image (Back)" value={applicantForm.aadharBack}
                  onPick={useCallback(() => pickImage(url => updateApplicantForm('aadharBack', url)), [updateApplicantForm])} err={errors.applicant.aadharBack} />
                <FieldImage label="PAN Card Image" value={applicantForm.panImage}
                  onPick={useCallback(() => pickImage(url => updateApplicantForm('panImage', url)), [updateApplicantForm])} err={errors.applicant.panImage} />
                <FieldText label="Post Office" value={applicantForm.postOffice} onChange={onChangeApplicantPostOffice} err={errors.applicant.postOffice} />
                <FieldText label="Co-Applicant Name" value={applicantForm.coApplicantName} onChange={onChangeApplicantCoApplicantName} />
              </View>
            </View>

            {/* Co-Applicant Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Co-Applicant Form</Text>
              <Text style={styles.formId}>Form ID: {coApplicantFormId}</Text>
              <View style={styles.section}>
                <FieldImage label="Photo (passport size)" value={coApplicantForm.photo}
                  onPick={useCallback(() => pickImage(url => updateCoApplicantForm('photo', url)), [updateCoApplicantForm])} err={errors.coApplicant.photo} />
                <FieldText label="Name" value={coApplicantForm.name} onChange={onChangeCoApplicantName} err={errors.coApplicant.name} />
                <FieldText label="Father's Name" value={coApplicantForm.fatherName} onChange={onChangeCoApplicantFather} err={errors.coApplicant.fatherName} />
                <View style={styles.row}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowDatePicker({ which: 'coApplicant', visible: true })}>
                    <FieldText label="Date of Birth" value={coApplicantForm.dateOfBirth ? coApplicantForm.dateOfBirth.toISOString().slice(0, 10) : ''} editable={false} err={errors.coApplicant.dateOfBirth} />
                  </TouchableOpacity>
                  <FieldText label="Age" value={coApplicantForm.dateOfBirth ? (new Date().getFullYear() - coApplicantForm.dateOfBirth.getFullYear()).toString() : ''} editable={false} />
                </View>
                <FieldText label="Aadhar Number" value={coApplicantForm.aadharNo} onChange={onChangeCoApplicantAadhar} err={errors.coApplicant.aadharNo} keyboardType="numeric" />
                <FieldText label="Address" value={coApplicantForm.address} onChange={onChangeCoApplicantAddress} err={errors.coApplicant.address} multiline />
                <FieldText label="Pincode" value={coApplicantForm.pincode} onChange={onChangeCoApplicantPincode} err={errors.coApplicant.pincode} keyboardType="numeric" />
                <FieldText label="Nearby Police Station" value={coApplicantForm.policeStation} onChange={onChangeCoApplicantPoliceStation} err={errors.coApplicant.policeStation} />
                <FieldImage label="Aadhar Image (Front)" value={coApplicantForm.aadharFront}
                  onPick={useCallback(() => pickImage(url => updateCoApplicantForm('aadharFront', url)), [updateCoApplicantForm])} err={errors.coApplicant.aadharFront} />
                <FieldImage label="Aadhar Image (Back)" value={coApplicantForm.aadharBack}
                  onPick={useCallback(() => pickImage(url => updateCoApplicantForm('aadharBack', url)), [updateCoApplicantForm])} err={errors.coApplicant.aadharBack} />
                <Text style={{ marginTop: 12, fontWeight: 'bold' }}>Document Type</Text>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[styles.radioBtn, coApplicantForm.documentType === 'pan' && styles.radioActive]}
                    onPress={() => onChangeCoApplicantDocumentType('pan')}

                  >
                    <Text>PAN Card</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.radioBtn, coApplicantForm.documentType === 'form60' && styles.radioActive]}
                    onPress={() => onChangeCoApplicantDocumentType('form60')}

                  >
                    <Text>Form 60</Text>
                  </TouchableOpacity>
                </View>
                {coApplicantForm.documentType === 'pan' && (
                  <>
                    <FieldText
                      label="PAN Number"
                      value={coApplicantForm.panNo}
                      onChange={onChangeCoApplicantPAN} // ✅ using stable function
                      err={errors.coApplicant.panNo}
                    />

                    <FieldImage
                      label="PAN Card Image"
                      value={coApplicantForm.panImage}
                      onPick={() => pickImage(url => updateCoApplicantForm('panImage', url))}
                      err={errors.coApplicant.panImage}
                    />
                  </>
                )}
                {coApplicantForm.documentType === 'form60' && (
                  <FieldImage
                    label="Form 60"
                    value={coApplicantForm.form60}
                    onPick={() => pickImage(url => updateCoApplicantForm('form60', url))}
                    err={errors.coApplicant.form60}
                  />
                )}

                <FieldText label="Post Office" value={coApplicantForm.postOffice} onChange={onChangeCoApplicantPostOffice} err={errors.coApplicant.postOffice} />
                {/* Relation with Applicant as Dropdown */}
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.label}>Relation with Applicant</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={coApplicantForm.relation}
                      onValueChange={onChangeCoApplicantRelation}
                      style={{ width: '100%' }}
                    >
                      <Picker.Item label="Select relation..." value="" />
                      <Picker.Item label="Father" value="father" />
                      <Picker.Item label="Mother" value="mother" />
                      <Picker.Item label="Brother" value="brother" />
                      <Picker.Item label="Husband" value="husband" />
                      <Picker.Item label="Wife" value="wife" />
                      <Picker.Item label="Son" value="son" />
                    </Picker>
                  </View>
                  {errors.coApplicant.relation ? <Text style={styles.error}>{errors.coApplicant.relation}</Text> : null}
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, uploading && { backgroundColor: '#ccc' }]}
              onPress={validateAndProceed}
              disabled={uploading}
            >
              <Text style={styles.submitText}>
                {uploading ? `Uploading... ${uploadProgress}%` : 'Submit Application'}
              </Text>
            </TouchableOpacity>

            {uploading && (
              <View style={styles.progressBarWrapper}>
                <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
                <Text style={styles.progressText}>{uploadProgress}%</Text>
              </View>
            )}



            {/* Vehicle Details Modal */}
            <Modal visible={showVehicleDialog} animationType="slide" transparent>
              <View style={styles.modalBg}>
                <View style={styles.vehicleModal}>
                  <Text style={styles.cardTitle}>Vehicle Details</Text>
                  <FieldText label="Brand Name" value={vehicleForm.brandName} onChange={v => setVehicleForm(prev => ({ ...prev, brandName: v }))} />
                  <FieldText label="Model Name" value={vehicleForm.modelName} onChange={v => setVehicleForm(prev => ({ ...prev, modelName: v }))} />
                  <FieldText label="Price of Vehicle" value={vehicleForm.priceOfVehicle} onChange={v => setVehicleForm(prev => ({ ...prev, priceOfVehicle: v }))} keyboardType="numeric" />
                  <FieldText label="Finance Required" value={vehicleForm.financeRequired} onChange={v => setVehicleForm(prev => ({ ...prev, financeRequired: v }))} keyboardType="numeric" />
                  <Text style={styles.label}>Tenure</Text>
                  <View style={[styles.row, { marginBottom: 12 }]}>
                    {['12', '15', '18', '21', '24'].map(opt => (
                      <TouchableOpacity key={opt} style={[styles.radioBtn, vehicleForm.tenure === opt && styles.radioActive]} onPress={() => setVehicleForm(prev => ({ ...prev, tenure: opt }))}>
                        <Text>{opt} Months</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={[styles.submitBtn, { flex: 1, backgroundColor: uploading ? '#ccc' : '#FF7300' }]}
                      onPress={handleFinalSubmit}
                      disabled={uploading}
                    >
                      <Text style={styles.submitText}>
                        {uploading ? `Uploading... ${uploadProgress}%` : 'Submit'}
                      </Text>
                    </TouchableOpacity>

                  </View>
                </View>
              </View>
            </Modal>

            {/* DatePicker Modal */}
            {showDatePicker.visible && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(e, date) => handleDatePicked(showDatePicker.which, e, date)}
              />
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... your styles here (unchanged)
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF7300',
    textAlign: 'center',
    marginVertical: 18,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f2f2f2',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FF7300',
    marginBottom: 6,
  },
  formId: {
    fontSize: 12,
    color: '#A67435',
    marginBottom: 6,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  section: {
    marginTop: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 10,
    fontSize: 15.5,
    backgroundColor: '#FAFAFA',
    marginBottom: 0,
    marginTop: 2,
    color: '#222',
  },
  error: {
    color: '#E55B13',
    fontSize: 12.5,
    marginTop: 2,
    marginLeft: 2,
    fontWeight: 'bold',
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 62,
    backgroundColor: '#FAFAFA',
    marginBottom: 2,
    marginTop: 2,
    flexDirection: 'row',
    gap: 7,
  },
  imagePreview: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FF7300',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 5,
    marginTop: 3,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    marginTop: 2,
    marginBottom: 0,
    paddingHorizontal: 4,
  },
  radioBtn: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#FFF',
  },
  radioActive: {
    backgroundColor: '#FFD3A3',
    borderColor: '#FF7300',
  },
  submitBtn: {
    backgroundColor: '#FF7300',
    borderRadius: 9,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    flex: 1,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16.5,
    letterSpacing: 0.16,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleModal: {
    backgroundColor: '#fff',
    borderRadius: 11,
    padding: 22,
    width: '93%',
    borderWidth: 1,
    borderColor: '#f2f2f2',
  },
  progressBarWrapper: {
    marginHorizontal: 16,
    marginTop: 8,
    height: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#FF7300',
    borderRadius: 10,
  },

  progressText: {
    position: 'absolute',
    top: -22,
    right: 10,
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },

});
