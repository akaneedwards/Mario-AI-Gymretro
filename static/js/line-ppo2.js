/**
 * @class Template
 */
class Line2_Loss {

    /*
    Constructor
     */
    constructor(_data, _target) {
        // Vars
        this.data_bins = [];
        this.data_bins_2 = [];
        this.data_bins_acktr = [];

        // Elements
        this.svg = null;
        this.g = null;
        this.line_loss = null;
        this.line_reward = null;

        // Configs
        this.svgW = 1200;
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

        vis.xAxisG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 15}px)`);
        vis.xAxisG.append('text')
            .attr('class', 'label labelX')
            .style('transform', `translate(${vis.gW / 2}px, 40px)`)
            .text('Time Steps')
            // .attr('style', 'font-size: 12px')
            .attr('fill', 'black');
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', `translateX(${-10}px)`);
        vis.yAxisG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -30px)`)
            .text('Value Loss')
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
        vis.data_bins = vis.data[0].map(d => {
          const val = parseFloat(d.value_loss).toFixed(2);
          const value = parseFloat(d.eprewmean).toFixed(2);
          return {
              step: parseInt(d.total_timesteps),
              loss: parseFloat(val),
              reward: parseFloat(value)
          }
        })

        vis.scX.domain(d3.extent(vis.data_bins, function(d) { return d.step; }));
        vis.scY.domain(d3.extent(vis.data_bins, function(d) { return d.loss; }));
        vis.xAxis.scale(vis.scX);
        vis.yAxis.scale(vis.scY);

        vis.line_loss = d3.line()
          .x(function(d) { return vis.scX(d.step); })
          .y(function(d) { return vis.scY(d.loss); });

        // Second Run of 1e7

        vis.data_bins_2 = vis.data[1].map(d => {
          const val = parseFloat(d.value_loss).toFixed(2);
          const value = parseFloat(d.eprewmean).toFixed(2);
          return {
              step: parseInt(d.total_timesteps),
              loss: parseFloat(val),
              reward: parseFloat(value)
          }
        })
        // console.log(vis.data_bins_2)
        vis.data_bins_acktr = vis.data[2].map(d => {
          const val = parseFloat(d.value_loss).toFixed(2);
          const value = parseFloat(d.eprewmean).toFixed(2);
          return {
              step: parseInt(d.total_timesteps),
              loss: parseFloat(val),
              reward: parseFloat(value)
          }
        })


        // Now render
        vis.render();
    }

    /** @function render()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        // Define this vis
        const vis = this;

        vis.g.append('path')
        .datum(vis.data_bins)
        .attr('class', 'ppo-line')
        .attr('d', vis.line_loss)
        // adding styles -- can move this to cSS file
        .attr('fill', 'none')
        .attr('stroke', 'darkorange');

        vis.g.append('path')
        .datum(vis.data_bins_2)
        .attr('class', 'ppo-line')
        .attr('d', vis.line_loss)
        // adding styles -- can move this to cSS file
        .attr('fill', 'none')
        .attr('stroke', 'darkcyan');

        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

    }

    /** @function renderAcktr_loss()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    renderAcktr_loss() {
      const vis = this;
      vis.g.append('path')
      .datum(vis.data_bins_acktr)
      .attr('class', 'acktr-line-loss')
      .attr('d', vis.line_loss)
      .attr('fill', 'none')
      .attr('stroke', 'darkred');
    }

    /** @function resetAcktr_loss()
     * removes the path fron the graph
     *
     * @returns void
     */
    resetAcktr_loss() {
      // Define this vis
      const vis = this;
      vis.g.select('.acktr-line-loss').remove();
    }

}


/**
 * @class Template
 */
class Line2_Reward {

    /*
    Constructor
     */
    constructor(_data, _target) {

        this.svg = null;
        this.g = null;

        // Configs
        this.svgW = 1200;
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

        vis.xAxisG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 15}px)`);
        vis.xAxisG.append('text')
            .attr('class', 'label labelX')
            .style('transform', `translate(${vis.gW / 2}px, 40px)`)
            .text('Time Steps')
            // .attr('style', 'font-size: 12px')
            .attr('fill', 'black');
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', `translateX(${-15}px)`);
        vis.yAxisG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -40px)`)
            .text('Episode Reward')
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

        vis.data_bins = vis.data[0].map(d => {
            const val = parseFloat(d.value_loss).toFixed(2);
            const value = parseFloat(d.eprewmean).toFixed(2);
            return {
                step: parseInt(d.total_timesteps),
                loss: parseFloat(val),
                reward: parseFloat(value)
            }
        })
        // console.log(vis.data_bins.slice(6, 3255))


        vis.scX.domain([0, d3.max(vis.data_bins.slice(6, 3255), function (d) {
            return d.step;
        })]);
        vis.scY.domain(d3.extent(vis.data_bins.slice(6, 3255), function (d) {
            return d.reward;
        }));
        vis.xAxis.scale(vis.scX); //.ticks(vis.data_bins.length);
        vis.yAxis.scale(vis.scY);


        vis.line_reward = d3.line()
            .x(function (d) {
                return vis.scX(d.step);
            })
            .y(function (d) {
                return vis.scY(d.reward);
            });

        // Second Run of 1e7
        vis.data_bins_2 = vis.data[1].map(d => {
          const val = parseFloat(d.value_loss).toFixed(2);
          const value = parseFloat(d.eprewmean).toFixed(2);
          return {
              step: parseInt(d.total_timesteps),
              loss: parseFloat(val),
              reward: parseFloat(value)
          }
        })
        // console.log(vis.data_bins_2)

        vis.data_bins_acktr = vis.data[2].map(d => {
          const val = parseFloat(d.value_loss).toFixed(2);
          const value = parseFloat(d.eprewmean).toFixed(2);
          return {
              step: parseInt(d.total_timesteps),
              loss: parseFloat(val),
              reward: parseFloat(value)
          }
        })
        console.log("ACKTR", vis.data_bins_acktr);

        // Now render
        vis.render();
    }

    /** @function render()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        // Define this vis
        const vis = this;

        vis.line = vis.g.append('path')
                    .datum(vis.data_bins.slice(6, 3255))
                    .attr('class', 'ppo-line')
                    .attr('d', vis.line_reward)
                    .attr('fill', 'none')
                    .attr('stroke', 'darkorange');

        vis.g.append('path')
            .datum(vis.data_bins_2.slice(11, 3255))
            .attr('class', 'ppo-line')
            .attr('d', vis.line_reward)
            .attr('fill', 'none')
            .attr('stroke', 'darkcyan');


        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

    }
    /**
     * @function renderAcktr_reward()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    renderAcktr_reward() {
      const vis = this;
      vis.g.append('path')
      .datum(vis.data_bins_acktr.slice(6, 3255))
      .attr('class', 'acktr-line-reward')
      .attr('d', vis.line_reward)
      .attr('fill', 'none')
      .attr('stroke', 'darkred');
    }

    /** @function resetAcktr_reward()
     * removes the path fron the graph
     *
     * @returns void
     */
    resetAcktr_reward() {
      // Define this vis
      const vis = this;
      vis.g.select('.acktr-line-reward').remove();
    }

}
