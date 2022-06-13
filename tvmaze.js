//sugestions for the placeholder text
let placeholderList =['Mythbusters','Galavant','Psych','Castle','Galavant','Bones','White collar',"Galavant"];
let placeholderNum =0;//keeps track of what placeholder text should show up when there is no value for the search input



//gets the shows from tvmaze.com
async function searchShows(query) {
  const results = await axios.get(
`http://api.tvmaze.com/search/shows?q=${query}`
  );


  if (results.data.length === 0) {
    alert(
      "Show not found! Please try a different show. Maybe try Galavant!"
    );
  }

  let shows = [];

  for (let showData of results.data) {
    let id = showData.show.id;
    let name = showData.show.name;
    let summary = showData.show.summary;

    let image;
    if (showData.show.image) {
      image = showData.show.image;
    }

    shows.push({ id, name, summary, image });
  }

  return shows;
}


//adds the html for the shows
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
let newDiv =$(`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">`);
let newCardDiv =$(`<div class="card" data-show-id="${show.id}">`);
let newCardBody =$('<div class="card-body">');
let newTitle =$(`<h5 class="card-title">${show.name}</h5>`);
let newSummery = $(`<p class="card-text"></p>`);


newCardBody.append(newTitle);

    if (show.summary) {
      newSummery.html(show.summary);
    } else {
      newSummery.text("No show summary :/");
    }
  newCardBody.append(newSummery);

      if (show.image) {
        newCardBody.append(`<img src =${show.image.medium}>`);
      }
      else{
        newCardBody.append('<img src = "https://tinyurl.com/tv-missing">');
      }

newCardBody.append('<button type="button" class="episodeBtn">View Episodes</button>');

newCardDiv.append(newCardBody);
newDiv.append(newCardDiv);
    $showsList.append(newDiv);
  }
}



//checks for a click/submit on the search button
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;
  $("#episodes-area").hide();

  let shows = await searchShows(query);

//
  $("#search-query").attr('placeholder',placeholderList[placeholderNum]);
  placeholderNum++;
  $("#search-query").val('');

  populateShows(shows);

});


//checks for a click on the buttons
$('#shows-list').on('click',"button",async function handleEpisodes(event){

let parElement = event.target.parentElement.parentElement;

if(parElement.dataset.showId){
let episodes = await getEpisodes(parElement.dataset.showId);
populateEpisodes(episodes);
}

});



//gets episodes of a show
async function getEpisodes(id) {

  const results = await axios.get(
`http://api.tvmaze.com/shows/${id}/episodes`
  );
let episodes =[];

  for(let episode of results.data)
  {
    episodes.push({
season: episode.season,
    number: episode.number,
      name: episode.name,
      id: episode.id
    })
  }

  return episodes;

}


//adds episodes to a list
function populateEpisodes(episodes)
{
  $('#episodes-list').empty();

  let episodeList = $('#episodes-list');

  for(let episode of episodes)
  {
    episodeList.append(`<li> S ${episode.season},E ${episode.number}  ${episode.name}, id: ${episode.id} </li>`);
  }
    $("#episodes-area").show();
}
