import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchMovieById,
  fetchMovieShows
} from '../services/movieService.js';

function MovieDetailsPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        setLoading(true);

        const [movieData, showsData] = await Promise.all([
          fetchMovieById(movieId),
          fetchMovieShows(movieId)
        ]);

        setMovie(movieData);
        setShows(showsData);
      } catch (error) {
        console.error('Failed to load movie details', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [movieId]);

  // Group shows by theatre and screen
  const groupedShows = shows.reduce((acc, show) => {
    const theatreKey = show.theatreId || show.theatreName;

    if (!acc[theatreKey]) {
      acc[theatreKey] = {
        theatreName: show.theatreName,
        screens: {}
      };
    }

    const screenKey = show.screenId || show.screenName;

    if (!acc[theatreKey].screens[screenKey]) {
      acc[theatreKey].screens[screenKey] = {
        screenName: show.screenName,
        shows: []
      };
    }

    acc[theatreKey].screens[screenKey].shows.push(show);

    return acc;
  }, {});

  const formatTime = (time) => {
    if (!time) return '';

    const [hour, minute] = time.split(':');

    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));

    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const scrollToShows = () => {
    document
      .getElementById('shows-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading movie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= HERO SECTION ================= */}

      <section className="relative min-h-[600px] overflow-hidden">

        {/* Background Image */}
        {movie?.image && (
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 blur-sm opacity-50"
            style={{
              backgroundImage: `url(${movie.image})`
            }}
          />
        )}

        {/* Dark Cinematic Overlays */}
        <div className="absolute inset-0 bg-slate-950/70" />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

        {/* Decorative glow */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-red-600/10 blur-[150px] rounded-full" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-24">

          

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">

            {/* Movie Poster */}
            <div className="flex-shrink-0">

              <div
                className="
                  relative
                  w-52
                  md:w-60
                  aspect-[2/3]
                  rounded-2xl
                  overflow-hidden
                  border
                  border-white/20
                  shadow-2xl
                  shadow-black/60
                  bg-slate-800
                "
              >
                {movie?.image ? (
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🎬
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-black/70 py-3 text-center">
                  <span className="text-sm font-medium">
                    Now Showing
                  </span>
                </div>

              </div>

            </div>

            {/* Movie Information */}
            <div className="max-w-3xl pt-2">

              <p className="text-red-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
                CineHub Presents
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {movie?.title}
              </h1>

              {/* Rating */}
              <div
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-4
                  px-5
                  py-4
                  rounded-xl
                  bg-black/40
                  border
                  border-white/15
                  backdrop-blur-md
                "
              >
                <span className="text-red-400 text-2xl">
                  ★
                </span>

                <div>
                  <p className="font-semibold text-lg">
                    {movie?.rating > 0
                      ? `${movie.rating}/10`
                      : 'Not Rated'}
                  </p>

                  <p className="text-xs text-slate-400">
                    CineHub Rating
                  </p>
                </div>

              </div>

              {/* Movie Info */}
              <div className="flex flex-wrap items-center gap-3 mt-6 text-sm md:text-base">

                {movie?.genre && (
                  <span className="px-4 py-2 rounded-md bg-white/10 border border-white/10 text-slate-200">
                    {movie.genre}
                  </span>
                )}

                {movie?.year && (
                  <span className="px-4 py-2 rounded-md bg-white/10 border border-white/10 text-slate-200">
                    {movie.year}
                  </span>
                )}

                <span className="px-4 py-2 rounded-md bg-white/10 border border-white/10 text-slate-200">
                  UA
                </span>

              </div>

              {/* Description */}
              {movie?.description && (
                <p className="mt-7 max-w-2xl text-slate-300 leading-7">
                  {movie.description}
                </p>
              )}

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mt-9">

                <button
                  onClick={scrollToShows}
                  className="
                    px-8
                    py-4
                    rounded-xl
                    bg-red-600
                    hover:bg-red-500
                    active:scale-95
                    font-semibold
                    shadow-lg
                    shadow-red-600/20
                    transition-all
                  "
                >
                  Book Tickets
                </button>

                <button
                  className="
                    px-7
                    py-4
                    rounded-xl
                    border
                    border-white/20
                    bg-white/5
                    hover:bg-white/10
                    transition
                    text-slate-200
                  "
                >
                  ▶ Watch Trailer
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= SHOWS SECTION ================= */}

      <section
        id="shows-section"
        className="relative border-t border-white/10 bg-slate-900"
      >

        <div className="max-w-7xl mx-auto px-6 py-14">

          {/* Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">

            <div>
              <p className="text-red-400 text-sm font-semibold tracking-wider">
                SELECT A SHOW
              </p>

              <h2 className="text-3xl font-bold mt-2">
                Choose your theatre
              </h2>

              <p className="text-slate-400 mt-2">
                Select a convenient showtime and continue to seat selection.
              </p>
            </div>

            <div className="text-sm text-slate-400">
              {shows.length} shows available
            </div>

          </div>


          {/* No Shows */}
          {Object.keys(groupedShows).length === 0 ? (

            <div className="
              py-16
              rounded-2xl
              border
              border-white/10
              bg-slate-950
              text-center
            ">
              <div className="text-4xl mb-4">
                🎭
              </div>

              <h3 className="text-lg font-semibold">
                No shows available
              </h3>

              <p className="text-slate-500 mt-2">
                Please check again later.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {Object.entries(groupedShows).map(
                ([theatreId, theatre]) => (

                  <div
                    key={theatreId}
                    className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-slate-950
                      overflow-hidden
                      hover:border-red-500/30
                      transition
                    "
                  >

                    {/* Theatre Header */}
                    <div className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      justify-between
                      gap-4
                      px-6
                      py-5
                      border-b
                      border-white/10
                    ">

                      <div className="flex items-center gap-4">

                        <div className="
                          w-12
                          h-12
                          rounded-xl
                          bg-red-500/10
                          border
                          border-red-500/20
                          flex
                          items-center
                          justify-center
                          text-xl
                        ">
                          🎬
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {theatre.theatreName}
                          </h3>

                          <p className="text-sm text-slate-500">
                            Available showtimes
                          </p>
                        </div>

                      </div>

                      <span className="
                        self-start
                        sm:self-auto
                        px-3
                        py-1.5
                        rounded-full
                        text-xs
                        text-emerald-400
                        bg-emerald-400/10
                      ">
                        Available
                      </span>

                    </div>


                    {/* Screens */}
                    <div className="p-6 space-y-7">

                      {Object.entries(theatre.screens).map(
                        ([screenId, screen]) => (

                          <div key={screenId}>

                            <div className="flex items-center gap-4 mb-4">

                              <span className="text-sm font-medium text-slate-300">
                                {screen.screenName}
                              </span>

                              <div className="h-px flex-1 bg-white/10" />

                            </div>


                            {/* Showtime Buttons */}
                            <div className="flex flex-wrap gap-3">

                              {screen.shows.map((show) => (

                                <button
                                  key={show.id}
                                  onClick={() =>
                                    navigate(`/booking/${show.id}`)
                                  }
                                  className="
                                    min-w-28
                                    px-5
                                    py-3
                                    rounded-xl
                                    border
                                    border-emerald-500/40
                                    bg-emerald-500/5
                                    text-emerald-400
                                    font-semibold
                                    hover:bg-emerald-500
                                    hover:text-slate-950
                                    hover:scale-105
                                    active:scale-95
                                    transition-all
                                  "
                                >
                                  {formatTime(show.startTime)}
                                </button>

                              ))}

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default MovieDetailsPage;