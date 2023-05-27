<template>
<div class="abstract">
	<button @click="doMerge">Merge</button>
	<button @click="doSplit">Split</button>
    <ul id="myTab-abs" class="nav nav-tabs">
        <li class="active"><a href="#home1" data-toggle="tab">
            菜鸟教程</a></li>
        <li><a href="#ios1" data-toggle="tab">iOS</a></li>
    </ul>
	<div id="myTabContent-abs" class="tab-content">
		<div class="tab-pane fade in active" id="home1">
			<p><span id="hello_id">hello</span><span id="hi_id"> hi</span><span id="the_id"> the</span><span id="world_id"> world</span></p>
		</div>
		<div class="tab-pane fade" id="ios1">
			<p>iOS 是一个由苹果公司开发和发布的手机操作系统。最初是于 2007 年首次发布 iPhone、iPod Touch 和 Apple TV。iOS 派生自 OS X，它们共享 Darwin 基础。OS X 操作系统是用在苹果电脑上，iOS 是苹果的移动版本。</p>
		</div>
	</div>
</div>
</template>
<script src="./script.js"></script>
<style type="text/css" scoped>
.abstract #myTabContent-abs.tab-content{
	padding-left: 10px;
	padding-right: 20px;
	font-size: 24px;
	height: 584px;
	overflow-y: auto;
	white-space: normal;
	display: inline-block;

}


.abstract #myTabContent-abs.tab-content .tab-pane.fade.in.active div p span{
	display: inline-block;
}

/*滚动条整体样式 body:: 只给body加样式 ::给全部*/
.abstract #myTabContent-abs.tab-content::-webkit-scrollbar{
	width: 20px;
	height: 20px;
}
/*滚动条里面小方块*/
.abstract #myTabContent-abs.tab-content::-webkit-scrollbar-thumb {
	border-radius: 10px;
	width: 10px;
	height: 10px;
	-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
	background: rgba(255, 255, 255, 0.3);
	/* outline-offset: -10px; */
	/* outline: 0px solid #fff; */
	border: 5px solid rgba(0, 0,0, 0);
	outline: 0px ridge #fff;

}
/*---鼠标点击滚动条显示样式--*/
.abstract #myTabContent-abs.tab-content::-webkit-scrollbar-thumb:hover{
	/* background: rgba(223, 223, 223, 0.3); */
	border: 10px solid rgba(223, 223, 223, 0);
}
/*滚动条里面轨道*/
.abstract #myTabContent-abs.tab-content::-webkit-scrollbar-track {
	/* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
	border-radius: 0;
	/* background: linear-gradient(to bottom, white 19%, orange 20%, white 21%, white 35%, orange 36%, white 37%); */
	border: 0px solid  rgb(238, 238, 238);
}

</style>
