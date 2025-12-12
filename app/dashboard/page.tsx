'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  School,
  FileText,
  Eye,
  Send,
  Calculator,
  Mail,
  Calendar,
  LogOut,
  Bell
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
    loadUpcomingAppointments();

    // Check for appointment reminders every minute
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/');
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      router.push('/');
    }
  };

  const loadUpcomingAppointments = async () => {
    try {
      const res = await fetch('/api/appointments/upcoming');
      if (res.ok) {
        const data = await res.json();
        setUpcomingAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const checkReminders = async () => {
    try {
      const res = await fetch('/api/appointments/check-reminders');
      if (res.ok) {
        const data = await res.json();
        if (data.reminders && data.reminders.length > 0) {
          data.reminders.forEach((reminder: any) => {
            if (Notification.permission === 'granted') {
              new Notification('تذكير بموعد', {
                body: `${reminder.title} - ${new Date(reminder.appointmentDate).toLocaleString('ar')}`,
                icon: '/icon.png'
              });
            } else {
              alert(`تذكير بموعد: ${reminder.title}`);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const menuItems = [
    { title: 'معلومات المديرين', icon: Users, path: '/dashboard/managers', color: 'from-blue-500 to-blue-600' },
    { title: 'معلومات الابتدائيات', icon: School, path: '/dashboard/schools', color: 'from-green-500 to-green-600' },
    { title: 'تقارير المفتشية', icon: FileText, path: '/dashboard/reports', color: 'from-purple-500 to-purple-600' },
    { title: 'متابعة المدراء', icon: Eye, path: '/dashboard/followups', color: 'from-yellow-500 to-yellow-600' },
    { title: 'جداول الإرسال', icon: Send, path: '/dashboard/transmissions', color: 'from-pink-500 to-pink-600' },
    { title: 'حساب المردودية', icon: Calculator, path: '/dashboard/productivity', color: 'from-indigo-500 to-indigo-600' },
    { title: 'إرسال رسائل Gmail', icon: Mail, path: '/dashboard/emails', color: 'from-red-500 to-red-600' },
    { title: 'المواعيد والاجتماعات', icon: Calendar, path: '/dashboard/appointments', color: 'from-teal-500 to-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                المفتش
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {upcomingAppointments.length > 0 && (
                <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
                  <Bell size={18} className="text-yellow-600" />
                  <span className="text-sm text-yellow-800 font-semibold">
                    {upcomingAppointments.length} مواعيد قادمة
                  </span>
                </div>
              )}
              <span className="text-gray-700 font-semibold">{user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                خروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">مرحباً بك في لوحة التحكم</h2>
          <p className="text-gray-600">اختر القسم الذي تريد الوصول إليه</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 group"
            >
              <div className={`bg-gradient-to-r ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
            </button>
          ))}
        </div>

        {upcomingAppointments.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="text-teal-600" />
              المواعيد القادمة
            </h3>
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{appointment.title}</p>
                    <p className="text-sm text-gray-600">{appointment.location}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-teal-600">
                      {new Date(appointment.appointmentDate).toLocaleDateString('ar')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.appointmentDate).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
