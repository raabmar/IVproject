$(document).ready(function(){

    //generation-menu events
    $('.gen-btn').on('click',function(e){
        $(this).toggleClass('active');
        $(this).trigger('genChange');
    });


    //jahresslider:



    //district-auswahl:

    loadGenerationData();

    $('.checkbox').on('change', function(){
        console.log('textbox changed!!');
    });


//                $('.dist-sel').append("<input type='checkbox' name='selectedDistrict' value='" + val[0] + "'>" + val[0] + "<br/>");


    function loadGenerationData() {
        var dataArray = [];
        $.getJSON("data/generations.json", function( data ) {
            $.each(data, function(key, val) {
                dataArray.push(val);
            });
            for (var i=0; i < 36; i++) {
                console.log(data[i].BezNr + data[i].Bezirk);
                $('.dist-sel form').append("<div class='checkboxWrapper'><input type='checkbox' class='checkbox' name='selectedDistrict' action='change' value='" +
                    data[i].Bezirk + "'><span class='textboxcaption'>" + data[i].Bezirk + "</span></div>");
            }
        });
    }


});