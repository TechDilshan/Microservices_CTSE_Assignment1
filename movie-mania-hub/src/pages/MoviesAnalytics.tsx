import { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

const MoviesAnalytics = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getMovieRankings()
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-16 flex items-center justify-center text-muted-foreground">Loading rankings...</div>;
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="font-display text-4xl tracking-wider">MOVIE <span className="text-primary">RANKINGS</span></h1>
        {items.length === 0 ? (
          <p className="text-muted-foreground">No analytics data available yet.</p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {items.map((m, idx) => (
              <div key={m.movieId || idx} className="glass-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg tracking-wider">{m.name}</h3>
                    <Badge variant="outline">{m.genre || 'N/A'}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rating <span className="font-semibold text-primary">{m.averageRating?.toFixed(1) || '0.0'}</span> from{' '}
                    {m.reviewCount || 0} reviews
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesAnalytics;

