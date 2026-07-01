// app/routes/index.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, ArrowLeft, CheckCircle2, X } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    Image,
    Linking,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useAppTheme } from "@/src/theme/app-theme";
import { calculateFares, FareBreakdown } from "@/src/utils/fare-calculator";

// Sub components split
import FareAccordion from "@/components/dashboard/fare-accordion";
import ModeDurations from "@/components/dashboard/mode-durations";
import TripSummary from "@/components/dashboard/trip-summary";

const GOOGLE_MAPS_API_KEY = Platform.select({
  ios: "AIzaSyCWHublkXuYaWfT68qUwGY3o5L9NB82JA8",
  android: "AIzaSyAJP6e_5eBGz1j8b6DEKqLT-vest54Atkc",
});

const BRAND_DICTIONARY: Record<string, any> = {
  Angkas: {
    title: "Angkas",
    logoAsset: require("@/assets/images/angkas.png"),
    brandColor: "#00A6B4",
    staticFare: "₱85",
    features: [
      "Ride-Hailing App",
      "Includes Passenger Insurance",
      "Provides Clean Hairnet & Helmet",
    ],
    hasApp: true,
    appScheme: "angkas://",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=com.angkas.passenger",
    appStoreUrl:
      "https://apps.apple.com/ph/app/angkas-bikes-cars-taxi/id1158864789",
    description:
      "The pioneer motorcycle taxi hailing service in the Philippines.",
  },
  Maxim: {
    title: "Maxim",
    logoAsset: require("@/assets/images/maxim.png"),
    brandColor: "#FFD600",
    staticFare: "₱60",
    features: ["Ride-Hailing App", "Budget Transport"],
    hasApp: true,
    appScheme: "maximpassenger://",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=com.taxsee.passenger",
    appStoreUrl:
      "https://apps.apple.com/ph/app/maxim-order-taxi-delivery/id579985956",
    description: "Budget-friendly motorcycle transport across Cebu.",
  },
  Moveit: {
    title: "Move It",
    logoAsset: require("@/assets/images/moveit.png"),
    brandColor: "#E63946",
    staticFare: "₱78",
    features: ["Ride-Hailing App", "Powered by Grab Ecosystem"],
    hasApp: true,
    appScheme: "moveit://",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=ph.moveit.passenger",
    appStoreUrl: "https://apps.apple.com/ph/app/move-it-now/id1438541910",
    description: "Online motorcycle taxi service powered by Grab.",
  },
  Joyride: {
    title: "JoyRide",
    logoAsset: require("@/assets/images/joyride.png"),
    brandColor: "#1A73E8",
    staticFare: "₱75",
    features: ["Ride-Hailing App", "Widespread Cebuano Driver Fleet"],
    hasApp: true,
    appScheme: "joyride://",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=com.joyride.passenger",
    appStoreUrl:
      "https://apps.apple.com/ph/app/joyride-car-pabili-taxi/id1485641775",
    description: "Competitive rates across urban Cebu.",
  },
  Grab: {
    title: "Grab Car",
    logoAsset: require("@/assets/images/grab.png"),
    brandColor: "#02B150",
    staticFare: "₱180",
    features: [
      "Ride-Hailing App (Book via Phone)",
      "Premium Air-Conditioned Comfort",
    ],
    hasApp: true,
    appScheme: "grab://",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=com.grabtaxi.passenger",
    appStoreUrl: "https://apps.apple.com/ph/app/grab-superapp/id647268330",
    description: "Premier full-scale car ride-hailing app.",
  },
  "Green Gsm": {
    title: "Green GSM Taxi",
    logoAsset: require("@/assets/images/greengsm.png"),
    brandColor: "#2A9D8F",
    staticFare: "₱140",
    features: [
      "Ride-Hailing App Compatible",
      "Eco-Friendly Electric Vehicle (EV)",
    ],
    hasApp: true,
    appScheme: "greengsm://",
    playStoreUrl: "https://play.google.com/",
    appStoreUrl: "https://apps.apple.com/",
    description: "Eco-conscious electric taxi grouping.",
  },
  "Joyride Car": {
    title: "JoyRide Car",
    logoAsset: require("@/assets/images/joyride.png"),
    brandColor: "#1A73E8",
    staticFare: "₱150",
    features: ["Ride-Hailing App", "On-Demand Private Sedans"],
    hasApp: true,
    appScheme: "joyride://",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=com.joyride.passenger",
    appStoreUrl:
      "https://apps.apple.com/ph/app/joyride-car-pabili-taxi/id1485641775",
    description: "The 4-wheel sedan wing of JoyRide.",
  },
  "White Taxi": {
    title: "Regular Metered Taxi",
    logoAsset: null,
    brandColor: "#94A3B8",
    features: [
      "No Booking App (Street Hail Only)",
      "Traditional Metered Flag-Down",
    ],
    description: "Cebu's standard metered flag-down taxis.",
  },
  "Traditional Jeep": {
    title: "Traditional Jeepney",
    logoAsset: null,
    brandColor: "#5F8796",
    features: ["Non Air-Conditioned (Open Window)", "Fixed Route Paths"],
  },
  "Modern Jeep": {
    title: "Modern Jeepney",
    logoAsset: null,
    brandColor: "#1E6091",
    features: ["Fully Air-Conditioned", "Fixed Transit Commuter Stops"],
  },
  "Traditional Bus": {
    title: "Traditional Bus",
    logoAsset: null,
    brandColor: "#D97706",
    features: ["Non Air-Conditioned", "Provincial Core Routes"],
  },
  "Modern Bus": {
    title: "Modern Bus / MyBus",
    logoAsset: null,
    brandColor: "#0D1822",
    features: ["Fully Air-Conditioned", "Large Premium Coach Seating"],
  },
};

// 🔥 Restored with strict export declaration for external map integration pipelines
export function decodePolyline(encoded: string) {
  const points = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

export default function RoutesPage() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const destinationTitle = (params.title as string) || "Selected Destination";
  const originLat = params.originLat
    ? parseFloat(params.originLat as string)
    : null;
  const originLng = params.originLng
    ? parseFloat(params.originLng as string)
    : null;
  const destLat = params.destLat ? parseFloat(params.destLat as string) : null;
  const destLng = params.destLng ? parseFloat(params.destLng as string) : null;

  const [loading, setLoading] = useState(false);
  const [transitTime, setTransitTime] = useState("N/A");
  const [carTime, setCarTime] = useState("N/A");
  const [motoTime, setMotoTime] = useState("N/A");
  const [distanceText, setDistanceText] = useState("");
  const [computedFares, setComputedFares] = useState<
    Record<string, FareBreakdown>
  >({});

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedBrandInfo, setSelectedBrandInfo] = useState<any>(null);

  const fetchRoutesData = useCallback(async () => {
    if (!originLat || !originLng || !destLat || !destLng) return;
    setLoading(true);

    const originStr = `${originLat},${originLng}`;
    const destStr = `${destLat},${destLng}`;
    const base = "https://maps.googleapis.com/maps/api/directions/json";

    try {
      const transitRes = await fetch(
        `${base}?origin=${originStr}&destination=${destStr}&mode=transit&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const transitJson = await transitRes.json();
      if (transitJson.routes?.[0]?.legs?.[0]) {
        const leg = transitJson.routes[0].legs[0];
        setTransitTime(leg.duration.text);
        setDistanceText(leg.distance.text);

        const calculated = calculateFares(
          leg.distance.value / 1000,
          leg.duration.value / 60,
        );
        setComputedFares(calculated);
      }

      const drivingRes = await fetch(
        `${base}?origin=${originStr}&destination=${destStr}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const drivingJson = await drivingRes.json();
      if (drivingJson.routes?.[0]?.legs?.[0]) {
        setCarTime(drivingJson.routes[0].legs[0].duration.text);
      }

      const motoRes = await fetch(
        `${base}?origin=${originStr}&destination=${destStr}&mode=driving&avoid=highways&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const motoJson = await motoRes.json();
      if (motoJson.routes?.[0]?.legs?.[0]) {
        const baseSeconds = motoJson.routes[0].legs[0].duration.value;
        setMotoTime(
          `${Math.max(2, Math.round((baseSeconds * 0.8) / 60))} mins`,
        );
      }
    } catch (err) {
      console.warn("API Processing Error:", err);
    } finally {
      setLoading(false);
    }
  }, [originLat, originLng, destLat, destLng]);

  useEffect(() => {
    fetchRoutesData();
  }, [fetchRoutesData]);

  const handleOpenInfo = (brandKey: string) => {
    const info = BRAND_DICTIONARY[brandKey];
    if (info) {
      setSelectedBrandInfo(info);
      setInfoModalVisible(true);
    }
  };

  const handleAppRedirection = async (brand: any) => {
    const scheme = brand.appScheme;
    const storeUrl =
      Platform.OS === "ios" ? brand.appStoreUrl : brand.playStoreUrl;
    try {
      if (await Linking.canOpenURL(scheme)) {
        await Linking.openURL(scheme);
      } else {
        await Linking.openURL(storeUrl);
      }
    } catch {
      await Linking.openURL(storeUrl);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.headerBox}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Routes</Text>
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView
        style={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <TripSummary
          destinationTitle={destinationTitle}
          distanceText={distanceText}
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Travel Mode Durations
        </Text>
        <ModeDurations
          loading={loading}
          transitTime={transitTime}
          motoTime={motoTime}
          carTime={carTime}
          textColor={colors.text}
          surfaceColor={colors.surfaceElevated}
          borderColor={colors.border}
        />

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Estimated Fare Summary
        </Text>
        <View
          style={[
            styles.reminderNoticeBox,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
        >
          <AlertCircle size={16} color="#1E6091" style={{ marginTop: 2 }} />
          <Text style={[styles.reminderNoticeText, { color: colors.text }]}>
            Notice: Metered Taxis and all Public Utility Vehicles follow the
            standard matrix authorized by the LTFRB. Special 20% discount
            applies to Students, Seniors, and PWDs.
          </Text>
        </View>

        <FareAccordion
          categoryTitle="Moto Taxi"
          brands={["Angkas", "Maxim", "Moveit", "Joyride"]}
          brandDictionary={BRAND_DICTIONARY}
          computedFares={computedFares}
          onOpenInfo={handleOpenInfo}
          textColor={colors.text}
          surfaceColor={colors.surfaceElevated}
          borderColor={colors.border}
        />
        <FareAccordion
          categoryTitle="Taxi"
          brands={["Grab", "Green Gsm", "Joyride Car", "White Taxi"]}
          brandDictionary={BRAND_DICTIONARY}
          computedFares={computedFares}
          onOpenInfo={handleOpenInfo}
          textColor={colors.text}
          surfaceColor={colors.surfaceElevated}
          borderColor={colors.border}
        />
        <FareAccordion
          categoryTitle="PUV"
          brands={[
            "Traditional Jeep",
            "Modern Jeep",
            "Traditional Bus",
            "Modern Bus",
          ]}
          brandDictionary={BRAND_DICTIONARY}
          computedFares={computedFares}
          onOpenInfo={handleOpenInfo}
          textColor={colors.text}
          surfaceColor={colors.surfaceElevated}
          borderColor={colors.border}
        />
      </ScrollView>

      <Modal
        visible={infoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.surfaceElevated || "#FFF" },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedBrandInfo?.title}
              </Text>
              <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.modalLogoBox,
                {
                  backgroundColor:
                    selectedBrandInfo?.brandColor || "rgba(0,0,0,0.04)",
                },
              ]}
            >
              {selectedBrandInfo?.logoAsset ? (
                <Image
                  source={selectedBrandInfo.logoAsset}
                  style={styles.modalLogoImage}
                />
              ) : (
                <Text style={styles.modalLogoFallbackText}>
                  {selectedBrandInfo?.title.charAt(0)}
                </Text>
              )}
            </View>
            {selectedBrandInfo?.description && (
              <Text style={[styles.modalDescription, { color: colors.text }]}>
                {selectedBrandInfo.description}
              </Text>
            )}
            {selectedBrandInfo?.features && (
              <View style={styles.modalFeaturesWrapper}>
                <Text
                  style={[styles.modalFeaturesTitle, { color: colors.text }]}
                >
                  Service Features
                </Text>
                {selectedBrandInfo.features.map((f: string, i: number) => (
                  <View key={i} style={styles.featureItemRow}>
                    <CheckCircle2
                      size={15}
                      color="#02B150"
                      style={{ marginTop: 2 }}
                    />
                    <Text
                      style={[styles.featureItemText, { color: colors.text }]}
                    >
                      {f}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            {selectedBrandInfo?.hasApp && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleAppRedirection(selectedBrandInfo)}
                style={[
                  styles.actionLaunchButton,
                  { backgroundColor: selectedBrandInfo.brandColor },
                ]}
              >
                <Text style={{ color: "#FFF", fontWeight: "800" }}>
                  Go to App
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBox: {
    backgroundColor: "#1E6091",
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: { padding: 6 },
  topBarTitle: { color: "#FFF", fontSize: 19, fontWeight: "800" },
  rightSpacer: { width: 36 },
  scrollBody: { flex: 1, padding: 16 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 12,
  },
  divider: { height: 1, marginVertical: 14 },
  reminderNoticeBox: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  reminderNoticeText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: { width: "90%", maxWidth: 340, borderRadius: 24, padding: 24 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "800" },
  modalLogoBox: {
    height: 90,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  modalLogoImage: { width: "55%", height: "55%", resizeMode: "contain" },
  modalLogoFallbackText: { color: "#FFF", fontSize: 32, fontWeight: "900" },
  modalDescription: { fontSize: 14, lineHeight: 21 },
  modalFeaturesWrapper: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  modalFeaturesTitle: { fontSize: 14, fontWeight: "800", marginBottom: 12 },
  featureItemRow: { flexDirection: "row", paddingVertical: 6, gap: 8 },
  featureItemText: { fontSize: 13, flex: 1 },
  actionLaunchButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
});
