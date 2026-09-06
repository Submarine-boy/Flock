# assets/images

This directory will hold responsive, optimized images for the Flock site.

Planned structure (currently placeholders):

- assets/images/originals/   # keep the original uploaded files here for safekeeping
- assets/images/hero-480.webp, hero-900.webp, hero-1400.webp, hero-2000.webp
- assets/images/hero-480.jpg, hero-900.jpg, hero-1400.jpg, hero-2000.jpg
- assets/images/coffee-480.webp, coffee-900.webp, etc.

What I did in the site/images branch:
- Updated index.html to use <picture> markup and point to the future responsive files in assets/images/.
- The page still falls back to the uploaded files at the repository root (1.jpeg … 5.jpeg) so the site immediately shows your photos.

Next steps I can take if you want me to continue:
- Move the root files into assets/images/originals/ and generate optimized WebP and JPEG variants at 480/900/1400/2000 widths.
- Add a small GitHub Action to perform the conversion automatically when new images are pushed.

If you approve, I will move the uploaded images into assets/images/originals/ and add the optimized files. Reply "move files" to proceed with that step.
