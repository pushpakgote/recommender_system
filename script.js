//import movie from './movie_list.json' assert {type: 'json'};
//console.log(movie['movies']);

const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");


async function autocomplete() {

	// getting all required elements

	const suggBox = searchWrapper.querySelector(".autocom-box");
	const icon = searchWrapper.querySelector(".icon");
	let linkTag = searchWrapper.querySelector("a");
	let webLink;


	const { default: movie_data } = await import('./Content based filtering/movie_list.json', {
		assert: {
			type: "json"
		}
	});

	// if user press any key and release
	inputBox.onkeyup = (e) => {
		let userData = e.target.value; //user enetered data
		let emptyArray = [];
		if (userData) {
			//    icon.onclick = ()=>{
			//       webLink = `https://www.google.com/search?q=${userData}`;
			//      linkTag.setAttribute("href", webLink);
			//        linkTag.click();
			//    }


			emptyArray = movie_data.movies.filter((data) => {
				//emptyArray = suggestions.filter((data)=>{
				//filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
				return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
			});
			emptyArray = emptyArray.map((data) => {
				// passing return data inside li tag
				return data = `<li>${data}</li>`;
			});
			searchWrapper.classList.add("active"); //show autocomplete box
			showSuggestions(emptyArray, inputBox, suggBox);
			let allList = suggBox.querySelectorAll("li");
			for (let i = 0; i < allList.length; i++) {
				//adding onclick attribute in all li tag
				allList[i].setAttribute("onclick", "select(this)");

			}
		} else {
			searchWrapper.classList.remove("active"); //hide autocomplete box
		}
	}

}

function select(element) {
	let selectData = element.textContent;
	inputBox.value = selectData;

	//icon.onclick = ()=>{
	//    webLink = `https://www.google.com/search?q=${selectData}`;
	//    linkTag.setAttribute("href", webLink);
	//    linkTag.click();
	//}
	searchWrapper.classList.remove("active");
}

function showSuggestions(list, inputBox, suggBox) {
	let listData;
	if (!list.length) {
		userValue = inputBox.value;
		listData = `<li>${userValue}</li>`;
	} else {
		listData = list.join('');
	}
	suggBox.innerHTML = listData;
}


async function show_movies() {

	const searchWrapper = document.querySelector(".search-input");
	const searched_movie = searchWrapper.querySelector("input").value;
	//console.log(searched_movie)

	const { default: movie_list_data } = await import('./Content based filtering/movie_list.json', {
		assert: {
			type: "json"
		}
	});

	var index = movie_list_data['movies'].indexOf(searched_movie);
	//console.log(index);

	if (index == -1) {
		document.querySelector(".wrapper2").style.display = "none";
		alert("Select a movie from the list");
	} else {

		const { default: similar_movie_data } = await import('./Content based filtering/movies_similarity.json', {
			assert: {
				type: "json"
			}
		});

		//console.log(similar_movie_data[index]);
		for (let i = 0; i < 5; i++) {
			var index_of_similar_movie_data = similar_movie_data[index][i];
			var tmdb_index = movie_list_data['id'][index_of_similar_movie_data];

			var movie_url = "https://api.themoviedb.org/3/movie/" + tmdb_index + "?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US";



			const { default: response_movie_data } = await import(movie_url, {
				assert: {
					type: "json"
				}
			});


			var src = "https://image.tmdb.org/t/p/original/" + response_movie_data['poster_path'];

			var card = document.getElementsByClassName("card")[i];

			card.querySelector("img").src = src;


			card.querySelector("h1").textContent = response_movie_data['title'];

		}
		document.querySelector(".wrapper2").style.display = "flex";
	}
}