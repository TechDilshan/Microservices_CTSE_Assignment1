import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Film, Ticket, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(38_92%_50%/0.08),transparent_70%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-3xl"
        >
          <h1 className="font-display text-6xl md:text-8xl tracking-wider text-foreground mb-4">
            MOVIE <span className="text-primary">HUB</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Book your favorite movies, choose the best seats, and enjoy the cinematic experience.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/movies">
              <Button size="lg" className="font-display tracking-wider text-lg px-8">
                <Film className="w-5 h-5 mr-2" /> Browse Movies
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="font-display tracking-wider text-lg px-8">
                Join Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Film className="w-8 h-8 text-primary" />, title: 'Latest Movies', desc: 'Browse and explore the latest movies showing near you.' },
            { icon: <Ticket className="w-8 h-8 text-primary" />, title: 'Easy Booking', desc: 'Select your seats, pick a showtime, and book in seconds.' },
            { icon: <MapPin className="w-8 h-8 text-primary" />, title: 'Find Halls', desc: 'Discover movie halls and their seat arrangements nearby.' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center space-y-4"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-display text-2xl tracking-wider">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
