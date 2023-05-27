export default{
    data(){
        return {}
    },
    methods:{
        doMerge: function (text) {
            // console.log('merge is called!')
            if (document.selection) { // 老IE
                let selecter = document.selection.createRange();
                selecter.select();
                let selectStr = selecter.text; //获取选中文本
                selecter.pasteHTML(text); //替换为HTML元素，替换完会失去选取，如果选择的是textarea里的内容这里会报错
            } else { // 非老IE
                let selecter;
                if (window.getSelection()) {
                    selecter = window.getSelection();
                } else {
                    selecter = document.getSelection();
                }
                selecter = document.getSelection();
                console.log(selecter);
                let selectStr = selecter.toString();
                if (selectStr.trim() != "") {
                    // let rang = selecter.getRangeAt(0);
                    // // temp成为选中内容的父节点，达到加粗的效果
                    // let temp = document.createElement('b');
                    // rang.surroundContents(temp);
                    // // 先删除再插入达到替换的效果，
                    // rang.deleteContents(); // 删除选中内容
                    // rang.insertNode(document.createTextNode(text)); //在选中内容的起始位置插入一个节点
                    // // chrome中的bug，如果选中的是textarea中的内容，就会在textarea前面插入节点
                    // console.log(selectStr);
                }
                // let selectedWords = document.querySelectorAll('.active span::selection'); // does NOT work!
                let beginSpan = selecter.anchorNode.parentElement; // this is the DOM element of the word where selection begins!
                let endSpan = selecter.focusNode.parentElement; // this is the DOM of the word where selection ends!
                let spansToMerge = [beginSpan, endSpan];
                // console.log(spansToMerge);

                
                spansToMerge.forEach((element, index) => {
                    if (index !== 0) { 
                    endSpan.parentElement.removeChild(element);}
                });

                let outerSpan = document.createElement('span');
                outerSpan.setAttribute('id', 'testId');

                beginSpan.parentNode.replaceChild(outerSpan, beginSpan);
                spansToMerge.forEach(element => {
                    outerSpan.appendChild(element);
                });

                // beginSpan.parentElement.removeChild(beginSpan)
                // console.log(document.querySelectorAll('.active span'));
            }
        },
        doSplit: function(text) {
            // console.log('merge is called!')
            if (document.selection) { // 老IE
                let selecter = document.selection.createRange();
                selecter.select();
                let selectStr = selecter.text; //获取选中文本
                selecter.pasteHTML(text); //替换为HTML元素，替换完会失去选取，如果选择的是textarea里的内容这里会报错
            } else { // 非老IE
                let selecter;
                if (window.getSelection()) {
                    selecter = window.getSelection();
                } else {
                    selecter = document.getSelection();
                }
                selecter = document.getSelection();
                console.log(selecter);
                let selectStr = selecter.toString();
                if (selectStr.trim() != "") {
                    // let rang = selecter.getRangeAt(0);
                    // // temp成为选中内容的父节点，达到加粗的效果
                    // let temp = document.createElement('b');
                    // rang.surroundContents(temp);
                    // // 先删除再插入达到替换的效果，
                    // rang.deleteContents(); // 删除选中内容
                    // rang.insertNode(document.createTextNode(text)); //在选中内容的起始位置插入一个节点
                    // // chrome中的bug，如果选中的是textarea中的内容，就会在textarea前面插入节点
                    // console.log(selectStr);
                }
                // let selectedWords = document.querySelectorAll('.active span::selection'); // does NOT work!
                let beginSpan = selecter.anchorNode.parentElement; // this is the DOM element of the word where selection begins!
                let endSpan = selecter.focusNode.parentElement; // this is the DOM of the word where selection ends!
                let spansToMerge = [beginSpan, endSpan]; // process to get this array
                // console.log(spansToMerge);

                console.log(beginSpan);
                let outerSpan = beginSpan.parentNode;
                console.log(outerSpan);
                spansToMerge.forEach((element, index) => {
                //     // if (index !== 0) { 
                //     // endSpan.parentElement.removeChild(element);
                    outerSpan.parentNode.insertBefore(element, outerSpan); // move spans in the outerSpan before the outerSpan

                });
                outerSpan.remove(); // remove the outerSpan

                // let outerSpan = document.createElement('span');
                // outerSpan.setAttribute('id', 'testId');

                // beginSpan.parentNode.replaceChild(outerSpan, beginSpan);
                // spansToMerge.forEach(element => {
                //     outerSpan.appendChild(element);
                // });

                // beginSpan.parentElement.removeChild(beginSpan)
                // console.log(document.querySelectorAll('.active span'));
            }
        }
    },
    // updated() {
    //     this.$nextTick(() => {
    //         this.test();
    //     })
    // },
};