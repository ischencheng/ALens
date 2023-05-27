<template>
  <!-- 这里写Html -->
  <div class="wrapper">
    <!-- title -->
    <el-row>
      <div class="header">
        ALens</div>
    </el-row>
    <el-row :gutter="10">
      <!-- the left side -->
      <el-col :span="7">
        <div class="grid-content bg" style="height: 1440px; margin: 10px 0px 10px 0px;">
          <h1 class="subTitle">
            Rhetorical Structure View
          </h1>
          <rstContent></rstContent>
        </div>
      </el-col>

      <!-- heatmap column -->
      <el-col :span="2">
        <div class="grid-content:false bg" style="height: 1440px; margin: 10px 0px 10px 0px;">
          <!-- <h1 class="subTitle">
            (Flowmap)
          </h1> -->
          <flowmap style="height: inherit"></flowmap>
        </div>
      </el-col>

      <!-- in the middle -->
      <el-col :span="7">
        <div class="grid-content bg" id="intro" style="height: 720px; margin: 10px 0px 10px 0px;">
          <h1 class="subTitle">
            Writing Area
          </h1>
          <writing></writing>
        </div>
        <div class="grid-content bg" style="height: 710px; margin: 0px 0px 0px 0px;">
          <h1 class="subTitle">
            Reference Abstract
          </h1>
          <reference></reference>
        </div>
      </el-col>

      

      <!-- the right side -->
      <el-col :span="6">
        <div class="grid-content bg" style="height: 1440px; margin: 10px 10px 10px 0px;">
          <h1 class="subTitle">
            Evaluation Dashboard
          </h1>
          <evaluation></evaluation>
        </div>
        <!-- <div class="grid-content bg" style="height: 190px; margin: 10px 10px 10px 0px;">
          <h1 class="subTitle">
            Setting View
          </h1>
          <sett></sett>
        </div>
        <div class="grid-content bg" style="height: 510px; margin: 0px 10px 0px 0px;">
          <h1 class="subTitle">
            Edit View
          </h1>
          <quill></quill>
        </div> -->
      </el-col>

      

    </el-row>
  </div>
</template>


<script src="./home.js"></script>


<style type="text/css" scoped>
body {
  --border_radius: 8px;
}

/* 画布大小 2560*1440 + 标题大小 2560 * 55 */
.wrapper {
  width: 2560px;
  height: 1440+55px;
  margin: 0 auto;
}

/* 标题FMLens */
.header {
  margin: 10px;
  height: 52px;
  color: #79bbff;
  /* font-size: 32px; */
  font: 48px "CormorantBold";
}

/* 小标题 */
.subTitle {
  margin: 0px 0px 0px 0px;
  font: 24px "CormorantBold";
  color: #ffffff;
  background-color: #79bbff;
  border-radius: 8px 8px 0px 0px;
  padding: 0px 10px;
}

/* text, element-table */
text,
.el-table {
  font-family: "CormorantSemiBold";
}

/* 背景 */
.bg {
  /* height: 1440px; */
  background: #ffffff;
}

.grid-content {
  border: 2px solid #dcd9d9;
  border-radius: var(--border_radius);
  min-height: 36px;
  height: inherit;
}

@font-face {
  font-family: "CormorantBold";
  src: url("../../assets/font/hind-bold.ttf");
}

@font-face {
  font-family: "CormorantSemiBold";
  src: url("../../assets/font/hind-semibold.ttf");
}
</style>