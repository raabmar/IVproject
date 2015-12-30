$(document).ready(function(){

    //generation-menu events
    $('.gen-btn').on('click',function(e){
        $(this).toggleClass('active');
        actualize();
    });



    //jahresslider:
    $('.yearSlider').on('change', function(){
        console.log('sliderChange to value: ' + $(this).val());
        actualize();
    });

    //district-auswahl:
    generateDistSel(true);



    function generateDistSel(initial) {
        var dataArray = [];
        $.getJSON("data/generations.json", function( data ) {
            $.each(data, function(key, val) {
                dataArray.push(val);
            });
            if(initial){
                for (var i=0; i < 36; i++) {
                    console.log(data[i].BezNr + data[i].Bezirk);
                    $('.dist-sel form').append("<div class='checkboxWrapper'><input type='checkbox' class='checkbox' name='selectedDistrict' action='change' value='" +
                        data[i].Bezirk + "'><span class='textboxcaption'>" + data[i].Bezirk + "</span></div>");
                }
            }
            $('.checkbox').on('change', function(){
                var checked = $('.checkbox:checked');
                var numChecked = checked.length;
                if (numChecked > 4) {
                    alert('Choose only up to 4 districts to compare!');
                    $(this).attr('checked', false);
                }
                actualize();
            });

        });
    }

    function actualize () {
        $('.piechart').empty();
        $
        var jCheckedGens = $('.gen-btn.active');
        var checkedGens = [];
        for (var i=0; i<jCheckedGens.length; i++){
            checkedGens.push($(jCheckedGens[i]).attr('genName'));
        }
        console.log(checkedGens);

        var dataArray = [];

        $.getJSON("data/generations.json", function( data ) {
            $.each(data, function(key, val) {
                dataArray.push(val);
            });

            var checkedDists = $('.checkbox:checked');
            var diagramCounter = 1;

            //get according data
            $.each(checkedDists, function(searchKey, searchVal){
                var searchedDistrict = searchVal.value;
                $.each(dataArray, function(key, val) {
                    if(searchedDistrict === val.Bezirk && $('.yearSlider').val() == val.Year){
                        console.log(val);
                        createPieChart(val, checkedGens, '.chart' + diagramCounter, 250, 250);
                        diagramCounter++;
                    }
                });
            });


            //ToDo: actualize graphs!

            //ToDo: mark on map!


        });
    }

    function createPieChart (district, checkedGens, domDestination, height, width) {
        $(domDestination).append('<h4 class="pieHeadline">' + district.Bezirk + '</h4>')
        var pieData = [];
        var sum = 0;
        for (var i=0; i<checkedGens.length; i++){
            $.each(district, function(key, val) {
                if(key==checkedGens[i]){
                    pieData.push({"label": key, "value":val});
                    sum += val;
                }
            });
        }
//        console.dir(pieData);
//        console.log('sum: ' + sum);
        console.log(domDestination);


        var r = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
            .range(["#FFDD6F", "#62A1B5", "#EFF5E3", "#C5DCA6", "#CBB5BB"]);

        var data = pieData;

        var vis = d3.select(domDestination)
            .append("svg:svg")              //create the SVG element inside the <body>
            .data([data])                   //associate our data with the document
            .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", height)
            .append("svg:g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

        var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
            .outerRadius(r);

        var pie = d3.layout.pie()           //this will create arc data for us given a list of values
            .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

        var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
            .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
            .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
            .attr("class", "slice");    //allow us to style things in the slices (like text)

        arcs.append("svg:path")
            .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
            .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

        arcs.append("svg:text")                                     //add a label to each slice
            .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = r*0.7;
                d.outerRadius = r*1.5;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return Math.round(data[i].value/sum*100) + "%"; });        //get the label from our origin

        arcs.on("mouseover", function(d){
            d3.select(this).transition().duration(1000).ease("elastic")
                .style("fill-opacity", 0.8);
        })
        .on("mouseout", function(d) {
            d3.select(this).transition()
                .style("fill-opacity", 1);
        });

    }


});