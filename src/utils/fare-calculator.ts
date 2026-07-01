export interface FareBreakdown {
  standardFare: number;
  discountedFare: number;
}

export function calculateFares(
  distanceInKm: number,
  durationInMins: number = 0,
): Record<string, FareBreakdown> {
  const dist = Math.max(0, distanceInKm);
  const mins = Math.max(0, durationInMins);

  // apply 20% discount
  const applyDiscount = (baseFare: number): FareBreakdown => {
    const standard = Math.round(baseFare);
    const discounted = Math.round(baseFare * 0.8);
    return { standardFare: standard, discountedFare: discounted };
  };

  // Regular Metered Taxi  ---
  const taxiBase = 45 + dist * 13.5 + mins * 2;

  // Modern Jeepney ---
  const modernJeepBase = dist <= 4 ? 17 : 17 + (dist - 4) * 2.4;

  // Traditional Jeepney ---
  const tradJeepBase = dist <= 4 ? 14 : 14 + (dist - 4) * 2.0;

  // Ordinary / Traditional Bus ---
  const ordinaryBusBase = dist <= 5 ? 11 : 11 + (dist - 5) * 1.9;

  // Modern Bus ---
  const modernBusBase = dist <= 5 ? 13 : 13 + (dist - 5) * 2.2;

  return {
    "White Taxi": applyDiscount(taxiBase),
    "Modern Jeep": applyDiscount(modernJeepBase),
    "Traditional Jeep": applyDiscount(tradJeepBase),
    "Traditional Bus": applyDiscount(ordinaryBusBase),
    "Modern Bus": applyDiscount(modernBusBase),
  };
}
