import React, { useState } from 'react';
import { User, Mail, Save, CheckCircle2, Loader2 } from 'lucide-react';

export function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Demo User',
    email: 'user@example.com'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSaved(true);

    // Reset success message after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl mb-2">Settings</h1>
        <p className="text-secondary">Manage your account preferences and profile details.</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">Profile Information</h2>
            <p className="text-sm text-secondary">Update your personal details.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-hover border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-hover border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>

            {isSaved && (
              <div className="flex items-center gap-2 text-green-500 animate-in fade-in slide-in-from-left-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Saved successfully</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}