import { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext.jsx';

export function useProfiles() {
  return useContext(ProfileContext);
}
