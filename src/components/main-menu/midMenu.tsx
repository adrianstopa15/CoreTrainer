import React from 'react'
import callendar from '../../assets/callendar.mp4'
import stats from '../../assets/stats.mp4'
import report from '../../assets/report.mp4'
import chat from '../../assets/chat.gif'
export default function MidMenu() {
  return (
    <div className='mid-menu'>
        <div className='mid-container pt-10 mb-12'><p className='text-2xl xl:text-9xl mb-14'>Czym jest Core<span className='text-red-600'>Trainer</span></p>

        <p className='text-xl xl:text-3xl mb-14'>Jest to aplikacja pomagająca zarządzać Twoim treningiem</p>
        
        <div className='mid-container--videos'>
        <div className='mid-item--1 rounded-md hover-container'>
        <video autoPlay muted loop playsInline className=''>
      <source src={callendar} type='video/mp4'/>.
      Twoja przeglądarka nie obsługuje video.
      </video>
      <div className='box-text'>
        <h1 className='text-xl xl:text-5xl mb-12'>Kontroluj Kalendarz</h1>
        <p className='xl:text-xl'>Jako trener zapisuj, bądź edytuj treningi podopiecznego na dany dzień.</p>
      </div>
        </div>
        <div className='mid-item--2 rounded-md  hover-container'>
        <video autoPlay muted loop playsInline className=''>
      <source src={stats} type='video/mp4'/>.
      Twoja przeglądarka nie obsługuje video.
      </video>
      <div className='box-text'>
        <h1 className='text-xl xl:text-5xl mb-12'>Śledź Postępy</h1>
        <p className='xl:text-xl'>Wysyłaj automatyczne raporty jako podopieczny, oraz odczytuj je jako trener.</p>
      </div>
        </div>
        
        <div className='mid-item--3 rounded-md  hover-container'>
        <img src={chat}/>
        <div className='box-text'>
        <h1 className=' text-xl mx-1 xl:text-5xl mb-12 xl:mx-0'>Dedykowany Czat</h1>
        <p className='text-xs mx-1 xl:text-xl whitespace-pre-line xl:mx-0'>Utrzymuj kontakt z trenerem poprzez czat </p>
        <p className=' text-xs xl:text-xl whitespace-pre-line'> dopytaj o cokolwiek w każdej chwili w zasięgu aplikacji.</p>
      </div>
      
        </div>
        <div className='mid-item--4 rounded-md  hover-container'>
        <video autoPlay muted loop playsInline className=''>
      <source src={report} type='video/mp4'/>.
      Twoja przeglądarka nie obsługuje video.
      </video>
      <div className='box-text'>
        <h1 className='xl:text-5xl mb-12 mx-2 xl:mx-0'>Wszystko Czego potrzebujesz</h1>
        <p className='xl:text-xl '>Zapoznaj się z pełną funkcjonalnością aplikacji i jej funkcji. </p>
      </div>
        </div>
        </div>
        </div>
        
    </div>
  )
}
