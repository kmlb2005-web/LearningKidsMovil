import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { buildApiEndpoints } from "../../../../shared/services/apiConfig";
import { setAuthenticatedUser } from "../../../../shared/utils/authSession";

type LoginResponse = {
  message?: string;
  usuario?: {
    idUsuario: number;
    nombre: string;
    username: string;
    password: string;
    idRol: number;
  };
};

const LOGIN_ENDPOINTS = buildApiEndpoints("/api/usuarios/login/alumnos");

export default function Index() {
  const scrollRef = React.useRef<ScrollView>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const router = useRouter();

  React.useEffect(() => {
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      });
    });

    return () => {
      hideSub.remove();
    };
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    });
  };

  const handleLogin = async () => {
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setFeedbackMessage("Ingresa tu username y tu contraseña.");
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage("");

    try {
      let lastNetworkError: unknown = null;

      for (const endpoint of LOGIN_ENDPOINTS) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: cleanUsername,
              password: cleanPassword,
            }),
          });

          const data = (await response.json().catch(() => null)) as LoginResponse | null;
          const backendMessage = data?.message || "No se pudo iniciar sesión.";

          if (response.ok && data?.usuario) {
            setAuthenticatedUser({
              idUsuario: data.usuario.idUsuario,
              nombre: data.usuario.nombre,
              username: data.usuario.username,
              idRol: data.usuario.idRol,
            });
            setFeedbackMessage("");
            router.replace("/home");
            return;
          }

          // El servidor respondió; no seguimos intentando otros hosts.
          setFeedbackMessage(backendMessage);
          return;
        } catch (networkError) {
          lastNetworkError = networkError;
          console.error(`Login request failed on ${endpoint}:`, networkError);
        }
      }

      const errorMessage =
        lastNetworkError instanceof Error
          ? lastNetworkError.message
          : "No fue posible conectar con el servidor en ninguna ruta.";

      setFeedbackMessage(errorMessage);
      Alert.alert("Error de conexión", errorMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido de red.";
      console.error("Login request failed:", error);
      setFeedbackMessage(errorMessage);
      Alert.alert("Error de conexión", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../../../assets/images/Splash/fondo.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.card}>
            <View style={styles.brandRow}>
              <Text style={styles.sparkles}>✦</Text>
              <Text style={styles.brandTitle}>
                <Text style={styles.brandBlue}>Learning </Text>
                <Text style={styles.brandYellow}>K</Text>
                <Text style={styles.brandGreen}>i</Text>
                <Text style={styles.brandPink}>d</Text>
                <Text style={styles.brandPurple}>s</Text>
              </Text>
              <Text style={styles.sparkles}>✦</Text>
            </View>

            <View style={styles.logoRow}>
              <Image
                source={require("../../../../../assets/images/Register/louz.png")}
                style={styles.logo}
              />
            </View>

            <Text style={styles.title}>¡Hola de nuevo!</Text>
            <Text style={styles.subtitle}>
              Ingresa tus datos para continuar la aventura
            </Text>

            <Text style={styles.label}>NOMBRE DE USUARIO</Text>

            <View style={styles.inputContainerEmail}>
              <View style={styles.inputIconBoxEmail}>
                <Ionicons name="mail-outline" size={22} color="#78B7EA" />
              </View>
              <TextInput
                placeholder="Ej. gabito23"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.inputText}
              />
            </View>

            <Text style={styles.label}>CONTRASEÑA</Text>

            <View style={styles.inputContainerPassword}>
              <View style={styles.inputIconBoxPassword}>
                <Ionicons name="lock-closed-outline" size={22} color="#B088F9" />
              </View>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                style={styles.inputText}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#9A7BEF"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isSubmitting && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text style={styles.loginButtonText}>
                  ¡ENTRA A APRENDER! 🚀
                </Text>
              )}
            </TouchableOpacity>

            {feedbackMessage ? (
              <Text style={styles.feedbackText}>
                {feedbackMessage}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.registerBox}
              activeOpacity={0.9}
              onPress={() => router.replace("/register")}
            >
              <Text style={styles.registerText}>
                ¿No tienes una cuenta? <Text style={styles.registerLink}>¡Regístrate aquí!</Text>
              </Text>
            </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 24,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    shadowColor: "#0B1C56",
    shadowOpacity: 0.13,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 9,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  sparkles: {
    color: "#F5CE56",
    marginHorizontal: 10,
    fontSize: 17,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  brandBlue: {
    color: "#132B70",
  },
  brandYellow: {
    color: "#F0C938",
  },
  brandGreen: {
    color: "#56BE6F",
  },
  brandPink: {
    color: "#F08FBD",
  },
  brandPurple: {
    color: "#9C82F0",
  },
  logoRow: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  logo: {
    width: 156,
    height: 156,
    borderRadius: 32,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "900",
    color: "#132B70",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 18,
  },
  label: {
    color: "#102A63",
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 6,
  },
  inputContainerEmail: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#BEE3FA",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    height: 58,
    marginBottom: 14,
  },
  inputContainerPassword: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#D8C6FF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    height: 58,
    marginBottom: 8,
  },
  inputIconBoxEmail: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF6FF",
  },
  inputIconBoxPassword: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2EAFF",
  },
  inputText: {
    flex: 1,
    marginLeft: 12,
    color: "#1F2937",
    fontSize: 18,
    fontWeight: "500",
  },
  forgotPassword: {
    textAlign: "right",
    color: "#4A77D4",
    fontSize: 16,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#F7CA3D",
    height: 58,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#102A63",
    fontWeight: "900",
    fontSize: 16,
  },
  feedbackText: {
    textAlign: "center",
    color: "#DC2626",
    fontWeight: "600",
    marginBottom: 12,
  },
  registerBox: {
    backgroundColor: "#F2F6FC",
    borderRadius: 20,
    minHeight: 62,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  registerText: {
    color: "#6B7280",
    fontSize: 16,
    textAlign: "center",
  },
  registerLink: {
    color: "#3E67D7",
    fontWeight: "800",
  },
});