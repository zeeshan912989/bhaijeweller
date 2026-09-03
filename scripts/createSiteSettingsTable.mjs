import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bbpzmxdnitdwlvlwbric.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicHpteGRuaXRkd2x2bHdicmljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODQyNjM3NiwiZXhwIjoyMTA0MDAyMzc2fQ.vKPB-ql4d2xohLsnuTswfdM9-JI__m8zxwlruyVhoB0";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSiteSettingsTable() {
  const { data, error } = await supabase.from("site_settings").select("*").limit(1);
  if (error) {
    console.log("Note on site_settings table:", error.message);
  } else {
    console.log("✅ Table site_settings is active in Supabase.");
  }
}

checkSiteSettingsTable();
