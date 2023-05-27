import writing from "../writing/writing.vue";
import flowmap from "../flowmap/flowmap.vue";
import rstSection from "../rstSection/rstSection.vue";
import rstContent from "../rstContent/rstContent.vue";
import reference from "../reference/reference.vue";
import evaluation from "../evaluation/evaluation.vue";


export default {
    components: { // 依赖组件
        rstSection,
        rstContent,
        writing,
        flowmap,
        reference,
        evaluation
    },
    data() { // 本页面数据
        return {
        };
    },
    setup() {
    },
    mounted() { 
    },
    methods: { // 这里写本页面自定义方法      
    },
    created() { // 生命周期中，组件被创建后调用

    },
};