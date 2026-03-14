import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, CheckCircle } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { amount, booking } = (location.state as any) || {};
  const [method, setMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!booking) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>No booking found.</p>
          <Button className="mt-4" onClick={() => navigate('/movies')}>Browse Movies</Button>
        </div>
      </div>
    );
  }

  const handlePay = async () => {
    setProcessing(true);
    try {
      await bookingsApi.pay(booking._id, { amount, method });
      setSuccess(true);
      toast({ title: 'Payment successful!' });
    } catch (err: any) {
      toast({ title: 'Payment failed', description: err.response?.data?.message || 'Try again', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md w-full text-center space-y-4 glow-amber">
          <CheckCircle className="w-16 h-16 text-success mx-auto" />
          <h1 className="font-display text-3xl tracking-wider">BOOKING <span className="text-primary">CONFIRMED</span></h1>
          <p className="text-muted-foreground">Your tickets have been booked successfully!</p>
          <div className="space-y-1 text-sm">
            <p>Booking ID: <span className="text-primary">{booking._id}</span></p>
            <p>Seats: {booking.seats?.join(', ')}</p>
            <p>Amount Paid: Rs. {amount}</p>
          </div>
          <div className="flex gap-3 justify-center pt-4">
            <Button onClick={() => navigate('/my-bookings')}>View Bookings</Button>
            <Button variant="outline" onClick={() => navigate('/movies')}>Browse More</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="glass-card p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <CreditCard className="w-10 h-10 text-primary mx-auto mb-2" />
          <h1 className="font-display text-3xl tracking-wider">PAYMENT</h1>
        </div>

        <div className="space-y-2 text-sm border-b border-border pb-4">
          <div className="flex justify-between"><span className="text-muted-foreground">Booking ID</span><span>{booking._id}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Seats</span><span>{booking.seats?.join(', ')}</span></div>
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">Rs. {amount}</span></div>
        </div>

        <div>
          <Label>Payment Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Credit/Debit Card</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="online">Online Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" size="lg" onClick={handlePay} disabled={processing}>
          {processing ? 'Processing...' : `Pay Rs. ${amount}`}
        </Button>
      </div>
    </div>
  );
};

export default Payment;
