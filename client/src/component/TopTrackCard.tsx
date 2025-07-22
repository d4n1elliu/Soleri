import React from 'react';

const TopTrackCard = ({ track }: any) => {
  return (
    <div className="bg-red-700 p-4 rounded-xl shadow">
      <img src={track.album.images[0].url} alt={track.name} className="rounded mb-2" />
      <h2 className="text-xl font-bold">{track.name}</h2>
      <p className="text-sm">{track.artists.map((a: any) => a.name).join(', ')}</p>
    </div>
  );
};

export default TopTrackCard;