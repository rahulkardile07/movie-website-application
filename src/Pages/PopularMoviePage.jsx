import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FILMS_URL } from "../utils/constant";

const PopularMoviePage = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("name")?.trim() ?? "";

  useEffect(() => {
    const controller = new AbortController();
    const loadFilms = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(FILMS_URL, { signal: controller.signal });
        if (!response.ok) throw new Error("Could not load films.");
        const data = await response.json();
        setFilms(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") setError("Unable to load films. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadFilms();
    return () => controller.abort();
  }, []);

  const visibleFilms = films.filter((film) =>
    film.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="p-4 bg-bgColor text-white w-full min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Studio Ghibli Films</h1>
      {loading ? (
        <p className="text-center">Loading films...</p>
      ) : error ? (
        <p className="text-center text-red-400">{error}</p>
      ) : visibleFilms.length ? (
        <div className="flex flex-wrap items-start justify-center gap-10">
          {visibleFilms.map((film) => (
            <button
              type="button"
              key={film.id}
              className="w-48 text-left group cursor-pointer"
              onClick={() => navigate(`/SingleMovieDetailPage?id=${encodeURIComponent(film.id)}`)}
            >
              <img src={film.image} alt={film.title} className="w-full rounded-lg transition-transform group-hover:scale-105 duration-300" />
              <span className="block text-lg font-semibold mt-2">{film.title}</span>
              <span className="block text-sm text-gray-400">Year: {film.release_date} · Score: {film.rt_score}/100</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center">No films found.</p>
      )}
    </main>
  );
};

export default PopularMoviePage;
