import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { chatMath } from "../../../../shared/services/mathTutorApi";

type Mensaje = {
  id: string;
  texto: string;
  esLouz: boolean;
};

const CHAT_CACHE_KEY = "learningkids_chat_cache_v1";
const CHAT_STATE_KEY = "learningkids_chat_state_v1";

function normalizeQuestion(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeTutorText(text: string): string {
  return text
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1/$2)")
    .replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)")
    .replace(/\\times/g, "x")
    .replace(/\\cdot/g, "*")
    .replace(/\\div/g, "/")
    .replace(/\$\$/g, "")
    .replace(/\$/g, "")
    .replace(/\\n/g, "\n")
    .trim();
}

function buildContextPrompt(messages: Mensaje[], currentQuestion: string): string {
  const recent = messages.slice(-6);

  if (recent.length === 0) {
    return currentQuestion;
  }

  const context = recent
    .map((item) => `${item.esLouz ? "Tutor" : "Alumno"}: ${item.texto}`)
    .join("\n");

  return `Contexto reciente:\n${context}\n\nPregunta actual del alumno: ${currentQuestion}`;
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const mensajeInicial: Mensaje[] = [
    {
      id: "1",
      texto:
        "¡Holaaa! 👋 Soy Louz, tu asistente académico personal, ¿en qué tienes duda?",
      esLouz: true,
    },
  ];

  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>(mensajeInicial);
  const [historial, setHistorial] = useState<string[]>([]);
  const [responseCache, setResponseCache] = useState<Record<string, string>>({});

  React.useEffect(() => {
    const loadPersisted = async () => {
      try {
        const [cacheRaw, stateRaw] = await Promise.all([
          AsyncStorage.getItem(CHAT_CACHE_KEY),
          AsyncStorage.getItem(CHAT_STATE_KEY),
        ]);

        if (cacheRaw) {
          setResponseCache(JSON.parse(cacheRaw) as Record<string, string>);
        }

        if (stateRaw) {
          const parsed = JSON.parse(stateRaw) as {
            mensajes?: Mensaje[];
            historial?: string[];
          };

          if (parsed.mensajes && parsed.mensajes.length > 0) {
            setMensajes(parsed.mensajes);
          }

          if (parsed.historial && parsed.historial.length > 0) {
            setHistorial(parsed.historial.slice(0, 10));
          }
        }
      } catch (error) {
        console.log("No se pudo restaurar cache de chat", error);
      }
    };

    loadPersisted();
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(responseCache)).catch(() => {
      // No bloqueamos la conversación si falla persistencia.
    });
  }, [responseCache]);

  React.useEffect(() => {
    AsyncStorage.setItem(
      CHAT_STATE_KEY,
      JSON.stringify({ mensajes, historial: historial.slice(0, 10) })
    ).catch(() => {
      // No bloqueamos la conversación si falla persistencia.
    });
  }, [mensajes, historial]);

  const enviarMensaje = async (msg?: string) => {
    const contenido = msg || texto.trim();
    if (!contenido) return;

    Keyboard.dismiss();

    const nuevo: Mensaje = {
      id: Date.now().toString(),
      texto: contenido,
      esLouz: false,
    };

    setMensajes((prev) => [...prev, nuevo]);
    setHistorial((prev) => [contenido, ...prev.slice(0, 9)]);
    setTexto("");

    const questionKey = normalizeQuestion(contenido);
    const cachedResponse = responseCache[questionKey];

    if (cachedResponse) {
      setMensajes((prev) => [
        ...prev,
        { id: `${Date.now()}-cached`, texto: cachedResponse, esLouz: true },
      ]);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return;
    }

    setCargando(true);

    try {
      const contextualPrompt = buildContextPrompt(mensajes, contenido);
      const respuesta = await chatMath(contextualPrompt);
      const normalizedText = sanitizeTutorText(respuesta.text);

      setResponseCache((prev) => ({
        ...prev,
        [questionKey]: normalizedText,
      }));

      setMensajes((prev) => [
        ...prev,
        { id: Date.now().toString(), texto: normalizedText, esLouz: true },
      ]);
    } catch (error) {
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          texto: "Ups, no pude conectarme con el tutor. Intenta de nuevo. 😅",
          esLouz: true,
        },
      ]);
    } finally {
      setCargando(false);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const nuevoChat = () => {
    setMensajes(mensajeInicial);
    setTexto("");
    setHistorial([]);
    setMenuVisible(false);

    AsyncStorage.removeItem(CHAT_STATE_KEY).catch(() => {
      // Ignorado: no afecta funcionalidad principal.
    });
  };

  const irInicio = () => {
    setMenuVisible(false);
    router.replace("/(tabs)/home");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 80}
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setMenuVisible(true)}
        >
          <Ionicons name="menu" size={26} color="#2E7DFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image
            source={require("../../../../../assets/images/Chat/Louz2.png")}
            style={styles.headerRobot}
          />
          <View>
            <Text style={styles.headerName}>Louz</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>En línea</Text>
            </View>
          </View>
        </View>
        </View>

        {/* FONDO */}
        <Image
          source={require("../../../../../assets/images/Chat/fondo.png")}
          style={styles.bg}
        />

        {/* MENSAJES */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
        {mensajes.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.row,
              msg.esLouz ? styles.rowLeft : styles.rowRight,
            ]}
          >
            {msg.esLouz && (
              <Image
                source={require("../../../../../assets/images/Chat/Louz1.png")}
                style={styles.msgAvatar}
              />
            )}

            <View
              style={[
                styles.bubble,
                msg.esLouz ? styles.botBubble : styles.userBubble,
              ]}
            >
              {msg.esLouz ? (
                <Markdown style={markdownStyles}>{msg.texto}</Markdown>
              ) : (
                <Text style={[styles.bubbleText, styles.userText]}>
                  {msg.texto}
                </Text>
              )}
            </View>
          </View>
        ))}

        {cargando && (
          <View style={styles.rowLeft}>
            <Image
              source={require("../../../../../assets/images/Chat/Louz1.png")}
              style={styles.msgAvatar}
            />
            <View style={styles.botBubble}>
              <Text style={styles.typingText}>Escribiendo...</Text>
            </View>
          </View>
        )}
        </ScrollView>

        {/* INPUT + BOTONES */}
        <View
          style={[
            styles.bottomArea,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRow}
        >
          <TouchableOpacity
            style={styles.quickBtnBlue}
            onPress={() => enviarMensaje("Ver ejemplo")}
          >
            <Ionicons name="search" size={18} color="#3B82F6" />
            <Text style={styles.quickBlueText}>Ver ejemplo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickBtnPurple}
            onPress={() => enviarMensaje("Explicar de nuevo")}
          >
            <Ionicons name="book" size={18} color="#A855F7" />
            <Text style={styles.quickPurpleText}>Explicar de nuevo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickBtnGreen}
            onPress={() => enviarMensaje("¿Cómo simplifico?")}
          >
            <Ionicons name="bulb" size={18} color="#22C55E" />
            <Text style={styles.quickGreenText}>¿Cómo simplifico?</Text>
          </TouchableOpacity>
        </ScrollView>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Escribe tu duda aquí..."
              placeholderTextColor="#C0C4CC"
              value={texto}
              onChangeText={setTexto}
              returnKeyType="send"
              blurOnSubmit
              onSubmitEditing={() => enviarMensaje()}
            />

            <TouchableOpacity
              style={styles.sendBtn}
              onPress={() => enviarMensaje()}
            >
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* MENÚ */}
        {menuVisible && (
          <View style={styles.menuOverlay}>
            <TouchableOpacity
              style={styles.menuBg}
              activeOpacity={1}
              onPress={() => setMenuVisible(false)}
            />

            <View style={styles.menuBox}>
              <TouchableOpacity style={styles.menuItem} onPress={nuevoChat}>
                <Ionicons name="create-outline" size={22} color="#111" />
                <Text style={styles.menuText}>Nuevo chat</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={irInicio}>
                <Ionicons name="home-outline" size={22} color="#111" />
                <Text style={styles.menuText}>Ir al Inicio</Text>
              </TouchableOpacity>

              <Text style={styles.historialTitle}>Historial</Text>

              {historial.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historialItem}
                  onPress={() => {
                    setMenuVisible(false);
                    enviarMensaje(item);
                  }}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={18}
                    color="#64748b"
                  />
                  <Text style={styles.historialText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEF6FF" },

  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.22,
    zIndex: -1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },

  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  headerRobot: {
    width: 48,
    height: 48,
    resizeMode: "contain",
    marginRight: 10,
  },

  headerName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
  },

  onlineRow: { flexDirection: "row", alignItems: "center" },

  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginRight: 5,
  },

  onlineText: {
    color: "#16a34a",
    fontWeight: "700",
    fontSize: 13,
  },

  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },

  menuBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.20)",
  },

  menuBox: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 270,
    backgroundColor: "#fff",
    paddingTop: 70,
    paddingHorizontal: 18,
    elevation: 100,
    zIndex: 10000,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#111",
  },

  historialTitle: {
    marginTop: 22,
    marginBottom: 10,
    color: "#64748b",
    fontWeight: "bold",
  },

  historialItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  historialText: {
    marginLeft: 10,
    color: "#111",
    fontSize: 15,
  },

  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-end",
  },

  rowLeft: { justifyContent: "flex-start" },
  rowRight: { justifyContent: "flex-end" },

  msgAvatar: {
    width: 38,
    height: 38,
    marginRight: 8,
    resizeMode: "contain",
  },

  bubble: {
    maxWidth: "78%",
    padding: 14,
    borderRadius: 22,
  },

  botBubble: { backgroundColor: "#fff", elevation: 3 },
  userBubble: { backgroundColor: "#4A86FF" },

  bubbleText: { fontSize: 15, lineHeight: 22 },
  botText: { color: "#1e293b" },
  userText: { color: "#fff" },

  typingText: { color: "#64748b", padding: 14 },

  bottomArea: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    elevation: 10,
  },

  quickRow: {
    paddingHorizontal: 14,
    paddingBottom: 10,
  },

  quickBtnBlue: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#A7D3FF",
    borderRadius: 26,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: "#F0F7FF",
  },

  quickBtnPurple: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#D8B4FE",
    borderRadius: 26,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: "#FAF5FF",
  },

  quickBtnGreen: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#BBF7D0",
    borderRadius: 26,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F0FDF4",
  },

  quickBlueText: {
    color: "#3B82F6",
    fontWeight: "700",
    marginLeft: 6,
  },

  quickPurpleText: {
    color: "#A855F7",
    fontWeight: "700",
    marginLeft: 6,
  },

  quickGreenText: {
    color: "#22C55E",
    fontWeight: "700",
    marginLeft: 6,
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    elevation: 6,
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
    color: "#111827",
  },

  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2f7dfa",
    justifyContent: "center",
    alignItems: "center",
  },
});

const markdownStyles = {
  body: { color: "#1e293b", fontSize: 15, lineHeight: 22 },
  heading1: { fontSize: 18, fontWeight: "bold" as const, marginBottom: 4 },
  heading2: { fontSize: 16, fontWeight: "bold" as const, marginBottom: 4 },
  heading3: { fontSize: 15, fontWeight: "bold" as const, marginBottom: 4 },
  strong: { fontWeight: "bold" as const },
  em: { fontStyle: "italic" as const },
  bullet_list: { marginLeft: 8 },
  ordered_list: { marginLeft: 8 },
  code_inline: { backgroundColor: "#f1f5f9", borderRadius: 4, paddingHorizontal: 4, fontFamily: "monospace" },
  fence: { backgroundColor: "#f1f5f9", borderRadius: 8, padding: 10 },
  blockquote: { borderLeftWidth: 3, borderLeftColor: "#94a3b8", paddingLeft: 10, color: "#64748b" },
};