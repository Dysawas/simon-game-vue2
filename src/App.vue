<template>
  <div class="container">
    <h1>Simon Says</h1>
    <div class="simon">
      <ul @click="onClickOnTile">
        <li class="red" data-tile="1"></li>
        <li class="blue" data-tile="2" style="opacity: 0.6"></li>
        <li class="purple" data-tile="3" style="opacity: 0.6"></li>
        <li class="green" data-tile="4" style="opacity: 0.6"></li>
      </ul>
    </div>
    <div class="game-info">
      <h2>Round: <span>{{ round }}</span></h2>
      <button @click="startGame" :disabled="isDisabled">Start</button>
      <p style="display: block">
        {{ loseMessage }}
      </p>
    </div>
    <div class="game-options">
      <h2>Game Options:</h2>
      <input type="radio" name="mode" value="easy" v-model="difficult" :disabled="isDisabled" />Easy<br />
      <input type="radio" name="mode" value="medium" v-model="difficult" :disabled="isDisabled" />Medium<br />
      <input type="radio" name="mode" value="hard" v-model="difficult" :disabled="isDisabled" />Hard<br />
    </div>
  </div>
</template>

<script>
import sound1 from './assets/1.mp3'
import sound2 from './assets/2.mp3'
import sound3 from './assets/3.mp3'
import sound4 from './assets/4.mp3'

import { animate, getRandomNumber, playSound } from './services/helpers'

export default {
  name: 'App',
  data() {
    return {
      round: 0,
      liElements: [],
      generatedSequence: [],
      sounds: [],
      playerStep: 0,
      loseMessage: "",
      difficult: "easy",
      isDisabled: false,
      statePointerEvents: { none: "none", all: "all" }
    }
  },
  mounted() {
    this.liElements = document.querySelectorAll(".simon li");
    this.sounds = [
      new Audio(sound1),
      new Audio(sound2),
      new Audio(sound3),
      new Audio(sound4)
    ]
    this.toggleTiles(this.statePointerEvents.none)
  },
  methods: {

    startGame() {
      this.isDisabled = true;
      this.loseMessage = "";
      this.round++;
      this.generateSequence()
    },

    generateSequence() {
      let generateStep = 0;
      let dataTile = 0
      
      let interval = setInterval(() => {

        dataTile = getRandomNumber(1, 5);
        let liElement = this.liElements[dataTile - 1];
        let sound = this.sounds[dataTile - 1];
        animate(liElement, this.getDifficultDelay);
        playSound(sound);
        this.generatedSequence.push(dataTile);

        generateStep++;

        if (generateStep > this.round - 1) {
          this.toggleTiles(this.statePointerEvents.all)
          clearInterval(interval);
        }

      }, this.getDifficultDelay);
    },

    onClickOnTile(event) {
      let liElement = event.target
      let selectedDataTile = +liElement.dataset.tile;
      let sound = this.sounds[selectedDataTile - 1];
      animate(liElement, this.getDifficultDelay);
      playSound(sound);
      if (this.generatedSequence[this.playerStep] === selectedDataTile) {
        this.playerStep++;
      } else {
        this.endGame();
      }
      this.nextRound();
    },

    nextRound() {
      if (this.playerStep === this.generatedSequence.length && this.playerStep !== 0) {
        this.round++;
        this.generatedSequence = [];
        this.playerStep = 0;
        this.toggleTiles(this.statePointerEvents.none);
        this.generateSequence();
      }
    },

    endGame() {
      this.isDisabled = false;
      this.loseMessage = `Sorry, you lost after ${this.round} rounds!`;
      this.playerStep = 0;
      this.generatedSequence = [];
      this.round = 0;
      this.toggleTiles(this.statePointerEvents.none);
    },

    toggleTiles(statePointerEvents) {
      this.liElements[0].parentNode.style.cssText += `pointer-events : ${statePointerEvents};`
    }
  },
  computed: {

    getDifficultDelay() {
      return this.difficult === "easy"
        ? 1500
        : this.difficult === "medium"
          ? 1000
          : 400;
    },
  },
}
</script>

<style>
body {
  font-family: Arial, serif;
  color: #333;
  -webkit-user-select: none;
  /* Chrome/Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE10+ */
  -o-user-select: none;
  user-select: none;
}

h1 {
  margin: 1em 0 2em;
  text-align: center;
}

ul {
  list-style: none;
}

ul,
li {
  padding: 0;
  margin: 0;
}

p[data-action="lose"] {
  display: none;
}

.clearfix {
  width: 100%;
  clear: both;
}

.container {
  width: 540px;
  margin: 0 auto;
}


.simon {
  position: relative;
  float: left;
  margin-right: 3em;
  width: 302px;
  height: 295px;
  -webkit-border-radius: 150px 150px 150px 150px;
  border-radius: 150px 150px 150px 150px;
  -moz-box-shadow: 2px 1px 12px #aaa;
  -webkit-box-shadow: 2px 1px 12px #aaa;
  -o-box-shadow: 2px 1px 12px #aaa;
  box-shadow: 2px 1px 12px #aaa;
}

.red,
.blue,
.purple,
.green {
  opacity: 0.6;
  height: 290px;
  -webkit-border-radius: 150px 150px 150px 150px;
  border-radius: 150px 150px 150px 150px;
  position: absolute;
  text-indent: 10000px;
}

.red:hover,
.blue:hover,
.purple:hover,
.green:hover {
  border: 2px solid black;
  cursor: pointer;

}

.red {
  background: rgb(94, 10, 10);
  clip: rect(0px, 300px, 150px, 150px);
  width: 296px;
}

.blue {
  background: darkcyan;
  clip: rect(0px, 150px, 150px, 0px);
  width: 300px;
}

.purple {
  background: purple;
  clip: rect(150px, 150px, 300px, 0px);
  width: 300px;
}

.green {
  background: darkgreen;
  clip: rect(150px, 300px, 300px, 150px);
  width: 296px;
}

.game-info {
  margin-top: 90px;
}

.game-info button {
  width: 5em;
  box-sizing: border-box;
  font-size: 1.4em;
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  background: #6DABE8;
  border: none;
  padding: 0.3em 0.6em;
}

.game-info button:hover {
  background: #78BCFF;
}

.game-options h2 {
  margin-top: 30px;
  margin-bottom: 0;
}

.game-options input[type="radio"] {
  margin-right: 10px;
}

.hoverable:hover {
  cursor: pointer;
}

footer {
  position: absolute;
  bottom: 20px;
  width: 100%;
  clear: both;
  text-align: center;
}
</style>
