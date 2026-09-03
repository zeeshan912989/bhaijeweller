import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bbpzmxdnitdwlvlwbric.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicHpteGRuaXRkd2x2bHdicmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MjYzNzYsImV4cCI6MjEwNDAwMjM3Nn0.4FrP1l5ZzKfivSPaqVvHjb7vdzSPqz2vIeu2SVWGMUE";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicHpteGRuaXRkd2x2bHdicmljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODQyNjM3NiwiZXhwIjoyMTA0MDAyMzc2fQ.vKPB-ql4d2xohLsnuTswfdM9-JI__m8zxwlruyVhoB0";

async function verifyAllTables() {
  console.log("==========================================");
  console.log("Verifying Supabase Tables After SQL Run...");
  console.log("==========================================");

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const tablesToCheck = ["products", "orders", "customers", "coupons"];

  for (const table of tablesToCheck) {
    const { data, error, count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: false })
      .limit(5);

    if (error) {
      console.log(`❌ Table '${table}': ERROR -> ${error.message} (Code: ${error.code})`);
    } else {
      console.log(`✅ Table '${table}': ONLINE & VERIFIED (Current rows count: ${data.length})`);
    }
  }

  console.log("==========================================");
}

verifyAllTables();
