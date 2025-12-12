import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const emails = db.prepare('SELECT * FROM emails ORDER BY createdAt DESC').all();
  return NextResponse.json({ emails });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await request.json();
    const { recipient, subject, bodyText, sendNow } = body;

    const result = db.prepare(
      'INSERT INTO emails (recipient, subject, body, status, createdBy) VALUES (?, ?, ?, ?, ?)'
    ).run(recipient, subject, bodyText, 'معلق', user.id);

    if (sendNow) {
      // Gmail sending is disabled for demo - requires nodemailer package
      db.prepare('UPDATE emails SET status = ? WHERE id = ?').run('محفوظ (الإرسال غير مفعل)', result.lastInsertRowid);
      return NextResponse.json({
        success: true,
        sent: false,
        id: result.lastInsertRowid,
        message: 'تم حفظ البريد الإلكتروني. ميزة الإرسال غير مفعلة في النسخة التجريبية.'
      });
    }

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
