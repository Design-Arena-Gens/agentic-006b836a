import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  // Get appointments within the next 24 hours that haven't been reminded
  const appointments = db.prepare(
    `SELECT * FROM appointments
     WHERE appointmentDate BETWEEN datetime('now') AND datetime('now', '+24 hours')
     AND reminderSent = 0
     AND status != 'منتهي'
     ORDER BY appointmentDate ASC`
  ).all();

  // Mark as reminded
  if (appointments.length > 0) {
    const ids = (appointments as any[]).map(a => a.id);
    db.prepare(`UPDATE appointments SET reminderSent = 1 WHERE id IN (${ids.join(',')})`).run();
  }

  return NextResponse.json({ reminders: appointments });
}
