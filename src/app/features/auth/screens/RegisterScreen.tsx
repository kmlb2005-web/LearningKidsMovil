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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [apellidoInput, setApellidoInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
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

    const usuario = {
      nombre: `${nombre} ${apellidoInput}`,
      username: emailInput,
      password: password,
      idRol: 2,
    };

    console.log(usuario);

    Alert.alert("¡Cuenta creada!", `Bienvenido ${nombre}`);
  };

  return (
    <ImageBackground
      source={require("../../../../../assets/images/fondos/fondo.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <View style={{ padding: 10 }}>
            {/* Card */}
            <View style={styles.card}>
            <Text style={styles.title}>Crea tu Cuenta</Text>
            <Text style={styles.subtitle}>¡Únete a la aventura!</Text>

            <View style={styles.logoWrap}>
              <Image
                source={require("../../../../../assets/images/logos/logoCuadrado.png")}
                style={styles.logoImage}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>PRIMER NOMBRE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Leo"
                  placeholderTextColor="#94a3b8"
                  value={nombre}
                  onChangeText={setNombre}
                />
              </View>

              <View style={styles.half}>
                <Text style={styles.label}>PRIMER APELLIDO</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Pérez"
                  placeholderTextColor="#94a3b8"
                  value={apellidoInput}
                  onChangeText={setApellidoInput}
                />
              </View>
            </View>

            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color="#64748b" />
              <TextInput
                style={styles.inputInner}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#94a3b8"
                value={emailInput}
                onChangeText={(t) => {
                  setEmailInput(t);
                  setUsername(t);
                }}
              />
            </View>

            <Text style={styles.label}>CONTRASEÑA</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color="#64748b" />
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
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.centerLabel}>
              ¿ERES NIÑO O NIÑA?
            </Text>

            <View style={styles.generoRow}>
              <TouchableOpacity
                style={[
                  styles.generoBtn,
                  genero === "nino" && styles.active,
                ]}
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

            {/* Botón */}
            <TouchableOpacity style={styles.btn} onPress={handleRegister}>
              <Text style={styles.btnText}>¡REGISTRARME!</Text>
            </TouchableOpacity>

            {/* 🔥 Login */}
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    paddingVertical: 44,
    paddingHorizontal: 30,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    minHeight: 620,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#0f172a",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 20,
  },

  logoWrap: {
    alignItems: "center",
    marginBottom: 10,
  },

  logoImage: {
    width: 112,
    height: 112,
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
    color: "#1e293b",
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    color: "#0f172a",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginBottom: 12,
  },

  inputInner: {
    flex: 1,
    marginLeft: 8,
    color: "#0f172a",
  },

  centerLabel: {
    textAlign: "center",
    marginTop: 14,
    fontWeight: "700",
    color: "#1e293b",
  },

  generoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginVertical: 16,
  },

  generoBtn: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },

  active: {
    backgroundColor: "#dbeafe",
  },

  activePink: {
    backgroundColor: "#fce7f3",
  },

  emoji: {
    fontSize: 30,
  },

  generoText: {
    color: "#1e293b",
  },

  btn: {
    backgroundColor: "#facc15",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
  },

  btnText: {
    fontWeight: "800",
    color: "#1e293b",
  },

  loginText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 16,
  },

  loginLink: {
    color: "#2563eb",
    fontWeight: "700",
  },
});