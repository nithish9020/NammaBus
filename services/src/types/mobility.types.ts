export interface Stop {
  id: string;
  name: string;
  lat: string; // stored as string for now (e.g. "12.9716")
  lon: string;
  city: string;
  pincode: string;
  createdAt: Date;
  updatedAt: Date;
}
