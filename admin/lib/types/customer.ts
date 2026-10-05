export interface CustomerAddress {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
}

export interface CustomerListItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  isGuest: boolean;
  createdAt: string;
}

export interface CustomerDetail extends CustomerListItem {
  addresses: CustomerAddress[];
}

export interface CreateCustomerInput {
  name: string;
  email?: string;
  phone?: string;
}
