export interface IUser {
  id: string;
  email: string;
  password: string | null;
  name: string;
  phone: string | null;
  role: Role;
  isActive: boolean;
  gcpId: string | null;
  complaints: Complaint[];
  payments: Payment[];
  notifications: Notification[];
  createdOutages: Outage[];
  assignedOutages: Outage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ILogin {
  email: string;
  password: string;
}

export enum Role {
  CUSTOMER = "CUSTOMER",
  // Add other roles as needed
}

// Define these interfaces based on your other schemas
export interface Complaint {
  id: string;
  // ... other fields
}

export interface Payment {
  id: string;
  // ... other fields
}

export interface Notification {
  id: string;
  // ... other fields
}

export interface Outage {
  id: string;
  // ... other fields
}

