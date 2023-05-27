<template>
  <!-- 这里写Html -->
  <div>
    <div style="display:table;
      margin:300px auto; transform: scale(3);" v-if="!isShow">
      <el-button type="primary" plain @click="showRef" v-if="!isShow">
        <el-icon><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="m759.936 805.248-90.944-91.008A254.912 254.912 0 0 1 512 768a254.912 254.912 0 0 1-156.992-53.76l-90.944 91.008A382.464 382.464 0 0 0 512 896c94.528 0 181.12-34.176 247.936-90.752zm45.312-45.312A382.464 382.464 0 0 0 896 512c0-94.528-34.176-181.12-90.752-247.936l-91.008 90.944C747.904 398.4 768 452.864 768 512c0 59.136-20.096 113.6-53.76 156.992l91.008 90.944zm-45.312-541.184A382.464 382.464 0 0 0 512 128c-94.528 0-181.12 34.176-247.936 90.752l90.944 91.008A254.912 254.912 0 0 1 512 256c59.136 0 113.6 20.096 156.992 53.76l90.944-91.008zm-541.184 45.312A382.464 382.464 0 0 0 128 512c0 94.528 34.176 181.12 90.752 247.936l91.008-90.944A254.912 254.912 0 0 1 256 512c0-59.136 20.096-113.6 53.76-156.992l-91.008-90.944zm417.28 394.496a194.56 194.56 0 0 0 22.528-22.528C686.912 602.56 704 559.232 704 512a191.232 191.232 0 0 0-67.968-146.56A191.296 191.296 0 0 0 512 320a191.232 191.232 0 0 0-146.56 67.968C337.088 421.44 320 464.768 320 512a191.232 191.232 0 0 0 67.968 146.56C421.44 686.912 464.768 704 512 704c47.296 0 90.56-17.088 124.032-45.44zM512 960a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"></path></svg></el-icon
        ><span>Show Reference</span>
      </el-button>
    </div>
    <div
      v-show="isShow"
      class="reference-div"
      style="position: relative; height: 630px; overflow: auto"
    >
      <!-- <p class="reference">{{ reference }}</p> -->
      <p><span v-for="(s,i) in reference" :key="i" :id="'span-abs-'+i" @mouseenter="aa" @mouseleave="bb" class="reference" :style="s.style
        "> {{ s.content }}</span></p>
    </div>
  </div>
</template>


<script src="./reference.js"></script>


<style type="text/css">
body {
  --border_radius: 8px;
}

.reference {
  margin: 10px;
  font-size: 18px;
  font-style: italic;
  line-height: 40px;
}
.reference-div {
	resize: none;
	width: 715px;
	height: 565px;
	margin: 10px 10px 0px 10px;

	border-radius: 8px;
	/* border: 1px solid #ddd; */
	padding: 0.5rem;
	color: #666;
	box-shadow: inset 0 0 0.95rem #ddd;
}
</style>
