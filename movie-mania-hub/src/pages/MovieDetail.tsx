import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { moviesApi, hallsApi, bookingsApi, reviewsApi, discountsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SeatMap from '@/components/SeatMap';
import { useToast } from '@/hooks/use-toast';
import { Clock, Globe, Calendar, MapPin, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [movie, setMovie] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [halls, setHalls] = useState<any[]>([]);
  const [hallSearch, setHallSearch] = useState('');
  const [selectedHallId, setSelectedHallId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [seatLayout, setSeatLayout] = useState<any>(null);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewSummary, setReviewSummary] = useState<{ averageRating: number; count: number } | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const [discountInfo, setDiscountInfo] = useState<{
    baseAmount: number;
    discountAmount: number;
    finalAmount: number;
    discountPercentage: number;
  } | null>(null);

  const dateInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!id) return;
    moviesApi
      .getById(id)
      .then(async (res) => {
        const base = res.data;
        setMovie(base);

        // load all variants of this film (same name in different halls)
        let allMovies: any[] = [];
        try {
          const allRes = await moviesApi.getAll();
          allMovies = allRes.data || [];
        } catch {
          allMovies = [];
        }
        const sameName = allMovies.filter(m => m.name === base.name);
        setVariants(sameName.length ? sameName : [base]);

        const hallIds = Array.from(
          new Set(
            (sameName.length ? sameName : [base])
              .map((m: any) => m.hallId)
              .filter(Boolean)
          )
        );

        const hallDocs: any[] = [];
        for (const hid of hallIds) {
          try {
            const hr = await hallsApi.getById(hid as string);
            hallDocs.push(hr.data);
          } catch {
            // ignore individual hall errors
          }
        }
        setHalls(hallDocs);
        if (base.hallId) {
          setSelectedHallId(base.hallId);
        } else if (hallIds[0]) {
          setSelectedHallId(hallIds[0] as string);
        }
      })
      .catch(() => toast({ title: 'Failed to load movie', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [id]);

  const selectedHall = useMemo(
    () => halls.find(h => h._id === selectedHallId),
    [halls, selectedHallId]
  );

  const selectedVariant = useMemo(
    () => variants.find(v => v.hallId === selectedHallId) || movie,
    [variants, selectedHallId, movie]
  );

  useEffect(() => {
    if (!selectedVariant || !selectedDate || !selectedTime) return;
    bookingsApi.getAvailableSeats({
      hallId: selectedVariant.hallId,
      movieId: selectedVariant._id,
      date: selectedDate,
      showTime: selectedTime,
    }).then(res => {
      setSeatLayout(res.data.layout);
      setBookedSeats(res.data.bookedSeats || []);
      setSelectedSeats([]);
    }).catch(() => {});
  }, [movie, selectedDate, selectedTime]);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const loadReviews = async (movieId: string) => {
    try {
      const [listRes, summaryRes] = await Promise.all([
        reviewsApi.getForMovie(movieId),
        reviewsApi.getSummaryForMovie(movieId),
      ]);
      setReviews(listRes.data || []);
      setReviewSummary(summaryRes.data || { averageRating: 0, count: 0 });
    } catch {
      setReviews([]);
      setReviewSummary(null);
    }
  };

  useEffect(() => {
    if (id) {
      loadReviews(id);
    }
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!id || !reviewForm.rating) {
      toast({ title: 'Please provide a rating', variant: 'destructive' });
      return;
    }
    try {
      if (editingReviewId) {
        await reviewsApi.update(editingReviewId, {
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        });
        toast({ title: 'Review updated' });
      } else {
        await reviewsApi.create({
          movieId: id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        });
        toast({ title: 'Review added' });
      }
      setEditingReviewId(null);
      setReviewForm({ rating: 0, comment: '' });
      await loadReviews(id);
    } catch (err: any) {
      toast({
        title: 'Failed to save review',
        description: err.response?.data?.message || 'Try again',
        variant: 'destructive',
      });
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReviewId(review._id);
    setReviewForm({ rating: review.rating, comment: review.comment || '' });
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!id) return;
    if (!confirm('Delete this review?')) return;
    try {
      await reviewsApi.delete(reviewId);
      toast({ title: 'Review deleted' });
      await loadReviews(id);
    } catch {
      toast({ title: 'Failed to delete review', variant: 'destructive' });
    }
  };

  const calculateTotal = () => {
    if (!movie?.price || selectedSeats.length === 0) return 0;
    return selectedSeats.reduce((total, seat) => {
      if (seat.startsWith('ODC-')) return total + (movie.price.ODC_Full || 0);
      if (seat.startsWith('Balcony-')) return total + (movie.price.Balcony || 0);
      if (seat.startsWith('Box-')) return total + (movie.price.Box || 0);
      return total;
    }, 0);
  };

  // Whenever seats/date change, compute discount (if any)
  useEffect(() => {
    const run = async () => {
      if (!selectedVariant || !selectedDate || selectedSeats.length === 0) {
        setDiscountInfo(null);
        return;
      }
      const base = calculateTotal();
      if (!base) {
        setDiscountInfo(null);
        return;
      }
      try {
        const res = await discountsApi.calculate({
          hallId: selectedVariant.hallId,
          movieId: selectedVariant._id,
          date: selectedDate,
          seats: selectedSeats,
          baseAmount: base,
        });
        const d = res.data;
        setDiscountInfo({
          baseAmount: d.baseAmount,
          discountAmount: d.discountAmount,
          finalAmount: d.finalAmount,
          discountPercentage: d.discountPercentage,
        });
      } catch {
        setDiscountInfo(null);
      }
    };
    run();
  }, [selectedVariant, selectedDate, selectedSeats]);

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (selectedSeats.length === 0) { toast({ title: 'Please select seats', variant: 'destructive' }); return; }

    setBooking(true);
    try {
      const res = await bookingsApi.create({
        hallId: selectedVariant.hallId,
        movieId: selectedVariant._id,
        showTime: selectedTime,
        date: selectedDate,
        seats: selectedSeats,
      });
      const amount = discountInfo?.finalAmount ?? calculateTotal();
      navigate(`/payment/${res.data._id}`, { state: { amount, booking: res.data } });
    } catch (err: any) {
      toast({ title: 'Booking failed', description: err.response?.data?.message || 'Try again', variant: 'destructive' });
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-16 flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!movie) return <div className="min-h-screen pt-16 flex items-center justify-center text-muted-foreground">Movie not found</div>;

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Movie Info */}
          <div className="lg:col-span-1">
            <div className="glass-card overflow-hidden">
              <div className="aspect-[2/3] bg-muted">
                {movie.movieImageUrl ? (
                  <img src={movie.movieImageUrl} alt={movie.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <h1 className="font-display text-3xl tracking-wider">{movie.name}</h1>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">{movie.genre}</Badge>
                  <Badge variant="outline"><Globe className="w-3 h-3 mr-1" />{movie.language}</Badge>
                  <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{movie.duration} min</Badge>
                </div>
                {reviewSummary && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">
                      {reviewSummary.averageRating?.toFixed(1) || '0.0'} / 5
                    </span>
                    <span>({reviewSummary.count || 0} reviews)</span>
                  </div>
                )}
                {selectedHall && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" /> {selectedHall.name} - {selectedHall.location}
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-white" /> {format(new Date(movie.startDate), 'MMM dd')} - {format(new Date(movie.endDate), 'MMM dd, yyyy')}
                </div>
                {movie.price && (
                  <div className="space-y-1 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Pricing</p>
                    {movie.price.ODC_Full && <div className="flex justify-between text-sm"><span>ODC Full</span><span className="text-primary">Rs. {movie.price.ODC_Full}</span></div>}
                    {movie.price.ODC_Half && <div className="flex justify-between text-sm"><span>ODC Half</span><span className="text-primary">Rs. {movie.price.ODC_Half}</span></div>}
                    {movie.price.Balcony && <div className="flex justify-between text-sm"><span>Balcony</span><span className="text-primary">Rs. {movie.price.Balcony}</span></div>}
                    {movie.price.Box && <div className="flex justify-between text-sm"><span>Box</span><span className="text-primary">Rs. {movie.price.Box}</span></div>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Halls & Booking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hall selection */}
            {halls.length > 0 && (
              <div className="glass-card p-6 space-y-4">
                <h2 className="font-display text-2xl tracking-wider">
                  SELECT <span className="text-primary">HALL</span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Search by location</Label>
                    <Input
                      placeholder="Type location to filter halls..."
                      value={hallSearch}
                      onChange={e => setHallSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {halls
                    .filter(h =>
                      !hallSearch ||
                      (h.location || '').toLowerCase().includes(hallSearch.toLowerCase())
                    )
                    .map(h => (
                      <button
                        key={h._id}
                        type="button"
                        onClick={() => setSelectedHallId(h._id)}
                        className={`text-left p-3 rounded border transition-colors ${
                          selectedHallId === h._id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="font-medium">{h.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {h.location}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="glass-card p-6 space-y-4">
              <h2 className="font-display text-2xl tracking-wider">BOOK <span className="text-primary">TICKETS</span></h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Select Date</Label>
                  <div className="relative">
                    <Input
                      ref={dateInputRef}
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      min={movie.startDate?.split('T')[0]}
                      max={movie.endDate?.split('T')[0]}
                      className="pr-10"
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white cursor-pointer"
                      onClick={() => {
                        const el = dateInputRef.current;
                        if (!el) return;
                        // try native picker if supported
                        // @ts-ignore
                        if (typeof el.showPicker === 'function') {
                          // @ts-ignore
                          el.showPicker();
                        } else {
                          el.focus();
                        }
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Select Show Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger><SelectValue placeholder="Choose time" /></SelectTrigger>
                    <SelectContent>
                      {movie.showTime?.map((t: string) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {seatLayout && (
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-display text-xl tracking-wider">SELECT <span className="text-primary">SEATS</span></h3>
                <SeatMap
                  layout={seatLayout}
                  bookedSeats={bookedSeats}
                  selectedSeats={selectedSeats}
                  onSeatClick={handleSeatClick}
                />
              </div>
            )}

            {selectedSeats.length > 0 && (
              <div className="glass-card p-6 space-y-4 glow-amber">
                <h3 className="font-display text-xl tracking-wider">BOOKING <span className="text-primary">SUMMARY</span></h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Seats</span><span>{selectedSeats.join(', ')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{selectedDate}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{selectedTime}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Base Total</span><span>Rs. {calculateTotal()}</span></div>
                  {discountInfo && discountInfo.discountAmount > 0 && (
                    <>
                      <div className="flex justify-between text-xs text-emerald-400">
                        <span>Discount ({discountInfo.discountPercentage}% )</span>
                        <span>- Rs. {discountInfo.discountAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
                        <span>Final Total</span>
                        <span className="text-primary flex items-center"><DollarSign className="w-4 h-4" />Rs. {discountInfo.finalAmount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  {!discountInfo && (
                    <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
                      <span>Total</span>
                      <span className="text-primary flex items-center"><DollarSign className="w-4 h-4" />Rs. {calculateTotal()}</span>
                    </div>
                  )}
                </div>
                <Button className="w-full" size="lg" onClick={handleBook} disabled={booking}>
                  {booking ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </div>
            )}

            {/* Reviews */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-display text-xl tracking-wider">REVIEWS &amp; <span className="text-primary">RATINGS</span></h3>
              {user ? (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="grid sm:grid-cols-4 gap-3 items-center">
                    <div className="sm:col-span-1">
                      <Label>Rating</Label>
                      <select
                        className="w-full rounded border border-border bg-background px-2 py-1 text-sm"
                        value={reviewForm.rating}
                        onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      >
                        <option value={0}>Select</option>
                        {[1, 2, 3, 4, 5].map(r => (
                          <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <Label>Comment</Label>
                      <Input
                        placeholder="Share your experience..."
                        value={reviewForm.comment}
                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" size="sm">
                    {editingReviewId ? 'Update Review' : 'Submit Review'}
                  </Button>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Please <button className="underline" onClick={() => navigate('/login')}>login</button> to add a review.
                </p>
              )}

              <div className="space-y-3 pt-2">
                {reviews.length === 0 && (
                  <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this movie.</p>
                )}
                {reviews.map((rev) => {
                  const isOwner = user && (user._id === rev.userId || user.email === rev.userEmail);
                  return (
                    <div key={rev._id} className="border border-border rounded px-3 py-2 text-sm flex justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{rev.userName || 'Anonymous'}</span>
                          <span className="text-primary">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                        </div>
                        {rev.comment && (
                          <p className="text-muted-foreground mt-1">{rev.comment}</p>
                        )}
                      </div>
                      {isOwner && (
                        <div className="flex flex-col gap-1 items-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEditReview(rev)}>Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteReview(rev._id)}>Delete</Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
