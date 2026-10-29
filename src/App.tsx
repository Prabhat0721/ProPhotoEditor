import { useRef, useState } from 'react';
import { ImagePlus, RotateCw, Undo2, Download, Sun, Contrast, Droplets } from 'lucide-react';

export default function App() {
  const picker = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);

  const reset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
  };

  const exportImage = () => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      const sideways = rotation % 180 !== 0;
      const canvas = document.createElement('canvas');
      canvas.width = sideways ? img.height : img.width;
      canvas.height = sideways ? img.width : img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      const link = document.createElement('a');
      link.download = 'edited-photo.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    };
    img.src = image;
  };

  return (
    <main className="min-h-screen bg-[#101114] text-white px-4 py-5 pb-10">
      <header className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-violet-300">Studio</p>
          <h1 className="text-2xl font-bold">PhotoCraft</h1>
        </div>
        <button onClick={reset} className="rounded-full bg-white/10 p-3" aria-label="Reset edits">
          <Undo2 size={20} />
        </button>
      </header>

      <section className="flex min-h-[40vh] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#1b1c22]">
        {image ? (
          <img
            src={image}
            alt="Photo preview"
            className="max-h-[55vh] max-w-full object-contain"
            style={{
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
              transform: `rotate(${rotation}deg)`,
            }}
          />
        ) : (
          <button onClick={() => picker.current?.click()} className="flex flex-col items-center gap-3 p-8 text-center">
            <span className="rounded-2xl bg-violet-500/20 p-5 text-violet-300"><ImagePlus size={36} /></span>
            <span className="text-lg font-semibold">Choose a photo</span>
            <span className="text-sm text-gray-400">Select an image from your device to begin</span>
          </button>
        )}
      </section>

      <input
        ref={picker}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setImage(URL.createObjectURL(file));
            reset();
          }
        }}
      />

      <div className="mt-5 grid grid-cols-3 gap-3">
        <button onClick={() => picker.current?.click()} className="rounded-2xl bg-violet-600 px-2 py-3 text-sm font-medium">
          <ImagePlus size={18} className="mx-auto mb-1" /> Open Photo
        </button>
        <button onClick={() => setRotation((r) => (r + 90) % 360)} disabled={!image} className="rounded-2xl bg-white/10 px-2 py-3 text-sm disabled:opacity-40">
          <RotateCw size={18} className="mx-auto mb-1" /> Rotate
        </button>
        <button onClick={exportImage} disabled={!image} className="rounded-2xl bg-white/10 px-2 py-3 text-sm disabled:opacity-40">
          <Download size={18} className="mx-auto mb-1" /> Export
        </button>
      </div>

      <section className="mt-7 space-y-6 rounded-3xl bg-[#1b1c22] p-5">
        <h2 className="text-lg font-semibold">Adjustments</h2>
        <label className="block">
          <span className="mb-3 flex items-center justify-between text-sm"><span className="flex items-center gap-2"><Sun size={17} /> Brightness</span><span>{brightness}%</span></span>
          <input className="w-full accent-violet-400" type="range" min="20" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
        </label>
        <label className="block">
          <span className="mb-3 flex items-center justify-between text-sm"><span className="flex items-center gap-2"><Contrast size={17} /> Contrast</span><span>{contrast}%</span></span>
          <input className="w-full accent-violet-400" type="range" min="20" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} />
        </label>
        <label className="block">
          <span className="mb-3 flex items-center justify-between text-sm"><span className="flex items-center gap-2"><Droplets size={17} /> Saturation</span><span>{saturation}%</span></span>
          <input className="w-full accent-violet-400" type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} />
        </label>
      </section>
      <p className="mt-5 text-center text-xs text-gray-500">Your edits stay on this device.</p>
    </main>
  );
}
