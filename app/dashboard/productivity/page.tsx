'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Trash2, Calculator } from 'lucide-react';

export default function ProductivityPage() {
  const [productivity, setProductivity] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    entityType: 'مدير',
    entityId: '',
    score: '',
    period: '',
    notes: '',
  });

  useEffect(() => {
    loadProductivity();
    loadManagers();
    loadSchools();
  }, []);

  const loadProductivity = async () => {
    const res = await fetch('/api/productivity');
    const data = await res.json();
    setProductivity(data.productivity || []);
  };

  const loadManagers = async () => {
    const res = await fetch('/api/managers');
    const data = await res.json();
    setManagers(data.managers || []);
  };

  const loadSchools = async () => {
    const res = await fetch('/api/schools');
    const data = await res.json();
    setSchools(data.schools || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/productivity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setShowForm(false);
    setFormData({ entityType: 'مدير', entityId: '', score: '', period: '', notes: '' });
    loadProductivity();
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      await fetch(`/api/productivity?id=${id}`, { method: 'DELETE' });
      loadProductivity();
    }
  };

  const getEntityName = (item: any) => {
    if (item.entityType === 'مدير') {
      const manager = managers.find((m) => m.id === item.entityId);
      return manager ? manager.name : `مدير #${item.entityId}`;
    } else {
      const school = schools.find((s) => s.id === item.entityId);
      return school ? school.name : `مدرسة #${item.entityId}`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout title="حساب المردودية">
      <div className="space-y-6">
        <button
          onClick={() => {
            setShowForm(true);
            setFormData({ entityType: 'مدير', entityId: '', score: '', period: '', notes: '' });
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          إضافة حساب مردودية
        </button>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">حساب مردودية جديد</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">نوع الكيان</label>
                  <select
                    value={formData.entityType}
                    onChange={(e) => setFormData({ ...formData, entityType: e.target.value, entityId: '' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800"
                  >
                    <option value="مدير">مدير</option>
                    <option value="مدرسة">مدرسة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {formData.entityType === 'مدير' ? 'المدير' : 'المدرسة'}
                  </label>
                  <select
                    value={formData.entityId}
                    onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800"
                    required
                  >
                    <option value="">اختر...</option>
                    {formData.entityType === 'مدير'
                      ? managers.map((manager) => (
                          <option key={manager.id} value={manager.id}>
                            {manager.name}
                          </option>
                        ))
                      : schools.map((school) => (
                          <option key={school.id} value={school.id}>
                            {school.name}
                          </option>
                        ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">النقاط (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">الفترة</label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800"
                    placeholder="مثال: الربع الأول 2024"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">ملاحظات</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800"
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  حفظ
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productivity.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="text-indigo-600" size={24} />
                  <span className="text-sm font-semibold text-gray-600">{item.entityType}</span>
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2">{getEntityName(item)}</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">النقاط:</span>
                  <span className={`text-3xl font-bold ${getScoreColor(item.score)}`}>{item.score}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      item.score >= 80
                        ? 'bg-green-500'
                        : item.score >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600 pt-2">
                  <strong>الفترة:</strong> {item.period}
                </p>

                {item.notes && (
                  <p className="text-sm text-gray-600">
                    <strong>ملاحظات:</strong> {item.notes}
                  </p>
                )}

                <p className="text-xs text-gray-500 pt-2">
                  {new Date(item.calculatedAt).toLocaleString('ar')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
