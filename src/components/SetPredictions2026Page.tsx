import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSeasonPredictions2026 } from '../hooks/useSeasonPredictions2026';
import { DRIVERS_2026, CONSTRUCTORS_2026 } from '../data/drivers2026';

const DRIVER_SLOTS = 22;
const CONSTRUCTOR_SLOTS = 11;

export function SetPredictions2026Page() {
  const { user } = useAuth();
  const {
    driverPredictions,
    constructorPredictions,
    isLoading,
    save,
    isSaving,
    saveError,
  } = useSeasonPredictions2026(user?.id);

  const [drivers, setDrivers] = useState<string[]>(() => Array(DRIVER_SLOTS).fill(''));
  const [constructors, setConstructors] = useState<string[]>(() => Array(CONSTRUCTOR_SLOTS).fill(''));
  const [driverSaved, setDriverSaved] = useState(false);
  const [constructorSaved, setConstructorSaved] = useState(false);

  useEffect(() => {
    if (driverPredictions?.length) {
      setDrivers((prev) =>
        Array(DRIVER_SLOTS)
          .fill('')
          .map((_, i) => driverPredictions[i] ?? prev[i] ?? '')
      );
    }
  }, [driverPredictions]);

  useEffect(() => {
    if (constructorPredictions?.length) {
      setConstructors((prev) =>
        Array(CONSTRUCTOR_SLOTS)
          .fill('')
          .map((_, i) => constructorPredictions[i] ?? prev[i] ?? '')
      );
    }
  }, [constructorPredictions]);

  const setDriver = (index: number, value: string) => {
    setDrivers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setDriverSaved(false);
  };

  const setConstructor = (index: number, value: string) => {
    setConstructors((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setConstructorSaved(false);
  };

  const validDrivers =
    drivers.filter(Boolean).length === DRIVER_SLOTS &&
    new Set(drivers.filter(Boolean)).size === DRIVER_SLOTS;
  const validConstructors =
    constructors.filter(Boolean).length === CONSTRUCTOR_SLOTS &&
    new Set(constructors.filter(Boolean)).size === CONSTRUCTOR_SLOTS;

  const handleSaveDrivers = async () => {
    if (!validDrivers) return;
    await save({ championshipType: 'drivers', predictions: drivers });
    setDriverSaved(true);
  };

  const handleSaveConstructors = async () => {
    if (!validConstructors) return;
    await save({ championshipType: 'constructors', predictions: constructors });
    setConstructorSaved(true);
  };

  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <p className="text-navy font-bold">Please log in to set your predictions.</p>
        <Link to="/login" className="text-red font-bold underline mt-2 inline-block">
          Log in
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <p className="text-navy font-bold">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-2">Set my 2026 predictions</h1>
      <p className="text-navy/80 text-sm mb-6">
        Choose your predicted finishing order for the 2026 season. You can update these anytime.
      </p>
      <Link
        to="/season/2026"
        className="text-sm text-red font-bold hover:underline mb-6 inline-block"
      >
        ← Back to 2026 dashboard
      </Link>

      {/* Drivers */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-navy mb-3">Drivers championship (1–22)</h2>
        <div className="space-y-2 mb-4">
          {Array.from({ length: DRIVER_SLOTS }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-8 text-sm font-bold text-navy">{i + 1}.</span>
              <select
                value={drivers[i] ?? ''}
                onChange={(e) => setDriver(i, e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-input rounded-md text-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select driver</option>
                {DRIVERS_2026.map((d) => (
                  <option
                    key={d}
                    value={d}
                    disabled={drivers.includes(d) && drivers[i] !== d}
                  >
                    {d}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleSaveDrivers}
          disabled={!validDrivers || isSaving}
          className="py-3 px-6 bg-primary text-primary-foreground font-bold rounded-full shadow-lg hover:bg-primary/90 hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wide"
        >
          {isSaving ? 'Saving…' : 'Save drivers'}
        </button>
        {driverSaved && (
          <span className="ml-3 text-sm text-green-700 font-bold">Saved.</span>
        )}
      </section>

      {/* Constructors */}
      <section>
        <h2 className="text-lg font-bold text-navy mb-3">Constructors championship (1–11)</h2>
        <div className="space-y-2 mb-4">
          {Array.from({ length: CONSTRUCTOR_SLOTS }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-8 text-sm font-bold text-navy">{i + 1}.</span>
              <select
                value={constructors[i] ?? ''}
                onChange={(e) => setConstructor(i, e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-input rounded-md text-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select constructor</option>
                {CONSTRUCTORS_2026.map((c) => (
                  <option
                    key={c}
                    value={c}
                    disabled={constructors.includes(c) && constructors[i] !== c}
                  >
                    {c}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleSaveConstructors}
          disabled={!validConstructors || isSaving}
          className="py-3 px-6 bg-primary text-primary-foreground font-bold rounded-full shadow-lg hover:bg-primary/90 hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wide"
        >
          {isSaving ? 'Saving…' : 'Save constructors'}
        </button>
        {constructorSaved && (
          <span className="ml-3 text-sm text-green-700 font-bold">Saved.</span>
        )}
      </section>

      {saveError && (
        <p className="mt-4 text-sm text-red font-bold" role="alert">
          {saveError instanceof Error ? saveError.message : 'Save failed'}
        </p>
      )}
    </div>
  );
}
