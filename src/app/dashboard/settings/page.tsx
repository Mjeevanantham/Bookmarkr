'use client';

import { motion } from 'framer-motion';
import { Bell, Save, Slack, User } from 'lucide-react';
import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const [slackWebhook, setSlackWebhook] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    // Show toast notification here
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="mt-1 text-sm text-white/60">
            Manage your account and application preferences
          </p>
        </div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <User className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Profile</h2>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white">
                  U
                </div>
                <div>
                  <p className="font-medium text-white">User Name</p>
                  <p className="text-sm text-white/60">user@example.com</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <Bell className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-sm text-white/60">
                    Receive email updates about your bookmarks
                  </p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-indigo-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <Slack className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Integrations</h2>
            </div>
            <div className="mt-6 space-y-4">
              <Input
                label="Slack Webhook URL"
                placeholder="https://hooks.slack.com/services/..."
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
              />
              <p className="text-xs text-white/60">
                Connect your Slack workspace to receive bookmark notifications
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
              <h2 className="text-lg font-semibold text-white">Theme Color</h2>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-6 gap-3">
                {[
                  { name: 'Indigo', from: 'from-indigo-500', to: 'to-purple-600' },
                  { name: 'Blue', from: 'from-blue-500', to: 'to-cyan-600' },
                  { name: 'Green', from: 'from-green-500', to: 'to-emerald-600' },
                  { name: 'Pink', from: 'from-pink-500', to: 'to-rose-600' },
                  { name: 'Orange', from: 'from-orange-500', to: 'to-amber-600' },
                  { name: 'Purple', from: 'from-purple-500', to: 'to-fuchsia-600' },
                ].map((color) => (
                  <button
                    key={color.name}
                    className={`h-12 w-full rounded-lg bg-gradient-to-br ${color.from} ${color.to} transition-all hover:scale-105 hover:shadow-lg`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
