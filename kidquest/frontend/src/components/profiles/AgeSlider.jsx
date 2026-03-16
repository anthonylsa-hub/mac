import React from 'react';
import { getAgeBand } from '../../utils/ageGroups.js';

export function AgeSlider({ value, onChange }) {
  const band = getAgeBand(value);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-4xl">{band.emoji}</span>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-brand-600">{value}</span>
          <span className="text-gray-500 ml-1">yrs</span>
        </div>
      </div>
      <input
        type="range"
        min="1"
        max="12"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 rounded-full appearance-none cursor-pointer accent-brand-600 bg-brand-100"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>1</span><span>3</span><span>5</span><span>7</span><span>9</span><span>11</span><span>12</span>
      </div>
      <div className="bg-brand-50 rounded-xl p-3 text-center">
        <p className="font-bold text-brand-700">{band.label}</p>
        <p className="text-xs text-gray-500">{band.description}</p>
      </div>
    </div>
  );
}
