import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function NotFoundPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <Icon icon="mdi-movie-off" className="text-6xl text-primary-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-grey-400 mb-4">Page Not Found</h2>
        <p className="text-grey-500 max-w-md mx-auto">
          The movie or page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Icon icon="mdi-home" />
          Go Home
        </Link>

        <Link
          to="/movies"
          className="px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Icon icon="mdi-movie" />
          Browse Movies
        </Link>
      </div>
    </div>
  );
}
