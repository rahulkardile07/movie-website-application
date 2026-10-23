import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILMS_URL } from "../utils/constant";

const HighRatedPage = () => {
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    fetch(FILMS_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load films.");
        return response.json();
      })
      .then((data) => setFilms(Array.isArray(data) ? [...data].sort((a, b) => Number(b.rt_score) - Number(a.rt_score)) : []))
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") setError("Unable to load films. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="bg-bgColor text-white w-full min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Highest Rated Ghibli Films</h1>
      {loading ? <p className="text-center">Loading films...</p> : error ? <p className="text-center text-red-400">{error}</p> : (
        <div className="flex flex-wrap items-start justify-center gap-10">
          {films.map((film) => (
            <button type="button" key={film.id} className="w-48 text-left group cursor-pointer" onClick={() => navigate(`/SingleMovieDetailPage?id=${encodeURIComponent(film.id)}`)}>
              <img src={film.image} alt={film.title} className="w-full rounded-lg transition-transform group-hover:scale-105 duration-300" />
              <span className="block text-lg font-semibold mt-2">{film.title}</span>
              <span className="block text-sm text-gray-400">Score: {film.rt_score}/100 · {film.release_date}</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
};

export default HighRatedPage;
