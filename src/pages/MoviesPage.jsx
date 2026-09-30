import { useEffect, useMemo, useState } from 'react';
import { SectionHeading } from '../components/SectionHeading.jsx';
import { SearchInput } from '../components/SearchInput.jsx';
import { MovieCard } from '../components/MovieCard.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { fetchMovies } from '../services/movieService.js';
import { useNavigate } from 'react-router-dom';

function MoviesPage() {
  const [page, setPage] = useState(0);

  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const navigate = useNavigate();

  // =========================
  // LOAD MOVIES
  // =========================

  useEffect(() => {
    let isMounted = true;

    const loadMovies = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await fetchMovies({
          page: page,
          size: 12
        });

        console.log('Pagination response:', data);

        if (isMounted) {
          setMovies(data.movies);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
        }

      } catch (err) {
        console.error('Unable to load movies:', err);

        if (isMounted) {
          setError(
            'Unable to load movies from the backend right now.'
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


  // =========================
  // GENRES
  // =========================

  const genres = useMemo(() => {
    return [
      'All',
      ...new Set(
        movies.map((movie) => movie.genre || 'Genre')
      )
    ];
  }, [movies]);


  // =========================
  // FILTER
  // =========================

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return movies.filter((movie) => {
      const title =
        movie.title?.toLowerCase() ?? '';

      const subtitle =
        movie.subtitle?.toLowerCase() ?? '';

      const genreValue =
        movie.genre?.toLowerCase() ?? '';

      const tags =
        (movie.tags ?? []).map((tag) =>
          tag.toLowerCase()
        );

      const matchesQuery =
        !normalizedQuery ||
        title.includes(normalizedQuery) ||
        subtitle.includes(normalizedQuery) ||
        genreValue.includes(normalizedQuery) ||
        tags.some((tag) =>
          tag.includes(normalizedQuery)
        );

      const matchesGenre =
        genre === 'All' ||
        movie.genre === genre;

      return matchesQuery && matchesGenre;
    });

  }, [query, genre, movies]);


  // =========================
  // SORT
  // =========================

  const sortedMovies = useMemo(() => {

    return [...filteredMovies].sort((a, b) => {

      const modifier =
        sortOrder === 'asc' ? 1 : -1;

      if (sortBy === 'rating') {
        return modifier *
          ((a.rating ?? 0) - (b.rating ?? 0));
      }

      if (sortBy === 'year') {
        return modifier *
          ((parseInt(a.year, 10) || 0) -
           (parseInt(b.year, 10) || 0));
      }

      return modifier *
        (a.title ?? '').localeCompare(
          b.title ?? ''
        );
    });

  }, [filteredMovies, sortBy, sortOrder]);


  return (
    <div className="space-y-10">

      <SectionHeading
        label="Movies"
        title="Browse the CineHub movie lineup"
        description="Search and explore featured titles with instant page-based navigation and loading states."
      />


      {/* SEARCH + FILTERS */}

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.7fr_1fr]">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

          <SearchInput
            placeholder="Search by title, genre, or tag"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            className="max-w-xl"
          />

          <p className="text-sm text-slate-400">
            Showing {sortedMovies.length} of {totalElements} titles
          </p>

        </div>


        <div className="grid gap-3 sm:grid-cols-3">

          {/* GENRE */}

          <label className="block text-sm text-slate-300">

            Genre

            <select
              value={genre}
              onChange={(event) => {
                setGenre(event.target.value);
                setPage(0);
              }}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-sm text-white outline-none focus:border-brand-400"
            >

              {genres.map((value) => (
                <option
                  key={value}
                  value={value}
                  className="bg-slate-950 text-white"
                >
                  {value}
                </option>
              ))}

            </select>

          </label>


          {/* SORT */}

          <label className="block text-sm text-slate-300">

            Sort by

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setPage(0);
              }}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-sm text-white outline-none focus:border-brand-400"
            >

              <option value="rating">
                Rating
              </option>

              <option value="year">
                Year
              </option>

              <option value="title">
                Title
              </option>

            </select>

          </label>


          {/* ORDER */}

          <label className="block text-sm text-slate-300">

            Order

            <select
              value={sortOrder}
              onChange={(event) => {
                setSortOrder(event.target.value);
                setPage(0);
              }}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-sm text-white outline-none focus:border-brand-400"
            >

              <option value="desc">
                Descending
              </option>

              <option value="asc">
                Ascending
              </option>

            </select>

          </label>

        </div>

      </div>


      {/* MOVIES */}

      <div className="grid gap-6 lg:grid-cols-3">

        {loading ? (

          Array.from({ length: 12 }).map((_, index) => (

            <div
              key={index}
              className="space-y-4"
            >

              <Skeleton className="h-72 rounded-[2rem]" />

              <Skeleton className="h-6 w-3/4 rounded-full" />

              <Skeleton className="h-5 w-1/2 rounded-full" />

              <Skeleton className="h-12 rounded-2xl" />

            </div>

          ))

        ) : error ? (

          <div className="col-span-full rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-300">

            {error}

          </div>

        ) : sortedMovies.length > 0 ? (

          sortedMovies.map((movie) => (

            <MovieCard
              key={movie.id}
              {...movie}

              onAction={() => {
                console.log(
                  'Clicked movie:',
                  movie.id
                );

                navigate(
                  `/movies/${movie.id}`
                );
              }}
            />

          ))

        ) : (

          <div className="col-span-full rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-300">

            <p className="text-lg font-semibold text-white">
              No movies found
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Try a different search term or clear the filter to see all titles.
            </p>

          </div>

        )}

      </div>


      {/* PAGINATION */}

      <div className="flex justify-center pt-6">

        <Pagination
          currentPage={page + 1}
          totalPages={totalPages}
          onChange={(newPage) => {
            setPage(newPage - 1);
          }}
        />

      </div>

    </div>
  );
}

export default MoviesPage;