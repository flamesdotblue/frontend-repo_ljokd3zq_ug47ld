import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, ImageDown, SlidersHorizontal, Eraser, RotateCcw } from 'lucide-react';

function useImageProcessor() {
  const [source, setSource] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [params, setParams] = useState({ smooth: 1, threshold: 90, invert: false });

  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const applyProcessing = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const maxW = 1100; // UI canvas size for speed
    const scale = Math.min(1, maxW / img.naturalWidth);
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));

    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    // draw
    ctx.drawImage(img, 0, 0, w, h);

    // get data
    const imageData = ctx.getImageData(0, 0, w, h);
    const { data } = imageData;

    // grayscale with luminosity
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      data[i] = data[i + 1] = data[i + 2] = gray;
    }

    // simple box blur for smoothing
    const radius = Math.max(0, Math.min(6, Math.round(params.smooth)));
    if (radius > 0) {
      const tmp = new Uint8ClampedArray(data);
      const w4 = w * 4;
      const kernel = (2 * radius + 1) ** 2;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let sum = 0;
          for (let ky = -radius; ky <= radius; ky++) {
            const yy = Math.min(h - 1, Math.max(0, y + ky));
            for (let kx = -radius; kx <= radius; kx++) {
              const xx = Math.min(w - 1, Math.max(0, x + kx));
              sum += tmp[yy * w4 + xx * 4];
            }
          }
          const idx = y * w4 + x * 4;
          const v = sum / kernel;
          data[idx] = data[idx + 1] = data[idx + 2] = v;
        }
      }
    }

    // Sobel edge detection
    const gray = new Uint8ClampedArray(data.length / 4);
    for (let i = 0, j = 0; i < data.length; i += 4, j++) gray[j] = data[i];

    const out = new Uint8ClampedArray(gray.length);
    const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let sx = 0, sy = 0, idx = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const v = gray[(y + ky) * w + (x + kx)];
            sx += v * gx[idx];
            sy += v * gy[idx];
            idx++;
          }
        }
        const mag = Math.sqrt(sx * sx + sy * sy);
        out[y * w + x] = mag > params.threshold ? 0 : 255; // black lines on white
      }
    }

    // write back to canvas
    const result = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const v = out[y * w + x] || 255;
        const ii = (y * w + x) * 4;
        const color = params.invert ? 255 - v : v;
        result.data[ii] = result.data[ii + 1] = result.data[ii + 2] = color;
        result.data[ii + 3] = 255;
      }
    }
    ctx.putImageData(result, 0, 0);
  }, [params]);

  const loadFromFile = useCallback((file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSource(url);
  }, []);

  useEffect(() => {
    if (!source) return;
    setProcessing(true);
    const img = new Image();
    imgRef.current = img;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      applyProcessing();
      setProcessing(false);
    };
    img.onerror = () => setProcessing(false);
    img.src = source;
    return () => URL.revokeObjectURL(source);
  }, [source, applyProcessing]);

  useEffect(() => {
    if (imgRef.current) applyProcessing();
  }, [params, applyProcessing]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'coloring-page.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  const reset = useCallback(() => {
    setSource(null);
    setParams({ smooth: 1, threshold: 90, invert: false });
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return {
    canvasRef,
    setParams,
    params,
    loadFromFile,
    download,
    processing,
    hasImage: !!source,
    reset,
  };
}

export default function ColoringConverter() {
  const {
    canvasRef,
    setParams,
    params,
    loadFromFile,
    download,
    processing,
    hasImage,
    reset,
  } = useImageProcessor();

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) loadFromFile(file);
  }, [loadFromFile]);

  const onChangeFile = (e) => {
    const file = e.target.files?.[0];
    if (file) loadFromFile(file);
  };

  return (
    <section id="generator" className="py-14">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="relative rounded-2xl border border-dashed border-slate-300 bg-white/60 backdrop-blur p-6 flex flex-col"
          >
            <div className="flex-1 grid place-items-center">
              <div className="w-full">
                <canvas ref={canvasRef} className="w-full h-auto rounded-lg border border-slate-200 bg-white" />
                {!hasImage && (
                  <div className="absolute inset-0 p-6 grid place-items-center">
                    <div className="text-center">
                      <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 grid place-items-center text-slate-500">
                        <Upload />
                      </div>
                      <p className="mt-3 font-medium text-slate-800">Drop an image here or choose a file</p>
                      <p className="text-sm text-slate-500">JPG, PNG, HEIC supported</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <label className="inline-flex">
                <input type="file" accept="image/*" className="hidden" onChange={onChangeFile} />
                <span className="px-4 py-2 rounded-xl bg-slate-900 text-white inline-flex items-center gap-2 cursor-pointer">
                  <Upload size={18} /> Choose image
                </span>
              </label>
              <button
                onClick={download}
                disabled={!hasImage || processing}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 inline-flex items-center gap-2 disabled:opacity-50"
              >
                <ImageDown size={18} /> Download PNG
              </button>
              <button
                onClick={reset}
                disabled={!hasImage}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 inline-flex items-center gap-2 disabled:opacity-50"
              >
                <RotateCcw size={18} /> Reset
              </button>
              {processing && <span className="text-sm text-slate-500">Processing...</span>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-6">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <SlidersHorizontal size={18} /> Controls
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <label className="text-slate-600">Smoothing</label>
                  <span className="text-slate-500">{params.smooth}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={6}
                  step={1}
                  value={params.smooth}
                  onChange={(e) => setParams((p) => ({ ...p, smooth: Number(e.target.value) }))}
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-1">Reduce photo noise for cleaner lines.</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <label className="text-slate-600">Edge threshold</label>
                  <span className="text-slate-500">{params.threshold}</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={200}
                  step={1}
                  value={params.threshold}
                  onChange={(e) => setParams((p) => ({ ...p, threshold: Number(e.target.value) }))}
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-1">Higher values thin out lines; lower values capture more detail.</p>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-slate-600">Dark mode (invert)</label>
                <button
                  onClick={() => setParams((p) => ({ ...p, invert: !p.invert }))}
                  className={`px-3 py-1.5 rounded-lg border text-sm ${params.invert ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700'}`}
                >
                  {params.invert ? 'On' : 'Off'}
                </button>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 flex items-start gap-3">
                <Eraser className="mt-0.5" size={16} />
                <p>
                  Tip: For best results, use clear, high-contrast photos. Faces, animals, and objects on simple backgrounds convert beautifully.
                </p>
              </div>

              <div id="how" className="border-t pt-6 mt-2">
                <h3 className="font-semibold text-slate-800">How it works</h3>
                <ol className="mt-3 space-y-2 text-sm text-slate-600 list-decimal list-inside">
                  <li>Upload a photo or drag-and-drop it into the canvas.</li>
                  <li>Adjust smoothing and threshold until lines look clean.</li>
                  <li>Download your printable coloring page as PNG.</li>
                  <li>Print and enjoy coloring!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
