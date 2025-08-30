import React from 'react';

const TrackList = ({ tracks }: any) => {
  return (
    <div className="space-y-4">
      {tracks.map((track: any) => (
        <div key={track.id} className="bg-zinc-800 p-3 rounded-lg">
          <h3 className="font-semibold">{track.name}</h3>
          <p className="text-sm">{track.artists.map((a: any) => a.name).join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default TrackList;