import React from "react";
import Header from "./header";
import tlo from "../../../assets/tlo5.mp4";
import MidMenu from "./midMenu";
import BottomMenu from "./bottomMenu";
import email from "../../assets/email.png";
import instagram from "../../assets/instagram.png";
import linkedin from "../../assets/linkedin.png";
export default function MainMenu() {
  return (
    <div className="mainpage">
      <div className="content-top">
        <video autoPlay muted loop playsInline className="background-video">
          <source src={tlo} type="video/mp4" />. Twoja przeglądarka nie
          obsługuje video.
        </video>
        <Header />
        <div className="content-top--main -mt-24 text-center">
          <p className="md:text-5xl xl:text-8xl tracking-widest mt-24">
            <span className="text-part1">Przejmij kontrolę</span> <br />
            <span className="text-part2">
              {" "}
              nad swoim <span className="text-red-600 ">Treningiem</span>
            </span>
          </p>
          <button className="button-main mt-24">Zacznij już teraz</button>
        </div>
      </div>
      <MidMenu />

      <BottomMenu />
      <footer className="main-footer">
        <p className="pt-5 mx-36 text-xs text-center footer-text">
          Core<span className="text-red-600">Trainer</span>&copy;2024. Wszystkie
          prawa zastrzeżone. Wszelkie treści, materiały i informacje zawarte na
          tej stronie są chronione prawami autorskimi i stanowią własność firmy
          CoreTrainer. Kopiowanie, rozpowszechnianie oraz wykorzystywanie bez
          uprzedniej zgody właściciela są surowo zabronione. Zastrzegamy sobie
          prawo do modyfikacji treści w każdej chwili bez uprzedzenia.
          Korzystanie z aplikacji oznacza akceptację regulaminu oraz polityki
          prywatności. Wszelkie zapytania prosimy kierować na adres kontaktowy
          podany w zakładce "kontakt".
        </p>
        <div className="footer-container mx-20">
          {/* <p className='mr-4 mt-1 text-sm'>Linki do ewentualnego kontaktu</p> */}
          {/* <div><img src={email} className='icons-main'/></div>
        <div><img src={linkedin} className='icons-main'/></div>
        <div><img src={instagram} className='icons-main'/></div> */}
        </div>
      </footer>
    </div>
  );
}
