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
  const [codEnabledForCustomizer, setCodEnabledForCustomizer] = useState(false);
  const [codSurcharge, setCodSurcharge] = useState('');
  const [autoBookDelhivery, setAutoBookDelhivery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get<Record<string, string>>('/admin/store-settings')
      .then((settings) => {
        setMinOrderValue(settings.min_order_value ?? '');
        setCodEnabledForCustomizer(settings.cod_enabled_for_customizer === '1');
        setCodSurcharge(settings.cod_surcharge && settings.cod_surcharge !== '0' ? settings.cod_surcharge : '');
        setAutoBookDelhivery(settings.auto_book_delhivery === '1');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!hasPermission('store_settings.view')) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put('/admin/store-settings', {
        min_order_value: minOrderValue.trim() || null,
        cod_enabled_for_customizer: codEnabledForCustomizer,
        cod_surcharge: codSurcharge.trim() || null,
        auto_book_delhivery: autoBookDelhivery,
      });
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
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={codEnabledForCustomizer}
              disabled={loading || !canManage}
              onChange={(e) => setCodEnabledForCustomizer(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            Allow Cash on Delivery for customized products
          </label>
          <p className="text-xs text-muted-foreground">
            Off by default: an order containing a product built in the customizer must be paid online. Turn this on to let customers pay by COD for those too.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="codSurcharge">Cash on Delivery fee (₹)</Label>
          <Input
            id="codSurcharge"
            type="number"
            min={0}
            placeholder="No extra fee"
            value={codSurcharge}
            disabled={loading || !canManage}
            onChange={(e) => setCodSurcharge(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Extra flat amount added to any order paid by Cash on Delivery, on top of delivery charges. Leave empty for no extra fee.
          </p>
        </div>
        <div className="space-y-2 rounded-md border border-amber-300 bg-amber-50 p-3">
          <label className="flex items-center gap-2 text-sm font-medium text-amber-900">
            <input
              type="checkbox"
              checked={autoBookDelhivery}
              disabled={loading || !canManage}
              onChange={(e) => setAutoBookDelhivery(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            Automatically book with Delhivery when an order is placed
          </label>
          <p className="text-xs text-amber-900">
            Off by default. Only turn this on once your Delhivery account is confirmed active and the wallet is
            funded - if Delhivery rejects a booking (e.g. low wallet balance), the order still goes through fine,
            it just won't have a shipment yet and you'll need to book it manually from the order page.
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
  const { user } = useAuth();
  const canManage = hasPermission('store_settings.manage');
  const [apiKey, setApiKey] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

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

  const handleTestEmail = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a Resend API Key first and save it.');
      return;
    }
    setTesting(true);
    try {
      await apiClient.put('/admin/store-settings', {
        resend_api_key: apiKey.trim(),
        resend_from_email: fromEmail.trim(),
      });
      const res = await apiClient.post<{ success: boolean; message: string }>('/admin/test-email', {
        to: user?.email,
      });
      toast.success(res.message || `Test email sent to ${user?.email}!`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to send test email');
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-base">Email Delivery (Resend)</CardTitle>
        <CardDescription>
          Required for admin onboarding credentials emails and customer broadcasts.
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
            Get your free API key from <a href="https://resend.com/api-keys" target="_blank" rel="noreferrer" className="underline text-primary">resend.com</a>.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="resendFromEmail">Sender Email / Name</Label>
          <Input
            id="resendFromEmail"
            placeholder="Canvas India <onboarding@resend.dev>"
            value={fromEmail}
            disabled={loading || !canManage}
            onChange={(e) => setFromEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Use <code>onboarding@resend.dev</code> for testing, or your verified domain sender (e.g. <code>Canvas India &lt;admin@canvassindia.com&gt;</code>).
          </p>
        </div>
        {canManage && (
          <div className="flex items-center gap-2 pt-1">
            <Button onClick={handleSave} disabled={loading || saving || testing}>
              {saving ? 'Saving…' : 'Save Email Settings'}
            </Button>
            <Button variant="outline" onClick={handleTestEmail} disabled={loading || saving || testing}>
              {testing ? 'Sending…' : 'Send Test Email'}
            </Button>
          </div>
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
