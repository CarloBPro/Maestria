const graf = d3.select('#graf')
const anchoTotal = graf.style('width').slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

const svg = graf
  .append('svg')
  .attr('width', anchoTotal)
  .attr('height', altoTotal)
  .attr('class', 'graf')

const margin = {
  top: 50,
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
let txtAtr = 'TotalS'
let Pkmn = 150



let y = d3.scaleLinear()
.range([alto, 0])

let x = d3.scaleBand()
.range([0, ancho])
.paddingInner(0.2)
.paddingOuter(0.5)

let color = d3.scaleOrdinal()
.range(['#008000', '#FF0000', '#1E90FF', '#32CD32', '#B0C4DE','#483D8B','#FFFF00', '#FFE4B5','#87CEFA',])

const xAxisGroup = g.append('g')
.attr('transform', `translate(0, ${alto})`)
.attr('class', 'ejes')


const yAxisGroup = g.append('g')
.attr('class', 'ejes')

d3.csv('pokemon.csv').then(data => {
  data.forEach(d => {
    d.TotalS = +d.TotalS
    d.HeP = +d.HeP
    d.Attack = +d.Attack
    d.Defense = +d.Defense
  })
  data = data.filter(d => {
    return d.TotalS > 500 }).sort((a,b)=> {
      return d3.descending(a.TotalS, b.TotalS)}).filter(d => {
        return d.Legendary != 'True' } )

  console.log(data)


 //const averag = d3.mean(data,function(d) { return d.TotalS}).filter(d => d.Type1)


  allData = data
  console.log(allData)

  render(allData).slice(0, StatS)
  labels(allData)
  Cfilter(allData)
  drawUserInput(allData)
})

function labels(data){

  let label = g.selectAll('label').data(data)


  let y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.TotalS)+75])
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
    .text(d3.mean(data, d => d.TotalS))
    .attr('x', d => x(d.Type1)+ x.bandwidth()/2)
    .attr('y', d => y(d.TotalS) -15)
    .attr('text-anchor', 'middle')
    .attr('font-size',15)
    .attr('fill','black')
    .classed('label',true);

}
function render(data) {

  let barras = g.selectAll('rect').data(data)


  
  
y.domain([0, d3.max(data, d => d.TotalS)+30])
x.domain(data.map(d => d.Type1))
color.domain(d3.map(allData, d => d.Type1))
    

xAxisGroup
    .call(
      d3.axisBottom(x)
        .tickSize(-alto)
    )
    .selectAll('text')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
    .attr('y', -15)
    .attr('x', -10)

yAxisGroup
      .call(
        d3.axisLeft(y)
          .ticks(4)
          .tickSize(-ancho)
          .tickFormat(d => `${d} TotalS.`)
      )

        

  barras
      .enter()
      .append('circle')
      .attr("class", "point")
        .attr('cx', d => x(d.Type1))
        .attr('cy', d => y(d.TotalS))
        .attr("r", 4)
        .attr('width', x.bandwidth())
        .attr('height', alto - y(0))
        .attr('fill', 'black')

        .transition()
        .duration(4000)
      .ease(d3.easeCubicOut)
        //.attr('y', d => y(d.TotalS))
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

selectVar.on('change', () => {
  txtAtr = selectVar.node().value
  render(allData)
})

selectNum.on('change', () => {
  Pkmn = selectNum.node().value
  render(allData.slice(0, numRegistros))
})