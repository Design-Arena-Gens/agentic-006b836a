'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    reportType: 'تفتيش عام',
    reportDate: new Date().toISOString().split('T')[0],
    schoolId: '',
    status: 'قيد المراجعة',
  });

  useEffect(() => {
    loadReports();
    loadSchools();
  }, []);

  const loadReports = async () => {
    const res = await fetch('/api/reports');
    const data = await res.json();
    setReports(data.reports || []);
  };

  const loadSchools = async () => {
    const res = await fetch('/api/schools');
    const data = await res.json();
    setSchools(data.schools || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = '/api/reports';
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
      title: '',
      content: '',
      reportType: 'تفتيش عام',
      reportDate: new Date().toISOString().split('T')[0],
      schoolId: '',
      status: 'قيد المراجعة',
    });
    loadReports();
  };

  const handleEdit = (report: any) => {
    setFormData({
      title: report.title,
      content: report.content,
      reportType: report.reportType,
      reportDate: report.reportDate,
      schoolId: report.schoolId || '',
      status: report.status,
    });
    setEditingId(report.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا التقرير؟')) {
      await fetch(`/api/reports?id=${id}`, { method: 'DELETE' });
      loadReports();
    }
  };

  return (
    <DashboardLayout title="تقارير المفتشية">
      <div className="space-y-6">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              title: '',
              content: '',
              reportType: 'تفتيش عام',
              reportDate: new Date().toISOString().split('T')[0],
              schoolId: '',
              status: 'قيد المراجعة',
            });
          }}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          إضافة تقرير جديد
        </button>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'تعديل تقرير' : 'إضافة تقرير جديد'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">عنوان التقرير</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">نوع التقرير</label>
                  <select
                    value={formData.reportType}
                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
                  >
                    <option value="تفتيش عام">تفتيش عام</option>
                    <option value="تفتيش إداري">تفتيش إداري</option>
                    <option value="تفتيش تربوي">تفتيش تربوي</option>
                    <option value="زيارة ميدانية">زيارة ميدانية</option>
                    <option value="متابعة">متابعة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">تاريخ التقرير</label>
                  <input
                    type="date"
                    value={formData.reportDate}
                    onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">المدرسة (اختياري)</label>
                  <select
                    value={formData.schoolId}
                    onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
                  >
                    <option value="">بدون مدرسة</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">الحالة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
                  >
                    <option value="قيد المراجعة">قيد المراجعة</option>
                    <option value="معتمد">معتمد</option>
                    <option value="مرسل">مرسل</option>
                    <option value="مؤرشف">مؤرشف</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">محتوى التقرير</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
                  rows={8}
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4 flex-1">
                  <FileText className="text-purple-600 mt-1" size={24} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{report.title}</h3>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                        {report.reportType}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          report.status === 'معتمد'
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'مرسل'
                            ? 'bg-blue-100 text-blue-800'
                            : report.status === 'مؤرشف'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <div className="text-gray-600 space-y-1 mb-3">
                      <p>
                        <strong>التاريخ:</strong>{' '}
                        {new Date(report.reportDate).toLocaleDateString('ar')}
                      </p>
                      {report.schoolName && (
                        <p>
                          <strong>المدرسة:</strong> {report.schoolName}
                        </p>
                      )}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{report.content}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(report)} className="text-blue-600 hover:text-blue-800">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(report.id)} className="text-red-600 hover:text-red-800">
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
