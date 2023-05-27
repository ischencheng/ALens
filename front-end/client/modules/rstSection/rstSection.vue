<template>
  <!-- 这里写Html -->
  <div class="one-paragraph" style="position: relative; margin: 20px 10px">
    <!-- 文字内容 -->
    <p v-for="(sentence, index) in filteredSentences" :ref="`sentence${index}`" :id="sentence.id" :key="sentence.id"
      :style="sentence.style" :class="{ sentence: true , isHidden: sentence.isHidden }">
      {{ sentence.content }}
    </p>
    <!-- 关系线 -->
    <svg v-for="line in filteredLines" :key="line.id" :style="line.svg.style" class="line p1" stroke="black">
      <line :x1="line.line.x1" :y1="line.line.y1" :x2="line.line.x2" :y2="line.line.y2" :style="line.line.style">
      </line>
    </svg>
    <!-- 关系图标 -->
    <img v-for="icon in filteredIcons" :key="icon.id" :src="icon.src" :style="icon.style" alt="icon of RST relations" />
    <!-- <button :style="Button.style" @click="hideContent = !hideContent" class="btn">
      {{ this.hideContent ? '>' : 'v' }}
    </button> -->
    <!-- 数量统计块 -->
    <svg v-for="rect in Rects" :key="rect.id" :style="rect.style" class="rect">
      <rect :style="rect.style" />
    </svg>
    <hr/>
  </div>
</template>


<script src="./rstSection.js"></script>


<style type="text/css">
body {
  --border_radius: 8px;
}

.sentence {
  border: 2px dashed #dcd9d9;
  border-radius: var(--border_radius);
  /* min-height: 36px;
  height: inherit; */
  padding: 10px;
  font-size: 18px;
}

.sentence.isHidden {
  opacity: 0.3;
}

/* #sentence-0 {
  padding: 10px 60px 10px 60px;
} */

.line {
  stroke-width: 4px;
}

/* 折叠 button */
.btn {
  /* 文字颜色 */
  color: #0099CC;
  /* 清除背景色 */
  background: transparent;
  /* 边框样式、颜色、宽度 */
  /* border: 2px solid #0099CC; */
  /* 给边框添加圆角 */
  border-radius: 8px;
  /* 字母转大写 */
  border: none;
  color: white;
  /* padding: 1px auto px auto; */
  text-align: center;
  display: inline-block;
  font-size: 12px;
  /* margin: 4px 2px; */
  -webkit-transition-duration: 0.4s;
  /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
  text-decoration: none;
  /* text-transform: uppercase; */
  width: 30px;
  height: 30px;
  background-color: white;
  color: black;
  /* border: 2px solid #008CBA; */
}

/* 悬停样式 */
.btn:hover {
  background-color: #008CBA;
  color: white;
}

/* rects */
.rect {
  border-radius: 4px;
}
</style>
