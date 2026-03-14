import { cn } from '@/lib/utils';

interface SeatMapProps {
  layout: {
    ODC?: string[][];
    Balcony?: string[];
    Box?: string[];
  };
  bookedSeats?: string[];
  selectedSeats?: string[];
  onSeatClick?: (seatId: string) => void;
  readOnly?: boolean;
}

const SeatMap = ({ layout, bookedSeats = [], selectedSeats = [], onSeatClick, readOnly = false }: SeatMapProps) => {
  const getSeatClass = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return 'seat seat-booked';
    if (selectedSeats.includes(seatId)) return 'seat seat-selected';
    return 'seat seat-available';
  };

  return (
    <div className="space-y-8">
      {/* Screen */}
      <div className="text-center">
        <div className="mx-auto w-3/4 h-2 bg-primary/30 rounded-b-full mb-2" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Screen</span>
      </div>

      {/* ODC Section */}
      {layout.ODC && layout.ODC.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-primary text-center">ODC</h4>
          <div className="flex flex-col items-center gap-1">
            {layout.ODC.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-1 items-center">
                <span className="text-xs text-muted-foreground w-6 text-right mr-1">
                  {String.fromCharCode(65 + rowIdx)}
                </span>
                {row.map((seat) => {
                  const seatId = `ODC-${seat}`;
                  return (
                    <button
                      key={seatId}
                      className={cn(getSeatClass(seatId))}
                      onClick={() => !readOnly && !bookedSeats.includes(seatId) && onSeatClick?.(seatId)}
                      disabled={readOnly || bookedSeats.includes(seatId)}
                      title={seatId}
                    >
                      {seat.replace(/[A-Z]/g, '')}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Balcony Section */}
      {layout.Balcony && layout.Balcony.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-primary text-center">Balcony</h4>
          <div className="flex justify-center gap-2 flex-wrap">
            {layout.Balcony.map((seat) => {
              const seatId = seat.startsWith('Balcony-') ? seat : `Balcony-${seat}`;
              return (
                <button
                  key={seatId}
                  className={cn(getSeatClass(seatId), 'w-12')}
                  onClick={() => !readOnly && !bookedSeats.includes(seatId) && onSeatClick?.(seatId)}
                  disabled={readOnly || bookedSeats.includes(seatId)}
                  title={seatId}
                >
                  {seat.replace('Balcony-', '')}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Box Section */}
      {layout.Box && layout.Box.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-primary text-center">Box</h4>
          <div className="flex justify-center gap-2 flex-wrap">
            {layout.Box.map((seat) => {
              const seatId = seat.startsWith('Box-') ? seat : `Box-${seat}`;
              return (
                <button
                  key={seatId}
                  className={cn(getSeatClass(seatId), 'w-12')}
                  onClick={() => !readOnly && !bookedSeats.includes(seatId) && onSeatClick?.(seatId)}
                  disabled={readOnly || bookedSeats.includes(seatId)}
                  title={seatId}
                >
                  {seat.replace('Box-', '')}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      {!readOnly && (
        <div className="flex justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><div className="seat seat-available w-4 h-4 text-[8px]" />Available</div>
          <div className="flex items-center gap-1"><div className="seat seat-selected w-4 h-4 text-[8px]" />Selected</div>
          <div className="flex items-center gap-1"><div className="seat seat-booked w-4 h-4 text-[8px]" />Booked</div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;
