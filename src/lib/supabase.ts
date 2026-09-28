import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://amfbcleycpyvtexsnchs.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZmJjbGV5Y3B5dnRleHNuY2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3NjY4NzcsImV4cCI6MjEwNDM0Mjg3N30.Y_RjiDYt8lZepwlkD78Pd2nLyJgEJginidEJyVIokqk';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_ANON_KEY;

// Safe initialization to guarantee the bundle never crashes on load
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getDeviceId(): string {
  let id =
    localStorage.getItem('bharat_virasat_device_id') ||
    localStorage.getItem('digital_bharat_device_id');
  if (!id) {
    id = `bv_device_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
  localStorage.setItem('bharat_virasat_device_id', id);
  return id;
}
