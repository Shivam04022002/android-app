import React, { useState, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";

const ORANGE = "#FF9100";
const YELLOW = "#FFD600";
const GREEN = "#34C759";
const RED = "#FF3B30";

export default function DashboardScreen({ navigation }) {
  // Replace these with your actual user and values fetched from backend
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const userJson = await AsyncStorage.getItem('userInfo');
        if (userJson) setUser(JSON.parse(userJson));
      };
      loadUser();
    }, [])
  );
  // These are dummy numbers for illustration
  const applyFormCount = 0;
  const pendingFilesCount = 1;
  const approvedFilesCount = 1;
  const rejectedFilesCount = 3;

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    navigation.replace("Login");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff7ed' }}>
    <View style={{ flex: 1, backgroundColor: "#fff7ed" }}>
      <Navbar user={user} onLogout={() => {
        // This function is called from Navbar
        navigation.replace('Login');
      }} />

      <View style={{ flex: 1, padding: 18 }}>
        <Text style={styles.heading}>Dashboard</Text>
        {/* Cards */}
        <DashboardCard
          title="Apply Form"
          count={applyFormCount}
          icon={<MaterialIcons name="note-add" size={28} color={ORANGE} />}
          borderColor={ORANGE}
          onPress={() => navigation.navigate("ApplyForm")}
        />
        <DashboardCard
          title="Pending Files"
          count={pendingFilesCount}
          icon={<MaterialIcons name="schedule" size={28} color={YELLOW} />}
          borderColor={YELLOW}
          onPress={() => navigation.navigate("PendingFiles")}
        />
        <DashboardCard
          title="Approved Files"
          count={approvedFilesCount}
          icon={<MaterialIcons name="check-circle" size={28} color={GREEN} />}
          borderColor={GREEN}
          onPress={() => navigation.navigate("ApprovedFiles")}
        />
        <DashboardCard
          title="Rejected Files"
          count={rejectedFilesCount}
          icon={<MaterialIcons name="cancel" size={28} color={RED} />}
          borderColor={RED}
          onPress={() => navigation.navigate("RejectedFiles")}
        />
      </View>
    </View>
    </SafeAreaView>
  );
}

function DashboardCard({ title, count, icon, borderColor, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, { borderColor }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardCount}>{count}</Text>
        </View>
        <View style={styles.iconWrap}>{icon}</View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#A34B1A",
    marginBottom: 18,
    marginLeft: 6,
    marginTop: 12,
  },
  card: {
    backgroundColor: "#fff6ec",
    borderRadius: 14,
    borderWidth: 2,
    marginBottom: 18,
    elevation: 2,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 17,
    color: "#222",
    fontWeight: "600",
    marginBottom: 3,
  },
  cardCount: {
    fontSize: 28,
    color: "#171717",
    fontWeight: "bold",
    marginTop: 4,
  },
  iconWrap: {
    backgroundColor: "#fff4e3",
    borderRadius: 24,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
