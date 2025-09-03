import { createClient } from '@supabase/supabase-js';

// Récupère les variables d'environnement (voir étape suivante)
const supabaseUrl = "https://xqlohamplcdwfxpbmkje.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxbG9oYW1wbGNkd2Z4cGJta2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4ODYxMTYsImV4cCI6MjA3MjQ2MjExNn0.B_iptqI2W6NCG2C2Ce1i0IFqh3katqTQKW2Azpmlx3U";

export const supabase = createClient(supabaseUrl, supabaseKey);
