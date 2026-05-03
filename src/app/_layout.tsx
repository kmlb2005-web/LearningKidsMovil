import { Ionicons } from "@expo/vector-icons";
import { Slot, usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const footerHeight = 78;
  const footerBottom = Math.max(insets.bottom, 10);

  console.log("PATHNAME:", pathname); // debug (puedes quitarlo luego)

  /* 🔥 TABS ACTIVOS */
  const isHome = pathname === "/home";
  const isChat = pathname === "/chatScreen";
  const isPruebas = pathname === "/campos";

  /* 🔥 OCULTAR SOLO EN SPLASH, LOGIN Y REGISTER */
  const hideFooter =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register";

  const showFooter = !hideFooter;

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          showFooter && { paddingBottom: footerHeight + footerBottom },
        ]}
      >
        <Slot />
      </View>

      {showFooter && (
        <View
          style={[
            styles.navbar,
            {
              bottom: footerBottom,
              height: footerHeight,
              paddingBottom: 10,
            },
          ]}
        >
          {/* INICIO */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/home")}
          >
            <Ionicons
              name="home"
              size={22}
              color={isHome ? "#5b8cdb" : "#94a3b8"}
            />
            <Text style={[styles.navLabel, isHome && styles.navLabelActive]}>
              Inicio
            </Text>
          </TouchableOpacity>

          {/* CHAT */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/chatScreen")}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={isChat ? "#5b8cdb" : "#94a3b8"}
            />
            <Text style={[styles.navLabel, isChat && styles.navLabelActive]}>
              Chat
            </Text>
          </TouchableOpacity>

          {/* PRUEBAS */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/campos")}
          >
            <Ionicons
              name="clipboard-outline"
              size={22}
              color={isPruebas ? "#5b8cdb" : "#94a3b8"}
            />
            <Text
              style={[styles.navLabel, isPruebas && styles.navLabelActive]}
            >
              Pruebas
            </Text>
          </TouchableOpacity>
        </View>
      )}
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

  navbar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 10,
    height: 88,
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