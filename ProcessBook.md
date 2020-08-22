## Process Book, G6 s14a-2020
# Reinforcement Learning for Nintendo Games

### Goal
Utilize OpenAI Gym reinforcement learning framework for learning Nintendo platform game. Develop a website to visualize various metrics throughout the training process. In particular, visualize how decisions are made by the framework while training is run and the end result of testing.

### Completions:
* 7/20/20 - Completed trained models for Brute algorithm and PPO2 algorithm. Created mockup of website with visualizations.
* 7/27/20 - Completed D3 line template for animating reward over time 
* 7/22/20 to 7/28/20 - Multiple PP02 training rounds at 1e7 with data logs 
* 7/28/20 - Completed trained agent reward data with video of play 
* 7/28/20 to 8/1/20 - Complete D3 visualizations comparing multiple PP02 training
* 8/1/20 - 8/2/20 - Perform ACKTR training and graph logs with PP02

### Tasks
* [X] Located candidate games integrated with OpenAI Gym(data source) and simple enough to train relatively quickly: Super Mario.
* [X] Used simplified Game environment inputs and rewards
* [X] Algorithm PPO2 chosen as easier to execute
* [X] Adjust the models
* [X] Visualize training results
* [X] Describe in web page about RL


### Data gathered during training:

- LOSS values - should be logged by default, verify the type of loss being logged: (PolyC, Entropy, Action liklihood, Value loss, etc)
- REWARD logs - verify if these are the real rewards value vs clipped values (clipped are 1 and -1)
- log of improvement over training rounds

### Data gathered during test rounds:

- Log of reward/loss from trained agent during play round
- Video that matches the data (so the graph can play along with the video in the website)
- Multiple play round data for graph to show if trained agent really is good.

### Findings/Graphs:

- A loss/reward graph during training of the agent (improvement across training rounds)
-  A loss/reward graph across 2 training rounds of the same algorithm
- Graph to show loss/reward as the game plays along side the video of the round 

### Roles

* Algorithm discovery and tuning of algorithms: Tony, Akane, Tiffany
* OpenAI Gym game environment (agent decisions and game states): Akane,Tiffany, Tony
* Web pages and D3 diagrams: Karen, Tony

### Setting up game-based reinforcement learning using Gym Retro

Gym Retro provides the framework for creating environments for training reinforcement learning algorithms on retro emulated game consoles. This framework includes many integrated environments for various video games already in place. For this project, we chose the class Nintendo game Super Mario Bros, a simple side-scrolling action game.

The general process for getting started with Gym Retro is located [here](https://retro.readthedocs.io/en/latest/getting_started.html).

- Install Gym Retro using pip:
pip3 install gym-retro
- Clone the Gym Retro git repository:
git clone https://github.com/openai/retro.git

The documentation gives basic instructions for trying out Gym Retro with an included non-commericial ROM called Airstriker Genesis. Even though the framework has Super Mario Bros already integrated, we must install the specific Nintendo console ROM that the Gym environment was designed for. Based on our literature search, finding the correct ROM version and ensuring that it will work properly with the integrated environment is often difficult because the environment may have been generated years ago and the ROM may be difficult to find among many ROM versions. The provided ROM repositories did not include the correct ROM. We were able to find the correct ROM to download by searching by the SHA hash which is listed in the rom.sha file in the Super Mario Bros environment folder and downloading the file from a third-party repository.

Import the ROM in Gym Retro:
python3 -m retro.import /path/to/your/ROMs/directory/
or,
python3 -m retro.import .

If it is the correct ROM, the program will confirm that the ROM was imported. 

### Running a random agent
This is useful for checking that everything is working properly in Gym Retro.
python3 -m retro.examples.random_agent --game SuperMarioBros-Nes

Running the Brute algorithm
The Brute algorithm is integrated in Gym Retro and is a simple though less efficient reinforcement learning algorithm. 
python3 -m retro.examples.brute --game SuperMarioBros-Nes

Running this function gave best reward values after new test runs and provided a video file of the run with the best reward value. The playback file has to be re-rendered as a ffmpeg in order to be viewed. Install ffmpeg based on your OS according to the instructions on the official ffmpeg page (there are numerous ffmpeg pip installations that may be unofficial): https://www.ffmpeg.org/
Then run the playback script included in Gym Retro to render:
python3 -m retro.scripts.playback_movie best.bk2

Running the PPO2 algorithm
The PPO2 algorithm provides better training than the Brute algorithm but also takes more resources. Running PPO2 requires the installation of OpenAI baselines and Tensorflow: https://github.com/openai/baselines

Training and saving the model:
python3 -m baselines.run --alg=ppo2 --env=SuperMarioBros-New --num_timesteps=1e6 --save_path=~/SuperMarioBros1e6

Because of the long run times involved, the first few trial tests were trained to 1e6 timesteps. The example functions train until 2e7 timesteps, so longer training times will probably be required to get a better model.

Loading and playback of the trained model:
python3 -m baselines.run --alg=ppo2 --env=SuperMarioBros-New --num_timesteps=0 --load_path=~/SuperMarioBros1e6 --play
Remember to set the timesteps to 0 on loading the model otherwise it will try to retrain itself.

Logging metrics:
Append --log_path=~/logs/SuperMarioBros1e6
OpenAI Baselines automatically generates logs with useful metrics that will eventually be visualized on our website in tandem with the video render.

### Modifying the Gym environments

So far our training has used the included scenario and data files from the Gym Retro Super Mario Bros integration. The files are included in the Gym Retro Github and can be modified to change the training process by adjusting variables such as reward functions. In doing so, we'll be able to see whether our trained model can be improved or possibly generated in a shorter training time.

### Running mulitple iterations

The training was run at 1e7 multiple rounds to get the logs and enough data for comparions.

### Running mulitple algorithms

Both PP02 and ACKTR algorithms were used for Super Mario training. The ACKTR algorithm was unable to complete to create the final model. But, it did output training logs that comparable to the training logs from PP02. 