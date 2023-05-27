<template>
  <div class="rst-content" id="rst-content" style="position: relative">

    <div class="filecontrol">
      <el-space style="margin: 10px 10px">
        <!-- <input id="fileupload" name="fileupload" type="file" class="file" data-show-preview="false"
          data-show-caption="false" data-show-cancel="false" data-rtl="false" data-show-upload="false"
          data-show-remove="false" /> -->
        <el-button type="primary" plain @click="uploadClickHandler" class="upload">
          <el-icon><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa="">
              <path fill="currentColor"
                d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64zm384-578.304V704h-64V247.296L237.248 490.048 192 444.8 508.8 128l316.8 316.8-45.312 45.248L544 253.696z">
              </path>
            </svg></el-icon><span>Upload</span>
        </el-button>
      </el-space>
    </div>

    <div class="rst-bar" style="position: relative; height: 110px; margin-left: 10px">
      <!-- 总统计图表 -->
      <svg v-for="(svg, index) in Svgs" :key="index" :style="svg.style">
        <rect :style="svg.style" />
      </svg>
      <!-- 关系 legend -->
      <img v-for="(icon, index) in Icons" :key="index" :src="icon.src" :style="icon.style"
        alt="icon of RST relations" />
    </div>
    <!-- 每段的内容 -->
    <div class="rstSection" style="height: 1200px; overflow: auto">
      <rstSection v-for="(data, index) in dataForSection" :key="index" :dataFromParent="data">
        <!-- props 传入需要使用 v-bind  -->
      </rstSection>
    </div>
  </div>
</template>


<script src="./rstContent.js"></script>


<style type="text/css">
body {
  --border_radius: 8px;
}
</style>
