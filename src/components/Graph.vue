<template> 
  <div>
    
    <h1>Живучесть графа</h1>
    <div id="col-1">
      <input v-model="sid1" v-bind:style="{ 'margin-left': '100px' }" placeholder="sid">
      <input v-model="tid1" placeholder="tid">
      <button @click="setLinks1">Add link</button>
      <button @click="setNodes1">Add node</button>
      <input v-model="ME1" placeholder="ME">
      <input v-model="MV1" placeholder="MV">
      <input v-model="p1" placeholder="Amount of nodes">
      <button @click="setMFO1">Set graph</button>
      <d3-network :net-nodes="nodes" :net-links="links" :options="options">
      </d3-network>
    </div>
    
    <div id="col-2">
      <input v-model="sid2" v-bind:style="{ 'margin-left': '100px' }" placeholder="sid">
      <input v-model="tid2" placeholder="tid">
      <button @click="setLinks2">Add link</button>
      <button @click="setNodes2">Add node</button>
      <input v-model="ME2" placeholder="ME">
      <input v-model="MV2" placeholder="MV">
      <input v-model="p2" placeholder="Amount of nodes">
      <button @click="setMFO2">Set graph</button>
      <d3-network :net-nodes="nodes2" :net-links="links2" :options="options2">
      </d3-network>
    </div>
    <button @click="handleCalculation">Calculate graph</button>
  </div>
</template>

<script>
import D3Network from 'vue-d3-network'
import Djikstra from '../calculationServices/dijkstra'

export default {
  components: {
    D3Network
  },
  data () {
    return {
      sid1: '',
      tid1: '',
      sid2: '',
      tid2: '',
      ME1: '',
      ME2: '',
      MV1: '',
      MV2: '',
      p1: 0,
      p2: 0,
      nodes1Input: '',
      nodes2Input: '',
      nodes: [],
      links: [],
      nodes2: [],
      links2: [],
      options:
      {
        force: 2000,
        nodeSize: 10,
        nodeLabels: true,
        linkWidth:5,
        linkLabels: true,
      },
      options2:
      {
        force: 2000,
        nodeSize: 10,
        nodeLabels: true,
        linkWidth:4,
        linkLabels: true,
      },
      matrix:[],
      matrix2:[],
    }
  },
  methods: {
    getBiggestWeight(matrix){
      let biggestWeight = 0;
      for(let i = 0; i < matrix[0].length; i++){
        let weights = Djikstra.buildWeightMap(matrix, i);
        weights.forEach(element => {
          if(element != Infinity && element > biggestWeight) {
            biggestWeight = element;
          }
        });
      }
      return biggestWeight;
    },
    handleCalculation(){
      this.makeMatrix1();
      this.makeMatrix2();
      let matrix1Result = this.getNumberOfDeletedElements(this.matrix);
      let matrix2Result = this.getNumberOfDeletedElements(this.matrix2);
      if(this.nodes.length === 2 && this.nodes2.length === 2){
        alert('Равны по признаку приведения к тривиальному графу')
      }else{
        if(matrix1Result === matrix2Result) alert('Равны');
        else alert('Не равны');
      }
    },
    getNumberOfDeletedElements(matrix){
      let biggestWeight = this.getBiggestWeight(matrix)

      for(let i = 0; i < matrix[0].length; i++){
        let mat = this.deleteMatrixElement(matrix, i)
        let be = this.getBiggestWeight(mat)
        if(be > biggestWeight) return 1;
      }

      for(let i = 0; i < matrix[0].length; i++){
        for(let k = 0; k < matrix[0].length; k++){
          if(i === k) continue;
          let mat = this.deleteMatrixElement(matrix, i);
          mat = this.deleteMatrixElement(mat, k);
          let be = this.getBiggestWeight(mat)
          if(be > biggestWeight) return 2;
        }
      }

      return 0;
    },
    deleteMatrixElement(matrix, index){
      let newMatrix = JSON.parse(JSON.stringify(matrix))
        for(let j = 0; j < newMatrix.length; j++){
          newMatrix[j][index] = 0;
          newMatrix[index][j] = 0;
        }
      return newMatrix;
    },

    setLinks1(){
      this.links.push({ sid: this.sid1, tid: this.tid1 })
    },

    setLinks2(){
      this.links2.push({ sid: this.sid2, tid: this.tid2 })
    },

    setNodes1(){
      this.nodes.push({id: this.nodes1Input})
    },

    setNodes2(){
      this.nodes2.push({id: this.nodes2Input})
    },

    makeMatrix1(){
      let matr = []
      for(let i = 0; i < this.nodes.length; i++) matr.push(Array(this.nodes.length).fill(0))
      this.links.forEach(link => {
        matr[+link.source.id][+link.target.id] = 1;
        matr[+link.target.id][+link.source.id] = 1;
      })
      this.matrix = matr;
    },

    makeMatrix2(){
      let matr = []
      for(let i = 0; i < this.nodes2.length; i++) matr.push(Array(this.nodes2.length).fill(0))
      this.links2.forEach(link => {
        matr[+link.source.id][+link.target.id] = 1;
        matr[+link.target.id][+link.source.id] = 1;
      })
      this.matrix2 = matr;
    },

    setMFO1(){
      //1,4,0,2,3,4,3,1,2,1,4,0,1,3
      //0,2,6,8,11,14
      let ME = this.ME1.split(',');
      let MV = this.MV1.split(',');
      for(let i = 0; i < this.p1; i++) this.nodes.push({id: i})
      for(let i = 0; i < this.p1; i++){
        for(let j = MV[i]; j < MV[i+1]; j++){
          this.links.push({ sid: i, tid: ME[j] })
        }
      }
    },

    setMFO2(){
      let ME = this.ME2.split(',');
      let MV = this.MV2.split(',');
      for(let i = 0; i < this.p2; i++) this.nodes2.push({id: i})
      for(let i = 0; i < this.p2; i++){
        for(let j = MV[i]; j < MV[i+1]; j++){
          this.links2.push({ sid: i, tid: ME[j] })
        }
      }
    }
  },
}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css">
</style>
<style>
#col-1 {
  position: relative;
  width: 50%;
  float: left;
  height: 100%;
  z-index: 1010101010
}

#col-2 {
  position: relative;
  width: 50%;
  float: left;
  height: 100%;
  z-index: 1010101010
}
</style>