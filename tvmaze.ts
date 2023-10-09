import axios from "axios";
import jQuery from 'jquery';

const $ = jQuery;

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const BASE_API_URL = "https://api.tvmaze.com";
const DEFAULT_IMAGE_URL =
 "https://tinyurl.com/tv-missing";


interface ShowInterface {
  id: number;
  name: string;
  summary: string;
  image: string;
}

interface EpisodeInterface {
  id: number;
  name: string;
  season: string;
  number: string
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
async function searchShowsByTerm(term: string): Promise<ShowInterface[]> {

  const params = new URLSearchParams({q: term});

  const response = await fetch(`${BASE_API_URL}/search/shows?${params}`);
  const showData = await response.json() as any[];

  return showData.map(s => ({
    id: s.show.id,
    name: s.show.name,
    summary: s.show.summary,
    image: s.show.image.original || DEFAULT_IMAGE_URL
  }));
}


/** Given list of shows, create markup for each and add to DOM */

function populateShows(shows: ShowInterface[]):void {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val() as string;
  const shows = await searchShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id:number):Promise<EpisodeInterface[]> {
  const response = await fetch(`${BASE_API_URL}/shows/${id}}/episodes`);
  const episodeData = await response.json() as any[];

  return episodeData.map(e => ({
    id: e.id,
    name: e.name,
    season: e.season,
    number: e.number
  }))
 }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
