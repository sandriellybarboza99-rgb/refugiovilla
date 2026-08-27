import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lonvjttovtswfmervcyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbnZqdHRvdnRzd2ZtZXJ2Y3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MjkwOTUsImV4cCI6MjEwMzQwNTA5NX0.kbRrowu5SEfiu79lghnxBZ4j4K6NCQjgJHpsUMTy8vQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
