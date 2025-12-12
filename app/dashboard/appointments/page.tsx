'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    appointmentDate: '',
    location: '',
    attendees: '',
    status: 'مجدول',
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    const res = await fetch('/api/appointments');
    const data = await res.json();
    setAppointments(data.appointments || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = '/api/appointments';
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...formData, id: editingId } : formData;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', description: '', appointmentDate: '', location: '', attendees: '', status: 'مجدول' });
    loadAppointments();
  };

  const handleEdit = (appointment: any) => {
    setFormData({
      title: appointment.title,
      description: appointment.description || '',
      appointmentDate: appointment.appointmentDate.replace(' ', 'T').substring(0, 16),
      location: appointment.location || '',
      attendees: appointment.attendees || '',
      status: appointment.status,
    });
    setEditingId(appointment.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
      await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
      loadAppointments();
    }
  };

  return (
    <DashboardLayout title="المواعيد والاجتماعات">
      <div className="space-y-6">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ title: '', description: '', appointmentDate: '', location: '', attendees: '', status: 'مجدول' });
          }}
          className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus size={20} />
          إضافة موعد جديد
        </button>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'تعديل موعد' : 'إضافة موعد جديد'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">العنوان</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">التاريخ والوقت</label>
                <input
                  type="datetime-local"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">المكان</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الحضور</label>
                <input
                  type="text"
                  value={formData.attendees}
                  onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-800"
                  placeholder="مثال: أحمد، محمد، فاطمة"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الحالة</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-800"
                >
                  <option value="مجدول">مجدول</option>
                  <option value="قيد التنفيذ">قيد التنفيذ</option>
                  <option value="منتهي">منتهي</option>
                  <option value="ملغي">ملغي</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-800"
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
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
          {appointments.map((appointment) => {
            const appointmentDate = new Date(appointment.appointmentDate);
            const isUpcoming = appointmentDate > new Date();

            return (
              <div
                key={appointment.id}
                className={`bg-white rounded-xl shadow-lg p-6 ${
                  isUpcoming ? 'border-r-4 border-teal-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="text-teal-600" size={24} />
                      <h3 className="text-xl font-bold text-gray-800">{appointment.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          appointment.status === 'مجدول'
                            ? 'bg-blue-100 text-blue-800'
                            : appointment.status === 'قيد التنفيذ'
                            ? 'bg-yellow-100 text-yellow-800'
                            : appointment.status === 'منتهي'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <div className="text-gray-600 space-y-1">
                      <p>
                        <strong>التاريخ:</strong>{' '}
                        {appointmentDate.toLocaleDateString('ar', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}{' '}
                        - {appointmentDate.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {appointment.location && (
                        <p>
                          <strong>المكان:</strong> {appointment.location}
                        </p>
                      )}
                      {appointment.attendees && (
                        <p>
                          <strong>الحضور:</strong> {appointment.attendees}
                        </p>
                      )}
                      {appointment.description && (
                        <p>
                          <strong>الوصف:</strong> {appointment.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(appointment)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDelete(appointment.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
