import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const appointments = db.prepare(
    `SELECT * FROM appointments
     WHERE appointmentDate >= datetime('now')
     AND status != 'منتهي'
     ORDER BY appointmentDate ASC
     LIMIT 10`
  ).all();

  return NextResponse.json({ appointments });
}
