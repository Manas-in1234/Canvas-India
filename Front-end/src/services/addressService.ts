import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Address } from '../types/auth';

const LOCAL_STORAGE_ADDRESSES_KEY = 'ci_guest_addresses';

export const addressService = {
  async getAddresses(userId?: string): Promise<Address[]> {
    if (isSupabaseConfigured && userId) {
      try {
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', userId)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []) as Address[];
      } catch (err) {
        console.error('Failed to load addresses from Supabase:', err);
      }
    }

    // Fallback to local storage for guests / local dev
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ADDRESSES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async addAddress(address: Omit<Address, 'id'>, userId?: string): Promise<Address> {
    const newAddress: Address = {
      ...address,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && userId) {
      if (address.is_default) {
        // Reset previous default
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      const { data, error } = await supabase
        .from('addresses')
        .insert([{
          user_id: userId,
          name: address.name,
          phone: address.phone,
          street_address: address.street_address,
          apartment: address.apartment || null,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country || 'India',
          address_type: address.address_type || 'home',
          is_default: address.is_default || false,
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Address;
    }

    // Local storage fallback
    const id = `addr-${Date.now()}`;
    const savedAddress = { ...newAddress, id };
    try {
      const current = await this.getAddresses();
      if (savedAddress.is_default) {
        current.forEach((a) => (a.is_default = false));
      }
      current.unshift(savedAddress);
      localStorage.setItem(LOCAL_STORAGE_ADDRESSES_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('Could not save address to local storage:', e);
    }
    return savedAddress;
  },

  async updateAddress(id: string, updates: Partial<Address>, userId?: string): Promise<Address> {
    if (isSupabaseConfigured && userId) {
      if (updates.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      const { data, error } = await supabase
        .from('addresses')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as Address;
    }

    // Local fallback
    const current = await this.getAddresses();
    const index = current.findIndex((a) => a.id === id);
    if (index !== -1) {
      if (updates.is_default) {
        current.forEach((a) => (a.is_default = false));
      }
      current[index] = { ...current[index], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(LOCAL_STORAGE_ADDRESSES_KEY, JSON.stringify(current));
      return current[index];
    }
    throw new Error('Address not found');
  },

  async deleteAddress(id: string, userId?: string): Promise<void> {
    if (isSupabaseConfigured && userId) {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return;
    }

    // Local fallback
    const current = await this.getAddresses();
    const filtered = current.filter((a) => a.id !== id);
    localStorage.setItem(LOCAL_STORAGE_ADDRESSES_KEY, JSON.stringify(filtered));
  },
};
