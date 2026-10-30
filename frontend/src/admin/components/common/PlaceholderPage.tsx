import PageMeta from "./PageMeta";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <PageMeta title={`${title} | Geoportal Aceh`} description={`Halaman ${title}`} />
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 dark:bg-blue-900/20 dark:text-blue-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Halaman {title}</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Modul ini sedang dalam tahap pengembangan. Fitur CRUD (Create, Read, Update, Delete) akan segera diimplementasikan.
        </p>
      </div>
    </>
  );
}