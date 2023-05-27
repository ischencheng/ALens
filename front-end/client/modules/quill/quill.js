import Quill from 'quill';
import fetch from "node-fetch";

export default {
    data() {
        return {
            rephrasedText: ''
        };
    },
    mounted() {
        this.createQuill();
        // this.rephrase();
    },
    methods: {
        createQuill() {
            var editor = new Quill('#editor', {
                modules: { toolbar: '#toolbar' },
                theme: 'snow',
            });
            // console.log(editor); 
        },
        queryRephrase: async function query(data) {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/prithivida/parrot_paraphraser_on_T5",
                {
                    headers: { Authorization: "Bearer {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}" },
                    method: "POST",
                    body: JSON.stringify(data),
                }
            );
            const result = await response.json();
            return result;
        },
        getRephrasedText: function (text) {
            // below is the test
            // return text + ' is rephrased!';

            // text is string!
            this.queryRephrase({ "inputs": text }).then((response) => {
                // console.log(JSON.stringify(response));
                // return response;
                // console.log(response[0].generated_text);
                console.log(response);
                return response[0].generated_text;
            })
                .catch(error => {
                    console.error('Error:', error);
                    return 'rephrase fail: ' + error;
                });
            setTimeout(() => {
                return text + ' (rephrased)';
            }, 5000);
            // [{"generated_text":"Can you please let us know more details about your ids as a subscriber or other related project? Be sure to update your username and password or it will be stolen via email. Our information is only accessible through our website, and the payment support services"}]
        },
        doRephrase: function (ev) {
            ev = ev || window.event;
            // console.log('test');
            function getSelectedText() {
                if (window.getSelection) {
                    // console.log(window.getSelection());
                    return window.getSelection().toString();
                } else if (document.selection) {
                    // console.log(document.selection);
                    return document.selection.createRange().text;
                }
                return '';
            }

            let selected = getSelectedText();
            let rephraseTip = document.querySelector('#rephraseTip'); // this is the div element not the p
            let rephraseContent = this.$refs.rephrased; // this the p element

            if (selected.length > 2) {
                // console.log(selected)
                this.queryRephrase({ "inputs": selected }).then((response) => {
                    // console.log(JSON.stringify(response));
                    // return response;
                    // console.log(response[0].generated_text);
                    // console.log(response);
                    // return response[0].generated_text;
                    console.log(response);
                    this.rephrasedText = response[0].generated_text;
                    rephraseContent.textContent = this.rephrasedText;
                    rephraseTip.style.display = 'block';
                    rephraseTip.style.left = ev.clientX - 200 + 'px';
                    rephraseTip.style.top = ev.clientY - 30 + 'px';
                })
                    .catch(error => {
                        console.error('Error:', error);
                        return 'rephrase fail: ' + error;
                    });

                // this.rephrasedText = this.getRephrasedText(selected);

                // console.log(this.rephrasedText);
                // console.log(this.$refs.rephrased);

                // rephraseContent.textContent = this.rephrasedText;
                // rephraseTip.style.display = 'block';
                // rephraseTip.style.left = ev.clientX - 500 + 'px';
                // rephraseTip.style.top = ev.clientY - 30 + 'px';
            }
            else { rephraseTip.style.display = 'none'; }
        },
        changeText: function (changedText) {
            if (document.selection) { // 老IE
                let selecter = document.selection.createRange();
                selecter.select();
                let selectStr = selecter.text; //获取选中文本
                selecter.pasteHTML(changedText); //替换为HTML元素，替换完会失去选取，如果选择的是textarea里的内容这里会报错
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
                    let rang = selecter.getRangeAt(0);
                    // temp成为选中内容的父节点，达到加粗的效果
                    let temp = document.createElement('b');
                    rang.surroundContents(temp);
                    // 先删除再插入达到替换的效果，
                    rang.deleteContents(); // 删除选中内容
                    rang.insertNode(document.createTextNode(changedText)); //在选中内容的起始位置插入一个节点
                }
            }
        }
    }
};