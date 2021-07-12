const graf = d3.select('#graf')
const anchoTotal = graf.style('width').slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

const svg = graf
  .append('svg')
  .attr('width', anchoTotal)
  .attr('height', altoTotal)
  .attr('class', 'graf')

const margin = {
  top: 100,
  bottom: 250,
  left: 150,
  right: 50,
}

const ancho = anchoTotal - margin.left - margin.right
const alto = altoTotal - margin.top - margin.bottom

const g = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)


let allData = []

d3.csv('pokemon.csv').then(data => {
  data.forEach(d => {
    d.TotalS = +d.TotalS
    d.HeP = +d.HeP
    d.Attack = +d.Attack
    d.Defense = +d.Defense
  })
  console.log(data)

  allData = data.slice(0, 9)
  console.log(allData)

  render(allData)
  labels(allData)
  Cfilter(allData)
})

function labels(data){

  let label = g.selectAll('label').data(data)


  let y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.TotalS)+50])
  .range([alto, 0])

  let x = d3.scaleBand()
  .domain(data.map(d => d.Num))
  .range([0, ancho])
  .paddingInner(0.2)
  .paddingOuter(0.5)


label
    .enter()
    .append("text")
    .attr("class","label")
    .text(d => d.TotalS)
    .attr('x', d => x(d.Num)+ x.bandwidth()/2)
    .attr('y', d => y(d.TotalS) -10)
    .attr('text-anchor', 'middle')
    .attr('font-size',15)
    .attr('fill','black')
    .classed('label',true);

}
function render(data) {

  let barras = g.selectAll('rect').data(data)
  
  let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.TotalS)+30])
    .range([alto, 0])

  let x = d3.scaleBand()
    .domain(data.map(d => d.Name))
    .range([0, ancho])
    .paddingInner(0.2)
    .paddingOuter(0.5)

  let color = d3.scaleOrdinal()
    .domain(d3.map(allData, d => d.Type1))
    .range(['#008000', '#FF0000', '#1E90FF', '#32CD32', '#B0C4DE','#483D8B','#FFFF00', '#FFE4B5','#87CEFA',])


  const xAxisGroup = g.append('g')
    .attr('transform', `translate(0, ${alto})`)
    .attr('class', 'ejes')
    .call(
      d3.axisBottom(x)
        .tickSize(-alto)
    )
    .selectAll('text')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
    .attr('y', -15)
    .attr('x', -10)

  const yAxisGroup = g.append('g')
      .attr('class', 'ejes')
      .call(
        d3.axisLeft(y)
          .ticks(4)
          .tickSize(-ancho)
          .tickFormat(d => `${d} TotalS.`)
      )

        

  barras
      .enter()
      .append('rect')
        .attr('x', d => x(d.Name))
        .attr('y', y(0))
        .attr('width', x.bandwidth())
        .attr('height', alto - y(0))
        .attr('fill', 'black')

        .transition()
        .duration(2000)
      .ease(d3.easeBounce)
        .attr('y', d => y(d.TotalS))
        .attr('fill', d => color(d.Type1))
        .attr('height', d => alto - y(d.TotalS))


  titleGroup = g.append('g')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', ancho/2)
        .attr('y', -20)
        .attr('class', 'titulo')
        .text('Pokemon Stats')
                          
}


function Cfilter(data){

let unselectedIds =[];

const listItems = d3
  .select('#graf')
  .select('ul')
  .selectAll('li')
  .data(allData)
  .enter()
  .append('li');

  listItems.append('span').data(d => d.Type1);

  listItems
    .append('input')
    .attr('type','checkbox')
    .attr('check',true)
    .on('change',d => {
      if (unselectedIds.indexOf(d.Type1) === -1) {
        unselectedIds.push(d.Type1)
      }else{
        unselectedIds =unselectedIds.filter(d => d.Type1 !== d.Type1)
      }
      selectedData = allData.filter
    })
    
}