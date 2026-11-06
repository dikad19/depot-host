import { useEffect, useRef } from "react";
import Header from "@/components/Header";
function RemoteApp({ load }) {
  const ref = useRef(null);

  useEffect(() => {
    let unmount;
    let cancelled = false;

    load()
      .then((m) => {
        const api = typeof m.mount === "function" ? m : m.default;
        if (!cancelled) unmount = api.mount(ref.current);
      })
      .catch((err) => {
        console.error("gagal memuat remote", err);
        if (ref.current) {
          ref.current.textContent = "Bagian ini gagal dimuat.";
        }
      });
    return () => {
      cancelled = true;
      if (unmount) unmount();
    };
  }, [load]);
  return <div ref={ref} />;
}

const loadCatalog = () => import("products/mount");

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main id="konten" className="mx-auto max-w-5xl p-4">
        <RemoteApp load={loadCatalog} />
      </main>
    </div>
  );
}
