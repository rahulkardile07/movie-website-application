import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FILMS_URL } from "../utils/constant";

const SingleMovieDetailPage = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const filmId = params.get("id");
  const filmName = params.get("name");
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadFilm = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(filmId ? `${FILMS_URL}/${encodeURIComponent(filmId)}` : FILMS_URL, { signal: controller.signal });
        if (!response.ok) throw new Error("Film not found.");
        const data = await response.json();
        const result = Array.isArray(data)
          ? data.find((item) => item.title.toLowerCase() === (filmName ?? "").toLowerCase())
          : data;
        if (!result) throw new Error("Film not found.");
        setFilm(result);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") setError("Film not found.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadFilm();
    return () => controller.abort();
  }, [filmId, filmName]);

  if (loading) return <div className="text-center bg-bgColor text-white text-lg min-h-screen p-8">Loading...</div>;
  if (error) return <div className="text-center bg-bgColor text-white text-lg min-h-screen p-8">{error}</div>;

  return (
    <main className="w-full min-h-screen bg-bgColor text-white px-4 py-8">
      {film && (
        <article className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start gap-8">
            <img src={film.image} alt={film.title} className="w-56 rounded-lg shadow-xl" />
            <div>
              <h1 className="text-4xl font-bold mb-4">{film.title}</h1>
              <p className="text-blue-300 text-xl mb-4">Rotten Tomatoes score: {film.rt_score}/100</p>
              <p className="text-gray-300 mb-2">Release year: {film.release_date}</p>
              <p className="text-gray-300 mb-2">Running time: {film.running_time} minutes</p>
              <p className="text-gray-300 mb-2">Director: {film.director}</p>
              <p className="text-gray-300">Producer: {film.producer}</p>
              {film.original_title_romanised && <p className="text-gray-400 mt-3">Original title: {film.original_title_romanised}</p>}
            </div>
          </div>
          <section className="mt-8">
            <h2 className="text-3xl font-semibold mb-3">Synopsis</h2>
            <p className="text-gray-300 leading-relaxed">{film.description}</p>
          </section>
        </article>
      )}
    </main>
  );
};

export default SingleMovieDetailPage;
