<template>
    <div class="quill">
        <!-- Create the toolbar container -->
        <div id="toolbar">
            <select class="ql-header"></select>
            <button class="ql-bold">Bold</button>
            <button class="ql-italic">Italic</button>
            <button class="ql-underline">Underline</button>
            <button class="ql-link">Link</button>
            <button class="ql-list" value="ordered"></button>
            <button class="ql-list" value="bullet"></button>
        </div>

        <!-- Create the editor container -->
        <div id="editor" style="height:405px" @mouseup="doRephrase">
            <p ref="origin">Paste here to edit!</p>
        </div>
        <div id="rephraseTip" style="position: absolute; display: none;">
            <button @click="changeText(rephrasedText)"></button>
            <p ref="rephrased">Hello</p>
        </div>
    </div>
</template>
<script src="./quill.js"></script>
<style scoped>
#editor {
    font-size: 24px;
}

#rephraseTip {
    border: solid 2px red;
    background-color: aliceblue;
    padding: 10px;
}

/* #guide {
    color: red;
} */
</style>