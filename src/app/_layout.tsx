import { Ionicons } from "@expo/vector-icons";
import { Slot, usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* OCULTAR MENU EN ESTAS RUTAS */
const HIDDEN_FOOTER_ROUTES = [
  "/",
  "/login",
  "/register",
  "/(tabs)/home",
  "/home",
];

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const showFooter = !HIDDEN_FOOTER_ROUTES.includes(pathname);

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          showFooter && styles.contentWithFooter,
          showFooter && { paddingBottom: 96 + insets.bottom },
        ]}
      >
        <Slot />
      </View>

      {showFooter ? (
        <View style={[styles.navbar, { paddingBottom: 12 + insets.bottom }]}>
          {/* INICIO */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Ionicons
              name="home"
              size={22}
              color={
                pathname === "/(tabs)/home" || pathname === "/home"
                  ? "#5b8cdb"
                  : "#94a3b8"
              }
            />

            <Text
              style={[
                styles.navLabel,
                (pathname === "/(tabs)/home" || pathname === "/home") &&
                  styles.navLabelActive,
              ]}
            >
              Inicio
            </Text>
          </TouchableOpacity>

          {/* CHAT */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/(tabs)/chatScreen")}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={
                pathname === "/(tabs)/chatScreen"
                  ? "#5b8cdb"
                  : "#94a3b8"
              }
            />

            <Text
              style={[
                styles.navLabel,
                pathname === "/(tabs)/chatScreen" &&
                  styles.navLabelActive,
              ]}
            >
              Chat
            </Text>
          </TouchableOpacity>

          {/* PRUEBAS */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/(tabs)/campos")}
          >
            <Ionicons
              name="clipboard-outline"
              size={22}
              color={
                pathname === "/(tabs)/campos"
                  ? "#5b8cdb"
                  : "#94a3b8"
              }
            />

            <Text
              style={[
                styles.navLabel,
                pathname === "/(tabs)/campos" &&
                  styles.navLabelActive,
              ]}
            >
              Pruebas
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e8f5f0",
  },

  content: {
    flex: 1,
  },

  contentWithFooter: {
    paddingBottom: 96,
  },

  navbar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 12,
    height: 78,
    backgroundColor: "#fff",
    borderRadius: 34,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  navLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
  },

  navLabelActive: {
    color: "#5b8cdb",
    fontWeight: "700",
  },
});