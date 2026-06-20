import { Bus, Clock, Info, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <FlatList
      data={hardcodedTerminals}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const isExpanded = expandedId === item.id;
        return (
          <View style={styles.card}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setExpandedId(isExpanded ? null : item.id)}
              style={styles.cardHeader}
            >
              <View style={styles.titleRow}>
                <Bus size={20} color="#74AFA0" style={styles.iconGap} />
                <Text style={styles.terminalName}>{item.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.mapPinButton}
                onPress={() => onSelectTerminal(item.lat, item.lng, item.name)}
              >
                <MapPin size={18} color="#FFF" />
              </TouchableOpacity>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <View style={styles.metaItem}>
                  <Clock size={14} color="#666" style={styles.iconGap} />
                  <Text style={styles.metaText}>{item.details.status}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Info size={14} color="#666" style={styles.iconGap} />
                  <Text style={styles.metaText}>{item.details.facilities}</Text>
                </View>

                <Text style={styles.sectionTitle}>Routes & Fares</Text>
                {item.details.routes_fares.map((rf, idx) => (
                  <View key={idx} style={styles.fareRow}>
                    <View style={styles.fareRouteContainer}>
                      {rf.vehicle_code && (
                        <Text style={styles.vehicleBadge}>
                          {rf.vehicle_code}
                        </Text>
                      )}
                      <Text style={styles.fareRouteText}>{rf.route}</Text>
                    </View>
                    <Text style={styles.fareAmount}>{rf.fare}</Text>
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
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 32,
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  iconGap: {
    marginRight: 8,
  },
  terminalName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  mapPinButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#74AFA0",
    justifyContent: "center",
    alignItems: "center",
  },
  expandedContent: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  metaText: {
    fontSize: 13,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#74AFA0",
    marginTop: 10,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  fareRouteContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  vehicleBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFF",
    backgroundColor: "#5F8796",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 6,
  },
  fareRouteText: {
    fontSize: 13,
    color: "#333",
    flex: 1,
  },
  fareAmount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E57373",
  },
});
