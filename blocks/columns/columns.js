export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // uniform row height: 80% (or data-row-height %) of the first image's natural height
  if (block.classList.contains('fixed-height')) {
    const firstImg = block.querySelector('img');
    if (firstImg) {
      const applyRowHeight = () => {
        const pct = Number(block.dataset.rowHeight) || 80;
        if (firstImg.naturalHeight) {
          block.style.setProperty('--row-height', `${firstImg.naturalHeight * (pct / 100)}px`);
        }
      };
      if (firstImg.complete) {
        applyRowHeight();
      } else {
        firstImg.addEventListener('load', applyRowHeight, { once: true });
      }
    }
  }

  // parallax scroll effect on image columns
  if (block.classList.contains('parallax')) {
    const imageCols = [...block.querySelectorAll('.columns-img-col')];
    imageCols.forEach((col) => {
      col.classList.add('image-col');
      col.style.overflow = 'hidden';
    });

    let ticking = false;
    const speed = 0.3;

    const updateParallax = () => {
      const viewportH = window.innerHeight;
      imageCols.forEach((col) => {
        const img = col.querySelector('img');
        if (!img) return;
        const rect = col.getBoundingClientRect();
        // only animate while the column is within (or near) the viewport
        if (rect.bottom < 0 || rect.top > viewportH) return;
        // image is taller than its column; keep the translate within that
        // extra height (minus a small safety margin) so the image always
        // fills the column with no gaps at the edges
        const travel = Math.max(0, (img.offsetHeight - col.offsetHeight) / 2 - 2);
        // offset relative to viewport center, moved at a reduced speed
        let offset = (rect.top + rect.height / 2 - viewportH / 2) * speed;
        offset = Math.max(-travel, Math.min(travel, offset));
        img.style.transform = `translateY(${offset.toFixed(1)}px)`;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // initial position
    updateParallax();
  }
}
