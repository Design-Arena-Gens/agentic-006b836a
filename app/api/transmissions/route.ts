import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const transmissions = db.prepare('SELECT * FROM transmissions ORDER BY createdAt DESC').all();
  return NextResponse.json({ transmissions });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await request.json();
    const { fromDepartment, toDepartment, subject, content, transmissionDate, referenceNumber, status } = body;

    const result = db.prepare(
      'INSERT INTO transmissions (fromDepartment, toDepartment, subject, content, transmissionDate, referenceNumber, status, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(fromDepartment, toDepartment, subject, content, transmissionDate, referenceNumber, status || 'مرسل', user.id);

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
    const { id, fromDepartment, toDepartment, subject, content, transmissionDate, referenceNumber, status } = body;

    db.prepare(
      'UPDATE transmissions SET fromDepartment = ?, toDepartment = ?, subject = ?, content = ?, transmissionDate = ?, referenceNumber = ?, status = ? WHERE id = ?'
    ).run(fromDepartment, toDepartment, subject, content, transmissionDate, referenceNumber, status, id);

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

    db.prepare('DELETE FROM transmissions WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
