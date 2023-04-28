import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "@/styles/gamepage.module.scss";

export default function Game() {
  const router = useRouter();
  const [allGameInfos, setAllGamesInfos] = useState(null);

  const fetchGame = async (name) => {
    const response = await fetch(`/api/igdb/game?query=${name}`);
    const data = await response.json();
    setAllGamesInfos(data[0]);
    console.log(data[0]);
  };

  const retrieveCoverImg = (url) => {
    const regex = /t_thumb/g;
    const replacedStr = url.replace(regex, "t_1080p");
    return "https:" + replacedStr;
  };

  const retrieveCarouselImg = (url) => {
    const regex = /t_thumb/g;
    const replacedStr = url.replace(regex, "t_720p");
    return "https:" + replacedStr;
  };

  useEffect(() => {
    if (router.isReady) {
      fetchGame(router.asPath.split("/").pop());
    }
  }, [router.isReady]);

  return (
    <>
      {allGameInfos && (
        <main className="text-white">
          <header className={`position-relative ${styles.header}`}>
            <div className={styles.gradient}></div>
            <div className="container align-items-center d-flex h-100 pb-5">
              <h1 className="text-white pb-lg-5 z-1">{allGameInfos.name}</h1>
            </div>
            <Image
              className="z-n1 object-fit-cover"
              fill
              src={
                allGameInfos.screenshots
                  ? retrieveCoverImg(allGameInfos.screenshots[0].url)
                  : Wallpaper
              }
              alt="Image de fond"
            ></Image>
          </header>
          <div className="container mt-4 text-white">
            <h2>What is {allGameInfos.name} ?</h2>
            <div className="row">
              <div className="col-md-7">
                <div className={styles.summary}>
                  <p className="mt-3 fs-5">{allGameInfos.summary}</p>
                </div>
                <a
                  href={allGameInfos.websites[0].url}
                  target="_blank"
                  className="btn btn-lg btn-primary mt-4"
                >
                  Télécharger le jeu
                </a>
              </div>
              <div className="col-md-5">
                <div
                  id="carouselExampleRide"
                  className="carousel slide"
                  data-bs-ride="true"
                >
                  <div className="carousel-inner">
                    {allGameInfos.screenshots.map((screenshot, i) => (
                      <div
                        key={i}
                        className={
                          i === 0 ? "carousel-item active" : "carousel-item "
                        }
                      >
                        <Image
                          src={retrieveCarouselImg(screenshot.url)}
                          width={600}
                          height={300}
                          alt={`Photo ${i} de ${allGameInfos.name}`}
                          className="d-block "
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleRide"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleRide"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {allGameInfos.videos && (
            <div className="container text-center mt-5">
              <h2>Watch the trailer to see more</h2>
              <iframe
                className="mt-4 w-100"
                width="1280"
                height="720"
                src={
                  "https://www.youtube.com/embed/" +
                  allGameInfos.videos[0].video_id
                }
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
          )}

          <div className="container mt-5">
            <h3>Ressources :</h3>
            <ul>
              {allGameInfos.websites.map((website, i) => (
                <li key={i}>
                  <a target="_blank" href={website.url}>
                    {website.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </main>
      )}
    </>
  );
}
