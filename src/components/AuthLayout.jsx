import { motion } from "framer-motion";
import logoOreus from "../assets/oreus_cl.svg";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F5FAFA] text-[#30302F]">
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen items-start justify-center px-5 py-8 xl:items-center">
        <div
          className="
            grid w-full max-w-[1500px] overflow-hidden
            rounded-[40px] border border-white/80 bg-white/70
            shadow-[0_35px_100px_rgba(48,48,47,0.16)] backdrop-blur-2xl
            lg:grid-cols-[420px_minmax(0,1fr)]
            xl:grid-cols-[460px_minmax(0,1fr)]
          "
        >
          <aside className="relative hidden min-h-[760px] flex-col justify-between overflow-hidden bg-[#30302F] p-10 text-white lg:flex">
            <AsideDecorations />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2">
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#7CBCCC]" />
                <span className="text-[15px] font-semibold text-white/85">
                  Plateforme sécurisée
                </span>
              </div>

              <div className="mt-10">
                <div className="w-fit rounded-[28px] bg-white px-6 py-4 shadow-2xl">
                  <img
                    src={logoOreus}
                    alt="OREUS"
                    className="block"
                    style={{ width: "180px", height: "auto" }}
                  />
                </div>

                <h1 className="mt-10 max-w-md text-[44px] font-extrabold leading-[1.02] tracking-[-0.055em]">
                  Une interface claire pour gérer vos accès.
                </h1>

                <p className="mt-6 max-w-md text-[16px] font-medium leading-8 text-white/75">
                  Connectez-vous, activez les comptes et suivez les associations
                  pharmacies/résidences dans une interface moderne inspirée
                  d’OREUS.
                </p>
              </div>
            </div>

            <div className="relative z-10 grid gap-3">
              <FeatureLine
                title="Navigation simple"
                text="Accédez rapidement aux sections principales"
              />
              <FeatureLine
                title="Activation sécurisée"
                text="Compte lié à un email d’activation"
              />
              <FeatureLine
                title="Validation admin"
                text="Accès autorisé après approbation"
              />
            </div>
          </aside>

          <main className="relative flex min-h-[760px] items-start justify-center overflow-hidden p-5 sm:p-8 lg:p-10">
            <RightSideDecorations />

            <div className="relative z-10 w-full max-w-[920px]">
              <div className="mb-8 flex justify-center lg:hidden">
                <img
                  src={logoOreus}
                  alt="OREUS"
                  className="block"
                  style={{ width: "170px", height: "auto" }}
                />
              </div>

              <div
                className="
                  w-full min-h-[680px] max-h-[78vh] overflow-y-auto
                  rounded-[34px] border border-white bg-white/90
                  p-5 shadow-[0_24px_70px_rgba(48,48,47,0.12)]
                  backdrop-blur-xl sm:p-7
                "
              >
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function AnimatedBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 opacity-[0.38]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(48,48,47,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(48,48,47,0.05) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <motion.div
        animate={{
          y: [0, -28, 0],
          scale: [1, 1.08, 1],
          opacity: [0.65, 0.95, 0.65],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-44 -top-44 h-[34rem] w-[34rem] rounded-full bg-[#7CBCCC]/35 blur-3xl"
      />

      <motion.div
        animate={{
          y: [0, 34, 0],
          scale: [1, 1.12, 1],
          opacity: [0.5, 0.85, 0.5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-44 top-1/3 h-[36rem] w-[36rem] rounded-full bg-[#7CBCCC]/24 blur-3xl"
      />

      <motion.div
        animate={{
          y: [0, -22, 0],
          opacity: [0.25, 0.5, 0.25],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#30302F]/10 blur-3xl"
      />

      <FloatingParticle className="left-[8%] top-[22%]" delay={0} />
      <FloatingParticle className="left-[15%] bottom-[20%]" delay={1.2} />
      <FloatingParticle className="right-[10%] top-[18%]" delay={0.6} />
      <FloatingParticle className="right-[18%] bottom-[14%]" delay={1.7} />
      <FloatingParticle className="left-[50%] top-[8%]" delay={2.1} />
    </>
  );
}

function FloatingParticle({ className, delay = 0 }) {
  return (
    <motion.span
      animate={{
        y: [0, -22, 0],
        opacity: [0.25, 0.85, 0.25],
        scale: [1, 1.25, 1],
      }}
      transition={{
        duration: 4.5,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-[#7CBCCC] shadow-[0_0_35px_rgba(124,188,204,0.9)] ${className}`}
    />
  );
}

function AsideDecorations() {
  return (
    <>
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#7CBCCC]/25 blur-3xl" />

      <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-[#7CBCCC]/10 blur-3xl" />

      <div className="absolute right-10 top-36 h-32 w-32 rounded-full border border-[#7CBCCC]/20" />

      <div className="absolute right-16 top-42 h-20 w-20 rounded-full border border-white/10" />
    </>
  );
}

function RightSideDecorations() {
  return (
    <>
      <div className="absolute right-7 top-7 hidden h-24 w-24 rounded-[30px] border border-[#7CBCCC]/25 bg-[#7CBCCC]/10 backdrop-blur-xl xl:block" />

      <div className="absolute bottom-12 right-8 hidden w-56 rounded-[28px] border border-white bg-white/55 p-4 shadow-[0_18px_45px_rgba(48,48,47,0.09)] backdrop-blur-xl xl:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#7CBCCC]/20 text-sm font-extrabold text-[#4A9CAF]">
            ID
          </div>

          <div>
            <strong className="block text-[15px] font-extrabold text-[#30302F]">
              Accès contrôlé
            </strong>
            <span className="text-[13px] font-medium text-[#6F7D80]">
              Validation admin requise
            </span>
          </div>
        </div>
      </div>

      <div className="absolute left-6 bottom-16 hidden h-16 w-16 rounded-full border border-[#7CBCCC]/30 bg-white/40 backdrop-blur-xl xl:block" />
    </>
  );
}

function FeatureLine({ title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7CBCCC]/20">
          <div className="h-3 w-3 rounded-full bg-[#7CBCCC]" />
        </div>

        <div>
          <strong className="block text-[16px] font-extrabold text-white">
            {title}
          </strong>
          <span className="text-[15px] font-medium text-white/65">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}