const graf = d3.select('#graf')

const width2 = 600;
const height2 = 300;
const baseX = 30;
const baseY = 30;
const size = 4;

const svg = graf.append("svg").attr("width", width2).attr("height", height2);

let allData = []

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


  allData = data.slice(0, 150)
  console.log(allData)

  draw(allData)
})

function draw(data){

    let point = svg.selectAll("circle").data(data)

    point
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx",d => y(d.TotalS))
    .attr("cy", y(0))
    .attr("r", size)
    .attr('fill', 'black')
}
