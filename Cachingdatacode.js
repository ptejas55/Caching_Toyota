import React from 'react';
import { useApolloClient } from '@apollo/client';

const CacheViewer = () => {
  const client = useApolloClient();

  const logCacheContents = () => {
    const cacheContents = client.cache.extract();
    console.log('Cache Contents:', cacheContents);
  };

  return (
    <div>
      <button onClick={logCacheContents}>Log Cache Contents</button>
    </div>
  );
};

export default CacheViewer;
