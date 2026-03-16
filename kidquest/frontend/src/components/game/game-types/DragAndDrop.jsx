import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';

function DraggableItem({ item, isPlaced }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: item.id, disabled: isPlaced });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm touch-none select-none
        ${isPlaced ? 'opacity-30 cursor-default border-gray-200 bg-gray-50 text-gray-400' : ''}
        ${isDragging ? 'opacity-0' : ''}
        ${!isPlaced && !isDragging ? 'border-brand-300 bg-brand-50 text-brand-800 cursor-grab active:cursor-grabbing shadow-sm' : ''}
      `}
    >
      {item.emoji && <span className="text-xl">{item.emoji}</span>}
      {item.label}
    </div>
  );
}

function DropZone({ zone, placedItems, isCorrectMap }) {
  const { setNodeRef, isOver } = useDroppable({ id: zone.id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-[100px] rounded-2xl border-2 border-dashed p-3 transition-all
        ${isOver ? 'border-brand-500 bg-brand-50 scale-[1.02]' : 'border-gray-300 bg-gray-50'}
      `}
    >
      <p className="text-center text-sm font-bold text-gray-600 mb-2">{zone.emoji} {zone.label}</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {placedItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold border-2
              ${isCorrectMap[item.id] ? 'border-green-400 bg-green-50 text-green-800' : 'border-red-400 bg-red-50 text-red-800'}`}
          >
            {item.emoji} {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DragAndDrop({ round, phase, onAnswer }) {
  const [placements, setPlacements] = useState({}); // itemId -> zoneId
  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const handleDragStart = ({ active }) => {
    setActiveItem(round.draggables?.find(d => d.id === active.id));
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveItem(null);
    if (!over) return;
    const newPlacements = { ...placements, [active.id]: over.id };
    setPlacements(newPlacements);

    const totalItems = round.draggables?.length || 0;
    if (Object.keys(newPlacements).length === totalItems) {
      const allCorrect = round.draggables?.every(d => newPlacements[d.id] === d.targetZoneId);
      onAnswer(allCorrect);
    }
  };

  const isCorrectMap = Object.fromEntries(
    Object.entries(placements).map(([itemId, zoneId]) => {
      const item = round.draggables?.find(d => d.id === itemId);
      return [itemId, item?.targetZoneId === zoneId];
    })
  );

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      <p className="text-xl font-bold text-gray-800 text-center">{round.prompt}</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Items to drag */}
        <div className="flex flex-wrap gap-2 justify-center p-3 bg-white rounded-2xl border border-gray-200">
          {round.draggables?.map((item) => (
            <DraggableItem key={item.id} item={item} isPlaced={!!placements[item.id]} />
          ))}
        </div>

        {/* Drop zones */}
        <div className="flex gap-3">
          {round.dropZones?.map((zone) => {
            const placedItems = round.draggables?.filter(d => placements[d.id] === zone.id) || [];
            return <DropZone key={zone.id} zone={zone} placedItems={placedItems} isCorrectMap={isCorrectMap} />;
          })}
        </div>

        <DragOverlay>
          {activeItem && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-brand-500 bg-brand-50 text-brand-800 font-semibold shadow-xl opacity-90">
              {activeItem.emoji} {activeItem.label}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <p className="text-center text-sm text-gray-400">
        {Object.keys(placements).length}/{round.draggables?.length || 0} placed
      </p>
    </div>
  );
}
