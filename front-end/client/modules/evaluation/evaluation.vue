<template>
	<div class="evaluation">
		<el-divider content-position="left">Organization History</el-divider>
		<svg id="class_legend" style="width:618px; height:25px;"></svg>
		<div class="classification" style="height:105px"></div>
		<el-divider content-position="left">Total Score</el-divider>
		<div><svg class="radar" style="height:300px; width: 618px;"></svg></div>
		<el-divider content-position="left">Sentence Score</el-divider>
		<div style="height: 780px; overflow: auto">
			<div id="index-0" style="height: 180px"></div>
			<div id="index-1" style="height: 180px"></div>
			<div id="index-2" style="height: 180px"></div>
			<div id="index-3" style="height: 180px"></div>
			<div id="index-4" style="height: 180px"></div>
		</div>
	</div>
</template>

<script src="./evaluation.js"></script>

<style type="text/css" scoped>
/* Style buttons */
div.classification path.domain {
	visibility: hidden;
}
</style>