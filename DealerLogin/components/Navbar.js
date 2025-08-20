import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


// You can lift this out into context or pass user as prop if needed
export default function Navbar({ user: userProp = null, onLogout }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(userProp);

  // Load user from storage if not passed
  useEffect(() => {
    const loadUser = async () => {
      if (!userProp) {
        // Try to load user from AsyncStorage
        const userJson = await AsyncStorage.getItem('userInfo');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      }
      else {
        setUser(userProp);
      }
    };
    loadUser();
  }, [userProp]);


  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      <View style={styles.container}>
        <Image
          source={require("../assets/logo-surjit.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.titleWrap}>
          <Text style={styles.title}>SURJIT FINANCE</Text>
          <Text style={styles.tagline}>TODAY . TOMORROW . TOGETHER</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarWrap}
          onPress={() => setModalVisible(true)}
        >
          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{userInitial}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {/* User popover modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBg}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.userCard}>
            {user?.image ? (
              <Image
                source={{ uri: user.image }}
                style={styles.avatarModalImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarModalFallback}>
                <Text style={styles.avatarModalText}>{userInitial}</Text>
              </View>
            )}
            <View style={{ alignItems: "center", marginTop: 6 }}>
              <Text style={styles.userName}>{user?.name || "Unknown User"}</Text>
              <Text style={styles.userEmail}>{user?.email || "No Email"}</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={async () => {
                setModalVisible(false);
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('userInfo');
                if (onLogout) onLogout(); // this will navigate to LoginScreen
              }}
            >
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const ORANGE = "#FF9100";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 3,
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 8,
  },
  titleWrap: {
    flex: 1,
    marginLeft: 2,
    justifyContent: "center",
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#1a1919",
    fontFamily: "serif",
  },
  tagline: {
    fontSize: 12,
    color: "#545454",
    fontWeight: "500",
    marginTop: -1,
  },
  avatarWrap: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ORANGE,
  },
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.14)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 85,
    paddingRight: 22,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    minWidth: 220,
    alignItems: "center",
    elevation: 8,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  avatarModalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ORANGE,
  },
  avatarModalFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarModalText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1919",
    marginBottom: 3,
  },
  userEmail: {
    fontSize: 14,
    color: "#B76E22",
    marginBottom: 14,
  },
  logoutBtn: {
    marginTop: 12,
    backgroundColor: "#FFF4E0",
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ORANGE,
  },
  logoutText: {
    color: ORANGE,
    fontWeight: "bold",
    fontSize: 15,
  },
});
