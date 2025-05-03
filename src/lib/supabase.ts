import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xsalkjgevllriluawvcp.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey!)
export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
export const supabaseAnon = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY!)