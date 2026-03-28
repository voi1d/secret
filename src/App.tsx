import React, { useState, useEffect, useRef } from 'react';

// Os tempos ajustados da letra com os seus recadinhos escondidos!
const syncedLyrics = [
  { time: 0.0, text: "(Oi rsrs)", emphasis: [] },
  { time: 14.50, text: "To com saudade de você", emphasis: [4] }, 
  { time: 22.00, text: "Debaixo do meu cobertor", emphasis: [3] },
  { time: 29.98, text: "E te arrancar suspiros, fazer amor", emphasis: [4, 5] },
  { time: 36.60, text: "'To com saudade de você", emphasis: [4] },
  { time: 39.44, text: "Na varanda em noite quente", emphasis: [4] },
  { time: 42.94, text: "E o arrepio frio", emphasis: [2] },
  { time: 45.46, text: "Que dá na gente", emphasis: [3] },
  { time: 47.28, text: "Truque do desejo", emphasis: [2] },
  { time: 50.74, text: "Guardo na boca o gosto do beijo", emphasis: [6] },
  { time: 57.50, text: "Eu sinto a falta de você", emphasis: [5] },
  { time: 60.88, text: "Me sinto só", emphasis: [2] },
  { time: 62.64, text: "E aí", emphasis: [] },
  { time: 65.28, text: "Será que você volta?", emphasis: [3] },
  { time: 68.28, text: "Tudo à minha volta é triste", emphasis: [5] },
  { time: 73.10, text: "E aí, o amor pode acontecer", emphasis: [2, 5] },
  { time: 79.86, text: "De novo pra você, palpite", emphasis: [4] },
  { time: 81.98, text: "(oq ta achando?)", emphasis: [] },
  { time: 86.90, text: "'To com saudade de você", emphasis: [4] },
  { time: 88.92, text: "Do nosso banho de chuva", emphasis: [4] },
  { time: 92.36, text: "Do calor na minha pele", emphasis: [4] },
  { time: 94.50, text: "Da língua tua", emphasis: [2] },
  { time: 97.86, text: "'To com saudade de você", emphasis: [4] },
  { time: 100.90, text: "Censurando o meu vestido", emphasis: [3] },
  { time: 104.16, text: "As juras de amor", emphasis: [3] },
  { time: 106.22, text: "Ao pé do ouvido", emphasis: [3] },
  { time: 108.48, text: "Truque do desejo", emphasis: [2] },
  { time: 112.12, text: "Guardo na boca o gosto do beijo", emphasis: [6] },
  { time: 118.00, text: "Eu sinto a falta de você", emphasis: [5] },
  { time: 122.00, text: "Me sinto só", emphasis: [2] },
  { time: 123.74, text: "E aí", emphasis: [] },
  { time: 126.34, text: "Será que você volta?", emphasis: [3] },
  { time: 129.46, text: "Tudo à minha volta é triste", emphasis: [5] },
  { time: 134.74, text: "E aí, o amor pode acontecer", emphasis: [2, 5] },
  { time: 141.20, text: "De novo pra você, palpite", emphasis: [4] },
  { time: 143.84, text: "(eai em)", emphasis: [] },
  { time: 170.76, text: "Eu sinto a falta de você", emphasis: [5] },
  { time: 174.34, text: "Me sinto só", emphasis: [2] },
  { time: 176.06, text: "E aí", emphasis: [] },
  { time: 178.72, text: "Será que você volta?", emphasis: [3] },
  { time: 181.80, text: "Tudo à minha volta é triste", emphasis: [5] },
  { time: 187.24, text: "E aí, o amor pode acontecer", emphasis: [2, 5] },
  { time: 193.34, text: "De novo pra você, palpite", emphasis: [4] },
  { time: 194.72, text: "(quase acabando)", emphasis: [] },
  { time: 199.62, text: "E aí", emphasis: [] },
  { time: 201.62, text: "Será que você volta?", emphasis: [3] },
  { time: 205.02, text: "Tudo à minha volta é triste", emphasis: [5] },
  { time: 210.32, text: "E aí, o amor pode acontecer", emphasis: [2, 5] },
  { time: 216.88, text: "De novo pra você, palpite", emphasis: [4] },
  { time: 219.40, text: "(Beijos rsrs)", emphasis: [] }
];

const memories = [];

export default function App() {
  // === CONFIGURAÇÃO DA SENHA AQUI ===
  const SECRET_PASSWORD = "2202"; 
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passError, setPassError] = useState(false);
  
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const lineRefs = useRef([]);

  // Lógica de verificação da senha secreta
  const handleUnlock = (e) => {
    e.preventDefault();
    if (passwordInput.toLowerCase().trim() === SECRET_PASSWORD) {
      setIsUnlocked(true);
      setPassError(false);
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 2000);
    }
  };

  useEffect(() => {
    let animationFrame;
    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
      animationFrame = requestAnimationFrame(updateTime);
    };

    if (hasStarted && isPlaying) {
      animationFrame = requestAnimationFrame(updateTime);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, isPlaying]);

  const activeLineIndex = syncedLyrics.findIndex((line, index) => {
    const nextLineTime = syncedLyrics[index + 1]?.time || Infinity;
    return currentTime >= line.time && currentTime < nextLineTime;
  });

  useEffect(() => {
    if (hasStarted && activeLineIndex !== -1 && lineRefs.current[activeLineIndex]) {
      lineRefs.current[activeLineIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLineIndex, hasStarted]);

  const startExperience = () => {
    setHasStarted(true);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Erro:", e));
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const activeMemories = memories.filter(
    (m) => currentTime >= m.time && currentTime < m.time + m.duration
  );

  return (
    // Usando h-[100dvh] no lugar de min-h-screen ajuda MUITO no celular para lidar com a barra de endereços do navegador
    <div className="relative h-[100dvh] bg-[#060606] text-white overflow-hidden font-sans selection:bg-rose-500/30">
      
      <audio 
        ref={audioRef} 
        src="palpite.mp3" 
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />

      {/* Background animado otimizado para mobile */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
        <div className="absolute top-[-10%] left-[-20%] w-[90vw] md:w-[60vw] h-[90vw] md:h-[60vw] bg-rose-800/40 rounded-full mix-blend-screen filter blur-[100px] md:blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[100vw] md:w-[70vw] h-[100vw] md:h-[70vw] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[120px] md:blur-[140px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-[30%] left-[20%] w-[80vw] md:w-[50vw] h-[80vw] md:h-[50vw] bg-indigo-900/30 rounded-full mix-blend-screen filter blur-[90px] md:blur-[100px] animate-[pulse_12s_ease-in-out_infinite]"></div>
      </div>

      {/* TELA DE SENHA / BLOQUEIO */}
      {!isUnlocked && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/60 backdrop-blur-2xl transition-opacity duration-1000 px-6">
          <form onSubmit={handleUnlock} className="flex flex-col items-center gap-6 p-6 md:p-8 transform hover:scale-105 transition-transform duration-500 w-full max-w-sm">
            
            <svg className="w-8 h-8 text-white/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>

            <h2 className="text-lg sm:text-xl md:text-2xl font-light tracking-[0.3em] text-white/80 uppercase text-center w-full">
              Acesso Restrito
            </h2>
            
            <div className="relative mt-4 w-full">
              <input
                type="password"
                inputMode="numeric" // Facilita abrindo o teclado numérico no celular, já que a senha é 2202!
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Qual a senha em?"
                className={`w-full px-6 py-4 bg-white/5 backdrop-blur-md rounded-full text-center text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all duration-300 border ${passError ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 hover:border-white/30'}`}
              />
              {passError && (
                <p className="absolute -bottom-7 w-full text-center text-rose-400 text-[10px] md:text-xs tracking-widest uppercase animate-pulse">
                  Senha Incorreta
                </p>
              )}
            </div>

            <button
              type="submit"
              className="mt-4 px-10 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full tracking-widest uppercase text-[10px] md:text-xs font-medium transition-all duration-300 border border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] w-full"
            >
              Entrar
            </button>
          </form>
        </div>
      )}

      {/* Tela de Início */}
      {isUnlocked && !hasStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md transition-opacity duration-1000 ease-in-out px-4">
          <div className="text-center space-y-6 md:space-y-8 p-6 transform hover:scale-105 transition-transform duration-500">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-wide text-white/90 drop-shadow-2xl">
              Oi lolo
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-white/50 font-light tracking-[0.3em] uppercase mb-10 md:mb-12">
              Para você
            </p>
            <button
              onClick={startExperience}
              className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full transition-all duration-500 ease-out flex items-center gap-3 sm:gap-4 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(225,29,72,0.3)] mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/30 via-purple-500/30 to-rose-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-[gradient_2s_linear_infinite]"></div>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="text-xs sm:text-sm md:text-base font-medium tracking-widest text-white relative z-10 uppercase">
                Abrir Presente
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Camada do Spotify Wrapped (Memórias Interativas) */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-4 md:p-6">
        {activeMemories.map((memory, idx) => (
          <div 
            key={idx}
            className="animate-float pointer-events-auto bg-black/40 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl w-full max-w-[90%] sm:max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-all duration-700 hover:scale-105"
            style={{ animation: 'floatUp 6s ease-in-out forwards' }}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 animate-pulse"></div>
              <h3 className="text-[10px] sm:text-xs font-bold tracking-widest text-rose-300 uppercase">{memory.title}</h3>
            </div>
            <p className="text-base sm:text-lg md:text-xl font-light text-white/90 leading-relaxed">
              {memory.text}
            </p>
          </div>
        ))}
      </div>

      {/* Container das Letras */}
      <div 
        className={`relative z-10 h-full w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col overflow-y-auto hide-scrollbar transition-opacity duration-1000 ease-in-out ${hasStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{
          // Ajustado o mask para 15% / 85% para não cortar tão agressivamente no mobile
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      >
        <div className="pt-[45vh] pb-[55vh] flex flex-col items-start w-full gap-6 md:gap-8">
          {syncedLyrics.map((line, lineIndex) => {
            const isActiveLine = lineIndex === activeLineIndex;
            const isPassedLine = lineIndex < activeLineIndex;
            
            const words = line.text.split(" ");
            const lineDuration = (syncedLyrics[lineIndex + 1]?.time || line.time + 5) - line.time;
            
            const singingDuration = Math.min(lineDuration, words.length * 0.45); 
            const progressWithinLine = Math.max(0, Math.min(1, (currentTime - line.time) / singingDuration));
            
            const activeWordIndex = Math.min(
              words.length - 1, 
              Math.floor(progressWithinLine * words.length)
            );

            return (
              <div
                key={lineIndex}
                ref={(el) => (lineRefs.current[lineIndex] = el)}
                className={`w-full transition-all duration-700 ease-out transform origin-left cursor-pointer
                  ${isActiveLine 
                    ? 'opacity-100 scale-100 translate-x-0 blur-none' 
                    : isPassedLine
                      ? 'opacity-30 scale-[0.98] -translate-y-2 md:-translate-y-4 blur-[1px] md:blur-[2px]'
                      : 'opacity-20 scale-[0.95] translate-y-4 md:translate-y-8 blur-[2px] md:blur-[3px]'
                  }
                `}
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = line.time;
                  }
                }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight md:leading-snug flex flex-wrap gap-x-2 md:gap-x-4">
                  {words.map((word, wordIndex) => {
                    const isSung = isPassedLine || (isActiveLine && wordIndex <= activeWordIndex);
                    const isCurrentlySinging = isActiveLine && wordIndex === activeWordIndex;
                    const isEmphasized = line.emphasis?.includes(wordIndex);

                    return (
                      <span 
                        key={wordIndex}
                        className={`transition-all duration-300 ease-out inline-block
                          ${isSung ? 'text-white' : 'text-white/20'}
                          ${isCurrentlySinging && isEmphasized ? 'scale-110 text-rose-200 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] -translate-y-1' : ''}
                          ${isCurrentlySinging && !isEmphasized ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]' : ''}
                        `}
                      >
                        {word}
                      </span>
                    );
                  })}
                </h2>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão de Pause/Play Minimalista (Mais distante das bordas para o mobile) */}
      {hasStarted && (
        <button 
          onClick={togglePlayPause}
          className="absolute bottom-10 right-6 md:bottom-8 md:right-8 z-50 p-3 md:p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-300 text-white/80 hover:text-white shadow-lg hover:shadow-rose-500/20 hover:scale-105"
        >
          {isPlaying ? (
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.9); }
          15% { opacity: 1; transform: translateY(0px) scale(1); }
          85% { opacity: 1; transform: translateY(-10px) scale(1); }
          100% { opacity: 0; transform: translateY(-30px) scale(0.95); filter: blur(4px); }
        }
      `}} />
    </div>
  );
}