import React, { useRef } from 'react';
import personalTrainer from '../../assets/personalTrainer.mp4';
import training from '../../assets/training.mp4';

export default function BottomMenu() {
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);

 const handleMouseOver = (videoRef) => {
    if (videoRef.current) {
        videoRef.current.play();
    }
 };

  const handleMouseOut = (videoRef) => {
    if (videoRef.current) {
        videoRef.current.pause();
    }
  };

  return (
    
    <div className='bottom-menu'>

<div>
        <p className='xl:text-6xl md:text-3xl text-2xl pb-20 text-center'>Wybierz Program Dla Siebie</p>
      </div>
      <div className='bottom-grid--container text-2xl'>

        
        <h1 className='mentee-h1 mb-32 xl:text-5xl mt-20'>Podopieczny</h1>
        <video
            ref={leftVideoRef}
            muted
            loop
            playsInline
            className='background-video--bottom-l'
            onMouseOver={() => handleMouseOver(leftVideoRef)}
            onMouseOut={() => handleMouseOut(leftVideoRef)}
            
          >
            <source src={training} type='video/mp4' />
            Twoja przeglądarka nie obsługuje video.
          </video>

        
            <li className='mentee-li-1 mb-16 mx-8'>Wprowadzaj dane treningowe do analizy</li>
            <li className='mentee-li-2 mb-16 mx-8' >W łatwy sposób odczytuj zaplanowane treningi przez trenera na bieżący tydzień</li>
            <li className='mentee-li-3 mb-16 mx-8' >Śledź statystyki postępu na swoim profilu</li>
            <li className='mentee-li-4 mb-32 mx-8' >Utrzymuj kontakt w czasie rzeczywistym ze swoim trenerem</li>
            <button className='button-main--blue mentee-btn mb-16'
            onMouseOver={() => handleMouseOver(leftVideoRef)}
            onMouseOut={() => handleMouseOut(leftVideoRef)}
            >Podopieczny</button>
         

        


        <h1 className='trainer-h1 mb-32 xl:text-5xl mt-20'>Trener</h1>
        <video
            ref={rightVideoRef}
            muted
            loop
            playsInline
            className='background-video--bottom-r'
            onMouseOver={() => handleMouseOver(rightVideoRef)}
            onMouseOut={() => handleMouseOut(rightVideoRef)}
          >
            <source src={personalTrainer} type='video/mp4' />
            Twoja przeglądarka nie obsługuje video.
          </video>

           
            <li className='trainer-li-1 mx-4 mb-16' >Zarządzaj Treningami Podopiecznego</li>
            <li className='trainer-li-2 mx-4 mb-16' >Analizuj raporty z wyników siłowych oraz badań</li>
            <li className='trainer-li-3 mx-4 mb-16' >Edytuj treningi podopiecznego w oparciu o dane z jego profilu</li>
            <li className='trainer-li-4 mx-4 mb-32' >Bądź na bieżąco z potrzebami klienta</li>
          <button className='button-main--red trainer-btn mb-16' onMouseOver={() => handleMouseOver(rightVideoRef)}
            onMouseOut={() => handleMouseOut(rightVideoRef)}>Trener</button>
      </div>




      
    </div>
  );
}
