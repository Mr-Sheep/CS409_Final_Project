export interface Location {
  address: string;
  full_address: string;
  latitude: number;
  longitude: number;
  mapbox_id: string;
}

export interface EventBase {
  name: string;
  description: string;
  date: string;
  location_note: string | "";
  location: Location;
}

export interface Event extends EventBase {
  _id: string;
  time?: string;
  weather?: string;
  creator: string;
  creatorUsername: string;
}

// EventForm.tsx
export interface FormData extends EventBase {
  time: string;
}

// EventCard.tsx
export interface EventCardProps {
  event: Event;
  onDelete?: (eventId: string) => void;
}

// use in EventForm.tsx
export interface EventFormProps {
  initialData: FormData;
  onSubmit?: (data: FormData) => Promise<void>;
  submitLabel?: string;
}

export interface UserProfile {
  id: string;
  username: string;
}
