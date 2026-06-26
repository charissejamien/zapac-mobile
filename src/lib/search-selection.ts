export interface PendingPlace {
  latitude: number;
  longitude: number;
  name: string;
}

let pending: PendingPlace | null = null;

export function setPendingPlace(place: PendingPlace) {
  pending = place;
}

export function consumePendingPlace(): PendingPlace | null {
  const p = pending;
  pending = null;
  return p;
}
