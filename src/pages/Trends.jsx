import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
// T-aked mn smiya dial l-composant dial l-card li 3ndek
import MovieCard from '@/components/MovieCard'; 

const Trends = () => {
  // 1. Fetch dial l-aflam l-matcha (Trending)
  const { data, isLoading, error } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: async () => {
      // Hna k-n-taslo b l-API
      const response = await base44.invoke('getTrendingMovies', {}); 
      return response;
    },
  });

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <p className="text-xl animate-pulse">Chargement des tendances...</p>
      </div>
    );
  }

  // 3. Error State (Bach ma-t-bqa l-page noire)
  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black text-red-500">
        <p>Erreur lors du chargement des films.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 rounded bg-white px-4 py-2 text-black"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // 4. L-FIX dial "p.map is not a function"
  // Hna k-n-t-akdo belli "movies" rah array s-shih
  const movies = Array.isArray(data) ? data : (data?.results || []);

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="mb-6 text-3xl font-bold text-white">Aflam Trending</h1>
      
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">
          <p>Walo ma-lqina f l-aflam dial lyoma.</p>
        </div>
      )}
    </div>
  );
};

export default Trends;
