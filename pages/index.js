//IMPORT

import React, { useState, useId, useEffect } from "react";
import Select from "react-select";
import _, { divide } from "lodash";
import { useRouter } from "next/router"; // import de useRouter depuis next/router
import styles from "../styles/gamepage.module.scss";

export default function Home() {
  const router = useRouter(); // initialisation de useRouter
  const [searchTerm, setSearchTerm] = useState(""); //stock la value qui sera recup dans l'input
  const [options, setOptions] = useState([]); //stockage des options qui ressortent
  const [randomGames, setRandomGames] = useState([]); //stockage des 10 jeux randoms

  //Recupere la value et la met dans searchTerm et rajoute 500ms de delais pour pas spammer l'api de requete par la suite
  const updateSearch = _.debounce((value) => {
    setSearchTerm(value);
  }, 500);

  // Requete API en fonction de ce qu'on tape dans l'input, ca affichera le tableau des jeux correspondant (data)
  const fetchGames = async () => {
    const response = await fetch(
      `/api/igdb/Async_Suggestions?query=${searchTerm}`
    );
    const data = await response.json();
    const newData = data.map(
      (game) =>
        (game = {
          label: game.name,
          value: game.slug,
        })
    );
    setOptions(newData);
    console.log(newData);
  };

  //Il faut que la requete se fasse lorsque l'user arrete de taper pendant 500ms comme expliqué avant.
  //Au changement de searchTerm, fetchGames() s'applique.(et ce dernier à un delais de 500ms donc bingo)

  useEffect(() => {
    fetchGames();
  }, [searchTerm]);

  //pour les 10 jeux random au lancement du site c'est le meme principe en simplifié
  const fetchRandomGames = async () => {
    const response = await fetch(`/api/igdb/Async_RandomGames`);
    const data = await response.json();
    setRandomGames(data);
  };

  //cta vers la page de jeu
  const selectOption = (game) => {
    router.push(`/game/${game.value}`);
  };

  useEffect(() => {
    fetchRandomGames();
  }, []);

  //Amélioration de la qualité d'image
  const getGoodQualityImage = (url) => {
    const regex = /t_thumb/g;
    const replacedStr = url.replace(regex, "t_720p");
    return "https:" + replacedStr;
  };

  return (
    <main>
      <h1>Disco games</h1>
      <Select
        instanceId={useId()}
        value={searchTerm}
        placeholder="Rechercher..."
        options={options}
        onChange={selectOption}
        onInputChange={(e) => updateSearch(e)}
      />
      <>
        <h1>10 Jeux vidéos random</h1>
        <ul id={styles.box_random_game}>
          {randomGames.map((game, index) => (
            <div>
              <img
                className={styles.cover_game}
                src={getGoodQualityImage(game.cover.url)}
              />
              {/* <li key={index}>{game.name}</li> */}
            </div>
          ))}
        </ul>
      </>
    </main>
  );
}
