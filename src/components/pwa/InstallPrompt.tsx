// src/components/pwa/InstallPrompt.tsx
import { useEffect, useState } from "react";
import { useIsIos, useIsStandalone } from "../../hooks/useIsIos";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

let deferredPrompt: any = null;

export default function InstallPrompt() {
  const [showGuide, setShowGuide] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const isIos = useIsIos();
  const isStandalone = useIsStandalone();

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt = e;
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (isIos) {
      setShowGuide(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
        setShowInstall(false);
      });
    }
  };

  if (isStandalone) return null;

  return (
    <>
      {(isIos || showInstall) && (
        <Button onClick={handleInstallClick}>
          Download App
        </Button>
      )}
      {isIos && (
        <Modal isOpen={showGuide} onClose={() => setShowGuide(false)}>
          <div className="p-6 text-gray-800 dark:text-white">
            <h2 className="text-xl font-semibold mb-4">Install this app</h2>
            <p>
              Tap the <strong>Share</strong> <span role="img" aria-label="share">🔗</span> icon
              and select <strong>Add to Home Screen</strong>.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}