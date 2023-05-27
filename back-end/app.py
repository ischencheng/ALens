
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import json
import requests
# from transformers import PegasusTokenizer, PegasusForConditionalGeneration
# import torch
# from datasets import load_dataset
# import shap
from taaled import compute
from test import compute2

# print("loading model...")
# model = PegasusForConditionalGeneration.from_pretrained("google/pegasus-large").cuda()
# tokenizer = PegasusTokenizer.from_pretrained("google/pegasus-large")
# print("model loaded!")


app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route('/hello', methods=["POST", "GET"])
def hello():
    msg = 'hello'
    return jsonify({
        'msg': msg,
    })


@app.route('/filename', methods=["POST"])
def openFile():
    path = 'C:/Users/cc/Desktop/File/'
    if request.method == 'POST':
        # print(request.args.get('filename'))
        filename = request.args.get('filename')
        path += filename
        with open('./source_txt/source_txt_arr.json', 'r', encoding='utf-8') as f:
            content = json.load(f)
    return jsonify(content)


@app.route('/sen2para', methods=["POST"])
def sen2para():
    path = 'D:/chi2023/system/CHI2023-abstract/back-end/source_txt/'
    if request.method == 'POST':
        # print(request.args.get('data'))
        filename = request.args.get('data')
        path += filename
        with open('./source_txt/sen2para_new.json', 'r', encoding='utf-8') as f:
            content = json.load(f)
    return jsonify(content)


@app.route('/summarize', methods=["POST", "GET"])
def summarize():
    with open('./abstract/curr_abs_arr.json', "r", encoding='utf-8') as f:
        abstract = json.load(f)
        # print(abstract)
    return jsonify(abstract)


@app.route('/classify', methods=["POST", "GET"])
def classify():
    with open("./abstract/curr_abs_arr.json", "r", encoding="utf-8") as f:
        abs_arr = json.load(f)
    # print(abs_arr)
    API_URL = "https://api-inference.huggingface.co/models/epiphacc/pubmed-20k-sign-sentence-classification"
    headers = {"Authorization": "Bearer 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"}

    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()

    output = query({
        "inputs": abs_arr,
        "options": {"wait_for_model": True},
    })
    # print(output)
    with open('./classify_tmp/classified.json', "w", encoding='utf-8') as f:
        json.dump({"text": abs_arr, "classify": output}, f)
        # 处理文件 略
    with open('./classify_tmp/classified.json', "r", encoding='utf-8') as f:
        classified = json.load(f)
        # print(classified)
    return jsonify(classified)


@app.route('/rstData', methods=["POST", "GET"])
def dispatchRstData():
    #print('test 5')
    with open('./rstData/rstData.json', 'r', encoding='utf-8') as f:
        rstData = json.load(f)  # 此处的 rstData 应该为每一个 section 需要的 data 数组
    return jsonify(rstData)


@app.route('/topk_abs_word', methods=["POST", "GET"])
def topk_abs_word():
    with open('./similarity/topk_abs.json', 'r', encoding='utf-8') as f:
        shapely = json.load(f)
        # print(shapely)
    return jsonify(shapely)


@app.route('/topk_avg_abs_word', methods=["POST", "GET"])
def topk_avg_abs_word():
    with open('./similarity/topk_avg_abs.json', 'r', encoding='utf-8') as f:
        shapely = json.load(f)
        # print(shapely)
    return jsonify(shapely)


@app.route('/topk_avg_src_word', methods=["POST", "GET"])
def topk_avg_src_word():
    with open('./similarity/topk_avg_src.json', 'r', encoding='utf-8') as f:
        shapely = json.load(f)
        # print(shapely)
    return jsonify(shapely)


@app.route('/single_src_word', methods=["POST", "GET"])
def single_src_word():
    with open('./similarity/similarity_matrix.json', 'r', encoding='utf-8') as f:
        shapley = json.load(f)
    if request.method == 'POST':
        # print(request.args.get('data'))
        column_id = int(request.args.get('data'))
        # print(column_id)
    word_shapley = []
    for i in range(0, len(shapley)):
        word_shapley.append(shapley[i][column_id])
    return jsonify(word_shapley)


@app.route('/topk_abs_sen', methods=["POST", "GET"])
def topk_abs_sen():
    with open('./similarity/topk_abs_sen.json', 'r', encoding='utf-8') as f:
        shapely = json.load(f)
        # print(shapely)
    return jsonify(shapely)


@app.route('/topk_avg_abs_sen', methods=["POST", "GET"])
def topk_avg_abs_sen():
    with open('./similarity/topk_avg_abs_sen.json', 'r', encoding='utf-8') as f:
        shapely = json.load(f)
        # print(shapely)
    return jsonify(shapely)


@app.route('/topk_avg_src_sen', methods=["POST", "GET"])
def topk_avg_src_sen():
    with open('./similarity/topk_avg_src_sen.json', 'r', encoding='utf-8') as f:
        shapely = json.load(f)
        # print(shapely)
    return jsonify(shapely)


@app.route('/single_src_sen', methods=["POST", "GET"])
def single_src_sen():
    with open('./similarity/similarity_matrix.json', 'r', encoding='utf-8') as f:
        shapley = json.load(f)
    if request.method == 'POST':
        # print(request.args.get('data'))
        column_id = int(request.args.get('data'))
        # print(column_id)
    word_shapley = []
    for i in range(0, len(shapley)):
        word_shapley.append(shapley[i][column_id])
    # print(word_shapley)
    return jsonify(word_shapley)


# analyze 相关
API_URL = "https://api-inference.huggingface.co/models/epiphacc/pubmed-20k-sign-sentence-classification"
headers = {"Authorization": "Bearer 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"}

bar = [
    {
        'index': 'mattr50_fw',
        'legend': [],
        'draft': [],
        'series': []
    },
    {
        'index': 'NumTokens',
        'legend': [],
        'draft': [],
        'series': []
    },
    {
        'index': 'mtld_fw',
        'legend': [],
        'draft': [],
        'series': []
    },
    {
        'index': 'MTLD_bi_fw',
        'legend': [],
        'draft': [],
        'series': []
    },
    {
        'index': 'MTLD_aw',
        'legend': [],
        'draft': [],
        'series': []
    }
]

def query_class(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

def analyzeText(text, bar):
    res = {'radar': {}, 'class': [], 'bar': []}  # 最终结果

    # class
    text_list = text.split(".")
    if "" in text_list:
        text_list.remove("")
    if " " in text_list:
        text_list.remove(" ")
    # # print(text_list)

    class_res = []
    label2type = {'LABEL_0': 'background', 'LABEL_1': 'method', 'LABEL_2': 'methods', 'LABEL_3': 'results', 'LABEL_4': 'conclusion'}
    for i in range(0,len(text_list)):
        class_res.append("a")
    for i in range(0,len(text_list)):
        tmp = query_class({"inputs": text_list[i],
        "options":{"wait_for_model":True}})
        #print(label2type[tmp[0][0]['label']])
        class_res[i]=int(tmp[0][0]['label'].split('_')[1])
    #print(class_res)

    class_res_ = []
    for i, el in enumerate(class_res):
        print(el)
        class_res_.append(
            {
                'group': 'D',
                'variable': 'S' + str(i),
                'value': el
            }
        )
    # print(class_res_)
    res['class'] = class_res_

    # radar
    index_res = (compute2(text))
    print('index res:', index_res)
    radar_res = {
        'portrait': [],
        'score': 0
    }

    radar_score = 0
    for key, value in index_res.items():
        radar_res['portrait'].append({
            'key': key,
            'value': value
        })
        radar_score += value
    radar_res['score'] = radar_score
    # print(radar_res)
    res['radar'] = radar_res

    # bar
    # print(bar)
    s_num = len(text_list)
    # print('sentence num:', s_num)
    draft_num = len(bar[0]['draft'])
    for idx in bar:
        idx['draft'].append('Draft ' + str(draft_num + 1))
    # print('draft_num:', draft_num)
    for i, s in enumerate(text_list):
        print(i)
        s_res = compute2(s)
        print(s)
        print('s_res:', s_res)
        p = 0
        for k, v in s_res.items():
            if i >= len(bar[p]['legend']):
                bar[p]['legend'].append('S' + str(i+1))
                data = []
                for i in range(draft_num):
                    data.append(0)
                data.append(v)
                bar[p]['series'].append({
                    'name': 'S' + str(i+1),
                    'data': data
                })
            else:
                bar[p]['series'][i]['data'].append(v)

            p += 1

    cha = len(bar[0]['legend']) - s_num
    if len(bar[0]['legend']) - s_num > 0:
        for idx in bar:
            for i, sid in enumerate(idx['series']):
                if i >= s_num:
                    idx['series'][i]['data'].append(0)

    res['bar'] = bar
    return res, bar


@app.route('/analyze', methods=["POST", "GET"])
def analyze():
    global bar
    if request.method == 'POST':
        text = request.args.get('text')  # 获取前端传入的参数
        res, bar = analyzeText(text, bar)
        print(type(res))
    return jsonify(res)


def analyzeAllRef_helper(text, bar):
    res = {'radar': {}, 'class': [], 'bar': []}  # 最终结果

    # class
    text_list = text.split(".")
    if "" in text_list:
        text_list.remove("")
    if " " in text_list:
        text_list.remove(" ")
    # # print(text_list)

    class_res = []
    label2type = {'LABEL_0': 'background', 'LABEL_1': 'objective', 'LABEL_2': 'methods', 'LABEL_3': 'results', 'LABEL_4': 'conclusion'}
    for i in range(0,len(text_list)):
        class_res.append('a')
    for i in range(0,len(text_list)):
        tmp = query_class({"inputs": text_list[i],
        "options":{"wait_for_model":True}})
        # print(label2type[tmp[0][0]['label']])
        # print('332', tmp)
        class_res[i]=tmp[0][0]['label'].split('_')[1]
    # print(class_res)

    class_res_ = []
    for i, el in enumerate(class_res):
        #print(el)
        class_res_.append(
            {
                'group': 'Ref',
                'variable': 'S' + str(i),
                'value': el
            }
        )
    # print(class_res_)
    res['class'] = class_res_

    # radar
    index_res = (compute2(text))
    # print('index res:', index_res)
    radar_res = {
        'portrait': [],
        'score': 0
    }

    radar_score = 0
    for key, value in index_res.items():
        radar_res['portrait'].append({
            'key': key,
            'value': value
        })
        radar_score += value
    radar_res['score'] = radar_score
    # print(radar_res)
    res['radar'] = radar_res

    # bar
    # print(bar)
    s_num = len(text_list)
    # print('sentence num:', s_num)
    draft_num = len(bar[0]['draft'])
    for idx in bar:
        idx['draft'].append('Ref')
    # print('draft_num:', draft_num)
    for i, s in enumerate(text_list):
        s_res = compute2(s)
        # print('s_res:', s_res)
        p = 0
        for k, v in s_res.items():
            if i >= len(bar[p]['legend']):
                bar[p]['legend'].append('S' + str(i+1))
                data = []
                for i in range(draft_num):
                    data.append(0)
                data.append(v)
                bar[p]['series'].append({
                    'name': 'S' + str(i+1),
                    'data': data
                })
            else:
                bar[p]['series'][i]['data'].append(v)

            p += 1

    cha = len(bar[0]['legend']) - s_num
    if len(bar[0]['legend']) - s_num > 0:
        for idx in bar:
            for i, sid in enumerate(idx['series']):
                if i >= s_num:
                    idx['series'][i]['data'].append(0)

    res['bar'] = bar
    return res, bar


@app.route('/analyzeAllRef', methods=["POST", "GET"])
def analyzeAllRef():
    global bar
    if request.method == 'POST':
        text = request.args.get('text')  # 获取前端传入的参数
        res, bar = analyzeAllRef_helper(text, bar)
    return res


def analyzeRef_helper(text):
    # radar
    index_res = (compute2(text))
    # print('index res:', index_res)
    radar_res = {
        'portrait': [],
        'score': 0
    }

    radar_score = 0
    for key, value in index_res.items():
        radar_res['portrait'].append({
            'key': key,
            'value': value
        })
        radar_score += value
    radar_res['score'] = radar_score
    # print(radar_res)
    return radar_res


@app.route('/analyzeRef', methods=["POST", "GET"])
def analyzeRef():
    if request.method == 'POST':
        text = request.args.get('text')  # 获取前端传入的参数
        res = analyzeRef_helper(text)
    return jsonify(res)

@app.route('/resetBar', methods=["POST", "GET"])
def resetBar():
    global bar
    bar = [
        {
            'index': 'mattr50_fw',
            'legend': [],
            'draft': [],
            'series': []
        },
        {
            'index': 'NumTokens',
            'legend': [],
            'draft': [],
            'series': []
        },
        {
            'index': 'mtld_fw',
            'legend': [],
            'draft': [],
            'series': []
        },
        {
            'index': 'MTLD_bi_fw',
            'legend': [],
            'draft': [],
            'series': []
       },
        {
            'index': 'MTLD_aw',
            'legend': [],
            'draft': [],
            'series': []
        }
    ]
    print('bar is reset')
    msg = 'hello'
    return jsonify({
        'msg': msg,
    })


@app.route('/len', methods=["POST", "GET"])
def get_len():
    with open('./similarity/similarity_matrix.json', 'r', encoding='utf-8') as f:
        similarity_matrix = json.load(f)
    len1 = len(similarity_matrix[0])
    len0 = len(similarity_matrix)
    # print(len0)
    return jsonify({
        'len0': len0,
        'len1': len1
    })


@app.route('/text_arr', methods=["POST", "GET"])
def text_arr():
    with open('./abstract/curr_abs_arr.json', 'r', encoding='utf-8') as f:
        abs_arr = json.load(f)
    return jsonify(abs_arr)


if __name__ == '__main__':
    app.run(debug=True, port=5432)
