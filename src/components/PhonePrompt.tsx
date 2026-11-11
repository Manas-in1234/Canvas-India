import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DISMISS_KEY = 'phone-prompt-dismissed';
// Pages that already collect a number (or are part of signing in) don't need the prompt.
const HIDDEN_PATHS = ['/login', '/signup', '/checkout', '/auth'];

const readDismissed = () => {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
};

/**
 * Asks signed-in customers who have no mobile number (for example after Google
 * sign-in, which never provides one) to add it. It saves to their profile, so
 * they are only asked once.
 */
export const PhonePrompt: React.FC = () => {
  const { user, profile, loading, updateProfile } = useAuth();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dismissed, setDismissed] = useState(readDismissed);

  const hidden = HIDDEN_PATHS.some((path) => location.pathname.startsWith(path));
  if (loading || !user || !profile || profile.phone || dismissed || hidden) return null;

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10 || !/^[6-9]/.test(phone)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setSaving(true);
    setError(null);
    const { error: saveError } = await updateProfile({ phone });
    setSaving(false);
    if (saveError) setError('Could not save your number. Please try again.');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true">
      <form onSubmit={save} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-2 text-[#002B49]">
          <Phone className="h-5 w-5" />
          <h2 className="text-lg font-bold">Add your mobile number</h2>
        </div>
        <p className="text-sm text-gray-600">
          We use it for delivery updates and to reach you about your orders. You only need to add it once.
        </p>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-gray-500">
            +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            autoFocus
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit mobile number"
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-12 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#002B49]"
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-[#002B49] py-2.5 text-sm font-semibold text-white hover:bg-[#001f35] disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save number'}
          </button>
          <button type="button" onClick={dismiss} className="rounded-lg px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-100">
            Not now
          </button>
        </div>
      </form>
    </div>
  );
};
