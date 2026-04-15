import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Image,
    ImageBackground,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Index() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <ImageBackground
      source={require("../../../../../assets/images/fondos/fondo.png")}
      resizeMode="cover"
      style={{
        flex: 1,
      }}
    >
      {/* Contenedor principal */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 16,
        }}
      >
        {/* Overlay SIN borderRadius */}
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: 20,
          }}
        >
          {/* Card */}
          <View
            style={{
              backgroundColor: "#f1f5f9",
              borderRadius: 24,
              padding: 20,
              elevation: 5,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#1e293b" />
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
            <View style={{ alignItems: "center", marginVertical: 10 }}>
              <Image
                source={require("../../../../../assets/images/logos/logoCuadrado.png")}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 20,
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
                marginTop: 10,
              }}
            >
              ¡Hola de nuevo!
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "#64748b",
                marginBottom: 20,
              }}
            >
              Ingresa tus datos para continuar la aventura
            </Text>

            {/* Email */}
            <Text
              style={{
                marginTop: 10,marginBottom: 5,
                color: "#0f172a",fontWeight: "500",
              }}
            >Tu Correo</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#e2e8f0",
                borderRadius: 12,
                paddingHorizontal: 10,
                height: 50,
                marginBottom: 10,
              }}
            >
              <Ionicons name="mail-outline" size={20} color="#94a3b8" />
              <TextInput
                placeholder="ejemplo@escuela.com"
                placeholderTextColor="#94a3b8"
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
                marginTop: 10,marginBottom: 5,
                color: "#0f172a",fontWeight: "500",
              }}
            >
              Tu Contraseña
            </Text>
            <View
              style={{
                flexDirection: "row",alignItems: "center",
                backgroundColor: "#e2e8f0",borderRadius: 12,
                paddingHorizontal: 10,height: 50,
                marginBottom: 10,
              }}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!passwordVisible}
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
                  marginBottom: 20,
                }}
              >
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#facc15",
                paddingVertical: 15,
                borderRadius: 14,
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#0f172a",
                  fontSize: 16,
                }}
              >
                Entrar a Aprender 🚀
              </Text>
            </TouchableOpacity>

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
              >
                ¡Regístrate aquí!
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}