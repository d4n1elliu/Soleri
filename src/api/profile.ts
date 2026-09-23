import type { ProfileData } from '../types';

export type ProfileSave = Omit<ProfileData, 'spotifyUserId' | 'avatarUrl' | 'bannerUrl'> & {
  // null clears a custom image; undefined leaves it untouched
  avatarUrl?: null;
  bannerUrl?: null;
};

export async function fetchProfile(spotifyId: string): Promise<ProfileData | null> {
  try {
    const res = await fetch(`/api/profile?spotifyId=${encodeURIComponent(spotifyId)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { profile?: ProfileData };
    return data.profile ?? null;
  } catch {
    return null;
  }
}

export async function saveProfile(
  token: string,
  profile: ProfileSave,
): Promise<{ profile: ProfileData | null; error: string | null }> {
  try {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(profile),
    });
    const data = (await res.json().catch(() => ({}))) as {
      profile?: ProfileData;
      error?: string;
    };
    if (!res.ok) return { profile: null, error: data.error ?? 'Could not save profile' };
    return { profile: data.profile ?? null, error: null };
  } catch {
    return { profile: null, error: 'Could not save profile' };
  }
}

export function uploadProfileImage(
  token: string,
  kind: 'avatar' | 'banner',
  blob: Blob,
  onProgress?: (fraction: number) => void,
): Promise<{ url: string | null; error: string | null }> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/profile-image?kind=${kind}`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText) as { url?: string; error?: string };
        if (xhr.status >= 200 && xhr.status < 300 && data.url) {
          resolve({ url: data.url, error: null });
        } else {
          resolve({ url: null, error: data.error ?? 'Upload failed' });
        }
      } catch {
        resolve({ url: null, error: 'Upload failed' });
      }
    };
    xhr.onerror = () => resolve({ url: null, error: 'Upload failed' });
    xhr.send(blob);
  });
}

export async function deleteProfile(token: string): Promise<boolean> {
  try {
    const res = await fetch('/api/profile', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
