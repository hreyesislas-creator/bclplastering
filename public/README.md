# Image architecture

Drop production photography here. Paths are referenced from `src/lib/images.ts`
— update the manifest to enable an image (set `enabled: true` on the entry).

```
/public
├── hero/                       Cinematic hero backgrounds
│   ├── primary.jpg             Desktop hero (≥ 2000×1200, ≤ 350 KB)
│   ├── primary-mobile.jpg      Mobile hero (≥ 900×1200)
│   └── showcase-portrait.jpg   Right-column testimonial portrait
├── services/                   One per service slug, 1600×1200
│   ├── stucco-installation.jpg
│   ├── stucco-repair.jpg
│   ├── exterior-remodeling.jpg
│   ├── interior-remodeling.jpg
│   ├── drywall-repair.jpg
│   └── decorative-finishes.jpg
├── before-after/               Slider pairs, same crop & focal length
│   ├── riverside-before.jpg
│   ├── riverside-after.jpg
│   ├── moreno-valley-before.jpg
│   ├── moreno-valley-after.jpg
│   ├── corona-before.jpg
│   └── corona-after.jpg
├── projects/                   Per-project galleries
│   ├── stucco-installation/
│   ├── stucco-repair/
│   ├── remodeling/
│   └── drywall/
├── reviews/                    Reviewer headshots (optional, square ≥ 240×240)
└── textures/                   Background textures (used decoratively only)
```

## Recommended specs

* Format: `.jpg` for photography, `.webp` if you can pre-encode
* Hero: 2000×1200 desktop / 900×1200 mobile, JPG quality 75–80
* Cards: 1600×1200, JPG quality 78
* Reviewer portraits: 240×240, JPG quality 82
* Keep total per image under 350 KB whenever possible — the layout already
  carries weight via gradients and motion.

## How to enable an image

1. Drop the file in the matching folder using the filename above.
2. Open `src/lib/images.ts`.
3. Flip `enabled: false` to `enabled: true` on the matching entry.

The component will swap from gradient placeholder to the real photo with no
other code change.
