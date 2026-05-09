import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || "https://wlexyxpltllgtduxkjmy.supabase.co",
  process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZXh5eHBsdGxsZ3RkdXhram15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTU5NjAsImV4cCI6MjA5MzgzMTk2MH0.msmUTP6GGeF-Ri8gzdx8IVs7mGhxRZqPUJbbr8s1a2g"
);
