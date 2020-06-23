// Global variable \\
var data;

// Function to select dropdown option "name" in <samples.json> \\

function init() {
  d3.json("data/samples.json").then(dataInitial => {
    data = dataInitial;
    var selectValues = dataInitial.names;

    var selectOpt = d3.select("#selDataset");

    selectValues.forEach(value => {
      selectOpt
        .append("option")
        .text(value)
        .attr("value", function() {
          return value;
        });
    });
  });
}
// Populate data in dropdown list \\
init();

d3.selectAll("#selDataset").on("change", plotFunctions);

function plotFunctions() {
  var valueSelect = d3.select("#selDataset").node().value;
  demographicFunc(valueSelect);
  panelPlot(valueSelect);
  demographicFunc(valueSelect);
  bubbleChart(valueSelect);
  gaugeChart(valueSelect);
}

function demographicFunc(valueSelect) {
  var filterValue2 = data.samples.filter(value => value.id == valueSelect);
  var ouid = filterValue2.map(v => v.otu_ids);
  ouid = treatOuid(ouid[0].slice(0, 10));
  var valueX = filterValue2.map(v => v.sample_values);
  valueX = valueX[0].slice(0, 10);

  var out_label = filterValue2.map(v => v.otu_labels);
  var names = treatBacName(out_label[0]).slice(0, 10);
  
  // console.log(ouid);
  // console.log(valueX);
  // console.log(out_label);
  // console.log(names);

  // Create trace \\
  var trace = {
    x: valueX,
    y: ouid,
    text: names,
    type: "bar",
    orientation: "h"
  };

  var layout = {
    yaxis: {
      autorange: "reversed"
    }
  };

  // Create data array for plot \\
  var dataV = [trace];

  // Plot chart to div tag <id> "bar-plot" \\
  Plotly.newPlot("bar", dataV, layout);
}

function panelPlot(valueSelect) {
  // console.log(valueSelect);
  var filterValue = data.metadata.filter(value => value.id == valueSelect);

  var divValue = d3.select(".panel-body");
  divValue.html("");
  divValue.append("p").text(`id: ${filterValue[0].id}`);
  divValue.append("p").text(`ethnicity: ${filterValue[0].ethnicity}`);
  divValue.append("p").text(`gender: ${filterValue[0].gender}`);
  divValue.append("p").text(`age: ${filterValue[0].age}`);
  divValue.append("p").text(`location: ${filterValue[0].location}`);
  divValue.append("p").text(`bbtype: ${filterValue[0].bbtype}`);
  divValue.append("p").text(`wfreq: ${filterValue[0].wfreq}`);
}

function bubbleChart(valueSelect) {
  var filterValue3 = data.samples.filter(value => value.id == valueSelect);
  var ouid = filterValue3.map(v => v.otu_ids);
  ouid = ouid[0];
  var valueY = filterValue3.map(v => v.sample_values);
  valueY = valueY[0];

  var out_label = filterValue3.map(v => v.otu_labels);
  out_label = treatBacName(out_label[0]);

  var trace1 = {
    x: ouid,
    y: valueY,
    mode: "markers",
    marker: {
      color: ouid,
      size: valueY
    },
    text: out_label
  };

  var data2 = [trace1];

  var layout = {
    showlegend: false,
    xaxis: { title: "OTU ID" }
  };

  Plotly.newPlot("bubble", data2, layout);
}

// Function to create gauge chart & set gauge value based on selected option from dropdown list \\
function gaugeChart(valueSelect) {
  var filterValue = data.metadata.filter(value => value.id == valueSelect);
  var weeklyFreq = filterValue[0].wfreq;

  var data2 = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      title: {
        text: "Belly Button Washing Frequency <br>Scrubs per Week"
      },
      type: "indicator",

      mode: "gauge",
      gauge: {
        axis: {
          range: [0, 9],
          tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          ticks: "outside"
        },

        steps: [
          { range: [0, 1], color: "#f03" },
          { range: [1, 2], color: "#e10" },
          { range: [2, 3], color: "#c30" },
          { range: [3, 4], color: "#a50" },
          { range: [4, 5], color: "#870" },
          { range: [5, 6], color: "#690" },
          { range: [6, 7], color: "#4b0" },
          { range: [7, 8], color: "#2d0" },
          { range: [8, 9], color: "#0f0" }
        ],
        threshold: {
          line: { color: "black", width: 3 },
          thickness: 1,
          value: weeklyFreq
        }
      }
    }
  ];

  var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot("gauge", data2, layout);
}

// Function to return bacteria name
// if array value has more than one name -> use last name
// retrieve first 10 values \\

function treatBacName(name) {
  var listOfBact = [];

  for (var i = 0; i < name.length; i++) {
    var stringName = name[i].toString();
    var splitValue = stringName.split(";");
    if (splitValue.length > 1) {
      listOfBact.push(splitValue[splitValue.length - 1]);
    } else {
      listOfBact.push(splitValue[0]);
    }
  }
  return listOfBact;
}

function treatOuid(name) {
  var listOfOuid = [];
  for (var i = 0; i < name.length; i++) {
    listOfOuid.push(`OTU ${name[i]}`);
  }
  return listOfOuid;
}