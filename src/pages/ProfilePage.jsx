import { useAuth } from '../hooks/useAuth.js';

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="cinehub-page relative overflow-hidden rounded-3xl border border-[#303030] bg-[#111111] p-6 shadow-2xl shadow-black/40 sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-700 via-brand-500 to-transparent" />
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">Account</p>
      <h1 className="text-3xl font-semibold tracking-tight text-white">Your Profile</h1>
      <p className="mt-3 text-slate-400">Manage your account and bookings.</p>
      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-[#0c0c0c] p-5 text-slate-200">
          <p className="text-sm text-slate-400">Name</p>
          <p className="mt-1 text-lg font-medium text-white">{user?.name || 'Guest'}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-[#0c0c0c] p-5 text-slate-200">
          <p className="text-sm text-slate-400">Email</p>
          <p className="mt-1 text-lg font-medium text-white">{user?.email || 'Not provided'}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
