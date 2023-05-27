<template>
    <div class="flowmap" style="overflow:auto">

    </div>
</template>
<script src="./flowmap.js"></script>
<style scoped>
.flowmap{
  overflow: hidden;
}
.link {
  fill: none;
  stroke: #000;
  stroke-opacity: .2;
}
.link:hover {
  stroke-opacity: .5;
}
</style>