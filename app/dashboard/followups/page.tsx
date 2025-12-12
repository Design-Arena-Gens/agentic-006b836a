'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    managerId: '',
    followupDate: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'معلق',
    nextActionDate: '',
  });

  useEffect(() => {
    loadFollowups();
    loadManagers();
  }, []);

  const loadFollowups = async () => {
    const res = await fetch('/api/followups');
    const data = await res.json();
    setFollowups(data.followups || []);
  };

  const loadManagers = async () => {
    const res = await fetch('/api/managers');
    const data = await res.json();
    setManagers(data.managers || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = '/api/followups';
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
      managerId: '',
      followupDate: new Date().toISOString().split('T')[0],
      notes: '',
      status: 'معلق',
      nextActionDate: '',
    });
    loadFollowups();
  };

  const handleEdit = (followup: any) => {
    setFormData({
      managerId: followup.managerId,
      followupDate: followup.followupDate,
      notes: followup.notes || '',
      status: followup.status,
      nextActionDate: followup.nextActionDate || '',
    });
    setEditingId(followup.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه المتابعة؟')) {
      await fetch(`/api/followups?id=${id}`, { method: 'DELETE' });
      loadFollowups();
    }
  };

  return (
    <DashboardLayout title="متابعة المدراء">
      <div className="space-y-6">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              managerId: '',
              followupDate: new Date().toISOString().split('T')[0],
              notes: '',
              status: 'معلق',
              nextActionDate: '',
            });
          }}
          className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <Plus size={20} />
          إضافة متابعة جديدة
        </button>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'تعديل متابعة' : 'إضافة متابعة جديدة'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">المدير</label>
                  <select
                    value={formData.managerId}
                    onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-800"
                    required
                  >
                    <option value="">اختر مديراً</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} - {manager.position}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">تاريخ المتابعة</label>
                  <input
                    type="date"
                    value={formData.followupDate}
                    onChange={(e) => setFormData({ ...formData, followupDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">الحالة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-800"
                  >
                    <option value="معلق">معلق</option>
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                    <option value="مكتمل">مكتمل</option>
                    <option value="متأخر">متأخر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">تاريخ الإجراء التالي</label>
                  <input
                    type="date"
                    value={formData.nextActionDate}
                    onChange={(e) => setFormData({ ...formData, nextActionDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">ملاحظات</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-800"
                  rows={4}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
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

        <div className="grid gap-4">
          {followups.map((followup) => (
            <div key={followup.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      {followup.managerName}
                    </h3>
                    <span className="text-sm text-gray-600">({followup.managerPosition})</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        followup.status === 'مكتمل'
                          ? 'bg-green-100 text-green-800'
                          : followup.status === 'قيد التنفيذ'
                          ? 'bg-blue-100 text-blue-800'
                          : followup.status === 'متأخر'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {followup.status}
                    </span>
                  </div>
                  <div className="text-gray-600 space-y-1">
                    <p>
                      <strong>تاريخ المتابعة:</strong>{' '}
                      {new Date(followup.followupDate).toLocaleDateString('ar')}
                    </p>
                    {followup.nextActionDate && (
                      <p>
                        <strong>الإجراء التالي:</strong>{' '}
                        {new Date(followup.nextActionDate).toLocaleDateString('ar')}
                      </p>
                    )}
                    {followup.notes && (
                      <p className="mt-2">
                        <strong>الملاحظات:</strong> {followup.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(followup)} className="text-blue-600 hover:text-blue-800">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(followup.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
