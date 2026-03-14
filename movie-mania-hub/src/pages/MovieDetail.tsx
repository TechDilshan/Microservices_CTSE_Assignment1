import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { moviesApi, hallsApi, bookingsApi } from '@/lib/api';
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
  const [hall, setHall] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [seatLayout, setSeatLayout] = useState<any>(null);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!id) return;
    moviesApi.getById(id).then(async (res) => {
      setMovie(res.data);
      if (res.data.hallId) {
        const hallRes = await hallsApi.getById(res.data.hallId);
        setHall(hallRes.data);
      }
    }).catch(() => toast({ title: 'Failed to load movie', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!movie || !selectedDate || !selectedTime) return;
    bookingsApi.getAvailableSeats({
      hallId: movie.hallId,
      movieId: movie._id,
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

  const calculateTotal = () => {
    if (!movie?.price || selectedSeats.length === 0) return 0;
    return selectedSeats.reduce((total, seat) => {
      if (seat.startsWith('ODC-')) return total + (movie.price.ODC_Full || 0);
      if (seat.startsWith('Balcony-')) return total + (movie.price.Balcony || 0);
      if (seat.startsWith('Box-')) return total + (movie.price.Box || 0);
      return total;
    }, 0);
  };

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (selectedSeats.length === 0) { toast({ title: 'Please select seats', variant: 'destructive' }); return; }

    setBooking(true);
    try {
      const res = await bookingsApi.create({
        hallId: movie.hallId,
        movieId: movie._id,
        showTime: selectedTime,
        date: selectedDate,
        seats: selectedSeats,
      });
      navigate(`/payment/${res.data._id}`, { state: { amount: calculateTotal(), booking: res.data } });
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
                {hall && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" /> {hall.name} - {hall.location}
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" /> {format(new Date(movie.startDate), 'MMM dd')} - {format(new Date(movie.endDate), 'MMM dd, yyyy')}
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

          {/* Booking */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-display text-2xl tracking-wider">BOOK <span className="text-primary">TICKETS</span></h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Select Date</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    min={movie.startDate?.split('T')[0]}
                    max={movie.endDate?.split('T')[0]}
                  />
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
                  <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
                    <span>Total</span>
                    <span className="text-primary flex items-center"><DollarSign className="w-4 h-4" />Rs. {calculateTotal()}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={handleBook} disabled={booking}>
                  {booking ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
