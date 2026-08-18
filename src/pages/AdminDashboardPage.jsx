import { useEffect, useRef, useState } from 'react';
import {
  createMovie,
  getPendingOwnerRequests,
  approveOwnerRequest,
  rejectOwnerRequest
} from '../api/adminApi.js';

const initialMovieForm = {
  title: 'KGF Chapter 3',
  description: 'Action movie',
  duration: '180',
  genre: 'ACTION',
  language: 'KANNADA',
  certificate: 'UA',
  releaseDate: '2026-08-01',
  imdbRating: '8.9'
};

const genreOptions = [
  'ACTION',
  'ADVENTURE',
  'ANIMATION',
  'COMEDY',
  'CRIME',
  'DRAMA',
  'FANTASY',
  'HORROR',
  'MYSTERY',
  'ROMANCE',
  'SCI_FI',
  'THRILLER',
  'DOCUMENTARY'
];

const languageOptions = ['ENGLISH', 'HINDI', 'KANNADA', 'TAMIL', 'TELUGU', 'MALAYALAM'];
const certificateOptions = ['U', 'UA', 'A'];

function AdminDashboardPage() {
  const [form, setForm] = useState(initialMovieForm);
  const [posterFile, setPosterFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestInFlightRef = useRef(false);
  const [ownerRequests, setOwnerRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (requestInFlightRef.current) {
      return;
    }

    if (!posterFile) {
      return;
    }

    requestInFlightRef.current = true;
    setIsSubmitting(true);

    try {
      const moviePayload = {
        ...form,
        duration: Number(form.duration),
        imdbRating: Number(form.imdbRating)
      };

      const payload = new FormData();
      payload.append(
        'movie',
        new Blob([JSON.stringify(moviePayload)], { type: 'application/json' })
      );
      payload.append('poster', posterFile);

      await createMovie(payload);
      setForm(initialMovieForm);
      setPosterFile(null);
    } catch (err) {
      // Intentionally ignore upload errors so nothing is displayed on screen.
    } finally {
      requestInFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  const [activeTab, setActiveTab] = useState('movie');

  useEffect(() => {
    let mounted = true;

    async function loadRequests() {
      setLoadingRequests(true);
      try {
        const data = await getPendingOwnerRequests();
        if (mounted) setOwnerRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load owner requests', err);
      } finally {
        if (mounted) setLoadingRequests(false);
      }
    }

    loadRequests();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex gap-6">
      <aside className="w-60 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Admin</h2>
          <p className="text-xs text-slate-400">Choose an action</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('movie')}
            className={`text-left rounded-xl px-3 py-2 text-sm font-medium transition ${
              activeTab === 'movie' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-950/60'
            }`}
          >
            Create Movie
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`text-left rounded-xl px-3 py-2 text-sm font-medium transition ${
              activeTab === 'requests' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-950/60'
            }`}
          >
            Owner Requests
          </button>
        </nav>
      </aside>

      <div className="flex-1 space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
        <div>
          <h1 className="text-3xl font-semibold text-white">Admin Dashboard</h1>
          <p className="mt-3 text-slate-400">Manage movies and owner requests.</p>
        </div>

        {activeTab === 'movie' && (
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              Title
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              />
            </label>

            <label className="text-sm text-slate-300">
              Genre
              <select
                name="genre"
                value={form.genre}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              >
                {genreOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm text-slate-300 md:col-span-2">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="3"
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              />
            </label>

            <label className="text-sm text-slate-300">
              Duration (minutes)
              <input
                name="duration"
                type="number"
                value={form.duration}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              />
            </label>

            <label className="text-sm text-slate-300">
              Language
              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              >
                {languageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm text-slate-300">
              Certificate
              <select
                name="certificate"
                value={form.certificate}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              >
                {certificateOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm text-slate-300">
              Release date
              <input
                name="releaseDate"
                type="date"
                value={form.releaseDate}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              />
            </label>

            <label className="text-sm text-slate-300">
              IMDb rating
              <input
                name="imdbRating"
                step="0.1"
                value={form.imdbRating}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              />
            </label>

            <label className="text-sm text-slate-300 md:col-span-2">
              Poster image
              <input
                type="file"
                accept="image/*"
                required
                onChange={(event) => setPosterFile(event.target.files?.[0] ?? null)}
                className="mt-2 w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-4 py-3 text-white"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="md:col-span-2 w-full rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Uploading...' : 'Upload movie'}
            </button>
          </form>
        )}

        {activeTab === 'requests' && (
          <div className="mt-2">
            <h2 className="text-2xl font-semibold text-white">Owner Requests</h2>
            <p className="mt-2 text-slate-400">Approve or reject theatre owner requests.</p>

            {loadingRequests ? (
              <p className="mt-4 text-slate-300">Loading requests...</p>
            ) : ownerRequests.length === 0 ? (
              <p className="mt-4 text-slate-300">No pending requests.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {ownerRequests.map((req) => (
                  <li
                    key={req.id}
                    className="flex items-start justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
                  >
                    <div className="max-w-[70%]">
                      <div className="text-sm text-slate-300">{req.businessName || req.business || 'Unknown business'}</div>
                      <div className="mt-1 text-xs text-slate-400">
                        {req.name || req.email || ''} {req.phone ? `• ${req.phone}` : ''}
                      </div>
                      {req.address && <div className="mt-1 text-xs text-slate-400">{req.address}</div>}
                      {req.gstNumber && <div className="mt-1 text-xs text-slate-400">GST: {req.gstNumber}</div>}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await approveOwnerRequest(req.id);
                            setOwnerRequests((current) => current.filter((r) => r.id !== req.id));
                          } catch (err) {
                            console.error('Approve failed', err);
                          }
                        }}
                        className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await rejectOwnerRequest(req.id);
                            setOwnerRequests((current) => current.filter((r) => r.id !== req.id));
                          } catch (err) {
                            console.error('Reject failed', err);
                          }
                        }}
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
