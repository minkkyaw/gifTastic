$(document).ready(function() {


    let apiKey = "mmLCz3wmdx1TnPjdeGHcmM5bz5ysjz2w";
    let searchArr = ["Taylor Swift", "Titanic", "007"];
    let gifData = [];
    let limitInput = 10;
    let count = 0;
    let favoriteArr = [];


    function showBtn(input) {
        let newBtn = $('<button>').text(input).addClass('btn');
        newBtn.addClass('search-input');
        $('#btn-group').append(newBtn);
    }

    function Data(item, json, dataForGif) {
        for(let j = 0; j < limitInput; j++) {
            let {rating, images} = json.data[j];
            let newGif = {
                name: item,
                rating,
                still: images.fixed_height_still.url,
                animation: images.fixed_height.url
            }
            dataForGif.push(Object.assign({} ,newGif));
        };
        gifData.push({});
        gifData[count][item] = dataForGif;
    }

    async function getData(arr) {
        for(let i = count; i < arr.length; i++) {
            let dataForGif = [];
            let searchPara = arr[i];
            let queryUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchPara}&limit=${limitInput}&offset=0&rating=&lang=en`;

            let response = await fetch(queryUrl);
            let json = await response.json();
            await Data(arr[i], json, dataForGif);
            count ++;
        }   
        console.log(gifData);
    }
    
    function displayBtns() {
        getData(searchArr);
        for(let i = 0; i < searchArr.length; i++) {
            showBtn(searchArr[i]);  
        };
    };
    displayBtns();

    $('#submit-btn').on('click', function(event) {
        event.preventDefault();
        this.blur();
        let input = $('#add-item').val().trim().toLowerCase().replace(/(^|\s)\S/g, x => x.toUpperCase());
        if(input === '') {
            $('#add-item').val('');
            alert("Enter something!!!");
        } else if(searchArr.includes(input)) {
            $('#add-item').val('');
            alert("Enter another!!");
        } else {
            
            searchArr.push(input);
            showBtn(input);
            $('#add-item').val('');
            getData(searchArr);
        };
    });

    $('#favorite-btn').on('click', function(event) {
        $('#gif-group').empty();
        $('#gif-group').addClass('gifs-wrapper');
        this.blur();
        for(let i = 0; i < favoriteArr.length; i++) {
            let data = favoriteArr[i];
            let name = data.name;
            let rating =  data.rating;
            let newP = $('<p>').text("Rating : " + rating);
            let newImg = $('<img>').attr('src', data.still).attr('data-id', i).attr('data-animation', 'still').addClass('favorite-gif-animation').attr('data-name', name);
            let newDiv = $('<div>').append($('<p>').text(name)).append(newP).append(newImg).addClass('gif-wrapper');
            newDiv.appendTo($('#gif-group'));
        };
    });

    $(document).on('click', '.search-input', function() {
        $('#gif-group').empty();
        $('#gif-group').addClass('gifs-wrapper');
        this.blur();
        let searchPara = $(this).text();
        let index = searchArr.indexOf(searchPara);
        for(let i = 0; i < limitInput; i++) {
            let data = gifData[index][searchPara][i];
            let rating =  data.rating;
            let name = data.name;
            let newP = $('<p>').text("Rating : " + rating);
            let newImg = $('<img>').attr('src', data.still).attr('data-id', i).attr('data-animation', 'still').addClass('gif-animation').attr('data-name', name);
            let newDiv = $('<div>').append($('<p>').text(name)).append(newP).append(newImg).addClass('gif-wrapper');
            newDiv.appendTo($('#gif-group'));
        };
        
    });
    
    $(document).on('click', '.gif-animation', function() {
        let index = parseInt($(this).attr('data-id'));
        let name = $(this).attr('data-name');
        let clickGifAnimation = gifData[searchArr.indexOf(name)][name];
        if($(this).attr('data-animation') === 'still') {
            $(this).attr('src', clickGifAnimation[index].animation);
            $(this).attr('data-animation','animation');
        } else{
            $(this).attr('src', clickGifAnimation[index].still);
            $(this).attr('data-animation', 'still');
        };
    });

    $(document).on('click', '.favorite-gif-animation', function() {
        let index = parseInt($(this).attr('data-id'));
        let name = $(this).attr('data-name');
        let clickGifAnimation = gifData[searchArr.indexOf(name)][name];
        if($(this).attr('data-animation') === 'still') {
            $(this).attr('src', favoriteArr[index].animation);
            $(this).attr('data-animation','animation');
        } else{
            $(this).attr('src', favoriteArr[index].still);
            $(this).attr('data-animation', 'still');
        };
    });

    $(document).on('dblclick', '.gif-animation', function() {
        this.blur();
        let name = $(this).attr('data-name');
        let index = searchArr.indexOf(name);
        let id = $(this).attr('data-id');
        favoriteArr.push(gifData[index][name][id]);
        if(favoriteArr.length > 10) {
            favoriteArr.shift();
        }
    });
});
