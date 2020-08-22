'use strict';

// Init variables
let dataPPOtrained, dataPPO2_1, dataPPO2_2, dataAcktr  = [];
let linePPOtrained, linePPO1, linePPO2, lineAcktrLoss, lineAcktrReward = null;

let lineAcktrLossIsRendered = false;
let lineAcktrRewardIsRendered = false;

// Retrieve runtime time to reward data
d3.csv("static/data/ppo/supermariobros1e7_reward_time.csv").then(d => {
    // Redefine
    dataPPOtrained = d;
    // Instantiate
    linePPOtrained = new Line(dataPPOtrained, 'ppo-mario-graph1');
    // add play click event after building line
    $("#play-ppo-button").click(function() {
      $("#trained-ppo-video")[0].play().then(() => {
        // clear existing render
        linePPOtrained.reset();
        $("#trained-ppo-video")[0].currentTime = 0;
        console.log("start rendering line");
        linePPOtrained.render(22000);
      });
    });
    $("#reset-ppo-button").click(function() {
      console.log("resetting video and line");
      linePPOtrained.reset();
      $("#trained-ppo-video")[0].pause();
      $("#trained-ppo-video")[0].currentTime = 0;
      linePPOtrained.reset();
    });
    $("#finish-ppo-button").click(function() {
      console.log("finish rendering svg");
      $("#trained-ppo-video")[0].pause();
      const dur = $("#trained-ppo-video")[0].duration;
      $("#trained-ppo-video")[0].currentTime = dur;
      linePPOtrained.render();
    });
    $(document).ready(function () {
        linePPOtrained.reset();
    })
}).catch(err => console.log(err));

// Compare 2 rounds of PPO2 and 1 round of ACKTR
Promise.all([
    d3.csv("static/data/ppo/1e7-progress.csv"),
    d3.csv("static/data/ppo/1e7-progress-2.csv"),
    d3.csv("static/data/acktr/progress-acktr.csv"),
]).then(function (files) {
    dataPPO2_1 = files
    linePPO1 = new Line2_Loss(dataPPO2_1, 'ppo-mario-graph2');
    linePPO2 = new Line2_Reward(dataPPO2_1, 'ppo-mario-graph3');

    // Toggle the ACKTR line overlay
    $("#view-acktr-loss-toggle").click(function() {
      if (lineAcktrLossIsRendered) {
        $(this).html('Show ACKTR');
        linePPO1.resetAcktr_loss();
      } else {
        $(this).html('Hide ACKTR');
        linePPO1.renderAcktr_loss();
      }
      lineAcktrLossIsRendered = !lineAcktrLossIsRendered;
    });
    $("#view-acktr-reward-toggle").click(function() {
      if (lineAcktrRewardIsRendered) {
        $(this).html('Show ACKTR');
        linePPO2.resetAcktr_reward();
      } else {
        $(this).html('Hide ACKTR');
        linePPO2.renderAcktr_reward();
      }
      lineAcktrRewardIsRendered = !lineAcktrRewardIsRendered;
    });

}).catch(function (err) {
    console.log(err);
});
