// JSON data URL
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function buildBarChart(sampleId) {
    console.log(`BuildBarChart(${sampleId})`);

    d3.json(url).then(data => {
        console.log(data);

        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();

        // Create a trace object
        let barData = {
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            type: 'bar',
            text: otu_labels.slice(0,10).reverse(),
            orientation: 'h'
        };

        // Put the trace object into an array
        let trace1 = [barData];

        // Create a layout object
        let barLayout = {
            margin: {
                t: 30,
                l: 150}
        };

        // Call the Plotly function
        Plotly.newPlot('bar', trace1, barLayout);
    });
};

function buildBubbleChart(sampleId) {
    console.log(`BuildBubbleChart(${sampleId})`);

    d3.json(url).then(data => {
        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        // Create a trace
        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                //colorscale: 'Earth'
            }
        }

        // Put the trace into an array
        let trace2 = [bubbleData];

        // Create a layout object
        let bubbleLayout = {
            margin: {t: 30},
            hovermode: 'closest',
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly funtion
        Plotly.newPlot('bubble', trace2, bubbleLayout);
    });
};

function ShowMetadata(sampleId) {
    console.log(`ShowMetadata(${sampleId})`);

    d3.json(url).then((data) => {
        let metadata = data.metadata;
        console.log(metadata);

        // Filter data
        let result = metadata.filter(m => m.id == sampleId)[0];
        let demographicInfo = d3.select('#sample-metadata');

        // Clear existing data in demographicInfo
        demographicInfo.html('');

        // Add key and value pair to the demographicInfo panel
        Object.entries(result).forEach(([key, value]) => {
            demographicInfo.append('h6').text(`${key}: ${value}`);
        });
    });
};

function optionChanged(sampleId) {
    console.log(`optionChanged, new value: ${sampleId}`);

    buildBarChart(sampleId);
    buildBubbleChart(sampleId);
    ShowMetadata(sampleId);
};

function Init() {
    console.log('InitDashboard');

    // Get a handle to the dropdown
    let dropdownMenu = d3.select('#selDataset');

    d3.json(url).then(data => {

        let sampleNames = data.names;

        // Populate the dropdown
        for (let i = 0; i < sampleNames.length; i++) {
            let sampleId = sampleNames[i];
            dropdownMenu.append('option').text(sampleId).property('value', sampleId);
        };

        // Read the current value from the dropdown
        let initialId = dropdownMenu.property('value');
        console.log(`initialId = ${initialId}`);

        // Draw the bargraph for the selected sample id
        buildBarChart(initialId);

        // Draw the bubblechart for the selected sample id
        buildBubbleChart(initialId);

        // Show the metadata for the selected sample id
        ShowMetadata(initialId);

    });
}

Init();























