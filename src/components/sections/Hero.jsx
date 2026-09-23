import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { doctor, address } from "@/config/site";
import fundo from "@/assets/img/fundo.png";
import draKaren from "@/assets/img/dra-karen.png";
import logo from "@/assets/img/logo-nova.png";
import { MapPin } from "lucide-react";
import "./Hero.css";

export function Hero() {
  return (
    <section id="inicio" className="hero-banner scroll-mt-20">
      <img className="hero-banner__bg" src={fundo} alt="" aria-hidden="true" fetchPriority="high" />
      <div className="hero-banner__scrim" aria-hidden="true" />

      <div className="hero-banner__inner">
        <div className="hero-banner__photo-wrap">
          <div className="hero-banner__decoration" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <figure className="hero-banner__card">
            <img className="hero-banner__photo" src={draKaren} alt={`${doctor.fullName}, ${doctor.specialty}`} />
            <div className="hero-banner__card-scrim" aria-hidden="true" />
            <img
              className="hero-banner__brand"
              src={logo}
              alt={`${doctor.shortName} — ${doctor.specialty}`}
            />
          </figure>
        </div>

        <div className="hero-banner__content">
          <span className="font-heading-alt text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-foreground">
            {doctor.specialty}
          </span>
          <h1 className="mt-4 font-heading text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] text-foreground">
            {doctor.tagline}
          </h1>
          <p className="mt-5 max-w-md text-base sm:text-lg italic text-foreground/80">
            {doctor.fullName} · {doctor.crm} | {doctor.rqe}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-foreground/80">
            <MapPin aria-hidden="true" className="size-4 text-primary" />
            {address.city}/{address.state}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <WhatsAppCTA size="lg" />
            <a
              href="#sobre"
              className="text-sm font-semibold text-foreground hover:text-primary"
            >
              Conhecer a Dra. Karen →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
