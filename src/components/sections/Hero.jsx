import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { doctor } from "@/config/site";
import heroBackground from "@/assets/img/hero-consultorio.png";
import draKaren from "@/assets/img/hero-dra-karen.png";
import "./Hero.css";

export function Hero() {
  return (
    <section id="inicio" className="hero-banner scroll-mt-20">
      <img
        className="hero-banner__background"
        src={heroBackground}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
      />

      <div className="hero-banner__inner">
        <div className="hero-banner__content">
          <h1 className="hero-banner__title">
            <span className="hero-banner__title-intro">{doctor.specialty}</span>
            <span className="hero-banner__title-highlight">{doctor.tagline}</span>
          </h1>
          <p className="hero-banner__description">
            {doctor.heroDescription}
          </p>
          <p className="hero-banner__credentials">
            {doctor.crm}
          </p>
          <div className="hero-banner__cta">
            <WhatsAppCTA size="lg" label="Agendar pelo WhatsApp" />
          </div>
        </div>

        <div className="hero-banner__photo-wrap">
          <img
            className="hero-banner__photo"
            src={draKaren}
            alt={`${doctor.fullName}, ${doctor.specialty}`}
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
