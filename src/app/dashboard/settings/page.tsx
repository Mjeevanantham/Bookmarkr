'use client';

import { Loader2, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/client';
import { fetchProfile, updateProfile } from '@/services/profiles';
import type { Profile } from '@/types';

function getInitials(name: string | null, email: string) {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return email.slice(0, 2).toUpperCase();
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [slackWebhook, setSlackWebhook] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email ?? '');
        }

        const p = await fetchProfile();
        if (p) {
          setProfile(p);
          setDisplayName(p.full_name ?? user?.user_metadata?.full_name ?? '');
          setSlackWebhook(p.slack_webhook ?? '');
        }
      } catch {
        // silent — user sees empty form
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      const updated = await updateProfile({
        full_name: displayName.trim() || null,
        slack_webhook: slackWebhook.trim() || null,
      });

      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = profile?.avatar_url ?? '';
  const initials = getInitials(displayName || null, email);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>

        {/* Status alerts */}
        {saveSuccess && (
          <Alert>
            <AlertDescription>Settings saved successfully.</AlertDescription>
          </Alert>
        )}
        {saveError && (
          <Alert variant="destructive">
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* ── Profile Tab ───────────────────────────────────── */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your display name and view account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar preview */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarUrl} alt={displayName || email} />
                    <AvatarFallback className="text-lg">
                      {loading ? <User className="h-6 w-6" /> : initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{displayName || '(no name set)'}</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input
                    id="display-name"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    This is how your name appears across the app.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input id="settings-email" type="email" value={email} disabled />
                  <p className="text-xs text-muted-foreground">
                    Email is managed by your authentication provider (Google).
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Notifications Tab ─────────────────────────────── */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your bookmarks
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-digest">Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      A summary of your reading list every week
                    </p>
                  </div>
                  <Switch id="weekly-digest" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Integrations Tab ──────────────────────────────── */}
          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Slack Integration</CardTitle>
                <CardDescription>
                  Get bookmark reminders directly in your Slack workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slack-webhook">Incoming Webhook URL</Label>
                  <Input
                    id="slack-webhook"
                    placeholder="https://hooks.slack.com/services/..."
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Create a webhook in your Slack app settings and paste the URL here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveProfile} disabled={saving || loading}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
