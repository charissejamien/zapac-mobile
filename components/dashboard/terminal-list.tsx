import {
  BusFront,
  ChevronDown,
  ChevronUp,
  Clock3,
  HeartHandshake,
  Navigation,
  Route,
  ShieldCheck,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "@/src/theme/app-theme";

interface RouteFare {
  route: string;
  fare: string;
  vehicle_code?: string;
  stops?: string;
}

interface TerminalItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  details: {
    title: string;
    status: string;
    routes: string;
    facilities: string;
    routes_fares: RouteFare[];
  };
}

const hardcodedTerminals: TerminalItem[] = [
  {
    id: "cebu_south_terminal",
    name: "Cebu South Bus Terminal",
    lat: 10.3015,
    lng: 123.8965,
    details: {
      title: "Cebu South Bus Terminal",
      status: "Open 24/7",
      routes: "Southern Cebu (Oslob, Moalboal, Carcar)",
      facilities: "Restrooms, Ticketing Counters, Food Stalls",
      routes_fares: [
        { route: "Cebu South Bus to Carcar", fare: "P 95" },
        { route: "Cebu South Bus to Sibonga", fare: "P 131" },
        { route: "Cebu South Bus to Argao", fare: "P 156" },
        { route: "Cebu South Bus to Pinamungajan", fare: "P 175" },
        { route: "Cebu South Bus to Aloguinsan", fare: "P 201" },
        { route: "Cebu South Bus to Moalboal", fare: "P 210" },
        { route: "Cebu South Bus to Alcoy", fare: "P 215" },
        { route: "Cebu South Bus to Bato (via Oslob)", fare: "P 330" },
        { route: "Cebu South Bus to Bato (via Barili)", fare: "P 347" },
      ],
    },
  },
  {
    id: "cebu_north_terminal",
    name: "Cebu North Bus Terminal",
    lat: 10.32,
    lng: 123.911,
    details: {
      title: "Cebu North Bus Terminal",
      status: "Open 4:00 AM - 10:00 PM",
      routes: "Northern Cebu (Bogo, Daanbantayan, Danao)",
      facilities: "Waiting Area, Ticket Booths, Vending Machines",
      routes_fares: [
        { route: "Cebu North Bus to Tabogon", fare: "P 202" },
        { route: "Cebu North Bus to Tuburan", fare: "P 235" },
        { route: "Cebu North Bus to Hagnaya", fare: "P 259" },
        { route: "Cebu North Bus to Lambusan", fare: "P 280" },
        { route: "Cebu North Bus to Daan Bantayan", fare: "P 301" },
        { route: "Cebu North Bus to Maya", fare: "P 320" },
      ],
    },
  },
  {
    id: "sm_city_cebu_terminal",
    name: "SM City Cebu PUV Terminal",
    lat: 10.3164,
    lng: 123.9189,
    details: {
      title: "SM City Cebu PUV Terminal",
      status: "Open 10:00 AM - 9:00 PM",
      routes: "Route 01K, 03B, 04H (Modern Jeepneys)",
      facilities: "Sheltered Waiting Area, CCTV, Access to Mall",
      routes_fares: [
        {
          route: "SM City to Bulacao",
          fare: "P 37",
          vehicle_code: "10H",
          stops:
            "SM City Cebu – F. Cabahug – MJ Cuenco – Downtown (Cathedral) – Cebu South Bus Terminal – N. Bacalso Highway – Mambaling – Basak – Pardo – Bulacao",
        },
        {
          route: "SM City to Bulacao",
          fare: "P 37",
          vehicle_code: "10M",
          stops:
            "SM City Cebu – F. Cabahug – MJ Cuenco – T. Padilla – Sancianko – Downtown – Leon Kilat – N. Bacalso – Basak – Mambaling – Pardo – Bulacao",
        },
        {
          route: "SM City to Labangon",
          fare: "P 26",
          vehicle_code: "12G",
          stops:
            "SM City Cebu – F. Cabahug – MJ Cuenco – Downtown – Sancianko – Panganiban – Katipunan – A. Bonifacio – Labangon",
        },
        {
          route: "SM City to Labangon",
          fare: "P 28",
          vehicle_code: "12I",
          stops:
            "SM City Cebu – F. Cabahug – Downtown (Sikatuna/Legazpi area) – N. Bacalso – Tres de Abril – Katipunan – Labangon",
        },
        {
          route: "SM City to Alumnos",
          fare: "P 15",
          vehicle_code: "08F",
          stops:
            "Sm City Cebu - Sergio Osmena Jr Blvd - Magallanes St - Carlock St - Alumnos",
        },
        {
          route: "SM City to Guadalupe",
          fare: "P 22",
          vehicle_code: "06H",
          stops:
            "SM City Cebu – Archbishop Reyes – Ayala Center Cebu – Escario – Capitol – V. Rama – Guadalupe Church – Guadalupe",
        },
        {
          route: "SM City to Ayala",
          fare: "P 15",
          vehicle_code: "03Q",
          stops:
            "SM City Cebu – F. Cabahug – Archbishop Reyes – Ayala Center Cebu",
        },
        {
          route: "Lahug to Ayala",
          fare: "P 15",
          vehicle_code: "04L",
          stops:
            "SM City Cebu – F. Cabahug – MJ Cuenco – Ramos – Fuente – Downtown (Colon)",
        },
        {
          route: "Urgello to Parkmall",
          fare: "P 22",
          vehicle_code: "01k",
          stops:
            "SM City Cebu – MJ Cuenco – Downtown (Colon) – Metro Colon – Leon Kilat – V. Rama Extension – Urgello",
        },
      ],
    },
  },
  {
    id: "ayala_puv_terminal",
    name: "Ayala Public Utility Vehicle Terminal",
    lat: 10.3177,
    lng: 123.905,
    details: {
      title: "Ayala Public Utility Vehicle Terminal",
      status: "Open 10:00 AM - 9:00 PM",
      routes: "Route 01K, 03B, 04H (Modern Jeepneys)",
      facilities: "Sheltered Waiting Area, CCTV, Access to Mall",
      routes_fares: [
        {
          route: "Ayala to SM City",
          fare: "P 15",
          vehicle_code: "03Q",
          stops:
            "Ayala Center Cebu – Archbishop Reyes – F. Cabahug – SM City Cebu",
        },
        {
          route: "Ayala to Lahug",
          fare: "P 15",
          vehicle_code: "04L",
          stops: "Ayala Center Cebu – Salinas Drive – JY Square – Lahug",
        },
        {
          route: "Ayala to Labangon",
          fare: "P 26",
          vehicle_code: "12L",
          stops:
            "Ayala Center Cebu – Archbishop Reyes – Escario – Fuente – V. Rama – Katipunan – Labangon",
        },
        {
          route: "Ayala to Colon",
          fare: "P 17",
          vehicle_code: "14D",
          stops: "Ayala Center Cebu – Escario – Capitol – Jones Avenue – Colon",
        },
        {
          route: "Ayala to Mandaue",
          fare: "P 24",
          vehicle_code: "20",
          stops:
            "Ayala Center Cebu – Archbishop Reyes – F. Cabahug – Mabolo – Panagdait – Mandaue City",
        },
        {
          route: "Guadalupe to SM City",
          fare: "P 27",
          vehicle_code: "06H",
          stops:
            "Guadalupe – V. Rama – Capitol – Escario – Ayala Center Cebu – Archbishop Reyes – SM City Cebu",
        },
        {
          route: "Talamban to Carbon",
          fare: "P 33",
          vehicle_code: "13C",
          stops:
            "Talamban – Banilad – Gaisano Country Mall – USC TC – Lahug – Escario – Fuente – Colon – Carbon",
        },
        {
          route: "Talamban to Colon",
          fare: "P 33",
          vehicle_code: "13C",
          stops:
            "Talamban – Banilad – Gaisano Country Mall – USC TC – Lahug – Escario – Fuente – Colon",
        },
      ],
    },
  },
  {
    id: "cebu_itpark_transport_terminal",
    name: "Cebu IT Park Transport Terminal",
    lat: 10.3317,
    lng: 123.9065,
    details: {
      title: "Cebu IT Park Transport Terminal",
      status: "Open 10:00 AM - 9:00 PM",
      routes: "Route 01K, 03B, 04H (Modern Jeepneys)",
      facilities: "Sheltered Waiting Area, CCTV, Access to Mall",
      routes_fares: [
        { route: "IT Park to Danao", fare: "P 50" },
        { route: "IT Park to Liloan", fare: "P 40" },
        { route: "IT Park to Consolacion", fare: "P 35" },
        { route: "IT Park to Mandaue", fare: "P 35" },
        { route: "IT Park to Carbon", fare: "P 20" },
        { route: "IT Park to Il Corso", fare: "P 26" },
        { route: "IT Park to Mactan Newtown", fare: "P 35" },
        { route: "IT Park to Talisay", fare: "P 40" },
        { route: "IT Park to Minglanilla", fare: "P 44" },
        { route: "IT Park to Naga", fare: "P 55" },
      ],
    },
  },
];

interface TerminalListProps {
  onSelectTerminal: (lat: number, lng: number, name: string) => void;
}

export default function TerminalList({ onSelectTerminal }: TerminalListProps) {
  const { colors } = useAppTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <FlatList
      data={hardcodedTerminals}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      scrollIndicatorInsets={{ bottom: 112 }}
      ListHeaderComponent={
        <View>
          <View
            style={[
              styles.reassuranceCard,
              { backgroundColor: colors.primarySoft },
            ]}
          >
            <View style={styles.reassuranceIcon}>
              <HeartHandshake size={19} color="#527AAF" />
            </View>
            <View style={styles.reassuranceCopy}>
              <Text style={[styles.reassuranceTitle, { color: colors.text }]}>
                Let&apos;s make the next step simpler
              </Text>
              <Text
                style={[styles.reassuranceText, { color: colors.textMuted }]}
              >
                Pick a terminal to check its routes, fare estimates, facilities,
                and exact map location.
              </Text>
            </View>
          </View>

          <View style={styles.listHeader}>
            <View>
              <Text style={styles.eyebrow}>NEARBY TRAVEL OPTIONS</Text>
              <Text style={[styles.listTitle, { color: colors.text }]}>
                Where are you heading from?
              </Text>
            </View>
            <View style={styles.terminalCount}>
              <Text style={styles.terminalCountText}>
                {hardcodedTerminals.length}
              </Text>
            </View>
          </View>
        </View>
      }
      renderItem={({ item }) => {
        const isExpanded = expandedId === item.id;
        const routeCount = item.details.routes_fares.length;

        return (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
              isExpanded && styles.cardExpanded,
            ]}
          >
            <View style={styles.cardHeader}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setExpandedId(isExpanded ? null : item.id)}
                style={styles.terminalSummary}
              >
                <View style={styles.terminalIcon}>
                  <BusFront size={21} color="#FFFFFF" />
                </View>

                <View style={styles.titleBlock}>
                  <Text style={[styles.terminalName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <View style={styles.quickMeta}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{item.details.status}</Text>
                  </View>
                </View>

                <View style={styles.expandButton}>
                  {isExpanded ? (
                    <ChevronUp size={19} color="#527AAF" />
                  ) : (
                    <ChevronDown size={19} color="#527AAF" />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.destinationRow,
                { backgroundColor: colors.surfaceMuted },
              ]}
            >
              <Route size={14} color="#5F8796" />
              <Text
                style={[styles.destinationText, { color: colors.textMuted }]}
                numberOfLines={2}
              >
                {item.details.routes}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.routeCountBadge}>
                <Text style={styles.routeCountText}>
                  {routeCount} {routeCount === 1 ? "route" : "routes"}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.mapButton}
                onPress={() => onSelectTerminal(item.lat, item.lng, item.name)}
              >
                <Navigation size={14} color="#FFFFFF" />
                <Text style={styles.mapButtonText}>Show me where</Text>
              </TouchableOpacity>
            </View>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <Clock3 size={15} color="#527AAF" />
                    </View>
                    <View style={styles.infoCopy}>
                      <Text style={styles.infoLabel}>When to go</Text>
                      <Text style={[styles.infoText, { color: colors.text }]}>
                        {item.details.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                      <ShieldCheck size={15} color="#527AAF" />
                    </View>
                    <View style={styles.infoCopy}>
                      <Text style={styles.infoLabel}>What&apos;s available</Text>
                      <Text style={[styles.infoText, { color: colors.text }]}>
                        {item.details.facilities}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sectionHeading}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Plan your ride
                  </Text>
                  <Text style={styles.sectionHint}>Fares are estimates</Text>
                </View>

                {item.details.routes_fares.map((rf, idx) => (
                  <View
                    key={`${rf.route}-${rf.vehicle_code ?? idx}`}
                    style={styles.fareRow}
                  >
                    <View style={styles.routeDetails}>
                      {rf.vehicle_code && (
                        <View style={styles.vehicleBadge}>
                          <Text style={styles.vehicleBadgeText}>
                            {rf.vehicle_code.toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <View style={styles.routeCopy}>
                        <Text style={styles.fareRouteText}>{rf.route}</Text>
                        {rf.stops && (
                          <Text style={styles.stopsText} numberOfLines={2}>
                            {rf.stops}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.farePill}>
                      <Text style={styles.fareAmount}>
                        {rf.fare.replace("P ", "₱")}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 140,
    paddingTop: 14,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  reassuranceCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
  },
  reassuranceIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginRight: 11,
  },
  reassuranceCopy: {
    flex: 1,
  },
  reassuranceTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  reassuranceText: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },
  eyebrow: {
    color: "#74AFA0",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  listTitle: {
    color: "#26354A",
    fontSize: 20,
    fontWeight: "800",
  },
  terminalCount: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E7F2EF",
  },
  terminalCountText: {
    color: "#4E8C7D",
    fontSize: 14,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E9EEF3",
    elevation: 3,
    shadowColor: "#28415E",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardExpanded: {
    borderColor: "#BFD4DE",
    shadowOpacity: 0.12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  terminalSummary: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  terminalIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#74AFA0",
  },
  titleBlock: {
    flex: 1,
    marginLeft: 11,
  },
  terminalName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
    color: "#26354A",
  },
  quickMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#74AFA0",
    marginRight: 5,
  },
  statusText: {
    flex: 1,
    fontSize: 11,
    color: "#718096",
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF3F8",
    marginLeft: 8,
  },
  destinationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    backgroundColor: "#F6F9FB",
    borderRadius: 12,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  destinationText: {
    flex: 1,
    color: "#536274",
    fontSize: 12,
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 11,
  },
  routeCountBadge: {
    backgroundColor: "#FFF4E2",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  routeCountText: {
    color: "#A66A19",
    fontSize: 11,
    fontWeight: "700",
  },
  mapButton: {
    flexDirection: "row",
    gap: 6,
    borderRadius: 999,
    backgroundColor: "#527AAF",
    paddingHorizontal: 13,
    paddingVertical: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  expandedContent: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E9EEF3",
    paddingTop: 14,
  },
  infoGrid: {
    gap: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF3F8",
    marginRight: 9,
  },
  infoCopy: {
    flex: 1,
  },
  infoLabel: {
    color: "#8A96A5",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoText: {
    color: "#3F4C5C",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#26354A",
  },
  sectionHint: {
    fontSize: 9,
    color: "#99A3AF",
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 12,
    marginBottom: 7,
  },
  routeDetails: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 10,
  },
  vehicleBadge: {
    minWidth: 36,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#5F8796",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginRight: 8,
  },
  vehicleBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  routeCopy: {
    flex: 1,
  },
  fareRouteText: {
    fontSize: 12,
    lineHeight: 17,
    color: "#344255",
    fontWeight: "600",
  },
  stopsText: {
    color: "#8A96A5",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },
  farePill: {
    borderRadius: 999,
    backgroundColor: "#E7F2EF",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  fareAmount: {
    fontSize: 11,
    fontWeight: "800",
    color: "#397968",
  },
});
