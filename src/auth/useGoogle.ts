import { useEffect, useState } from "react";

export default function useGoogle() {
  const [googleInstance, setGoogleInstance] = useState<typeof google | null>(null);

  useEffect(() => {
    if (window.google) {
      setGoogleInstance(window.google);
      return;
    }

    function handleLoad() {
      if (window.google) setGoogleInstance(window.google);
    }

    window.addEventListener("load", handleLoad);

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return googleInstance;
}
