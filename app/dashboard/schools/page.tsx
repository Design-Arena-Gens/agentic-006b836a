'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    principalName: '',
    phone: '',
    studentCount: '',
    teacherCount: '',
    notes: '',
  });

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    const res = await fetch('/api/schools');
    const data = await res.json();
    setSchools(data.schools || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = '/api/schools';
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...formData, id: editingId } : formData;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', location: '', principalName: '', phone: '', studentCount: '', teacherCount: '', notes: '' });
    loadSchools();
  };

  const handleEdit = (school: any) => {
    setFormData({
      name: school.name,
      location: school.location || '',
      principalName: school.principalName || '',
      phone: school.phone || '',
      studentCount: school.studentCount || '',
      teacherCount: school.teacherCount || '',
      notes: school.notes || '',
    });
    setEditingId(school.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه المدرسة؟')) {
      await fetch(`/api/schools?id=${id}`, { method: 'DELETE' });
      loadSchools();
    }
  };

  return (
    <DashboardLayout title="معلومات الابتدائيات">
      <div className="space-y-6">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', location: '', principalName: '', phone: '', studentCount: '', teacherCount: '', notes: '' });
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          إضافة مدرسة جديدة
        </button>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'تعديل مدرسة' : 'إضافة مدرسة جديدة'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">اسم المدرسة</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الموقع</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">اسم المدير</label>
                <input
                  type="text"
                  value={formData.principalName}
                  onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الهاتف</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">عدد الطلاب</label>
                <input
                  type="number"
                  value={formData.studentCount}
                  onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">عدد المعلمين</label>
                <input
                  type="number"
                  value={formData.teacherCount}
                  onChange={(e) => setFormData({ ...formData, teacherCount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">ملاحظات</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div key={school.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800">{school.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(school)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(school.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                {school.location && <p><strong>الموقع:</strong> {school.location}</p>}
                {school.principalName && <p><strong>المدير:</strong> {school.principalName}</p>}
                {school.phone && <p><strong>الهاتف:</strong> {school.phone}</p>}
                <div className="flex gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-gray-500">الطلاب</p>
                    <p className="text-lg font-bold text-green-600">{school.studentCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">المعلمين</p>
                    <p className="text-lg font-bold text-blue-600">{school.teacherCount || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
