import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const appointments = db.prepare('SELECT * FROM appointments ORDER BY appointmentDate DESC').all();
  return NextResponse.json({ appointments });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, appointmentDate, location, attendees } = body;

    const result = db.prepare(
      'INSERT INTO appointments (title, description, appointmentDate, location, attendees, createdBy) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(title, description, appointmentDate, location, attendees, user.id);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, title, description, appointmentDate, location, attendees, status } = body;

    db.prepare(
      'UPDATE appointments SET title = ?, description = ?, appointmentDate = ?, location = ?, attendees = ?, status = ? WHERE id = ?'
    ).run(title, description, appointmentDate, location, attendees, status, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    db.prepare('DELETE FROM appointments WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
