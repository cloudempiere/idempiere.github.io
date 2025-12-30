import React from 'react';

export default function YouTube({id, title = 'YouTube video'}) {
  return (
    <div style={{
      position: 'relative',
      paddingBottom: '56.25%', // 16:9 aspect ratio
      height: 0,
      overflow: 'hidden',
      maxWidth: '100%',
      marginBottom: '1rem',
    }}>
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '8px',
        }}
      />
    </div>
  );
}
