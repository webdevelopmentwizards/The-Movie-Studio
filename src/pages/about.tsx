import Head from "next/head";
import Image from "next/image";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us — The Movie Studio, Inc.</title>
        <meta
          name="description"
          content="The Movie Studio, Inc. (OTC: MVES) is a vertically integrated motion picture production company that acquires, develops, produces, and distributes independent motion picture content for worldwide consumption."
        />
      </Head>

      <section className="border-b border-zinc-800 bg-black py-12 md:py-16">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <Image
            src="/assets/PRO_Movie_Studio_Logo_WHT2021-1769728410816.png"
            alt="The Movie Studio"
            width={1280}
            height={256}
            priority
            className="h-auto w-full object-contain"
          />
        </div>
      </section>

      <section className="bg-zinc-950 py-12 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:gap-16 sm:px-6 lg:grid-cols-2 lg:items-start">
          <div className="order-2 w-full space-y-3 lg:order-1">
            <div className="relative mx-auto h-52 w-full max-w-[480px] overflow-hidden rounded-2xl border border-zinc-800 bg-black">
              <Image
                src="/assets/aboutusimage.jpeg"
                alt="The Movie Studio production set"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="mx-auto flex w-full max-w-[240px] flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-black px-4 py-1 text-center">
              <dl className="space-y-1 text-sm">
                <div className="flex justify-center gap-2">
                  <dt className="text-zinc-400">Exchange:</dt>
                  <dd className="font-semibold text-zinc-100">OTC</dd>
                </div>
                <div className="flex justify-center gap-2">
                  <dt className="text-zinc-400">Symbol:</dt>
                  <dd className="font-semibold text-zinc-100">MVES</dd>
                </div>
                <div className="flex justify-center gap-2">
                  <dt className="text-zinc-400">Authorized:</dt>
                  <dd className="font-semibold text-zinc-100">5,500,000,000</dd>
                </div>
                <div className="flex justify-center gap-2">
                  <dt className="text-zinc-400">Outstanding:</dt>
                  <dd className="font-semibold text-zinc-100">217,872,013</dd>
                </div>
                <div className="flex justify-center gap-2">
                  <dt className="text-zinc-400">Float:</dt>
                  <dd className="font-semibold text-zinc-100">46,459,245</dd>
                </div>
              </dl>
              <a
                href="https://www.themoviestudio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-amber-400 hover:text-amber-300"
              >
                www.themoviestudio.com
              </a>
            </div>
            <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl border border-zinc-800 bg-black">
              <Image
                src="/assets/movies.png"
                alt="The Movie Studio film catalog"
                width={411}
                height={613}
                sizes="340px"
                className="h-auto w-full"
              />
            </div>
          </div>
          <div className="order-1 space-y-8 leading-relaxed text-zinc-400 lg:order-2">
            <p>
              In 1893, Thomas Edison built the first &ldquo;Movie Studio&rdquo;
              in the United States when he constructed the Black Maria, a tar
              paper covered structure near his laboratories in New Jersey, and
              asked circus, vaudeville, and dramatic actors to perform for the
              camera.
            </p>
            <p>
              In the 20th century, The Movie Studio, Inc. would create a first
              mover digital disruptor focused on the independent motion picture
              content sector and change the way independent motion pictures are
              made and distributed. The Movie Studio is a vertically integrated
              motion picture production company that acquires, develops,
              produces, and distributes independent motion picture content for
              worldwide consumption in theatrical, Video on Demand (VOD),
              foreign sales, and on various media devices. Its digital business
              model includes motion picture aggregation and distribution,
              intended to create a direct server access platform of its content
              with &ldquo;geo-fractured&rdquo; territories for worldwide
              distribution. The Movie Studios&rsquo; latest releases are
              available on Showtime, Comcast, and Amazon Prime. The company was
              formerly known as Destination Television, Inc. and changed its
              name to The Movie Studio, Inc. in November 2012. The Movie Studio,
              Inc. was founded in 1961 and is based in Ft. Lauderdale, Florida.
            </p>
            <p>
              In 2015, The Movie Studio acquired certain assets of Seven Arts
              Entertainment (OTC: SAPX), a diversified company with motion
              picture productions, including major motion pictures with top
              Hollywood stars such as John Goodman, John Malkovich, Ving Rhames,
              Burt Reynolds, Tom Sizemore, Tom Arnold, Tim Robbins, and more.
              The Movie Studio also develops, manufactures, and distributes
              independent motion picture content for worldwide consumption.
            </p>
            <a
              href="https://finance.yahoo.com/quote/MVES/?p=MVES"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
            >
              View Stock (MVES)
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-950 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-50 sm:text-3xl">
            The Brand
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-zinc-400">
            <p>
              The Movie Studio &reg; Received the Registered Trademark Reg. No.
              6,524,870 on Oct. 19, 2021 Int. Cl.: 41 Registered Service Mark
              consists of the words &ldquo;THE MOVIE STUDIO&rdquo; such that the
              letter &ldquo;O&rdquo; in &ldquo;MOVIE&rdquo; is a stylized camera
              aperture.
            </p>
            <p className="text-left">
              The Company has previously been successful in producing, casting,
              and distributing its films on major AVOD/SVOD platforms including
              Comcast, Tubi and Amazon however, The Movie Studio with sufficient
              financing, could potentially integrate recognizable stars and/or
              Social Media Influencers (SMI) into the productions at substantial
              value propositions either pre or post-completion and then
              integration of the talent into a new or re-edited feature film of
              the intellectual property using the Company&rsquo;s unique
              &ldquo;Moviesode&rdquo; production process. The process is where
              the Company breaks down production into &ldquo;Chapters&rdquo; and
              then edits the completed scenes/Moviesodes into a completed
              feature film.
            </p>
            <p className="text-left">
              The Movie Studio, Inc. (OTC: MVES) (the &ldquo;Company&rdquo;) a
              vertically integrated motion picture production company focused on
              acquiring, developing, producing, and distributing independent
              motion picture content for worldwide consumption. The Company has
              its own Over The Top (OTT) Video on Demand Streaming Platform and a
              &ldquo;App&rdquo; via Advertiser Video on Demand and Subscription
              Video on Demand (AVOD/SVOD) and utilizes revenue sharing
              integration of third party feature films distribution and sales
              and is viewable on various media devices. The Company is currently
              integrating both its own and aggregated feature films and its own
              projects in development and other media intellectual properties.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-950 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-normal text-zinc-50 sm:text-3xl">
            Gordon Scott Venters,{" "}
            <span className="font-bold">President - CEO</span>
          </h2>
          <div className="mt-8">
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black sm:float-left sm:mr-8 sm:w-[280px]">
              <Image
                src="/assets/ceo.png"
                alt="Gordon Scott Venters, President - CEO"
                fill
                sizes="(max-width: 640px) 100vw, 280px"
                className="object-cover"
              />
            </div>
            <div className="space-y-4 leading-relaxed text-zinc-400">
              <p>
                Mr. Venters has been the President &amp; CEO of The Movie Studio
                FKA Destination Television, Inc. since 1996. To his credit, Mr.
                Venters is experienced as an Executive Producer, Producer,
                Writer, and Director. He has produced many full-length feature
                films and was the subject of a Forbes profile article in 2008.
              </p>
              <p>
                Mr. Venters has served as President and CEO of Flash
                Entertainment, Inc., an independent feature film company located
                at Universal Studios Florida, where he was the Executive
                Producer of the feature film No More Dirty Deals as well as
                multiple music videos. Mr. Venters also served as the President
                and Director of Quantum Entertainment, Inc., from 1997 to 1999,
                where he was the Executive Producer of two full length feature
                films, Shakma and Shoot.
              </p>
              <p>
                In his early career, he was a Series 7 &amp; 63 financial
                advisor and a registered stockbroker with Prudential Securities,
                Inc. and F.D. Roberts Securities.
              </p>
              <p>
                Mr. Venters was involved in and responsible for financing,
                development, pre-production, production, post-production, and
                distribution of the following recently released feature films:
                RETRIBUTION, EXPOSURE, BAD ACTRESS, and DANCING ON THE EDGE,
                currently available on Comcast, Amazon Prime, Tubi TV, and
                Foreign Market Distribution Platforms.
              </p>
            </div>
            <div className="clear-both" />
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-950 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-50 sm:text-3xl">
            Contact:
          </h2>
          <div className="mt-6 space-y-1 leading-relaxed text-zinc-400">
            <p>The Movie Studio, Inc.</p>
            <p>110 Tower</p>
            <p>110 S.E. 6th Street Suite #1700</p>
            <p>Ft. Lauderdale, Florida 33301</p>
            <p>
              Phone #{" "}
              <a
                href="tel:+19543326600"
                className="transition-colors hover:text-amber-400"
              >
                954-332-6600
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
