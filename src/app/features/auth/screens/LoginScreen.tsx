import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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

const LOGIN_ENDPOINTS = [
  "http://192.168.1.72:5125/api/usuarios/login/alumnos",
  "http://10.0.2.2:5125/api/usuarios/login/alumnos",
  "http://localhost:5125/api/usuarios/login/alumnos",
];

export default function Index() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const router = useRouter();

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
      source={require("../../../../../assets/images/fondos/fondo.png")}
      resizeMode="cover"
      style={{
        flex: 1,
      }}
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
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              padding: 10,
            }}
          >
            <View
              style={{
              backgroundColor: "#ffffff",
              borderRadius: 28,
              paddingVertical: 44,
              paddingHorizontal: 30,
              elevation: 8,

              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 5 },

              width: "100%",
              maxWidth: 420,
              alignSelf: "center",
              minHeight: 620,
              justifyContent: "center",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#0f172a",
                }}
              >
                Learning Kids
              </Text>
            </View>

            {/* Logo */}
            <View style={{ alignItems: "center", marginVertical: 14 }}>
              <Image
                source={require("../../../../../assets/images/logos/logoCuadrado.png")}
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 28,
                }}
              />
            </View>

            {/* Texto */}
            <Text
              style={{
                textAlign: "center",
                fontSize: 26,
                fontWeight: "bold",
                color: "#0f172a",
                marginTop: 14,
              }}
            >
              ¡Hola de nuevo!
            </Text>

            <Text
              style={{
                textAlign: "center",
                color: "#64748b",
                marginBottom: 28,
              }}
            >
              Ingresa tus datos para continuar la aventura
            </Text>

            {/* Email */}
            <Text
              style={{
                marginTop: 14,
                marginBottom: 8,
                color: "#0f172a",
                fontWeight: "500",
              }}
            >
              CORREO
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#e2e8f0",
                borderRadius: 14,
                paddingHorizontal: 12,
                height: 56,
                marginBottom: 18,
              }}
            >
              <Ionicons name="mail-outline" size={20} color="#94a3b8" />
              <TextInput
                placeholder="Tu username"
                placeholderTextColor="#94a3b8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  flex: 1,
                  marginLeft: 10,
                  color: "#0f172a",
                }}
              />
            </View>

            {/* Password */}
            <Text
              style={{
                marginTop: 14,
                marginBottom: 8,
                color: "#0f172a",
                fontWeight: "500",
              }}
            >
              CONTRASEÑA
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#e2e8f0",
                borderRadius: 14,
                paddingHorizontal: 12,
                height: 56,
                marginBottom: 18,
              }}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                style={{
                  flex: 1,
                  marginLeft: 10,
                  color: "#0f172a",
                }}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot */}
            <TouchableOpacity>
              <Text
                style={{
                  textAlign: "right",
                  color: "#2563eb",
                  marginBottom: 24,
                }}
              >
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#facc15",
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: "center",
                marginBottom: 24,
                opacity: isSubmitting ? 0.7 : 1,
              }}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#0f172a",
                    fontSize: 16,
                  }}
                >
                  ¡ENTRA A APRENDER! 🚀
                </Text>
              )}
            </TouchableOpacity>

            {feedbackMessage ? (
              <Text
                style={{
                  textAlign: "center",
                  color: "#dc2626",
                  fontWeight: "600",
                  marginTop: -8,
                  marginBottom: 18,
                }}
              >
                {feedbackMessage}
              </Text>
            ) : null}

            {/* Register */}
            <Text
              style={{
                textAlign: "center",
                color: "#64748b",
              }}
            >
              ¿No tienes una cuenta?{" "}
              <Text
                style={{
                  color: "#2563eb",
                  fontWeight: "600",
                }}
                onPress={() => router.replace("/register")}
              >
                ¡Regístrate aquí!
              </Text>
            </Text>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}