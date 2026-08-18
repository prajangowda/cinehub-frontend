import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button.jsx';
import { SearchInput } from '../components/SearchInput.jsx';
import { SectionHeading } from '../components/SectionHeading.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { MovieCard } from '../components/MovieCard.jsx';
import { fetchMovies } from '../services/movieService.js';

function HomePage() {
  const [page, setPage] = useState(1);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const totalPages = 4;

  useEffect(() => {
    let isMounted = true;

    const loadMovies = async () => {
      try {
        setLoading(true);
        setError('');
        const movies = await fetchMovies();
        if (isMounted) {
          setFeaturedMovies(movies.slice(0, 3));
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load movies from the backend right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMovies();
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredMovie = featuredMovies[0];

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-lg shadow-slate-950/20">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex rounded-full bg-brand-500/15 px-4 py-2 text-sm font-semibold text-brand-100">
              Discover the latest movies in your city
            </span>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">
              Book tickets, watch premieres, and stay ahead of every show.
            </h1>
            <p className="max-w-2xl text-slate-300">
              CineHub brings theatre listings, trailers, and seamless booking in one modern experience.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <SearchInput placeholder="Search movies, theatres, or cities" />
              <Link to="/movies">
                <Button>Explore now</Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[2rem] bg-gradient-to-br from-brand-700 via-slate-900 to-slate-950 p-8"
          >
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6 text-slate-200">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-200">Now showing</p>
              <h2 className="mt-4 text-3xl font-semibold">{featuredMovie?.title || 'Loading latest movies...'}</h2>
              <p className="mt-2 text-slate-400">{featuredMovie?.subtitle || featuredMovie?.genre || 'Fetching movie details from the backend.'}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          label="Featured"
          title="Explore today’s top movie picks"
          description="Browse the latest blockbusters, coming soon releases, and exclusive offers curated for your next cinema visit."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-400">
                Loading featured movies...
              </div>
            ))
          ) : error ? (
            <div className="col-span-full rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-300">
              {error}
            </div>
          ) : (
            featuredMovies.map((movie) => <MovieCard key={movie.id} {...movie} onAction={() => null} />)
          )}
        </div>
        <div className="flex justify-center pt-6">
          <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </section>
    </div>
  );
}

export default HomePage;
