export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      logos: {
        Row: {
          id: string
          user_id: string
          prompt: string
          style: string
          image_url: string
          created_at: string
          company_name: string
          company_description: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          style: string
          image_url: string
          created_at?: string
          company_name: string
          company_description: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          style?: string
          image_url?: string
          created_at?: string
          company_name?: string
          company_description?: string
        }
      }
      stripe_customers: {
        Row: {
          id: number
          user_id: string
          customer_id: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: never
          user_id: string
          customer_id: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: never
          user_id?: string
          customer_id?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      stripe_subscriptions: {
        Row: {
          id: number
          customer_id: string
          subscription_id: string | null
          price_id: string | null
          current_period_start: number | null
          current_period_end: number | null
          cancel_at_period_end: boolean
          payment_method_brand: string | null
          payment_method_last4: string | null
          status: Database['public']['Enums']['stripe_subscription_status']
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: never
          customer_id: string
          subscription_id?: string | null
          price_id?: string | null
          current_period_start?: number | null
          current_period_end?: number | null
          cancel_at_period_end?: boolean
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          status: Database['public']['Enums']['stripe_subscription_status']
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: never
          customer_id?: string
          subscription_id?: string | null
          price_id?: string | null
          current_period_start?: number | null
          current_period_end?: number | null
          cancel_at_period_end?: boolean
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          status?: Database['public']['Enums']['stripe_subscription_status']
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      stripe_orders: {
        Row: {
          id: number
          checkout_session_id: string
          payment_intent_id: string
          customer_id: string
          amount_subtotal: number
          amount_total: number
          currency: string
          payment_status: string
          status: Database['public']['Enums']['stripe_order_status']
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: never
          checkout_session_id: string
          payment_intent_id: string
          customer_id: string
          amount_subtotal: number
          amount_total: number
          currency: string
          payment_status: string
          status?: Database['public']['Enums']['stripe_order_status']
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: never
          checkout_session_id?: string
          payment_intent_id?: string
          customer_id?: string
          amount_subtotal?: number
          amount_total?: number
          currency?: string
          payment_status?: string
          status?: Database['public']['Enums']['stripe_order_status']
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
    }
    Views: {
      stripe_user_subscriptions: {
        Row: {
          customer_id: string
          subscription_id: string | null
          subscription_status: Database['public']['Enums']['stripe_subscription_status']
          price_id: string | null
          current_period_start: number | null
          current_period_end: number | null
          cancel_at_period_end: boolean
          payment_method_brand: string | null
          payment_method_last4: string | null
        }
      }
      stripe_user_orders: {
        Row: {
          customer_id: string
          order_id: number
          checkout_session_id: string
          payment_intent_id: string
          amount_subtotal: number
          amount_total: number
          currency: string
          payment_status: string
          order_status: Database['public']['Enums']['stripe_order_status']
          order_date: string
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      stripe_subscription_status: 'not_started' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused'
      stripe_order_status: 'pending' | 'completed' | 'canceled'
    }
  }
}