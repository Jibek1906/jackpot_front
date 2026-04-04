import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseRadiusRem: number; // Радиус в rem для масштабирования
  radiusPx: number; // Рассчитанный радиус в пикселях
  colorIndex: 0 | 1; // 0: левый (красный), 1: правый (синий)
  vx: number; // Velocity X
  vy: number; // Velocity Y
  pulseSpeed: number;
  pulsePhase: number;
  baseAlpha: number;
}

interface FloatingParticlesProps {
  enableAnimation?: boolean;
  particleCount?: number;
}

// Задаем цвета из твоего макета (RGBA)
const colors = [
  [239, 110, 75], // Левая сторона: #EF6E4B (Красный)
  [74, 125, 255], // Правая сторона: #4A7DFF (Синий)
];

export default function FloatingParticles({
  enableAnimation = true,
  particleCount = 50,
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  // Рефы для хранения заранее сгенерированных холстов с бликами (оптимизация)
  const preRenderedParticles = useRef<HTMLCanvasElement[]>([]);

  // Вспомогательная функция для генерации холста с одним светящимся бликом
  const generatePreRenderedParticle = (color: number[], radius: number) => {
    const canvas = document.createElement('canvas');
    const size = radius * 4; // Размер холста с запасом для свечения
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const center = size / 2;
    const gradient = ctx.createRadialGradient(
      center,
      center,
      0,
      center,
      center,
      size / 2,
    );

    // Плавное затухание (центр яркий, края прозрачные)
    gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`);
    gradient.addColorStop(
      0.2,
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`,
    );
    gradient.addColorStop(
      0.5,
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`,
    );
    gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return canvas;
  };

  useEffect(() => {
    // ИСПРАВЛЕНИЕ: используем .current вместо .get()
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true }); // Включаем прозрачность холста

    if (!canvas || !ctx) return;

    // Функция инициализации/перерисовки при изменении размера
    const initOrResize = () => {
      // 1. Устанавливаем физический размер Canvas равным размеру окна
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      // 2. Рассчитываем текущий размер 1rem в пикселях
      const remPx = (w / 1920) * 16;

      // 3. Предварительная отрисовка эталонных бликов
      const baseRemRef = 1;

      // ИСПРАВЛЕНИЕ: используем .current
      preRenderedParticles.current = [
        generatePreRenderedParticle(colors[0], baseRemRef * remPx),
        generatePreRenderedParticle(colors[1], baseRemRef * remPx),
      ];

      // 4. Генерируем данные о частицах
      // ИСПРАВЛЕНИЕ: используем .current
      particlesRef.current = Array.from({ length: particleCount }, () => {
        const x = Math.random() * w;
        const baseRadiusRem = 0.5 + Math.random() * 0.8;

        // Определяем цвет на основе позиции X
        let colorIndex: 0 | 1;
        if (x < w * 0.4) colorIndex = 0;
        else if (x > w * 0.6) colorIndex = 1;
        else colorIndex = Math.random() < 0.5 ? 0 : 1;

        return {
          x,
          y: Math.random() * h,
          baseRadiusRem,
          radiusPx: baseRadiusRem * remPx,
          colorIndex,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          pulseSpeed: 0.005 + Math.random() * 0.015,
          pulsePhase: Math.random() * Math.PI * 2,
          baseAlpha: 0.1 + Math.random() * 0.3,
        };
      });
    };

    // --- Цикл Анимации ---
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ИСПРАВЛЕНИЕ: используем .current
      const particles = particlesRef.current;
      const preRendered = preRenderedParticles.current;

      if (!preRendered[0] || !preRendered[1]) return;

      for (const p of particles) {
        if (enableAnimation) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -p.radiusPx) p.x = canvas.width + p.radiusPx;
          if (p.x > canvas.width + p.radiusPx) p.x = -p.radiusPx;
          if (p.y < -p.radiusPx) p.y = canvas.height + p.radiusPx;
          if (p.y > canvas.height + p.radiusPx) p.y = -p.radiusPx;

          p.pulsePhase += p.pulseSpeed;
        }

        let alpha = p.baseAlpha;
        if (enableAnimation) {
          alpha = p.baseAlpha + Math.sin(p.pulsePhase) * (p.baseAlpha * 0.5);
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        const scaleFactor = p.baseRadiusRem / 1;
        const preRenderCanvas = preRendered[p.colorIndex];
        const rawSize = preRenderCanvas.width;
        const scaledSize = rawSize * scaleFactor;

        ctx.drawImage(
          preRenderCanvas,
          p.x - scaledSize / 2,
          p.y - scaledSize / 2,
          scaledSize,
          scaledSize,
        );
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    initOrResize();
    window.addEventListener('resize', initOrResize);
    render();

    return () => {
      window.removeEventListener('resize', initOrResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enableAnimation, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className='absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen opacity-50'
    />
  );
}
