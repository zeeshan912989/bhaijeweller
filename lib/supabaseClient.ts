import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bbpzmxdnitdwlvlwbric.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicHpteGRuaXRkd2x2bHdicmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MjYzNzYsImV4cCI6MjEwNDAwMjM3Nn0.4FrP1l5ZzKfivSPaqVvHjb7vdzSPqz2vIeu2SVWGMUE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
