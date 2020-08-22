/**
 * @class Line
 */
class Line {

    /*
    Constructor
     */
    constructor(_data, _target) {

        // To support Safari, moved public field declarations into contructor
        // Variables
        this.data_bins = [];
        // Elements
        this.svg = null;
        this.g = null;
        this.xAxisG = null;
        this.yAxisG = null;
        this.path = null;

        // Configs
        this.svgW = 500; // in px
        this.svgH = 360;
        this.gMargin = {top: 50, right: 50, bottom: 60, left: 80};
        this.gW = this.svgW - (this.gMargin.right + this.gMargin.left);
        this.gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);

        // Tools
        this.scX = d3.scaleLinear()
                .range([0, this.gW]);
        this.scY = d3.scaleLinear()
                .range([this.gH, 0]);
        this.xAxis = d3.axisBottom();
        this.yAxis = d3.axisLeft();

        // Assign parameters as object fields
        this.data = _data;
        this.target = _target;

        // Now init
        this.init();
    }

    /** @function init()
     * Perform one-time setup function
     *
     * @returns void
     */
    init() {
        // Define this vis
        const vis = this;

        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)
            .append('svg')
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // Append axes
        vis.xAxisG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 15}px)`);
        vis.xAxisG.append('text')
            .attr('class', 'label labelX')
            .style('transform', `translate(${vis.gW / 2}px, 40px)`)
            .text('time')
            .attr('fill', 'black');
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', `translateX(${-15}px)`);
        vis.yAxisG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -30px)`)
            .text('Reward')
            .attr('fill', 'black'); // can move this to CSS when reusing line graph

        // Now wrangle
        vis.wrangle();
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle() {
        // Define this vis
        const vis = this;
        console.log('Data', vis.data);

        // reduce value precision for readability
        vis.data_bin = vis.data.map(d => {
          const time = parseFloat(d.time).toFixed(2);
          return {
            time : parseFloat(time),
            reward : parseInt(d.reward)
          }
        });
        console.log('Data_bin', vis.data_bin);

        // Update scales
        vis.scX.domain(d3.extent(vis.data_bin, function(d) { return d.time; }));
        vis.scY.domain(d3.extent(vis.data_bin, function(d) { return d.reward; }));
        vis.xAxis.scale(vis.scX); //.ticks(vis.data_bins.length);
        vis.yAxis.scale(vis.scY);

        vis.line = d3.line()
          .x(function(d) { return vis.scX(d.time); })
          .y(function(d) { return vis.scY(d.reward); });

        // Now render
        vis.render();
    }

    /** @function render()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render(duration) {
        // Define this vis
        const vis = this;
        // Make the path
        vis.path = vis.g.append('path')
        .datum(vis.data_bin)
        .attr('class', 'ppo-line')
        .attr('d', vis.line)
        // adding styles -- can move this to cSS file
        .attr('fill', 'none')
        .attr('stroke', 'black');

        console.log('data_bin', vis.data_bin);

        if (duration) {
          const totalLength = vis.path.node().getTotalLength();
          // Ref: https://github.com/d3/d3-transition
          // Ref: http://duspviz.mit.edu/d3-workshop/transitions-animation/
          // Set Properties of Dash Array and Dash Offset and initiate Transition
          vis.path
            .attr('stroke-dasharray', totalLength + " " + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition() // Call Transition Method
            .duration(duration) // Set Duration timing (ms)
            .ease(d3.easeLinear) // Set Easing option
            .attr('stroke-dashoffset', 0); // Set final value of dash-offset for transition
        }

        // Update axis
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }

    /** @function reset()
     * removes the path fron the graph
     *
     * @returns void
     */
    reset() {
      // Define this vis
      const vis = this;
      vis.g.select('.ppo-line').remove();
    }
}
