import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getDeviceId(): string {
  let id = localStorage.getItem('bharat_virasat_device_id') || localStorage.getItem('digital_bharat_device_id');
  if (!id) {
    id = `bv_device_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
  localStorage.setItem('bharat_virasat_device_id', id);
  return id;
}
