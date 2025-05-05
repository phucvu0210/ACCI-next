'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import { useAuthStore } from '@/store/auth';
import React from 'react';

const actions = [
  { icon: '/icons/register-individual.png', title: 'Register for', subtitle: 'Individual Customer', route: '/register', allowedRoles: ['reception'] },
  { icon: '/icons/register-corporate.png', title: 'Register for', subtitle: 'Corporate Customer', route: '/register_corporate', allowedRoles: ['reception'] },
  { icon: '/icons/issue.png', title: 'Issue', route: '/issue', allowedRoles: ['reception'] },
  { icon: '/icons/register-extension.png', title: 'Register Extension', route: '/register_extension', allowedRoles: ['reception'] },
  { icon: '/icons/certificate.png', title: 'Certificate', route: '/exam-form', allowedRoles: ['reception'] },
  { icon: '/icons/payment.png', title: 'Payment', route: '/payment', allowedRoles: ['accounting'] },
  { icon: '/icons/issue-extension.png', title: 'Issue Extension', route: '/issue_extension', allowedRoles: ['accounting'] },
  { icon: '/icons/record-result.png', title: 'Record Result', route: '/record_result', allowedRoles: ['data entry'] },
];

export default function Home() {
  const router = useRouter();
  // Lấy currentUser bên trong component
  const currentUser = useAuthStore((state) => state.user);

  const handleNavigation = (route) => {
    router.push(route);
  };

  // Kiểm tra nếu chưa đăng nhập
  if (!currentUser) {
    React.useEffect(() => {
      router.push(''); // Điều hướng về trang login (giả định login là '/login')
    }, [router]);
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-start pt-10 px-6 bg-[#faf6e8] text-black font-aftersick">
      {/* Logo ACCI */}
      <div className="text-[#e2725b] text-4xl self-start pl-6 mb-6">ACCI</div>

      {/* Title */}
      <h1 className="text-5xl mt-6 mb-14 tracking-wide">What do you want?</h1>

      {/* Grid buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl w-full">
        {actions.map((action, idx) => {
          const isAllowed = action.allowedRoles.includes(currentUser.chucVu.toLowerCase());
          return (
            <div key={idx} className="flex flex-col items-center text-center">
              <button
                onClick={() => isAllowed && handleNavigation(action.route)}
                disabled={!isAllowed}
                className={classNames(
                  'bg-[#f7dfad] rounded-xl p-5 shadow-lg transition-all duration-200 focus:outline-none',
                  {
                    'cursor-pointer hover:bg-[#f0d69e] hover:shadow-xl hover:scale-105': isAllowed,
                    'cursor-not-allowed opacity-50': !isAllowed,
                  }
                )}
              >
                <Image src={action.icon} alt={action.title} width={60} height={60} className="mx-auto" />
              </button>
              <div className="mt-3 text-base leading-tight">
                <div className="text-gray-800">{action.title}</div>
                {action.subtitle && (
                  <div className="font-semibold text-gray-900">{action.subtitle}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}