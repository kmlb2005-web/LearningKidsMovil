import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [genero, setGenero] = useState<"nino" | "nina" | null>(null);

  const handleRegister = () => {
    if (!nombre || !apellido || !email || !password || !genero) {
      Alert.alert("¡Espera!", "Por favor completa todos los campos.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Contraseña muy corta", "Debe tener al menos 8 caracteres.");
      return;
    }
    Alert.alert("¡Bienvenido!", `¡Hola ${nombre}! Tu cuenta fue creada. 🎉`, [
      { text: "¡A aprender!", onPress: () => router.replace("/features/home/screens/HomeScreen") },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header azul degradado */}
        <View style={styles.headerBg}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crea tu Cuenta</Text>
          <Text style={styles.headerSubtitle}>¡Únete a la aventura!</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Nombre y apellido */}
          <View style={styles.row}>
            <View style={[styles.halfField]}>
              <Text style={styles.label}>PRIMER NOMBRE</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Leo"
                placeholderTextColor="#b0bec5"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>
            <View style={[styles.halfField]}>
              <Text style={styles.label}>PRIMER APELLIDO</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Pérez"
                placeholderTextColor="#b0bec5"
                value={apellido}
                onChangeText={setApellido}
              />
            </View>
          </View>

          {/* Email */}
          <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color="#94a3b8" />
            <TextInput
              style={styles.inputInner}
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#b0bec5"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Contraseña */}
          <Text style={styles.label}>CREA TU CONTRASEÑA</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" />
            <TextInput
              style={styles.inputInner}
              placeholder="Mínimo 8 caracteres"
              placeholderTextColor="#b0bec5"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#94a3b8"
              />
            </TouchableOpacity>
          </View>

          {/* Género */}
          <Text style={[styles.label, { textAlign: "center", marginTop: 16 }]}>
            ¿ERES NIÑO O NIÑA?
          </Text>
          <View style={styles.generoRow}>
            <TouchableOpacity
              style={[
                styles.generoBtn,
                genero === "nino" && styles.generoBtnActive,
              ]}
              onPress={() => setGenero("nino")}
            >
              <Text style={styles.generoEmoji}>🧒</Text>
              <Text
                style={[
                  styles.generoLabel,
                  genero === "nino" && styles.generoLabelActive,
                ]}
              >
                Niño
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.generoBtn,
                genero === "nina" && styles.generoBtnActiveNina,
              ]}
              onPress={() => setGenero("nina")}
            >
              <Text style={styles.generoEmoji}>👧</Text>
              <Text
                style={[
                  styles.generoLabel,
                  genero === "nina" && styles.generoLabelActive,
                ]}
              >
                Niña
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón */}
          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <Text style={styles.registerBtnText}>¡REGISTRARME!</Text>
          </TouchableOpacity>

          {/* Login */}
          <Text style={styles.loginText}>
            ¿Ya tienes cuenta?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => router.replace("/login")}
            >
              Inicia sesión
            </Text>
          </Text>

          {/* Barra de colores */}
          <View style={styles.colorBar}>
            <View style={[styles.colorSegment, { backgroundColor: "#f87171" }]} />
            <View style={[styles.colorSegment, { backgroundColor: "#fb923c" }]} />
            <View style={[styles.colorSegment, { backgroundColor: "#facc15" }]} />
            <View style={[styles.colorSegment, { backgroundColor: "#4ade80" }]} />
            <View style={[styles.colorSegment, { backgroundColor: "#60a5fa" }]} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7ff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBg: {
    backgroundColor: "#5b8cdb",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: 55,
    left: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
  },
  form: {
    backgroundColor: "#fff",
    padding: 24,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  halfField: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 6,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    color: "#0f172a",
    fontSize: 14,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 4,
  },
  inputInner: {
    flex: 1,
    marginLeft: 8,
    color: "#0f172a",
    fontSize: 14,
  },
  generoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 12,
    marginBottom: 8,
  },
  generoBtn: {
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    minWidth: 90,
    borderWidth: 2,
    borderColor: "transparent",
  },
  generoBtnActive: {
    backgroundColor: "#dbeafe",
    borderColor: "#3b82f6",
  },
  generoBtnActiveNina: {
    backgroundColor: "#fce7f3",
    borderColor: "#ec4899",
  },
  generoEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  generoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  generoLabelActive: {
    color: "#1e293b",
  },
  registerBtn: {
    backgroundColor: "#facc15",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
    shadowColor: "#facc15",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  registerBtnText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: 1,
  },
  loginText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
    marginBottom: 20,
  },
  loginLink: {
    color: "#3b82f6",
    fontWeight: "700",
  },
  colorBar: {
    flexDirection: "row",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 4,
  },
  colorSegment: {
    flex: 1,
  },
});