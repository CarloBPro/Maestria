const graf = d3.select('#graf')
const anchoTotal = graf.style('width').slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16


const RegiIn = d3.select('#RegionMX')
const btnEsel = d3.select('#EstadoMX')

const svg = graf
  .append('svg')
  .attr('width', anchoTotal)
  .attr('height', altoTotal)
  .attr('class', 'graf')

const margin = {
  top: 50,
  bottom: 85,
  left: 55,
  right: 30,
}

const ancho = anchoTotal - margin.left - margin.right
const alto = altoTotal - margin.top - margin.bottom


const g = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

g.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', ancho)
  .attr('height', alto)
  .attr('stroke', '#333333')
  .attr('fill', '#ffffff77')

const yearDisplay = g
  .append('text')
  .attr('class', 'numerote')
  .attr('x', ancho / 2)
  .attr('y', alto / 2 + 50)
  .attr('text-anchor', 'middle')


let allData = []
let year = 0
let minYear, maxYear
let corriendo = false
let interval
let txtEst = "Aguascalientes"
let txtReg = 1


const txtYear = d3.select('#txt-year')
const btnAtras = d3.select('#btn-atras')
const btnPlay = d3.select('#btn-play')
const btnAdelante = d3.select('#btn-adelante')


let x = d3.scaleLog().range([0, ancho])
let y = d3.scaleLinear().range([alto, 0])
let r = d3.scaleLinear().range([5, 100])
let color = d3
  .scaleOrdinal()
  .range(['#008f39', '#69f0d6', '#be1d14', '#a8dc9b', '#572364'])

function carga() {
  d3.csv('exporta.csv').then((datos) => {
    datos.forEach((d) => {
      d.Qt1= +d.Qt1
      d.Qt2= +d.Qt2
      d.Qt3= +d.Qt3
      d.Qt4= +d.Qt4
      d.TotalExp = +d.TotalExp
      d.year = +d.year
      d.RegionN = +d.RegionN
    })

    datos = d3.filter(
      datos,
      (d) => d.Qt1> 0 && d.Qt2> 0 && d.Qt3> 0 && d.Qt4> 0 && d.TotalExp> 0 && d.Region != "Mexico"
    )

    allData = datos
    txtYear.attr('value', year)
    minYear = d3.min(datos, (d) => d.year)
    maxYear = d3.max(datos, (d) => d.year)
    year = minYear


    x.domain([d3.min(datos, (d) => d.TotalExp), d3.max(datos, (d) => d.TotalExp)*1.8])
    y.domain([d3.min(datos, (d) => d.TotalExp), d3.max(datos, (d) => d.TotalExp)*1.3])
    r.domain(d3.extent(d3.map(datos, (d) => d.TotalExp)))
    color.domain(d3.map(datos, (d) => d.Region))
  

    g.append('g')
      .attr('transform', `translate(0, ${alto})`)
      .attr('class', 'ejes')
      .call(
        d3
          .axisBottom(x)
          .ticks(10)
          .tickSize(-alto)
          .tickFormat((d) => d3.format(',d')(d))
      )
      .selectAll('text')
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'end')
      .attr('x', -10)
      .attr('y', -5)

    g.append('g')
      .attr('class', 'ejes')
      .call(d3.axisLeft(y).ticks(10).tickSize(-ancho))

    cuadro()
    
  })
}

function dibujo(datos) {




  yearDisplay.text(year)

  burbujas = g.selectAll('circle').data(datos, (d) => d.Estado)

  burbujas
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.TotalExp))
    .attr('cy', (d) => y(d.TotalExp))
    .attr('r', 0)
    .attr('fill-opacity', 0.5)
    .attr('stroke', '#bbb')
    .attr('fill', '#0d0')
    .transition()
    .duration(325)
    .attr('r', 125)
    .transition()
    .duration(325)
    .attr('r', (d) => r(d.TotalExp))
    .attr('fill', (d) => color(d.Region))
    

  burbujas
    .merge(burbujas)
    .transition()
    .duration(750)
    .attr('cx', (d) => x(d.TotalExp))
    .attr('cy', (d) => y(d.TotalExp))
    .attr('r', (d) => r(d.TotalExp))
    .attr('fill', (d) => color(d.Region))

  burbujas
    .exit()
    .transition()
    .duration(325)
    .attr('r', 125)
    .attr('fill', (d) => color(d.Region))
    .transition()
    .duration(325)
    .attr('r', 0)
    .remove()
}




function cuadro() {

  data = d3.filter(allData, (d) => d.year == year)

  dibujo(data)
}


function cuadro2() {

  data = d3.filter(allData, (d) => d.year == year &&  d.RegionN == txtReg)

  dibujo(data)
}

function cuadro3() {

  data = d3.filter(allData, (d) => d.year == year &&  d.Estado == txtEst)

  dibujo(data)
}


function changeYear(inc) {
  console.log(year)
  year += inc
  console.log(year)

  if (year > maxYear) year = maxYear
  if (year < minYear) year = minYear

  txtYear.attr('value', year)
  cuadro()
}

carga()

txtYear.on('change', () => {
  year = +txtYear.node().value
  cuadro()
})

btnAtras.on('click', () => {
  changeYear(-1)
})

btnPlay.on('click', () => {
  corriendo = !corriendo
  if (corriendo) {
    btnPlay.html("<i class='fas fa-pause'></i>")
    btnPlay.classed('btn-danger', true)
    btnPlay.classed('btn-success', false)
    intervalo = d3.interval(() => changeYear(1), 750)
  } else {
    btnPlay.html("<i class='fas fa-play'></i>")
    btnPlay.classed('btn-danger', false)
    btnPlay.classed('btn-success', true)
    intervalo.stop()
  }
})

btnAdelante.on('click', () => {
  changeYear(1)
})

btnEsel.on('change', () => {
  txtEst = btnEsel.node().value
  cuadro3()
})


RegiIn.on('change', () => {
  txtReg = RegiIn.node().value
  cuadro2()
})



