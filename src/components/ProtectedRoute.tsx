// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // تأكد من صحة مسار ملف تهيئة Firebase

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * مكون لحماية المسارات. يعيد التوجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مسجلاً.
 * @param children العناصر التي سيتم عرضها إذا كان المستخدم مسجلاً.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // مراقبة حالة مصادقة Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // إذا لم يكن هناك مستخدم مسجل دخول، أعد التوجيه إلى صفحة تسجيل الدخول
        navigate('/login', { replace: true });
      }
      setLoading(false); // تم الانتهاء من التحقق، يمكن عرض المحتوى أو إعادة التوجيه
    });

    // تنظيف الاشتراك عند إلغاء تحميل المكون لتجنب تسرب الذاكرة
    return () => unsubscribe();
  }, [navigate]); // تشغيل التأثير فقط إذا تغيرت دالة navigate

  if (loading) {
    // عرض رسالة تحميل أو مكون مؤشر تحميل أثناء التحقق من المصادقة
    return <div>جاري التحقق من المصادقة...</div>;
  }

  // إذا كان المستخدم مسجل دخول، اعرض العناصر الفرعية
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;