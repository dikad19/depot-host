import { useEffect, useRef } from "react";

function RemoteApp({ load }) {
  const ref = useRef;

  useEffect(() => {
    let unmount;
    let cancelled = false;

    load()
      .then((m) => {
        if (!cancelled) unmount = m.mount(ref.current);
      })
      .catch(() => {
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

const loadCatalog = () => import("catalog/mount");

export default function App() {
  return (
    <div>
      <header>Toko Saya</header>
      <main>
        <RemoteApp load={loadCatalog} />
      </main>
    </div>
  );
}
