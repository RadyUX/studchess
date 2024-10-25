"use client"
import React, { useEffect, useRef } from 'react';

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {

    const images = [
        "/rook.png",
        "/queen.png",
        "/bishop.png",
        "/king.png",

      ];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particlesArray: Particle[] = [];
    const numberOfParticles = 30;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Classe représentant une particule
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      image: HTMLImageElement;
      opacity: number;


      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 40 + 10; // Taille de chaque particule
        this.speedX = Math.random() * 3 - 1.5; // Vitesse aléatoire en X
        this.speedY = Math.random() * 3 - 1.5; // Vitesse aléatoire en Y
        this.image = new Image();
        this.image.src = images[Math.floor(Math.random() * images.length)]; 
        this.opacity = Math.random() * 0.5;
    }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

      
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (ctx) {
              ctx.globalAlpha = this.opacity;
          ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }
      }
    }

   
    // Fonction pour initialiser les particules
    const initParticles = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    // Fonction d'animation
    const animateParticles = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach((particle) => {
          particle.update();
          particle.draw();
        });
        requestAnimationFrame(animateParticles);
      }
    };

    initParticles();
    animateParticles();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    ></canvas>
  );
};

export default ParticleBackground;
