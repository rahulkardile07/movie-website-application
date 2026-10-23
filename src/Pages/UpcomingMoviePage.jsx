import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILMS_URL } from "../utils/constant";

const UpcomingMoviePage = () => {
  const [films, setFilms] = useState([]);
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
      .then((data) => setFilms(Array.isArray(data) ? [...data].sort((a, b) => Number(b.release_date) - Number(a.release_date)) : []))
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") setError("Unable to load films. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="p-4 bg-bgColor text-white w-full min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-2">Latest Studio Ghibli Films</h1>
      <p className="text-center text-gray-400 mb-8">Sorted by release year</p>
      {loading ? <p className="text-center">Loading films...</p> : error ? <p className="text-center text-red-400">{error}</p> : (
        <div className="flex flex-wrap items-start justify-center gap-10">
          {films.map((film) => (
            <button type="button" key={film.id} className="w-48 text-left group cursor-pointer" onClick={() => navigate(`/SingleMovieDetailPage?id=${encodeURIComponent(film.id)}`)}>
              <img src={film.image} alt={film.title} className="w-full rounded-lg transition-transform group-hover:scale-105 duration-300" />
              <span className="block text-lg font-semibold mt-2">{film.title}</span>
              <span className="block text-sm text-gray-400">Released {film.release_date}</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
};

export default UpcomingMoviePage;
