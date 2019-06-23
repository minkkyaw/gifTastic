$(document).ready(function() {


    let apiKey = "mmLCz3wmdx1TnPjdeGHcmM5bz5ysjz2w";
    let searchArr = ["Taylor Swift", "Titanic", "007"];
    let gifData = [];
    let limitInput = 10;

    function showBtns(i) {
        let newBtn = $('<button>').text(searchArr[i]).addClass('btn');
        newBtn.addClass('search-input');
        $('#btn-group').append(newBtn);
    }

    function getData(response , i) {
        let dataForGif = [];
        for(let j = 0; j < limitInput; j++) {
            let {rating, images} = response.data[j];
            let newGif = {
                rating,
                still: response.data[j].images.fixed_height_still.url,
                animation: images.fixed_height.url
            }
            dataForGif.push(Object.assign({} ,newGif));
        };
        gifData.push({});
        gifData[i][searchArr[i]] = dataForGif;
        console.log(gifData);
    }

    function displayBtns() {
        for(let i = 0; i < searchArr.length; i++) {
            let searchPara = searchArr[i];
            
            let queryUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchPara}&limit=${limitInput}&offset=0&rating=&lang=en`;
            $.ajax({
                url: queryUrl,
                method: 'GET'
            }).then(response => {
                getData(response , i)
                showBtns(i);
            })
        };
    };

    displayBtns();

    $('#submit-btn').on('click', function(event) {
        event.preventDefault();
        this.blur();
        if($('#add-item').val().trim() === '') {
            alert("Enter something!!!");
        } else {
            searchArr.push($('#add-item').val().trim());
            $('#btn-group').empty();
            displayBtns();
            $('#add-item').val('');
        };
    });

    $(document).on('click', '.search-input', function() {
        $('#gif-group').empty();
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
