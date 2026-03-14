import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { moviesApi } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface Movie {
  _id: string;
  name: string;
  genre: string;
  language: string;
  duration: number;
  movieImageUrl: string;
  startDate: string;
  endDate: string;
  showTime: string[];
  price: Record<string, number>;
}

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moviesApi.getAll().then(res => setMovies(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = movies.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.genre.toLowerCase().includes(search.toLowerCase()) ||
    m.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-4xl tracking-wider mb-6">NOW <span className="text-primary">SHOWING</span></h1>
        
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search movies by name, genre, language..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-20">Loading movies...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">No movies found</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((movie, i) => (
              <motion.div
                key={movie._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/movies/${movie._id}`} className="glass-card block overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="aspect-[2/3] overflow-hidden bg-muted">
                    {movie.movieImageUrl ? (
                      <img src={movie.movieImageUrl} alt={movie.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-display text-xl tracking-wider truncate">{movie.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">{movie.genre}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {movie.language}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {movie.duration} min
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
