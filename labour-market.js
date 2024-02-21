//FAO Colors
/*FAO COLORS */
const fao_blue = '#0f60d5';
const white = '#ffffff';
const fao_dark_blue = '#1a2b4a';
const fao_light_blue_1 = '#9ec2f5';
const fao_light_blue_2 = '#bad1f6';
const fao_light_blue_3 = '#d7e4fa';
const fao_light_blue_4 = '#f1f6fd';
const fao_green = '#b2d235';
const fao_pink = '#e23e94';
const fao_light_pink = "#E6C7D8";
const black = '#000000';
const csv_dir_url = 'data/';


let chartOption = {width: 1000, height:600, className: "labour-market-chart", marginLeft: 55, marginBottom: 80, marginRight: 0};

function replaceFig(figId,graphElement){
    //DOCSTRING: Replaces the image with the graph element
    //figId: the id of the figure
    //graphElement: the graph element to replace the image with
    const img = document.querySelector('#' + figId + '-image img');
    img.after(graphElement);
    img.style.display = "none";
}
function replaceGElem(figId){
    // Find the <g> element using aria-label attribute
    //the g element beased on fig-id
    //ex: fig3-2-image sb-char5 g[aria-label="y-axis label"]


    const div = document.querySelector('html body div#'+figId+'-image.report-chart');
    const gElement = div.querySelector('figure.labour-market-chart');
    console.log(gElement);
    //go inside the g element and find the g element with aria-label="y-axis label"
    //gElement = gElement[0].querySelectorAll('g[aria-label="y-axis label"]');
    // Check if the <g> element is found=
    if (gElement) {
        // Find the <text> element within <g>
        var textElement = gElement.querySelector('text');

        // Check if the <text> element is found
        if (textElement) {
            // Access the text content
            var labelText = textElement.textContent || textElement.innerText;
            //modify the text content to replace the up arrow with nothing
            if(figId == "fig3-2"){
                textElement.textContent = "";
            }
            else{
                textElement.textContent = "";
            }
        } else {    
            console.error('No <text> element found within <g>');
        }
    } else {
        console.error('Element with aria-label="y-axis label" not found');
    }
    
};

function replaceSwatchesWithCheckboxes() {
    // Get all the swatches
    const swatches = document.querySelectorAll('.labour-market-chart-swatch');
    console.log(swatches);
  
    // Iterate over each swatch
    swatches.forEach((swatch) => {
      // Create a checkbox element
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'swatch-checkbox';
  
      // Replace the swatch with the checkbox
      swatch.parentNode.replaceChild(checkbox, swatch);
    });
  }
  
  // Call the function to replace swatches with checkboxes
  

function activeData(data1, data2, figId){
    //On click of the legend, the data is activated or deactivated
    //Always look for this
    window.setInterval(() => {
        const legend_rect = document.querySelectorAll('div#'+figId+'-image.report-chart figure.labour-market-chart-figure div.labour-market-chart-swatches.labour-market-chart-swatches-wrap span.labour-market-chart-swatch svg rect');
        //console.log(legend_rect);
        if(legend_rect){
            //console.log(legend_rect);
            // i = 0 is associated with the first data
            // i = 1 is associated with the second data
            for(let i = 0; i < legend_rect.length; i++){
                legend_rect[i].onclick = e => {
                    //So if i == 0, we are dealing with the first data and we want to hide the first data
                }
            }
            /*
            legend.onclick = e => {
                if(e.target.tagName === "LI"){
                    const item = e.target;
                    const parent = item.parentNode;
                    const index = Array.from(parent.children).indexOf(item);
                    const marks = document.querySelectorAll('.mark');
                    marks[index].style.display = marks[index].style.display === "none" ? "block" : "none";
                }
            }
            */
        }
    }, 10);
}

d3.csv(csv_dir_url + 'fig1.csv').then(d => {
    //console.log(d);
    //map the type to the change for formatted data
    let year_vs_employmentchange  = d.map(d => Object.keys(d).slice(1).map(k => ({Type: "Year vs Employment Change", Year: k.toString(), "Change": +d[k]})))[0]
    console.log(year_vs_employmentchange);
    let year_vs_unemploymentrate = d.map(d => Object.keys(d).slice(1).map(k => ({Type: "Year vs Unemployment Rate", Year: k.toString(), "Change": +d[k]})))[1];

    //combine the two datasets, have another column called y and have it add the Change and the Unemployment Rate
    let combined = year_vs_employmentchange.map((d, i) => ({...d, "Unemployment Rate": year_vs_unemploymentrate[i].Change, "y": d.Change - year_vs_unemploymentrate[i].Change}));
    console.log(combined);
    //let year_vs_employmentchangepercent = d.map(d => Object.keys(d).slice(1).map(k => ({Type: "Year vs Employment Change Percent", Year: k.toString(), "Change": +d[k]})))[2];
    /*
    const fig1 = Plot.plot({
        className:  chartOption.className,
        width: 800,
        marginBottom: 100,
        marginLeft: 50,
        marginRight: 50,
        x: {
            label: "Year",
            domain: year_vs_employmentchange.map(d => d.Year),
            tickFormat: d => d,
        },
        y: {
            label: "Change",
            tickFormat: d => d,
        },
        marks: [
            Plot.barY(year_vs_employmentchange, {x: "Year", y: "Change", stroke: fao_blue, tip:true}),

        ]
    })
    */

    

   

    const fig1 = Plot.plot({
        width: chartOption.width,
        height: chartOption.height,
        marginLeft: chartOption.marginLeft,
        marginBottom: chartOption.marginBottom,
        className:  chartOption.className,
        x:{type: "band", label: "Year", domain: year_vs_unemploymentrate.map(d => d.Year), padding: 0.2},
        y:{axis: "left", label:"", labelArrow: "none", domain: [-400,400], nice: true, line: true},
        marks:[
            Plot.barY(year_vs_employmentchange, {x: "Year", y: "Change", fill: fao_light_blue_1}),
            
            () => 
                Plot.plot({
                    
                    width: chartOption.width,
                    height: chartOption.height,
                    marginLeft: chartOption.marginLeft,
                    marginRight: 27,
                    marginBottom: chartOption.marginBottom,
                    className:  chartOption.className,
                    x:{type: "band", label: "", domain: year_vs_unemploymentrate.map(d => d.Year), padding: 0.2, tickFormat: d => null},
                    y:{axis: "right", label: "", labelArrow: "none", domain: [0,12], nice: true, line: true},
                    marks:[
                        Plot.line(year_vs_unemploymentrate, {x: "Year", y: "Change", stroke: fao_blue, strokeWidth: 5}),                    
                    ],
                })
            
            //Plot.line(year_vs_unemploymentrate, {x: "Year", y: "Change", stroke: fao_blue, strokeWidth: 5}),
            
        ],
        color: {legend: true, domain:["Year vs Employment Change", "Year vs Unemployment Rate"], range: [fao_light_blue_1, fao_blue]},

    });
    
    
    activeData(year_vs_employmentchange, 'fig1');
    replaceFig('fig1',fig1);
});
