import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="campos" />
      <Tabs.Screen name="home" />
      <Tabs.Screen name="chatScreen" />
      <Tabs.Screen name="formPruebas" />
      <Tabs.Screen name="proyectos" />
      <Tabs.Screen name="pruebas" />
      <Tabs.Screen name="temas" />
    </Tabs>
  );
}