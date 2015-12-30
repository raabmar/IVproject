var lineChart = {
    createAVGAgeLinzChart: function () {
        var height = 120;
        var width = 500;
        var margin = {top:20, right:20, bottom:30, left:50}


        //Parse date/time format
        //https://github.com/mbostock/d3/wiki/Time-Formatting
        var parseDate = d3.time.format("%Y").parse;

        //Scale
        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        //Labels
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left");


        var line = d3.svg.line().x(function(d) {
            return x(d.year);

        }).y(function(d) {
            return y(d.amount);
        }).interpolate("monotone"); //für runde Linien


        //Deklaration DIV-Bereich für Diagramm
        var svg = d3.select(".avg-age-linz-diagram").append("svg")
            .attr("class", 'avg-age-linz')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g").attr("transform", "translate(" + margin.left+", " + margin.top + ")");


        //Datensatz durchlaufen
        //We start here, after loading the data
        d3.json("data/data.json", function(error, data) {
            if(error) throw error;
            data.forEach(function(d) {
                d.year = parseDate(d.year); // = data[d]
                d.amount = d.avgage; //not necessary
                console.log(d);
            });

            //extent = array von min/maximum
            x.domain(d3.extent(data, function(d) {
                return d.year;
            }))

            y.domain([d3.max(data, function(d) {
                return d.amount-2;
            }), d3.max(data, function(d) {
                return d.amount+2;
            })]);

            svg.append("g").attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g").attr("class", "y axis")
                .call(yAxis);

            svg.append("path").datum(data)
                .attr("class", "line")
                .attr("d", line);

            svg.selectAll("datamarker").data(data).enter()
                .append("circle").attr("class", "datamarker")
                .attr("r", function(d) {
                    return d.amount * 0.15;
                })
                .attr("cx", function(d) {
                    return x(d.year);
                })
                .attr("cy", function(d) {
                    return y(d.amount);
                })
                /*                .on("mouseover", function(d){
                 d3.select(this).style("fill-opacity", 1.0);
                 })
                 .on("mouseout", function(d) {
                 d3.select(this).style("fill-opacity", 0.5);
                 });*/

                .on("mouseover", function(d){
                    d3.select(this).transition().duration(1000).ease("elastic")
                        .style("fill-opacity", 1.0)
                        .attr("r", function(d) {return d.amount * 0.15 + 5})
                })
                .on("mouseout", function(d) {
                    d3.select(this).transition()
                        .style("fill-opacity", 0.5)
                        .attr("r", function(d) {return d.amount *0.15})
                });
        });
    }
};
