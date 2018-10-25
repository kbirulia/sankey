import * as d3 from 'd3';
import * as d3_sankey from 'd3-sankey';
import { data } from './data';

const width = window.innerWidth - 20;
const height = window.innerHeight - 20;

const svg = d3.select("#sankey")
    .attr("width", width)
    .attr("height", height)
    .style("padding", "10px");

const sankey = d3_sankey.sankey()
    .size([ width - 20, height - 20])
    .nodeId((d: any) => d.id)
    .nodeAlign(d3_sankey.sankeyCenter);
let chart = sankey(<any>data);


svg.append("g")
    .classed("links", true)
    .selectAll("path")
    .data(chart.links)
    .enter()
    .append("path")
    .classed("link", true)
    .attr("d", d3_sankey.sankeyLinkHorizontal())
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", d => d.width)
    .attr("stoke-opacity", 0.5);

svg.append("g")
    .classed("nodes", true)
    .selectAll("rect")
    .data(chart.nodes)
    .enter()
    .append("rect")
    .classed("node", true)
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", "black")
    .attr("opacity", 0.5)
    .text(node => {
        return node.id;
    });

svg.append("g")
    .classed("text", true)
    .selectAll("text")
    .data(chart.nodes)
    .enter()
    .append("text")
    .classed("node", true)
    .attr("x", d => d.x0)
    .attr("y", d => d.y0 + 15)
    .text(node => node.id);
