import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xetmaltsgxnpyythngdv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldG1hbHRzZ3hucHl5dGhuZ2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NDg4MTksImV4cCI6MjA1NDMyNDgxOX0.mzcSh330WlV-xc_TeFD6vV2ImTFoT8Gq0J4qDdG69tY';

export const supabase = createClient(supabaseUrl, supabaseKey); 