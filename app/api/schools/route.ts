import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const schools = db.prepare('SELECT * FROM schools ORDER BY createdAt DESC').all();
  return NextResponse.json({ schools });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, location, principalName, phone, studentCount, teacherCount, notes } = body;

    const result = db.prepare(
      'INSERT INTO schools (name, location, principalName, phone, studentCount, teacherCount, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(name, location, principalName, phone, studentCount, teacherCount, notes);

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
    const { id, name, location, principalName, phone, studentCount, teacherCount, notes } = body;

    db.prepare(
      'UPDATE schools SET name = ?, location = ?, principalName = ?, phone = ?, studentCount = ?, teacherCount = ?, notes = ? WHERE id = ?'
    ).run(name, location, principalName, phone, studentCount, teacherCount, notes, id);

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

    db.prepare('DELETE FROM schools WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
