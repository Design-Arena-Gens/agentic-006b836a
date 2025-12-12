'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function TransmissionsPage() {
  const [transmissions, setTransmissions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fromDepartment: '',
    toDepartment: '',
    subject: '',
    content: '',
    transmissionDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    status: 'مرسل',
  });

  useEffect(() => {
    loadTransmissions();
  }, []);

  const loadTransmissions = async () => {
    const res = await fetch('/api/transmissions');
    const data = await res.json();
    setTransmissions(data.transmissions || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = '/api/transmissions';
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...formData, id: editingId } : formData;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setShowForm(false);
    setEditingId(null);
    setFormData({
      fromDepartment: '',
      toDepartment: '',
      subject: '',
      content: '',
      transmissionDate: new Date().toISOString().split('T')[0],
      referenceNumber: '',
      status: 'مرسل',
    });
    loadTransmissions();
  };

  const handleEdit = (transmission: any) => {
    setFormData({
      fromDepartment: transmission.fromDepartment,
      toDepartment: transmission.toDepartment,
      subject: transmission.subject,
      content: transmission.content || '',
      transmissionDate: transmission.transmissionDate,
      referenceNumber: transmission.referenceNumber || '',
      status: transmission.status,
    });
    setEditingId(transmission.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الإرسال؟')) {
      await fetch(`/api/transmissions?id=${id}`, { method: 'DELETE' });
      loadTransmissions();
    }
  };

  return (
    <DashboardLayout title="جداول الإرسال">
      <div className="space-y-6">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              fromDepartment: '',
              toDepartment: '',
              subject: '',
              content: '',
              transmissionDate: new Date().toISOString().split('T')[0],
              referenceNumber: '',
              status: 'مرسل',
            });
          }}
          className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus size={20} />
          إضافة إرسال جديد
        </button>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'تعديل إرسال' : 'إضافة إرسال جديد'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">من (القسم)</label>
                  <input
                    type="text"
                    value={formData.fromDepartment}
                    onChange={(e) => setFormData({ ...formData, fromDepartment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">إلى (القسم)</label>
                  <input
                    type="text"
                    value={formData.toDepartment}
                    onChange={(e) => setFormData({ ...formData, toDepartment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">تاريخ الإرسال</label>
                  <input
                    type="date"
                    value={formData.transmissionDate}
                    onChange={(e) => setFormData({ ...formData, transmissionDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">رقم المرجع</label>
                  <input
                    type="text"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">الحالة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-gray-800"
                  >
                    <option value="مرسل">مرسل</option>
                    <option value="قيد الانتظار">قيد الانتظار</option>
                    <option value="مستلم">مستلم</option>
                    <option value="معالج">معالج</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الموضوع</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">المحتوى</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-gray-800"
                  rows={5}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  {editingId ? 'تحديث' : 'حفظ'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم المرجع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">من</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إلى</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الموضوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transmissions.map((transmission) => (
                  <tr key={transmission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transmission.referenceNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transmission.fromDepartment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transmission.toDepartment}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{transmission.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transmission.transmissionDate).toLocaleDateString('ar')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transmission.status === 'مستلم'
                            ? 'bg-blue-100 text-blue-800'
                            : transmission.status === 'معالج'
                            ? 'bg-green-100 text-green-800'
                            : transmission.status === 'قيد الانتظار'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {transmission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(transmission)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(transmission.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
