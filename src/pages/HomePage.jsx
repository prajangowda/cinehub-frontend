import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Button } from "../components/Button.jsx";
import { SearchInput } from "../components/SearchInput.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { MovieCard } from "../components/MovieCard.jsx";

import { fetchMovies } from "../services/movieService.js";


function HomePage() {

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [featuredMovies, setFeaturedMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ============================================================
  // LOAD MOVIES
  // ============================================================

  useEffect(() => {

    let isMounted = true;

    const loadMovies = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await fetchMovies({
          page,
          size: 6
        });

        if (isMounted) {

          setFeaturedMovies(data.movies ?? []);
          setTotalPages(data.totalPages ?? 0);

        }

      } catch (err) {

        console.error("Unable to load movies:", err);

        if (isMounted) {

          setError(
            "We couldn't load the movies right now."
          );

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

  }, [page]);


  const featuredMovie = featuredMovies[0];
   

  return (

    <div className="space-y-20 pb-12">


      {/* ========================================================
          HERO
      ======================================================== */}

      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-[#0b0b0f]">

        {/* Ambient background */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />

          <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        </div>


        <div className="relative grid min-h-[520px] lg:grid-cols-[1.05fr_0.95fr]">


          {/* ====================================================
              HERO CONTENT
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col justify-center p-8 sm:p-12 lg:p-16"
          >

            <div className="max-w-xl space-y-7">

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-brand-400" />

                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-300">
                  CineHub
                </span>

              </div>


              <div>

                <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[4rem]">

                  Your next great
                  <span className="block text-brand-400">
                    cinema experience.
                  </span>

                </h1>

              </div>


              <p className="max-w-lg text-base leading-7 text-slate-400 sm:text-lg">

                Discover movies, explore theatres, choose your seats,
                and book your next night out — all in one place.

              </p>


              {/* Search */}

              


              {/* Actions */}

              <div className="flex flex-wrap items-center gap-3">

                <Link to="/movies">

                  <Button>
                    Explore movies
                  </Button>

                </Link>


                <Link
                  to="/movies"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.04]"
                >

                  View all movies

                  <span aria-hidden="true">
                    →
                  </span>

                </Link>

              </div>

            </div>

          </motion.div>


          {/* ====================================================
              FEATURED MOVIE
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative min-h-[420px] lg:min-h-full"
          >

            {loading ? (

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-brand-400" />

              </div>

            ) : featuredMovie ? (

              <>

                {/* Poster */}
                 
                {featuredMovie.image && (

                 
                  <img
                    src={featuredMovie.image}
                    alt={featuredMovie.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                )}


                {/* Cinematic overlays */}

                <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0f] via-[#0b0b0f]/35 to-transparent" />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-transparent to-[#0b0b0f]/20" />


                {/* Movie information */}

                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">

                  <div className="max-w-md">

                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
                      Now showing
                    </p>


                    <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">

                      {featuredMovie.title}

                    </h2>


                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-300">

                      {featuredMovie.genre && (
                        <span>
                          {featuredMovie.genre}
                        </span>
                      )}

                      {featuredMovie.duration && (
                        <>
                          <span className="text-slate-600">
                            •
                          </span>

                          <span>
                            {featuredMovie.duration} min
                          </span>
                        </>
                      )}

                      {featuredMovie.certificate && (
                        <>
                          <span className="text-slate-600">
                            •
                          </span>

                          <span>
                            {featuredMovie.certificate}
                          </span>
                        </>
                      )}

                    </div>


                    <button
                      onClick={() =>
                        navigate(`/movies/${featuredMovie.id}`)
                      }
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                    >

                      Book tickets

                      <span>
                        →
                      </span>

                    </button>

                  </div>

                </div>

              </>

            ) : (

              <div className="absolute inset-0 flex items-center justify-center">

                <p className="text-sm text-slate-500">
                  No featured movie available.
                </p>

              </div>

            )}

          </motion.div>

        </div>

      </section>


      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (

        <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.04] px-5 py-4 text-sm text-red-300">

          {error}

        </div>

      )}


      {/* ========================================================
          MOVIES
      ======================================================== */}

      <section className="space-y-8">


        {/* Heading */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <SectionHeading
            label="Now showing"
            title="Movies worth watching"
            description="Find something for your next cinema visit."
          />


          <Link
            to="/movies"
            className="hidden shrink-0 text-sm font-medium text-brand-300 transition hover:text-brand-200 sm:block"
          >

            See all movies
            <span className="ml-2">
              →
            </span>

          </Link>

        </div>


        {/* Movie grid */}

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">


          {loading ? (

            Array.from({ length: 6 }).map((_, index) => (

              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/[0.05] bg-slate-900/40"
              >

                <div className="aspect-[2/3] animate-pulse bg-slate-800/60" />

                <div className="space-y-3 p-5">

                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-800" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-800" />

                  <div className="h-10 animate-pulse rounded-xl bg-slate-800" />

                </div>

              </div>

            ))

          ) : (

            featuredMovies.slice(0, 6).map((movie) => (

              <motion.div
                key={movie.id}
                initial={{
                  opacity: 0,
                  y: 15
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.35
                }}
              >

                <MovieCard
                  {...movie}
                  onAction={() => {

                    navigate(
                      `/movies/${movie.id}`
                    );

                  }}
                />

              </motion.div>

            ))

          )}

        </div>


        {/* ======================================================
            PAGINATION
        ====================================================== */}

        {totalPages > 1 && (

          <div className="flex items-center justify-center pt-4">

            <Pagination
              currentPage={page + 1}
              totalPages={totalPages}
              onChange={(newPage) => {

                setPage(newPage - 1);

                window.scrollTo({
                  top: 0,
                  behavior: "smooth"
                });

              }}
            />

          </div>

        )}

      </section>


      {/* ========================================================
          BOTTOM CTA
      ======================================================== */}

      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-slate-900/50 px-6 py-14 text-center sm:px-10">

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-500/[0.04] via-transparent to-purple-500/[0.04]" />

        <div className="relative mx-auto max-w-2xl">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-300">
            Plan your next outing
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Find a movie. Pick a seat. Enjoy the show.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Browse the latest releases and discover shows playing
            near you.
          </p>

          <Link
            to="/movies"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
          >

            Browse movies

            <span>
              →
            </span>

          </Link>

        </div>

      </section>

    </div>

  );

}


export default HomePage;