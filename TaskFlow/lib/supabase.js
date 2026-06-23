import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zoyoyofdslnvjmwyzprp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpveW95b2Zkc2xudmptd3l6cHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTcyNTUsImV4cCI6MjA5Nzc3MzI1NX0.BmmRDE0L4w5x6xEK5N2SYP3HZ6hST013iptlJm7EJfI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);