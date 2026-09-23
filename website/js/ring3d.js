// 3D Moving Ring Engine
function init3DRing(config) {
  const stage = document.getElementById(config.stageId);
  const labelEl = document.getElementById(config.labelId);
  const prevBtn = document.getElementById(config.prevBtnId);
  const nextBtn = document.getElementById(config.nextBtnId);

  if (!stage || !config.items || !config.items.length) return;

  const N = config.items.length;
  const STEP = (Math.PI * 2) / N;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Render cards into stage
  stage.innerHTML = config.items.map((item, i) => `
    <article class="rc" data-i="${i}" style="--c:${item.c || '#0082ff'};">
      <div class="top" style="background-image:url(${item.img || ''});">
        <div class="ic">${item.i || 'A'}</div>
      </div>
      <div class="bd">
        <h3>${item.n}</h3>
        <em>${item.t || ''}</em>
        <ul>
          ${(item.b || []).map(bullet => `<li>${bullet}</li>`).join('')}
        </ul>
        <a class="btn" href="${item.link || '#'}" data-cat="${item.id || ''}">
          ${item.cta || 'Explore'} →
        </a>
      </div>
    </article>
  `).join('');

  const cards = Array.from(stage.children);
  let ang = 0;
  let dv = 0;
  let isDragging = false;
  let lastX = 0;
  let movedDist = 0;
  let hoveredIndex = -1;
  let targetAngle = null;
  let isVisible = true;
  let frontIndex = -1;

  const norm = (rad) => Math.atan2(Math.sin(rad), Math.cos(rad));

  function layout() {
    const W = stage.clientWidth;
    const Rx = Math.min(560, Math.max(70, W * 0.36));
    let bestIndex = 0;
    let maxZ = -2;

    cards.forEach((c, i) => {
      const a = ang + i * STEP;
      const s = Math.sin(a);
      const z = Math.cos(a);
      const depth = (z + 1) / 2; // 0 (back) to 1 (front)
      const scale = 0.58 + 0.42 * depth + (hoveredIndex === i ? 0.04 : 0);

      c.style.transform = `translate3d(${s * Rx}px, 0, ${z * 200}px) rotateY(${-s * 20}deg) scale(${scale})`;
      c.style.zIndex = Math.round(depth * 100);
      c.style.opacity = (0.42 + 0.58 * depth).toFixed(2);

      if (z > maxZ) {
        maxZ = z;
        bestIndex = i;
      }
    });

    if (bestIndex !== frontIndex) {
      frontIndex = bestIndex;
      cards.forEach((c, i) => c.classList.toggle('front', i === bestIndex));
      if (labelEl) {
        labelEl.textContent = config.items[bestIndex].n;
      }
      if (typeof config.onFrontChange === 'function') {
        config.onFrontChange(config.items[bestIndex], bestIndex);
      }
    }
  }

  function snap(direction) {
    const currentStep = Math.round(ang / STEP) * STEP;
    targetAngle = currentStep + direction * STEP;
  }

  if (prevBtn) prevBtn.onclick = () => snap(1);
  if (nextBtn) nextBtn.onclick = () => snap(-1);

  // Drag and touch interaction
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a')) return;
    isDragging = true;
    lastX = e.clientX;
    movedDist = 0;
    dv = 0;
    targetAngle = null;
    stage.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    movedDist += Math.abs(dx);
    ang += dx * 0.006;
    dv = dx * 0.006;
  });

  const onPointerUp = () => {
    if (isDragging) {
      isDragging = false;
      stage.style.cursor = 'grab';
    }
  };
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  // Click card to bring forward or navigate to link
  stage.addEventListener('click', (e) => {
    const btn = e.target.closest('a.btn, button.btn');
    if (btn) {
      const href = btn.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('#')) {
        e.preventDefault();
        window.location.href = href;
        return;
      }
    }

    if (movedDist > 8) return;
    const cardEl = e.target.closest('.rc');
    if (!cardEl) return;
    const idx = +cardEl.dataset.i;

    // If clicking the card already in front, navigate to its link
    if (idx === frontIndex) {
      const item = config.items[idx];
      if (item && item.link && item.link !== '#' && !item.link.startsWith('#')) {
        window.location.href = item.link;
        return;
      }
    }

    // Bring clicked card forward
    targetAngle = ang + norm(-idx * STEP - ang);
  });

  // Desktop hover pause
  cards.forEach((c, i) => {
    c.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') hoveredIndex = i;
    });
    c.addEventListener('pointerleave', () => {
      hoveredIndex = -1;
    });
  });

  // 3D Tilt on cards (desktop only)
  if (!reduceMotion && matchMedia('(hover: hover)').matches) {
    cards.forEach((c) => {
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        const rx = -((e.clientY - r.top) / r.height - 0.5) * 12;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 12;
        c.style.setProperty('--rx', `${rx}deg`);
        c.style.setProperty('--ry', `${ry}deg`);
      });
      c.addEventListener('pointerleave', () => {
        c.style.removeProperty('--rx');
        c.style.removeProperty('--ry');
      });
    });
  }

  // Pause when off-screen
  new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }).observe(stage);

  // Main animation loop
  function loop() {
    requestAnimationFrame(loop);
    if (!isVisible) return;

    if (targetAngle !== null && !isDragging) {
      const diff = norm(targetAngle - ang);
      ang += diff * 0.1;
      dv = 0;
      if (Math.abs(diff) < 0.002) {
        ang = targetAngle;
        targetAngle = null;
      }
    } else if (!isDragging) {
      ang += dv;
      dv *= 0.94; // inertia decay
      if (!reduceMotion && hoveredIndex < 0 && Math.abs(dv) < 0.004) {
        ang += 0.004; // slow continuous auto-rotation
      }
    }

    layout();
  }

  loop();

  return {
    rotateToId: (catId) => {
      const foundIndex = config.items.findIndex(it => it.id === catId || it.slug === catId);
      if (foundIndex >= 0) {
        targetAngle = ang + norm(-foundIndex * STEP - ang);
      }
    },
    getFrontIndex: () => frontIndex,
    getFrontItem: () => config.items[frontIndex] || config.items[0]
  };
}
