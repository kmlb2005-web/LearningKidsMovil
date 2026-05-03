import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellidoInput, setApellidoInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [genero, setGenero] = useState<"nino" | "nina" | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleRegister = () => {
    if (!nombre || !apellidoInput || !emailInput || !password || !genero) {
      Alert.alert("Completa todos los campos");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Mínimo 8 caracteres");
      return;
    }

    Alert.alert("¡Cuenta creada!", `Bienvenido ${nombre}`);
  };

  return (
    <ImageBackground
      source={require("../../../../../assets/images/Splash/fondo.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            <Text style={styles.title}>Crea tu Cuenta</Text>
            <Text style={styles.subtitle}>⭐ ¡Únete a la aventura! ⭐</Text>

            <View style={styles.logoWrap}>
              <Image
                source={require("../../../../../assets/images/Register/louz.png")}
                style={styles.logoImage}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>PRIMER NOMBRE</Text>
                <View style={styles.inputRow}>
                  <Ionicons
                    name="person"
                    size={18}
                    color="#4CD964"
                  />
                  <TextInput
                    style={styles.inputInner}
                    placeholder="Ej. Leo"
                    placeholderTextColor="#94a3b8"
                    value={nombre}
                    onChangeText={setNombre}
                  />
                </View>
              </View>

              <View style={styles.half}>
                <Text style={styles.label}>PRIMER APELLIDO</Text>
                <View style={styles.inputRow}>
                  <Ionicons
                    name="person"
                    size={18}
                    color="#4CD964"
                  />
                  <TextInput
                    style={styles.inputInner}
                    placeholder="Ej. Pérez"
                    placeholderTextColor="#94a3b8"
                    value={apellidoInput}
                    onChangeText={setApellidoInput}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#2F80ED"
              />
              <TextInput
                style={styles.inputInner}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#94a3b8"
                value={emailInput}
                onChangeText={setEmailInput}
              />
            </View>

            <Text style={styles.label}>CONTRASEÑA</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#9B6BFF"
              />
              <TextInput
                style={styles.inputInner}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#9B6BFF"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.centerLabel}>¿ERES NIÑO O NIÑA?</Text>

            <View style={styles.generoRow}>
              <TouchableOpacity
                style={[styles.generoBtn, genero === "nino" && styles.active]}
                onPress={() => setGenero("nino")}
              >
                <Text style={styles.emoji}>🧒</Text>
                <Text style={styles.generoText}>Niño</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.generoBtn,
                  genero === "nina" && styles.activePink,
                ]}
                onPress={() => setGenero("nina")}
              >
                <Text style={styles.emoji}>👧</Text>
                <Text style={styles.generoText}>Niña</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleRegister}>
              <Ionicons name="star" size={24} color="#F59E0B" />
              <Text style={styles.btnText}>¡REGISTRARME!</Text>
            </TouchableOpacity>

            <Text style={styles.loginText}>
              ¿Ya tienes cuenta?{" "}
              <Text
                style={styles.loginLink}
                onPress={() => router.replace("/login")}
              >
                Inicia sesión
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 14,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    color: "#081B54",
  },

  subtitle: {
    textAlign: "center",
    color: "#1A73E8",
    marginTop: 8,
    marginBottom: 18,
    fontSize: 16,
    fontWeight: "600",
  },

  logoWrap: {
    alignItems: "center",
    marginBottom: 18,
  },

  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  half: {
    flex: 1,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0f3b82",
    marginBottom: 6,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  inputInner: {
    flex: 1,
    marginLeft: 10,
    color: "#0f172a",
    fontSize: 15,
  },

  centerLabel: {
    textAlign: "center",
    marginTop: 12,
    fontWeight: "700",
    color: "#1A73E8",
  },

  generoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginVertical: 18,
  },

  generoBtn: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    width: 110,
  },

  active: {
    backgroundColor: "#DBEAFE",
    borderColor: "#60A5FA",
  },

  activePink: {
    backgroundColor: "#FCE7F3",
    borderColor: "#F9A8D4",
  },

  emoji: {
    fontSize: 34,
  },

  generoText: {
    marginTop: 8,
    fontWeight: "600",
    color: "#334155",
  },

  btn: {
    backgroundColor: "#FACC15",
    borderRadius: 25,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  btnText: {
    fontWeight: "800",
    color: "#081B54",
    fontSize: 18,
  },

  loginText: {
    textAlign: "center",
    marginTop: 18,
    color: "#64748b",
  },

  loginLink: {
    color: "#2563EB",
    fontWeight: "700",
  },
});