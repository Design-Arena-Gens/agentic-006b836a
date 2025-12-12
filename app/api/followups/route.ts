import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const followups = db.prepare(`
    SELECT f.*, m.name as managerName, m.position as managerPosition
    FROM followups f
    LEFT JOIN managers m ON f.managerId = m.id
    ORDER BY f.createdAt DESC
  `).all();
  return NextResponse.json({ followups });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await request.json();
    const { managerId, followupDate, notes, status, nextActionDate } = body;

    const result = db.prepare(
      'INSERT INTO followups (managerId, followupDate, notes, status, nextActionDate, createdBy) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(managerId, followupDate, notes, status || 'معلق', nextActionDate || null, user.id);

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
    const { id, managerId, followupDate, notes, status, nextActionDate } = body;

    db.prepare(
      'UPDATE followups SET managerId = ?, followupDate = ?, notes = ?, status = ?, nextActionDate = ? WHERE id = ?'
    ).run(managerId, followupDate, notes, status, nextActionDate || null, id);

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

    db.prepare('DELETE FROM followups WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
