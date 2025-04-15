import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = 'https://njlgkfapvajltajgottj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qbGdrZmFwdmFqbHRhamdvdHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTEwODYsImV4cCI6MjA2MDIyNzA4Nn0.BfyhKoBjUy6G7CxDzMpSNlpvfB4SBimIlVKUAOIdVHE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

