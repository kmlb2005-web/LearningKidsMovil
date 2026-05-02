import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Mensaje = {
  id: string;
  texto: string;
  esLouz: boolean;
  pasos?: string[];
  resultado?: string;
};

type ChatSesion = {
  id: string;
  titulo: string;
  mensajes: Mensaje[];
  updatedAt: number;
};

const mensajesIniciales: Mensaje[] = [
  {
    id: "1",
    texto: "¡Holaaa! Soy Louz, tu asistente académico personal, ¿en qué tienes duda?",
    esLouz: true,
  },
];

const respuestasRapidas = [
  "Ver ejemplo",
  "Explicar de nuevo",
  "¿Cómo simplifico?",
];

const crearSesionInicial = (): ChatSesion => ({
  id: Date.now().toString(),
  titulo: "Nuevo chat",
  mensajes: mensajesIniciales,
  updatedAt: Date.now(),
});

const obtenerTituloChat = (mensajes: Mensaje[]) => {
  const primerMensajeUsuario = mensajes.find((m) => !m.esLouz);
  if (!primerMensajeUsuario) return "Nuevo chat";

  const tituloBase = primerMensajeUsuario.texto.trim();
  return tituloBase.length > 28 ? `${tituloBase.slice(0, 28)}...` : tituloBase;
};

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [chats, setChats] = useState<ChatSesion[]>([crearSesionInicial()]);
  const [chatActivoId, setChatActivoId] = useState(chats[0].id);
  const [menuVisible, setMenuVisible] = useState(false);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const chatActivo = chats.find((c) => c.id === chatActivoId) ?? chats[0];
  const mensajes = chatActivo?.mensajes ?? mensajesIniciales;

  const generarRespuesta = (pregunta: string): Mensaje => {
    const p = pregunta.toLowerCase();

    if (p.includes("fraccion") || p.includes("fracción") || p.includes("/") || p.includes("division") || p.includes("división") || p.includes("dividir")) {
      return {
        id: Date.now().toString(),
        texto: "¡Excelente ejemplo! Sigue estos pasos:",
        esLouz: true,
        pasos: [
          "El truco de la X: Multiplicamos en cruz. El numerador de arriba (2) por el denominador de abajo (5).",
          "¡El resultado va arriba! 2 × 5 = 10. Este es tu nuevo numerador.",
          "Ahora el otro: Multiplicamos 3 × 4 = 12. Este va abajo.",
        ],
        resultado: "¡Tu resultado es 10/12!",
      };
    }

    if (p.includes("suma") || p.includes("sumar") || p.includes("+")) {
      return {
        id: Date.now().toString(),
        texto: "¡Claro que sí! Para sumar fracciones sigue estos pasos:",
        esLouz: true,
        pasos: [
          "Primero verifica si los denominadores son iguales.",
          "Si son iguales, solo suma los numeradores.",
          "Si son distintos, encuentra el mínimo común múltiplo.",
        ],
        resultado: "¡Y listo! Simplifica si es posible.",
      };
    }

    if (p.includes("multipli") || p.includes("×") || p.includes("*")) {
      return {
        id: Date.now().toString(),
        texto: "¡La multiplicación es fácil! Te explico:",
        esLouz: true,
        pasos: [
          "Multiplica numerador con numerador.",
          "Multiplica denominador con denominador.",
          "Simplifica el resultado si puedes.",
        ],
        resultado: "¡Así de sencillo! 🎉",
      };
    }

    if (p.includes("no entiendo") || p.includes("ayuda") || p.includes("help")) {
      return {
        id: Date.now().toString(),
        texto: "¡No te preocupes! Es más fácil de lo que parece. Dime, ¿cuál es el problema que quieres resolver? Puedes escribirme la operación y te guío paso a paso. 😊",
        esLouz: true,
      };
    }

    if (p.includes("hola") || p.includes("hi") || p.includes("buenas")) {
      return {
        id: Date.now().toString(),
        texto: "¡Hola! 👋 Me alegra que estés aquí. ¿En qué materia necesitas ayuda hoy? Puedo ayudarte con matemáticas, ciencias, y mucho más.",
        esLouz: true,
      };
    }

    return {
      id: Date.now().toString(),
      texto: `¡Buena pregunta! Déjame ayudarte con "${pregunta}". ¿Puedes darme más detalles sobre tu duda? Mientras más específico seas, mejor te puedo explicar. 🤖`,
      esLouz: true,
    };
  };

  const enviarMensaje = (msg?: string) => {
    const mensajeTexto = msg || texto.trim();
    if (!mensajeTexto) return;

    const chatObjetivoId = chatActivoId;

    const nuevoMensaje: Mensaje = {
      id: Date.now().toString(),
      texto: mensajeTexto,
      esLouz: false,
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatObjetivoId) return chat;
        const mensajesActualizados = [...chat.mensajes, nuevoMensaje];
        return {
          ...chat,
          mensajes: mensajesActualizados,
          titulo: obtenerTituloChat(mensajesActualizados),
          updatedAt: Date.now(),
        };
      })
    );
    setTexto("");
    setCargando(true);

    setTimeout(() => {
      const respuesta = generarRespuesta(mensajeTexto);
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatObjetivoId) return chat;
          const mensajesActualizados = [...chat.mensajes, respuesta];
          return {
            ...chat,
            mensajes: mensajesActualizados,
            titulo: obtenerTituloChat(mensajesActualizados),
            updatedAt: Date.now(),
          };
        })
      );
      setCargando(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1000);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleAjustes = () => {
    Alert.alert(
      "Ajustes del chat",
      "¿Qué deseas hacer?",
      [
        {
          text: "Borrar chat actual",
          style: "destructive",
          onPress: () => {
            setChats((prev) =>
              prev.map((chat) =>
                chat.id === chatActivoId
                  ? {
                      ...chat,
                      mensajes: mensajesIniciales,
                      titulo: "Nuevo chat",
                      updatedAt: Date.now(),
                    }
                  : chat
              )
            );
          },
        },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const crearNuevoChat = () => {
    const nuevo = crearSesionInicial();
    setChats((prev) => [nuevo, ...prev]);
    setChatActivoId(nuevo.id);
    setTexto("");
    setMenuVisible(false);
  };

  const seleccionarChat = (id: string) => {
    setChatActivoId(id);
    setTexto("");
    setMenuVisible(false);
  };

  const chatsOrdenados = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={22} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🤖</Text>
          </View>
          <View>
            <Text style={styles.headerName}>Louz</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>En línea</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleAjustes}>
          <Ionicons name="settings-outline" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.drawerWrapper}>
          <Pressable style={styles.drawerBackdrop} onPress={() => setMenuVisible(false)} />
          <View style={[styles.drawerPanel, { paddingTop: insets.top + 18 }]}>
            <Text style={styles.drawerTitle}>Historial de chats</Text>

            <TouchableOpacity style={styles.newChatBtn} onPress={crearNuevoChat}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.newChatText}>Nuevo chat</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {chatsOrdenados.map((chat) => (
                <TouchableOpacity
                  key={chat.id}
                  style={[
                    styles.chatHistoryItem,
                    chat.id === chatActivoId && styles.chatHistoryItemActive,
                  ]}
                  onPress={() => seleccionarChat(chat.id)}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={18}
                    color={chat.id === chatActivoId ? "#2563eb" : "#64748b"}
                  />
                  <Text
                    style={[
                      styles.chatHistoryText,
                      chat.id === chatActivoId && styles.chatHistoryTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {chat.titulo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Mensajes */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {mensajes.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.msgRow,
              msg.esLouz ? styles.msgRowLouz : styles.msgRowUser,
            ]}
          >
            {msg.esLouz && (
              <View style={styles.msgAvatar}>
                <Text style={styles.avatarEmojiSmall}>🤖</Text>
              </View>
            )}
            <View style={styles.msgContent}>
              <View
                style={[
                  styles.bubble,
                  msg.esLouz ? styles.bubbleLouz : styles.bubbleUser,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    msg.esLouz ? styles.bubbleTextLouz : styles.bubbleTextUser,
                  ]}
                >
                  {msg.texto}
                </Text>
              </View>

              {/* Pasos */}
              {msg.pasos && msg.pasos.length > 0 && (
                <View style={styles.pasosCard}>
                  {msg.pasos.map((paso, i) => (
                    <View key={i} style={styles.pasoRow}>
                      <View style={styles.pasoNum}>
                        <Text style={styles.pasoNumText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.pasoText}>{paso}</Text>
                    </View>
                  ))}
                  {msg.resultado && (
                    <View style={styles.resultadoBox}>
                      <Text style={styles.resultadoText}>{msg.resultado}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Indicador de escritura */}
        {cargando && (
          <View style={[styles.msgRow, styles.msgRowLouz]}>
            <View style={styles.msgAvatar}>
              <Text style={styles.avatarEmojiSmall}>🤖</Text>
            </View>
            <View style={[styles.bubble, styles.bubbleLouz]}>
              <Text style={styles.typingText}>Escribiendo...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Respuestas rápidas */}
      <View style={styles.quickReplies}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {respuestasRapidas.map((r) => (
            <TouchableOpacity
              key={r}
              style={styles.quickBtn}
              onPress={() => enviarMensaje(r)}
            >
              <Text style={styles.quickBtnText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.inputArea}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachBtn}>
              <Ionicons name="attach" size={20} color="#94a3b8" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe tu duda aquí..."
              placeholderTextColor="#94a3b8"
              value={texto}
              onChangeText={setTexto}
              multiline
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
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7ff",
  },
  drawerWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  drawerPanel: {
    width: "78%",
    maxWidth: 340,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  newChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  newChatText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  chatHistoryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: "#f8fafc",
  },
  chatHistoryItemActive: {
    backgroundColor: "#dbeafe",
  },
  chatHistoryText: {
    flex: 1,
    color: "#334155",
    fontSize: 13,
    fontWeight: "500",
  },
  chatHistoryTextActive: {
    color: "#1d4ed8",
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginLeft: 12,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 24,
  },
  avatarEmojiSmall: {
    fontSize: 18,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
  },
  onlineText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "500",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  msgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 4,
  },
  msgRowLouz: {
    justifyContent: "flex-start",
  },
  msgRowUser: {
    justifyContent: "flex-end",
    flexDirection: "row-reverse",
  },
  msgAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  msgContent: {
    maxWidth: "78%",
    gap: 8,
  },
  bubble: {
    borderRadius: 18,
    padding: 12,
    paddingHorizontal: 14,
  },
  bubbleLouz: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: "#5b8cdb",
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextLouz: {
    color: "#1e293b",
  },
  bubbleTextUser: {
    color: "#fff",
  },
  typingText: {
    color: "#94a3b8",
    fontSize: 13,
    fontStyle: "italic",
  },
  pasosCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  pasoRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  pasoNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#5b8cdb",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pasoNumText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  pasoText: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
    lineHeight: 18,
  },
  resultadoBox: {
    backgroundColor: "#f0fdf4",
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#22c55e",
  },
  resultadoText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#166534",
    textAlign: "center",
  },
  quickReplies: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  quickBtn: {
    borderWidth: 1,
    borderColor: "#5b8cdb",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    backgroundColor: "#eff6ff",
  },
  quickBtnText: {
    fontSize: 13,
    color: "#3b82f6",
    fontWeight: "500",
  },
  inputArea: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 8,
  },
  attachBtn: {
    padding: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#0f172a",
    maxHeight: 80,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#5b8cdb",
    alignItems: "center",
    justifyContent: "center",
  },
});
