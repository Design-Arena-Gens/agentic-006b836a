'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Mail, Send } from 'lucide-react';

export default function EmailsPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    bodyText: '',
    sendNow: false,
  });

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    const res = await fetch('/api/emails');
    const data = await res.json();
    setEmails(data.emails || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(formData.sendNow ? 'تم إرسال البريد الإلكتروني بنجاح!' : 'تم حفظ البريد الإلكتروني');
        setShowForm(false);
        setFormData({ recipient: '', subject: '', bodyText: '', sendNow: false });
        loadEmails();
      } else {
        setMessage(data.error || 'حدث خطأ');
      }
    } catch (error) {
      setMessage('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="إرسال رسائل Gmail">
      <div className="space-y-6">
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.includes('نجاح') || message.includes('حفظ')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        <div className="bg-blue-100 border border-blue-400 text-blue-800 p-4 rounded-lg">
          <p className="font-semibold mb-2">ملاحظة مهمة:</p>
          <p className="text-sm">
            لإرسال رسائل عبر Gmail، يجب تكوين بيانات الاعتماد في ملف .env.local:
            <br />
            - GMAIL_USER: عنوان بريدك الإلكتروني
            <br />
            - GMAIL_APP_PASSWORD: كلمة مرور التطبيق (يمكن إنشاؤها من إعدادات حساب Google)
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setFormData({ recipient: '', subject: '', bodyText: '', sendNow: false });
          }}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus size={20} />
          إنشاء رسالة جديدة
        </button>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">رسالة جديدة</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">إلى (البريد الإلكتروني)</label>
                <input
                  type="email"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-800"
                  required
                  placeholder="example@gmail.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الموضوع</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الرسالة</label>
                <textarea
                  value={formData.bodyText}
                  onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-800"
                  rows={6}
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sendNow"
                  checked={formData.sendNow}
                  onChange={(e) => setFormData({ ...formData, sendNow: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="sendNow" className="text-gray-700">
                  إرسال الآن
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {formData.sendNow ? (
                    <>
                      <Send size={18} />
                      {loading ? 'جارٍ الإرسال...' : 'إرسال'}
                    </>
                  ) : (
                    'حفظ كمسودة'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <h3 className="text-xl font-bold text-gray-800 p-6 border-b">الرسائل المحفوظة</h3>
          <div className="divide-y">
            {emails.map((email) => (
              <div key={email.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Mail className="text-red-600 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">{email.subject}</p>
                      <p className="text-sm text-gray-600">إلى: {email.recipient}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(email.createdAt).toLocaleString('ar')}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      email.status === 'مرسل'
                        ? 'bg-green-100 text-green-800'
                        : email.status === 'فشل'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {email.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
