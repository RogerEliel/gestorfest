// pages/api/teste.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { data, error } = await supabase.from('usuarios').select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ usuarios: data });
}