export interface PixSettings {
  _id: string;
  pixKey: string;
  ownerName: string;
  city: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePixSettingsRequest {
  pixKey: string;
  ownerName: string;
  city: string;
  isActive: boolean;
}

export interface UpdatePixSettingsRequest {
  pixKey?: string;
  ownerName?: string;
  city?: string;
  isActive?: boolean;
}
