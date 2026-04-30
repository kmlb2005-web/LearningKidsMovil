import { Ionicons } from "@expo/vector-icons";
import { Slot, usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HIDDEN_FOOTER_ROUTES = ["/", "/login", "/register"];

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
          showFooter && { paddingBottom: 84 + insets.bottom },
        ]}
      >
        <Slot />
      </View>

      {showFooter ? (
        <View style={[styles.navbar, { paddingBottom: 12 + insets.bottom }]}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace("/home")}>
            <Ionicons
              name="home"
              size={22}
              color={pathname === "/home" ? "#5b8cdb" : "#94a3b8"}
            />
            <Text style={[styles.navLabel, pathname === "/home" && styles.navLabelActive]}>
              Inicio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/(tabs)/chatScreen")}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={pathname === "/(tabs)/chatScreen" ? "#5b8cdb" : "#94a3b8"}
            />
            <Text
              style={[
                styles.navLabel,
                pathname === "/(tabs)/chatScreen" && styles.navLabelActive,
              ]}
            >
              Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/(tabs)/campos")}
          >
            <Ionicons
              name="clipboard-outline"
              size={22}
              color={pathname === "/(tabs)/campos" ? "#5b8cdb" : "#94a3b8"}
            />
            <Text
              style={[
                styles.navLabel,
                pathname === "/(tabs)/campos" && styles.navLabelActive,
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
    paddingBottom: 84,
  },
  navbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  navLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#5b8cdb",
  },
});