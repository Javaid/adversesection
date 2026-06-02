import { useState } from 'react';
import { useTenantSubdomainValidation } from '../hooks/useTenantSubdomainValidation';

const Settings = () => {
  // 🔐 SECURITY: Validate user's tenant matches the URL subdomain
  useTenantSubdomainValidation();

  const [fullName, setFullName] = useState('Marcus Thorne');
  const [email, setEmail] = useState('m.thorne@naviquis.com');
  const [professionalTitle, setProfessionalTitle] = useState('Compliance Officer');
  const [department, setDepartment] = useState('Risk Management');
  const [userRole, setUserRole] = useState('Super Admin');
  const [timezone, setTimezone] = useState('Eastern Standard Time (EST)');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log('Profile saved:', {
      fullName,
      email,
      professionalTitle,
      department,
      userRole,
      timezone,
    });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    console.log('Password updated');

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account preferences and compliance alert systems.
        </p>
      </div>

      {/* ACCOUNT INFORMATION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            Account Information
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Update your personal details and professional profile.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Professional Title
              </label>
              <input
                type="text"
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                User Role
              </label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option>Eastern Standard Time (EST)</option>
                <option>Central Standard Time (CST)</option>
                <option>Mountain Standard Time (MST)</option>
                <option>Pacific Standard Time (PST)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* SECURITY */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            Security
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your account security and password settings.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* INFO BOX */}
    

    </div>
  );
};

export default Settings;