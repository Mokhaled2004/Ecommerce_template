'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, MapPin, Phone, LogOut, Heart, ShoppingBag, Settings, X, Eye, EyeOff, Shield, Bell } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<{ email: string; name: string; phone?: string; address?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', phone: '', address: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  
  // Email notifications state
  const [isManagingNotifications, setIsManagingNotifications] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
  });
  const [isNotificationSaving, setIsNotificationSaving] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Privacy & Data state
  const [isManagingPrivacy, setIsManagingPrivacy] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    allowMarketing: false,
    allowThirdParty: false,
    dataRetention: '12_months',
  });
  const [isPrivacySaving, setIsPrivacySaving] = useState(false);
  const [privacyMessage, setPrivacyMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          const savedAddress = typeof window !== 'undefined' ? localStorage.getItem('userAddress') : '';
          setUser({
            email: userData.email,
            name: userData.fullName,
            phone: userData.phoneNumber || '',
            address: userData.address || savedAddress || '',
          });
        } else if (response.status === 401) {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      window.location.href = '/';
    }
  };

  const handleEditClick = () => {
    setEditFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!editFormData.name.trim()) {
      setSaveMessage({ type: 'error', text: 'Name is required' });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editFormData.name,
          phone: editFormData.phone,
          address: editFormData.address,
        }),
      });

      if (response.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userAddress', editFormData.address);
        }
        
        setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
        setUser({
          email: user?.email || '',
          name: editFormData.name,
          phone: editFormData.phone,
          address: editFormData.address,
        });
        setTimeout(() => {
          setIsEditingProfile(false);
          setSaveMessage(null);
        }, 1500);
      } else {
        const error = await response.json();
        setSaveMessage({ type: 'error', text: error.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Save profile error:', error);
      setSaveMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMessage(null);
    
    if (!passwordFormData.currentPassword.trim()) {
      setPasswordMessage({ type: 'error', text: 'Current password is required' });
      return;
    }
    if (!passwordFormData.newPassword.trim()) {
      setPasswordMessage({ type: 'error', text: 'New password is required' });
      return;
    }
    if (passwordFormData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsPasswordSaving(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setIsChangingPassword(false);
          setPasswordMessage(null);
        }, 1500);
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Change password error:', error);
      setPasswordMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const fetchNotificationPrefs = async () => {
    // First check localStorage for saved preferences
    try {
      const saved = localStorage.getItem('notificationPrefs');
      if (saved) {
        setNotificationPrefs(JSON.parse(saved));
        return;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }

    // Fall back to API
    try {
      const response = await fetch('/api/auth/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotificationPrefs({
          orderUpdates: data.orderUpdates,
          promotions: data.promotions,
          newsletter: data.newsletter,
        });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleOpenNotifications = () => {
    fetchNotificationPrefs();
    setIsManagingNotifications(true);
  };

  const handleSaveNotifications = async () => {
    setNotificationMessage(null);
    setIsNotificationSaving(true);

    try {
      const response = await fetch('/api/auth/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderUpdates: notificationPrefs.orderUpdates,
          promotions: notificationPrefs.promotions,
          newsletter: notificationPrefs.newsletter,
        }),
      });

      if (response.ok) {
        // Save to localStorage as well
        if (typeof window !== 'undefined') {
          localStorage.setItem('notificationPrefs', JSON.stringify(notificationPrefs));
        }
        
        setNotificationMessage({ type: 'success', text: 'Notification preferences saved!' });
        setTimeout(() => {
          setIsManagingNotifications(false);
          setNotificationMessage(null);
        }, 1500);
      } else {
        const data = await response.json();
        setNotificationMessage({ type: 'error', text: data.error || 'Failed to save preferences' });
      }
    } catch (error) {
      console.error('Save notifications error:', error);
      setNotificationMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsNotificationSaving(false);
    }
  };

  const fetchPrivacySettings = async () => {
    // First check localStorage for saved settings
    try {
      const saved = localStorage.getItem('privacySettings');
      if (saved) {
        setPrivacySettings(JSON.parse(saved));
        return;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }

    // Fall back to API
    try {
      const response = await fetch('/api/auth/privacy');
      if (response.ok) {
        const data = await response.json();
        setPrivacySettings({
          allowMarketing: data.allowMarketing,
          allowThirdParty: data.allowThirdParty,
          dataRetention: data.dataRetention,
        });
      }
    } catch (error) {
      console.error('Failed to fetch privacy settings:', error);
    }
  };

  const handleOpenPrivacy = () => {
    fetchPrivacySettings();
    setIsManagingPrivacy(true);
  };

  const handleSavePrivacy = async () => {
    setPrivacyMessage(null);
    setIsPrivacySaving(true);

    try {
      const response = await fetch('/api/auth/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allowMarketing: privacySettings.allowMarketing,
          allowThirdParty: privacySettings.allowThirdParty,
          dataRetention: privacySettings.dataRetention,
        }),
      });

      if (response.ok) {
        // Save to localStorage as well
        if (typeof window !== 'undefined') {
          localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
        }
        
        setPrivacyMessage({ type: 'success', text: 'Privacy settings saved!' });
        setTimeout(() => {
          setIsManagingPrivacy(false);
          setPrivacyMessage(null);
        }, 1500);
      } else {
        const data = await response.json();
        setPrivacyMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Save privacy error:', error);
      setPrivacyMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsPrivacySaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#FDF6F8] to-[#F9F3F5] py-12 px-4 flex items-center justify-center">
        <div className="text-[#C8547A] font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FDF6F8] to-[#F9F3F5] py-12 px-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8547A]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8A0B0]/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#3B1A26] mb-2">My Account</h1>
          <p className="text-[#888]">Manage your profile, orders, and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg shadow-pink-100/50 border border-gray-100 p-6 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => scrollToSection('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors text-left ${
                    activeTab === 'profile' ? 'bg-pink-50 text-[#C8547A]' : 'text-[#1a1a1a] hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => scrollToSection('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors text-left ${
                    activeTab === 'orders' ? 'bg-pink-50 text-[#C8547A]' : 'text-[#1a1a1a] hover:bg-gray-50'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => scrollToSection('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors text-left ${
                    activeTab === 'wishlist' ? 'bg-pink-50 text-[#C8547A]' : 'text-[#1a1a1a] hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => scrollToSection('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors text-left ${
                    activeTab === 'settings' ? 'bg-pink-50 text-[#C8547A]' : 'text-[#1a1a1a] hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
              </nav>

              <hr className="my-4 border-gray-200" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition-colors text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <section id="profile" className="bg-white rounded-2xl shadow-lg shadow-pink-100/50 border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#3B1A26]">Profile Information</h2>
                <button 
                  onClick={handleEditClick}
                  className="px-4 py-2 border border-[#C8547A] text-[#C8547A] rounded-xl font-semibold hover:bg-pink-50 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-50 rounded-xl">
                    <Mail className="w-6 h-6 text-[#C8547A]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#888] font-semibold uppercase">Email Address</p>
                    <p className="text-lg font-semibold text-[#1a1a1a] mt-1">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-50 rounded-xl">
                    <User className="w-6 h-6 text-[#C8547A]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#888] font-semibold uppercase">Account Name</p>
                    <p className="text-lg font-semibold text-[#1a1a1a] mt-1">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-50 rounded-xl">
                    <Phone className="w-6 h-6 text-[#C8547A]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#888] font-semibold uppercase">Phone Number</p>
                    <p className="text-lg text-[#888] mt-1">{user.phone || 'Not added'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-50 rounded-xl">
                    <MapPin className="w-6 h-6 text-[#C8547A]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#888] font-semibold uppercase">Delivery Address</p>
                    <p className="text-lg text-[#888] mt-1">{user.address || 'Not added'}</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="orders" className="bg-white rounded-2xl shadow-lg shadow-pink-100/50 border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-[#3B1A26] mb-6">Recent Orders</h2>

              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-[#C8547A] mx-auto mb-4 opacity-50" />
                <p className="text-[#888] font-semibold mb-2">No orders yet</p>
                <p className="text-sm text-[#888] mb-6">Start shopping to see your orders here</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C8547A] to-[#b04468] hover:from-[#b04468] hover:to-[#a03d5a] text-white rounded-xl font-semibold transition-all shadow-md shadow-[#C8547A]/30"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Browse Shop
                </Link>
              </div>
            </section>

            <section id="wishlist" className="bg-white rounded-2xl shadow-lg shadow-pink-100/50 border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-[#3B1A26] mb-6">Wishlist</h2>

              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-[#C8547A] mx-auto mb-4 opacity-50" />
                <p className="text-[#888] font-semibold mb-2">Your wishlist is empty</p>
                <p className="text-sm text-[#888] mb-6">Add your favorite products to save for later</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C8547A] to-[#b04468] hover:from-[#b04468] hover:to-[#a03d5a] text-white rounded-xl font-semibold transition-all shadow-md shadow-[#C8547A]/30"
                >
                  <Heart className="w-5 h-5" />
                  Explore Products
                </Link>
              </div>
            </section>

            <section id="settings" className="bg-white rounded-2xl shadow-lg shadow-pink-100/50 border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-[#3B1A26] mb-6">Security & Settings</h2>

              <div className="space-y-4">
                <button 
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <Lock className="w-6 h-6 text-[#C8547A]" />
                    <div className="text-left">
                      <p className="font-semibold text-[#1a1a1a]">Change Password</p>
                      <p className="text-sm text-[#888]">Update your password regularly</p>
                    </div>
                  </div>
                  <span className="text-[#888] group-hover:text-[#C8547A] transition-colors">→</span>
                </button>

                <button 
                  onClick={handleOpenNotifications}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <Bell className="w-6 h-6 text-[#C8547A]" />
                    <div className="text-left">
                      <p className="font-semibold text-[#1a1a1a]">Email Notifications</p>
                      <p className="text-sm text-[#888]">Manage your notification preferences</p>
                    </div>
                  </div>
                  <span className="text-[#888] group-hover:text-[#C8547A] transition-colors">→</span>
                </button>

                <button 
                  onClick={handleOpenPrivacy}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <Shield className="w-6 h-6 text-[#C8547A]" />
                    <div className="text-left">
                      <p className="font-semibold text-[#1a1a1a]">Privacy & Data</p>
                      <p className="text-sm text-[#888]">Control your personal data</p>
                    </div>
                  </div>
                  <span className="text-[#888] group-hover:text-[#C8547A] transition-colors">→</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#3B1A26]">Change Password</h3>
              <button
                onClick={() => setIsChangingPassword(false)}
                disabled={isPasswordSaving}
                className="text-[#888] hover:text-[#C8547A] transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {passwordMessage && (
              <div
                className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordFormData.currentPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
                    disabled={isPasswordSaving}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8547A] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#C8547A]"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordFormData.newPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                    disabled={isPasswordSaving}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8547A] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#C8547A]"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordFormData.confirmPassword}
                    onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                    disabled={isPasswordSaving}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8547A] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#C8547A]"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsChangingPassword(false)}
                disabled={isPasswordSaving}
                className="flex-1 px-4 py-3 border border-gray-200 text-[#1a1a1a] rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isPasswordSaving}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#C8547A] to-[#b04468] hover:from-[#b04468] hover:to-[#a03d5a] text-white rounded-xl font-semibold transition-all shadow-md shadow-[#C8547A]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPasswordSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#3B1A26]">Edit Profile</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                disabled={isSaving}
                className="text-[#888] hover:text-[#C8547A] transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {saveMessage && (
              <div
                className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                  saveMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {saveMessage.text}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  disabled={isSaving}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8547A] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  disabled={isSaving}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8547A] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Delivery Address</label>
                <textarea
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  disabled={isSaving}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8547A] focus:border-transparent transition-all resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter your delivery address"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsEditingProfile(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-3 border border-gray-200 text-[#1a1a1a] rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#C8547A] to-[#b04468] hover:from-[#b04468] hover:to-[#a03d5a] text-white rounded-xl font-semibold transition-all shadow-md shadow-[#C8547A]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Notifications Modal */}
      {isManagingNotifications && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#3B1A26]">Email Notifications</h3>
              <button
                onClick={() => setIsManagingNotifications(false)}
                disabled={isNotificationSaving}
                className="text-[#888] hover:text-[#C8547A] transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {notificationMessage && (
              <div
                className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                  notificationMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {notificationMessage.text}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationPrefs.orderUpdates}
                  onChange={(e) => setNotificationPrefs({ ...notificationPrefs, orderUpdates: e.target.checked })}
                  disabled={isNotificationSaving}
                  className="w-5 h-5 text-[#C8547A] rounded cursor-pointer"
                />
                <div>
                  <p className="font-semibold text-[#1a1a1a]">Order Updates</p>
                  <p className="text-sm text-[#888]">Get notified about your orders</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationPrefs.promotions}
                  onChange={(e) => setNotificationPrefs({ ...notificationPrefs, promotions: e.target.checked })}
                  disabled={isNotificationSaving}
                  className="w-5 h-5 text-[#C8547A] rounded cursor-pointer"
                />
                <div>
                  <p className="font-semibold text-[#1a1a1a]">Promotions & Offers</p>
                  <p className="text-sm text-[#888]">Exclusive deals and discounts</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationPrefs.newsletter}
                  onChange={(e) => setNotificationPrefs({ ...notificationPrefs, newsletter: e.target.checked })}
                  disabled={isNotificationSaving}
                  className="w-5 h-5 text-[#C8547A] rounded cursor-pointer"
                />
                <div>
                  <p className="font-semibold text-[#1a1a1a]">Newsletter</p>
                  <p className="text-sm text-[#888]">Weekly updates and tips</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsManagingNotifications(false)}
                disabled={isNotificationSaving}
                className="flex-1 px-4 py-3 border border-gray-200 text-[#1a1a1a] rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotifications}
                disabled={isNotificationSaving}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#C8547A] to-[#b04468] hover:from-[#b04468] hover:to-[#a03d5a] text-white rounded-xl font-semibold transition-all shadow-md shadow-[#C8547A]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isNotificationSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Preferences'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy & Data Modal */}
      {isManagingPrivacy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#3B1A26]">Privacy & Data</h3>
              <button
                onClick={() => setIsManagingPrivacy(false)}
                disabled={isPrivacySaving}
                className="text-[#888] hover:text-[#C8547A] transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {privacyMessage && (
              <div
                className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                  privacyMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {privacyMessage.text}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.allowMarketing}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, allowMarketing: e.target.checked })}
                  disabled={isPrivacySaving}
                  className="w-5 h-5 text-[#C8547A] rounded cursor-pointer"
                />
                <div>
                  <p className="font-semibold text-[#1a1a1a]">Marketing Communications</p>
                  <p className="text-sm text-[#888]">Allow us to send marketing emails</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.allowThirdParty}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, allowThirdParty: e.target.checked })}
                  disabled={isPrivacySaving}
                  className="w-5 h-5 text-[#C8547A] rounded cursor-pointer"
                />
                <div>
                  <p className="font-semibold text-[#1a1a1a]">Third-Party Sharing</p>
                  <p className="text-sm text-[#888]">Allow third parties to use your data</p>
                </div>
              </label>

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-3">Data Retention Period</label>
                <select
                  value={privacySettings.dataRetention}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, dataRetention: e.target.value })}
                  disabled={isPrivacySaving}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8547A] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="3_months">3 Months</option>
                  <option value="12_months">12 Months (Default)</option>
                  <option value="24_months">24 Months</option>
                  <option value="indefinite">Indefinite</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsManagingPrivacy(false)}
                disabled={isPrivacySaving}
                className="flex-1 px-4 py-3 border border-gray-200 text-[#1a1a1a] rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrivacy}
                disabled={isPrivacySaving}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#C8547A] to-[#b04468] hover:from-[#b04468] hover:to-[#a03d5a] text-white rounded-xl font-semibold transition-all shadow-md shadow-[#C8547A]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPrivacySaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
