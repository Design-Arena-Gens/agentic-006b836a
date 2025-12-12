import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const reports = db.prepare(`
    SELECT r.*, s.name as schoolName
    FROM reports r
    LEFT JOIN schools s ON r.schoolId = s.id
    ORDER BY r.createdAt DESC
  `).all();
  return NextResponse.json({ reports });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, content, reportType, reportDate, schoolId, status } = body;

    const result = db.prepare(
      'INSERT INTO reports (title, content, reportType, reportDate, schoolId, status, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(title, content, reportType, reportDate, schoolId || null, status || 'قيد المراجعة', user.id);

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
    const { id, title, content, reportType, reportDate, schoolId, status } = body;

    db.prepare(
      'UPDATE reports SET title = ?, content = ?, reportType = ?, reportDate = ?, schoolId = ?, status = ? WHERE id = ?'
    ).run(title, content, reportType, reportDate, schoolId || null, status, id);

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

    db.prepare('DELETE FROM reports WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
