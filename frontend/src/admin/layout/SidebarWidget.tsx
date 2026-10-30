import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export default function SidebarWidget() {
  return (
    <div className="pb-20 px-3">
      <div className="mx-auto w-full max-w-60 rounded-xl bg-blue-50 px-4 py-5 text-center dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
        <h3 className="mb-2 font-bold text-blue-900 dark:text-blue-100 text-sm">
          Geoportal Aceh
        </h3>
        <p className="mb-4 text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
          Lihat tampilan website publik, peta interaktif, dan katalog data.
        </p>
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 p-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Buka WebPortal <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}