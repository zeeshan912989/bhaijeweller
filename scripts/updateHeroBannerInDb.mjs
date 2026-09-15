import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bbpzmxdnitdwlvlwbric.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicHpteGRuaXRkd2x2bHdicmljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODQyNjM3NiwiZXhwIjoyMTA0MDAyMzc2fQ.vKPB-ql4d2xohLsnuTswfdM9-JI__m8zxwlruyVhoB0";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateHero() {
  const updatedValue = {
    title: "More Than Just Jewellery",
    subtitle: "Timeless pieces for your most precious moments.",
    ctaText: "Explore Collection",
    ctaHref: "/collections",
    imageSrc: "/hero_desktop.jpg",
  };
  const { error } = await supabase.from("site_settings").upsert({ key: "hero_banner", value: updatedValue });
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("✅ Supabase hero_banner updated to 'More Than Just Jewellery' & '/hero_desktop.jpg'");
  }
}

updateHero();
