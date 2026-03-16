import React, { useMemo } from 'react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { getPlaceInfo } from '../utils/placeTypes.js';

const HISTORY_KEY = 'kidquest_history';

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function HistoryPage() {
  const history = useMemo(() => loadHistory(), []);

  return (
    <AppShell title="History">
      <div className="p-5 space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="text-7xl">📖</div>
            <h2 className="text-2xl font-bold text-gray-700">No adventures yet!</h2>
            <p className="text-gray-500">Completed games will show up here.</p>
          </div>
        ) : (
          history.map((session) => {
            const place = getPlaceInfo(session.location?.placeType);
            const dateStr = session.completedAt
              ? new Date(session.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
              : '—';
            return (
              <div key={session.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{session.profileSnapshot?.name?.[0] || '👦'}</span>
                    <div>
                      <p className="font-bold text-gray-900">{session.profileSnapshot?.name}</p>
                      <p className="text-xs text-gray-400">{dateStr}</p>
                    </div>
                  </div>
                  {session.score !== undefined && (
                    <Badge color="green">⭐ {session.score}/{session.game?.totalRounds}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{place.emoji}</span>
                  <span className="text-sm text-gray-600 font-medium">{place.label}</span>
                  {session.game?.title && (
                    <span className="text-sm text-gray-400">· {session.game.title}</span>
                  )}
                </div>
                {session.game?.skillTrack && (
                  <Badge color="purple">{session.game.skillTrack}</Badge>
                )}
              </div>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
