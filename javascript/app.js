$(document).ready(function() {


    let apiKey = "mmLCz3wmdx1TnPjdeGHcmM5bz5ysjz2w";
    let searchArr = ["Taylor Swift", "Titanic", "007"];
    let gifData = [];
    let limitInput = 10;
    let count = 0;


    function showBtn(input) {
        let newBtn = $('<button>').text(input).addClass('btn');
        newBtn.addClass('search-input');
        $('#btn-group').append(newBtn);
    }

    function Data(item, json, dataForGif, i) {
        for(let j = 0; j < limitInput; j++) {
            let {rating, images} = json.data[j];
            let newGif = {
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
            await Data(arr[i], json, dataForGif, i);
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
        console.log(count);
        this.blur();
        console.log(gifData);
        if($('#add-item').val().trim() === '') {
            alert("Enter something!!!");
        } else {
            let input = $('#add-item').val().trim().toLowerCase();
            searchArr.push(input.replace(/(^|\s)\S/g, x => x.toUpperCase()));
            showBtn(input.replace(/(^|\s)\S/g, x => x.toUpperCase()));
            $('#add-item').val('');
            getData(searchArr);
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
            let newP = $('<p>').text("Rating : " + rating);
            let newImg = $('<img>').attr('src', data.still).attr('data-id', i).attr('data-animation', 'still').addClass('gif-animation').attr('data-name', searchPara);
            let newDiv = $('<div>').append(newP).append(newImg).addClass('gif-wrapper');
            newDiv.appendTo($('#gif-group'));
        };
        
    });
    $(document).on('click', '.gif-animation', function() {
        this.blur()
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
});
