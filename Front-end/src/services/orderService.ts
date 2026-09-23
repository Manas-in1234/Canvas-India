import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order, OrderItem, PaymentRecord } from '../types/auth';

const LOCAL_STORAGE_ORDERS_KEY = 'ci_guest_orders';

export interface CreateOrderParams {
  userId?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    customizationDetails?: any;
  }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: any;
  shippingMethod: 'standard' | 'express';
  notes?: string;
}

export const orderService = {
  generateOrderNumber(): string {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `CI-${datePart}-${randomPart}`;
  },

  async createOrder(params: CreateOrderParams): Promise<Order> {
    const orderNumber = this.generateOrderNumber();
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        // 1. Insert order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([{
            order_number: orderNumber,
            user_id: params.userId || null,
            guest_email: params.guestEmail || null,
            guest_phone: params.guestPhone || null,
            status: 'confirmed',
            subtotal: params.subtotal,
            discount: params.discount,
            shipping_fee: params.shippingFee,
            tax: params.tax,
            total: params.total,
            shipping_address: params.shippingAddress,
            shipping_method: params.shippingMethod,
            notes: params.notes || null,
          }])
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Insert items
        const itemsToInsert = params.items.map((item) => ({
          order_id: orderData.id,
          product_id: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image_url: item.imageUrl || null,
          customization_details: item.customizationDetails || null,
        }));

        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsToInsert)
          .select();

        if (itemsError) throw itemsError;

        const completeOrder: Order = {
          ...orderData,
          items: itemsData as OrderItem[],
        };

        return completeOrder;
      } catch (err) {
        console.error('Failed to create order in Supabase:', err);
      }
    }

    // Local storage fallback for guests or development
    const localId = `ord-${Date.now()}`;
    const completeOrder: Order = {
      id: localId,
      order_number: orderNumber,
      user_id: params.userId,
      guest_email: params.guestEmail,
      guest_phone: params.guestPhone,
      status: 'confirmed',
      subtotal: params.subtotal,
      discount: params.discount,
      shipping_fee: params.shippingFee,
      tax: params.tax,
      total: params.total,
      shipping_address: params.shippingAddress,
      shipping_method: params.shippingMethod,
      notes: params.notes,
      created_at: now,
      updated_at: now,
      items: params.items.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        order_id: localId,
        product_id: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image_url: item.imageUrl,
        customization_details: item.customizationDetails,
        created_at: now,
      })),
    };

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      const orders: Order[] = stored ? JSON.parse(stored) : [];
      orders.unshift(completeOrder);
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save order locally:', e);
    }

    return completeOrder;
  },

  async recordPayment(
    orderId: string,
    payment: {
      userId?: string | null;
      amount: number;
      currency?: string;
      status: 'captured' | 'failed' | 'pending';
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
      errorMessage?: string;
    }
  ): Promise<PaymentRecord> {
    const paymentRecord: PaymentRecord = {
      order_id: orderId,
      user_id: payment.userId || null,
      amount: payment.amount,
      currency: payment.currency || 'INR',
      status: payment.status,
      razorpay_order_id: payment.razorpayOrderId,
      razorpay_payment_id: payment.razorpayPaymentId,
      razorpay_signature: payment.razorpaySignature,
      payment_method: 'Razorpay',
      error_message: payment.errorMessage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('payments')
          .insert([{
            order_id: paymentRecord.order_id,
            user_id: paymentRecord.user_id,
            amount: paymentRecord.amount,
            currency: paymentRecord.currency,
            status: paymentRecord.status,
            razorpay_order_id: paymentRecord.razorpay_order_id || null,
            razorpay_payment_id: paymentRecord.razorpay_payment_id || null,
            razorpay_signature: paymentRecord.razorpay_signature || null,
            payment_method: paymentRecord.payment_method,
            error_message: paymentRecord.error_message || null,
          }])
          .select()
          .single();

        if (error) throw error;
        return data as PaymentRecord;
      } catch (err) {
        console.error('Failed to record payment in Supabase:', err);
      }
    }

    return paymentRecord;
  },

  async getUserOrders(userId?: string): Promise<Order[]> {
    if (isSupabaseConfigured && userId) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(*),
            payment:payments(*)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []) as Order[];
      } catch (err) {
        console.error('Failed to fetch user orders from Supabase:', err);
      }
    }

    // Local storage fallback
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      const orders: Order[] = stored ? JSON.parse(stored) : [];
      if (userId) {
        return orders.filter((o) => o.user_id === userId);
      }
      return orders;
    } catch {
      return [];
    }
  },

  async getOrderById(orderIdOrNumber: string): Promise<Order | null> {
    if (isSupabaseConfigured) {
      try {
        const query = supabase
          .from('orders')
          .select(`
            *,
            items:order_items(*),
            payment:payments(*)
          `);

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdOrNumber);
        const { data, error } = isUuid
          ? await query.eq('id', orderIdOrNumber).single()
          : await query.eq('order_number', orderIdOrNumber).single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching order:', error);
        }
        if (data) return data as Order;
      } catch (err) {
        console.error('Failed to query order by ID in Supabase:', err);
      }
    }

    // Local storage fallback
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      const orders: Order[] = stored ? JSON.parse(stored) : [];
      const found = orders.find(
        (o) => o.id === orderIdOrNumber || o.order_number === orderIdOrNumber
      );
      return found || null;
    } catch {
      return null;
    }
  },
};
