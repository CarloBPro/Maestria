const graf = d3.select('#graf')
const anchoTotal = graf.style('width').slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

const selectCheck = d3.select('#Legen')
const selectVar = d3.select('#variable')
const selectNum = d3.select('#numero')
const selectStat = d3.select('#Status')

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
let NumP = 50
let StatP = 0
let CheckL = 'True'


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
   return d.TotalS > 200}).filter(d => {
      return d.Legendary != CheckL } )

  console.log(data)


 //const averag = d3.mean(data,function(d) { return d.TotalS}).filter(d => d.Type1)


  allData = data
  console.log(allData)

  
  render(allData).slice(0, NumP)
  labels(allData)
})



function labels(data){

  let label = g.selectAll('label').data(data)


  let y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d[txtAtr])])
  .range([alto, 0])

  let x = d3.scaleBand()
  .domain(data.map(d => d.type))
  .range([0, ancho])
  .paddingInner(0.2)
  .paddingOuter(0.5)



label
    .enter()
    .append("text")
    .attr("class","label")
    .text(d3.mean(data, d => y(d[txtAtr])))
    .attr('x', d => x(d.Type1)+ x.bandwidth()/2)
    .attr('y', d => y(d[txtAtr]) -15)
    .attr('text-anchor', 'middle')
    .attr('font-size',15)
    .attr('fill','black')
    .classed('label',true);

}
function render(data) {

data = data.filter(d => {
  return d[txtAtr] > StatP}).filter(d => {
    return d.Legendary != CheckL } ).slice(0,NumP)

  let Circle  = g.selectAll('circle').data(data)


  
  
y.domain([0, d3.max(data, d => d[txtAtr])])
x.domain(data.map(d => d.Type1))
color.domain(d3.map(allData, d => d.Type1))
    

xAxisGroup
    .call(
      d3.axisBottom(x)
        .tickSize(-alto)
    )
    .selectAll('text')
    .attr('text-anchor', 'End')
    .attr('transform', 'rotate(-90)')
    .attr('y', -30)
    .attr('x', -10)

yAxisGroup
    .transition()
    .duration(2000)
    .call(
        d3.axisLeft(y)
          .ticks(4)
          .tickSize(-ancho)
          .tickFormat(d => `${d} ${ txtAtr == 'TotalS' ? 'TotalS' : 'atr' }`)
      )



      
      Circle
      .enter()
        .append('circle')
          .attr("class", "point")
          .attr('cy', y(0))
          .attr('cx', d => x(d.Type1))
          .attr("r", 4)
          .attr('width', x.bandwidth())
          .attr('height', alto - y(0))
          .attr('fill', d => color(d.Type1))
      .merge(Circle)
        .transition()
        .duration(2000)
        .ease(d3.easeCubicOut)
          .attr('cx', d => x(d.Type1))
          .attr('width', x.bandwidth())
          .attr('cy', d => {
            console.log(txtAtr)
            return y(d[txtAtr])
          }).filter(d => {
            return d.Legendary != CheckL })
          .attr("r", 4)
          .attr('fill', d => color(d.Type1))
          .attr('height', d => alto - y(d[txtAtr]))

        Circle
        .exit()
        .transition()
        .duration(2000)
        .attr('height', alto - y(0))
        .attr('cx', d => x(d.Type1))
        .attr('cy', y(0))
        .attr('fill', '#f00')
        .remove()    



 }



selectVar.on('change', () => {
  txtAtr = selectVar.node().value
  render(allData.slice(0,NumP))
})

selectNum.on('change', () => {
  NumP = selectNum.node().value
  render(allData.slice(0,NumP))
})


selectStat.on('change', () => {
  StatP = selectStat.node().value
  render(allData.slice(0,NumP))
})

selectCheck.on('change', () => {
  CheckL = selectCheck.node().value
  render(allData)
})