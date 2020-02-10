function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(sampledata) {
      var sample_metadata = d3.select("#sample-metadata")
      sample_metadata.html("");

      Object.entries(sampledata).forEach(function ([key,value]){
        var row = sample_metadata.append("p");
        row.text(`${key}: ${value}`);
      });
    });
      d3.json(url).then(function(sampledata) {
        console.log(sampledata.WFREQ);
        level = sampledata.WFREQ

        var degrees = ((level)*20-180)*-1;
      alert(degrees);
      radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
  var url = "/samples/"+sample;
  d3.json(url).then(function(response) {

    console.log(response);
    var data = [response];
    let otu_ids = response.otu_ids.slice(0,10);
    let otu_labels = response.otu_labels.slice(0,10);
    let sample_values = response.sample_values.slice(0,10);   
    let pieChartData = [
      {
        values: sample_values,
        labels: otu_ids,
        hovertext: otu_labels,
        hoverinfo: "hovertext",
        colorscale: "Picnic",
        type: "pie"
      }
    ];
  

    let pieChartLayout = {

      margin: { t: 0, l: 0 }

    };
    

    Plotly.newPlot("pie", pieChartData, pieChartLayout);

    let bubbleChartData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Picnic"
        }
      }
    ];
    let bubbleChartLayout = {
      margin: { t: 0 },
      hovermode: "closests",
      xaxis: { title: "OTU ID"}
    };
    Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);

    
  });



}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
