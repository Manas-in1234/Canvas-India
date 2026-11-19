'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api-client';
import { useAuth } from '@/lib/auth/auth-context';
import { usePermission } from '@/lib/auth/use-permission';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function StorePoliciesCard() {
  const { hasPermission } = usePermission();
  const canManage = hasPermission('store_settings.manage');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get<Record<string, string>>('/admin/store-settings')
      .then((settings) => setMinOrderValue(settings.min_order_value ?? ''))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!hasPermission('store_settings.view')) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put('/admin/store-settings', { min_order_value: minOrderValue.trim() || null });
      toast.success('Store policies updated');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update store policies');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-base">Store Policies</CardTitle>
        <CardDescription>Store-wide checkout rules.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="minOrderValue">Minimum order value (₹)</Label>
          <Input
            id="minOrderValue"
            type="number"
            min={0}
            placeholder="No minimum"
            value={minOrderValue}
            disabled={loading || !canManage}
            onChange={(e) => setMinOrderValue(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Customers must have at least this much in their cart (before shipping/tax) to check out. Leave empty to disable.
          </p>
        </div>
        {canManage && (
          <Button onClick={handleSave} disabled={loading || saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function EmailDeliveryCard() {
  const { hasPermission } = usePermission();
  const canManage = hasPermission('store_settings.manage');
  const [apiKey, setApiKey] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get<Record<string, string>>('/admin/store-settings')
      .then((settings) => {
        setApiKey(settings.resend_api_key ?? '');
        setFromEmail(settings.resend_from_email ?? '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!hasPermission('store_settings.view')) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put('/admin/store-settings', {
        resend_api_key: apiKey.trim(),
        resend_from_email: fromEmail.trim(),
      });
      toast.success('Email settings updated');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update email settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-base">Email Delivery (Resend)</CardTitle>
        <CardDescription>
          Configures email sending for admin onboarding credentials and customer broadcasts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resendApiKey">Resend API Key</Label>
          <Input
            id="resendApiKey"
            type="password"
            placeholder="re_xxxxxxxxxxxxxxxxxxxx"
            value={apiKey}
            disabled={loading || !canManage}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Get your API key from <a href="https://resend.com/api-keys" target="_blank" rel="noreferrer" className="underline text-primary">resend.com</a>.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="resendFromEmail">Sender Email / Name</Label>
          <Input
            id="resendFromEmail"
            placeholder="Canvas India <admin@canvassindia.com>"
            value={fromEmail}
            disabled={loading || !canManage}
            onChange={(e) => setFromEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Must be a verified domain on Resend (e.g. <code>Canvas India &lt;admin@canvassindia.com&gt;</code>).
          </p>
        </div>
        {canManage && (
          <Button onClick={handleSave} disabled={loading || saving}>
            {saving ? 'Saving…' : 'Save Email Settings'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/auth/change-password', { currentPassword, newPassword });
      // The backend revokes every session (including this one) on a
      // successful change, so sign out locally and force a fresh login.
      await logout();
      router.replace('/login');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to change password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and store policies.</p>
      </div>

      <StorePoliciesCard />
      <EmailDeliveryCard />

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
          <CardDescription>
            Signed in as {user?.email}. Changing your password will sign you out of every device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Changing…' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
