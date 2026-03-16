import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell.jsx';
import { ProfileCard } from '../components/profiles/ProfileCard.jsx';
import { ProfileEditor } from '../components/profiles/ProfileEditor.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useProfiles } from '../hooks/useProfiles.js';

export function HomePage() {
  const navigate = useNavigate();
  const { profiles, selectedProfileId, setSelectedProfileId, upsertProfile, deleteProfile } = useProfiles();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  const openCreate = () => { setEditingProfile(null); setEditorOpen(true); };
  const openEdit = (profile) => { setEditingProfile(profile); setEditorOpen(true); };
  const handleSave = (profile) => { upsertProfile(profile); setEditorOpen(false); };

  return (
    <AppShell title="KidQuest" action={<button onClick={openCreate} className="w-10 h-10 rounded-full bg-brand-600 text-white text-2xl flex items-center justify-center shadow-md">+</button>}>
      <div className="p-5 space-y-4">
        {profiles.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="text-7xl">👦</div>
            <h2 className="text-2xl font-bold text-gray-700">Add your first child!</h2>
            <p className="text-gray-500 max-w-xs mx-auto">Create a profile to get personalized games for your child, wherever you are.</p>
            <Button size="lg" onClick={openCreate} className="mt-4">+ Add Child Profile</Button>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Select a child to play with</p>
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                isSelected={selectedProfileId === profile.id}
                onSelect={() => setSelectedProfileId(profile.id)}
                onEdit={() => openEdit(profile)}
                onDelete={() => deleteProfile(profile.id)}
              />
            ))}
            <button onClick={openCreate} className="w-full py-4 rounded-3xl border-2 border-dashed border-brand-300 text-brand-600 font-semibold text-lg hover:bg-brand-50 transition-colors">
              + Add Another Child
            </button>
          </>
        )}

        {selectedProfileId && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-lg px-5 z-20">
            <Button size="xl" className="w-full shadow-xl" onClick={() => navigate('/location')}>
              🎮 Start Adventure!
            </Button>
          </div>
        )}
      </div>

      <Modal isOpen={editorOpen} onClose={() => setEditorOpen(false)} title={editingProfile ? 'Edit Profile' : 'New Child Profile'}>
        <ProfileEditor
          profile={editingProfile}
          onSave={handleSave}
          onCancel={() => setEditorOpen(false)}
        />
      </Modal>
    </AppShell>
  );
}
