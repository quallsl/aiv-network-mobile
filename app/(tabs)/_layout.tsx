import { Tabs } from "expo-router";
import { colors } from "@/constants/theme";
import { IS_TV, tvSafe, tvType } from "@/constants/tv";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: !IS_TV,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textFaint,
        // Apple TV: large tab bar across the top, inside the safe area
        tabBarPosition: IS_TV ? "top" : "bottom",
        tabBarStyle: IS_TV
          ? {
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
              borderTopWidth: 0,
              height: 140,
              paddingTop: tvSafe.vertical,
              paddingHorizontal: tvSafe.horizontal,
            }
          : { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: IS_TV
          ? { fontSize: tvType.body, fontWeight: "700" }
          : undefined,
        tabBarIconStyle: IS_TV ? { display: "none" } : undefined,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      {/* Search is a placeholder and Filmmaker needs uploads/payouts —
          neither belongs on Apple TV, so they're hidden there. */}
      <Tabs.Screen
        name="search"
        options={{ title: "Search", href: IS_TV ? null : undefined }}
      />
      <Tabs.Screen
        name="filmmaker"
        options={{ title: "Filmmaker", href: IS_TV ? null : undefined }}
      />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}