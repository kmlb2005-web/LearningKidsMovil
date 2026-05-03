import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Tema = {
  idTema: number;
  nombre: string;
  descripcion: string;
  idProyecto: number;
  proyecto: {
    nombre: string;
    descripcion: string;
  };
};

export default function TemasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { idProyecto } = useLocalSearchParams();

  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        const res = await fetch("http://192.168.1.72:5125/api/temas");
        const data: Tema[] = await res.json();

        const filtrados = data.filter(
          (t) => t.idProyecto === Number(idProyecto)
        );

        setTemas(filtrados);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemas();
  }, [idProyecto]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  const proyectoNombre = temas[0]?.proyecto?.nombre || "Proyecto";
  const proyectoDesc = temas[0]?.proyecto?.descripcion || "";

  const imagenesLocales = [
    require("../../../../../assets/images_3/uno.png"),
    require("../../../../../assets/images_3/dos.png"),
    require("../../../../../assets/images_3/tres.png"),
    require("../../../../../assets/images_3/cuatro.png"),
    require("../../../../../assets/images_3/cinco.png"),
  ];

  const onPressTema = (id: number) => {
    router.push({
      pathname: "/features/home/screens/PruebasScreen",
      params: { idTema: id.toString() },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>{proyectoNombre}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* CARD PRINCIPAL (VISUAL DEL PRIMER CÓDIGO) */}
        <View style={styles.mainCard}>
          <Image
            source={require("../../../../../assets/images_3/doctor.png")}
            style={styles.mainImage}
            resizeMode="cover"
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.mainTitle}>{proyectoNombre}</Text>
            <Text style={styles.mainDesc}>{proyectoDesc}</Text>
          </View>
        </View>

        {/* LISTA DE TEMAS (FUNCIONALIDAD DEL SEGUNDO + IMÁGENES) */}
        <View style={styles.list}>
          {temas.map((item, index) => (
            <TouchableOpacity
              key={item.idTema}
              style={styles.item}
              onPress={() => onPressTema(item.idTema)}
            >
              <Image
                source={imagenesLocales[index] || imagenesLocales[0]}
                style={styles.circle}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.nombre}</Text>
                <Text style={styles.itemDesc}>{item.descripcion}</Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* 🔻 IMAGEN FIJA INFERIOR */}
      <Image
        source={require("../../../../../assets/images_3/fondoo.png")}
        style={styles.bottomImage}
        resizeMode="cover"
      />
    </SafeAreaView>
  );
}

/* ========= STYLES ========= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },

  header: {
    padding: 16,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  mainCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },

  mainImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },

  mainTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  mainDesc: {
    fontSize: 13,
    color: "#666",
  },

  list: {
    paddingHorizontal: 16,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  itemTitle: {
    fontWeight: "bold",
  },

  itemDesc: {
    fontSize: 12,
    color: "#666",
  },

  arrow: {
    fontSize: 18,
    color: "#888",
  },

  bottomImage: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
  },
});