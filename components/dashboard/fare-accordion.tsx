import { FareBreakdown } from "@/src/utils/fare-calculator";
import { ChevronDown, ChevronUp, Info } from "lucide-react-native";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FareAccordionProps {
  categoryTitle: "Moto Taxi" | "Taxi" | "PUV";
  brands: string[];
  brandDictionary: Record<string, any>;
  computedFares: Record<string, FareBreakdown>;
  onOpenInfo: (brandKey: string) => void;
  textColor: string;
  surfaceColor: string;
  borderColor: string;
}

export default function FareAccordion({
  categoryTitle,
  brands,
  brandDictionary,
  computedFares,
  onOpenInfo,
  textColor,
  surfaceColor,
  borderColor,
}: FareAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={{ marginBottom: 8 }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsOpen(!isOpen)}
        style={[
          styles.dropdownHeader,
          { backgroundColor: surfaceColor, borderColor },
        ]}
      >
        <Text style={[styles.dropdownHeaderTitle, { color: textColor }]}>
          {categoryTitle}
        </Text>
        {isOpen ? (
          <ChevronUp size={20} color={textColor} />
        ) : (
          <ChevronDown size={20} color={textColor} />
        )}
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.dropdownContent, { borderColor }]}>
          {brands.map((brandKey) => {
            const data = brandDictionary[brandKey];
            if (!data) return null;

            let displayPrice = data.staticFare || "零0";
            let displayDiscount = "";

            if (computedFares[brandKey]) {
              const fareObj = computedFares[brandKey];
              displayPrice = `₱${fareObj.standardFare}`;
              displayDiscount = `₱${fareObj.discountedFare}`;
            }

            return (
              <View key={brandKey} style={styles.subRow}>
                <View style={styles.brandNameBlock}>
                  <View
                    style={[
                      styles.logoBadgeFrame,
                      { backgroundColor: data.brandColor },
                    ]}
                  >
                    {data.logoAsset ? (
                      <Image
                        source={data.logoAsset}
                        style={styles.logoImageStyle}
                      />
                    ) : (
                      <Text style={styles.logoTextFallback}>
                        {data.title.charAt(0)}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.subLabel, { color: textColor }]}>
                    {data.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => onOpenInfo(brandKey)}
                    style={styles.infoTouchTarget}
                  >
                    <Info size={15} color="#777" />
                  </TouchableOpacity>
                </View>
                <View style={styles.farePriceColumn}>
                  <Text style={[styles.subFare, { color: textColor }]}>
                    {displayPrice}
                  </Text>
                  {displayDiscount ? (
                    <Text style={styles.discountSubText}>
                      Disc: {displayDiscount}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  dropdownHeaderTitle: { fontSize: 15, fontWeight: "700" },
  dropdownContent: {
    borderWidth: 1,
    borderTopWidth: 0,
    marginTop: -4,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: "rgba(0,0,0,0.01)",
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.05)",
  },
  brandNameBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  logoBadgeFrame: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoImageStyle: { width: "75%", height: "75%", resizeMode: "contain" },
  logoTextFallback: { color: "#FFF", fontWeight: "800", fontSize: 14 },
  infoTouchTarget: { padding: 6 },
  farePriceColumn: { alignItems: "flex-end" },
  subLabel: { fontSize: 14, fontWeight: "700" },
  subFare: { fontSize: 14, fontWeight: "800" },
  discountSubText: {
    fontSize: 11,
    color: "#166534",
    fontWeight: "700",
    marginTop: 2,
  },
});
