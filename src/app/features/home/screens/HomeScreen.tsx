import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <StatusBar
        translucent={false}
        barStyle="dark-content"
        backgroundColor="#EAF6FF"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require("../../../../../assets/images/HomeScreen/Nube.png")}
            style={[styles.cloud, { top: 28, left: 28 }]}
          />

          <Image
            source={require("../../../../../assets/images/HomeScreen/Nube.png")}
            style={[styles.cloud, { top: 30, left: 145, width: 45 }]}
          />

          <Image
            source={require("../../../../../assets/images/HomeScreen/Nube.png")}
            style={[styles.cloud, { top: 25, right: 165, width: 42 }]}
          />

          <Image
            source={require("../../../../../assets/images/HomeScreen/Nube.png")}
            style={[styles.cloud, { top: 18, left: 70, width: 42, height: 24 }]}
          />

          <Text style={styles.title}>¿Qué decides{"\n"}hacer hoy?</Text>

          <Text style={styles.subtitle}>
            ¡Tu amigo <Text style={styles.blueText}>Louz</Text> te espera!
          </Text>

          <Image
            source={require("../../../../../assets/images/HomeScreen/Louz1.png")}
            style={styles.robot}
          />
        </View>

        {/* CHAT */}
        <View style={styles.cardBlue}>
          <Image
            source={require("../../../../../assets/images/HomeScreen/Mensaje.png")}
            style={styles.topIcon}
          />

          <View style={styles.leftBoxBlue}>
            <View style={styles.leftBoxBlueTop} />
            <View style={styles.leftBoxBlueBottom} />

            <Image
              source={require("../../../../../assets/images/HomeScreen/Louz3.png")}
              style={styles.cardImage}
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.chatTitle}>Chat</Text>

            <Text style={styles.cardText}>
              Habla con Louz, tu amigo inteligente que te ayuda a aprender y
              divertirte.
            </Text>

            <TouchableOpacity
              style={styles.blueButton}
              onPress={() => router.push("/(tabs)/chatScreen")}
            >
              <Text style={styles.buttonText}>Ir al chat →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PRUEBAS */}
        <View style={styles.cardOrange}>
          <Image
            source={require("../../../../../assets/images/HomeScreen/E.png")}
            style={styles.topIcon}
          />

          <View style={styles.leftBoxOrange}>
            <View style={styles.leftBoxOrangeTop} />
            <View style={styles.leftBoxOrangeBottom} />

            <Image
              source={require("../../../../../assets/images/HomeScreen/Prueba.png")}
              style={styles.cardImage}
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.orangeTitle}>Pruebas</Text>

            <Text style={styles.cardText}>
              Pon a prueba lo que has aprendido con divertidos retos y
              cuestionarios.
            </Text>

            <TouchableOpacity
              style={styles.orangeButton}
              onPress={() => router.push("/(tabs)/campos")}
            >
              <Text style={styles.buttonText}>Comenzar →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Image
            source={require("../../../../../assets/images/HomeScreen/Estrella.png")}
            style={styles.star}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.footerTitle}>¡Sigue aprendiendo!</Text>

            <Text style={styles.footerText}>
              Cada paso que das te acerca a tus metas.
              <Text style={styles.green}> ¡Tú puedes!</Text>
            </Text>
          </View>

          <Image
            source={require("../../../../../assets/images/HomeScreen/corazón.png")}
            style={styles.heart}
          />
        </View>
      </ScrollView>

      {/* MENU INFERIOR */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Ionicons name="home" size={24} color="#2E7DFF" />
          <Text style={styles.navActive}>Inicio</Text>
          <View style={styles.line} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/chatScreen")}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#A0AEC0"
          />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/campos")}
        >
          <Ionicons name="clipboard-outline" size={24} color="#A0AEC0" />
          <Text style={styles.navText}>Pruebas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  header: {
    backgroundColor: "#EAF6FF",
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
    height: 212,
    paddingHorizontal: 24,
    paddingTop: 18,
    position: "relative",
    overflow: "hidden",
  },

  cloud: {
    position: "absolute",
    width: 55,
    height: 30,
    resizeMode: "contain",
    opacity: 0.9,
  },

  title: {
    fontSize: 31,
    fontWeight: "900",
    color: "#081B54",
    lineHeight: 37,
    width: "55%",
    marginTop: 30,
  },

  subtitle: {
    marginTop: 3,
    fontSize: 17,
    color: "#64748B",
  },

  blueText: {
    color: "#338CFF",
    fontWeight: "700",
  },

  robot: {
    width: 190,
    height: 200,
    position: "absolute",
    right: 8,
    top: 20,
    resizeMode: "contain",
  },

  cardBlue: {
    marginHorizontal: 18,
    marginTop: 18,
    backgroundColor: "#F9FCFF",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#DCEEFF",
    minHeight: 180,
    flexDirection: "row",
    padding: 16,
    elevation: 8,
  },

  cardOrange: {
    marginHorizontal: 18,
    marginTop: 18,
    backgroundColor: "#FFFDF6",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#FFE7A0",
    minHeight: 190,
    flexDirection: "row",
    padding: 16,
    elevation: 8,
  },

  topIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 46,
    height: 46,
    resizeMode: "contain",
  },

  leftBoxBlue: {
    width: 132,
    height: 132,
    borderRadius: 36,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#EDF7FF",
  },

  leftBoxBlueTop: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#EDF7FF",
  },

  leftBoxBlueBottom: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 108,
    height: 108,
    borderRadius: 28,
    backgroundColor: "#DCEEFF",
  },

  leftBoxOrange: {
    width: 132,
    height: 132,
    borderRadius: 36,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#FFF6D8",
  },

  leftBoxOrangeTop: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF6D8",
  },

  leftBoxOrangeBottom: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 108,
    height: 108,
    borderRadius: 28,
    backgroundColor: "#FFF0B7",
  },

  cardImage: {
    width: 95,
    height: 96,
    resizeMode: "contain",
  },

  info: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: "center",
  },

  chatTitle: {
    fontSize: 31,
    fontWeight: "900",
    color: "#2E7DFF",
  },

  orangeTitle: {
    fontSize: 31,
    fontWeight: "900",
    color: "#FF8500",
  },

  cardText: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 22,
    marginVertical: 8,
  },

  blueButton: {
    backgroundColor: "#2E7DFF",
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 28,
    alignSelf: "flex-start",
  },

  orangeButton: {
    backgroundColor: "#FF8A00",
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 28,
    alignSelf: "flex-start",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  footer: {
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
  },

  star: {
    width: 74,
    height: 74,
    resizeMode: "contain",
    marginRight: 12,
  },

  footerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#081B54",
  },

  footerText: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 20,
  },

  green: {
    color: "#2BC866",
    fontWeight: "700",
  },

  heart: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  navbar: {
    position: "absolute",
    bottom: 12,
    left: 18,
    right: 18,
    height: 78,
    backgroundColor: "#fff",
    borderRadius: 34,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 14,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    fontSize: 11,
    color: "#A0AEC0",
    marginTop: 2,
  },

  navActive: {
    fontSize: 11,
    color: "#2E7DFF",
    marginTop: 2,
    fontWeight: "700",
  },

  line: {
    marginTop: 4,
    width: 18,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#2E7DFF",
  },
});