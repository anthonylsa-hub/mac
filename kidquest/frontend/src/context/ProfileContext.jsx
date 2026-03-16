import React, { createContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'kidquest_profiles';

function loadProfiles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveProfiles(profiles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState(loadProfiles);
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  const upsertProfile = useCallback((profile) => {
    setProfiles((prev) => {
      const now = new Date().toISOString();
      let next;
      if (profile.id) {
        next = prev.map((p) => (p.id === profile.id ? { ...p, ...profile, updatedAt: now } : p));
      } else {
        const newProfile = { ...profile, id: uuidv4(), createdAt: now, updatedAt: now };
        next = [...prev, newProfile];
      }
      saveProfiles(next);
      return next;
    });
  }, []);

  const deleteProfile = useCallback((id) => {
    setProfiles((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveProfiles(next);
      return next;
    });
    setSelectedProfileId((prev) => (prev === id ? null : prev));
  }, []);

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId) || null;

  return (
    <ProfileContext.Provider value={{ profiles, selectedProfile, selectedProfileId, setSelectedProfileId, upsertProfile, deleteProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
