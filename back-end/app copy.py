
from cgitb import text
from crypt import methods
from optparse import Option
from random import randint, random
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import json
import os
import numpy as np
import requests
# from transformers import PegasusTokenizer, PegasusForConditionalGeneration
# import torch
# from datasets import load_dataset
# import shap


# print("loading model...")
# model = PegasusForConditionalGeneration.from_pretrained("google/pegasus-large").cuda()
# tokenizer = PegasusTokenizer.from_pretrained("google/pegasus-large")
# print("model loaded!")


app = Flask(__name__)
CORS(app, supports_credentials=True)


# analyze 相关
def analyzeText(text):
    classD = [
        [
            {'group': "D", 'variable': "S1", 'value': "background"},
            {'group': "D", 'variable': "S2", 'value': "method"},
            {'group': "D", 'variable': "S3", 'value': "method"},
            {'group': "D", 'variable': "S4", 'value': "purpose"},
            {'group': "D", 'variable': "S5", 'value': "purpose"},
            {'group': "D", 'variable': "S6", 'value': "purpose"},
            {'group': "D", 'variable': "S7", 'value': "conclusion"},
            {'group': "D", 'variable': "S8", 'value': "result"},
            {'group': "D", 'variable': "S9", 'value': "conclusion"},
            {'group': "D", 'variable': "S10", 'value': "conclusion"},
        ],
        # [
        #     {'group': "D", 'variable': "S1", 'value': "background"},
        #     {'group': "D", 'variable': "S2", 'value': "background"},
        #     {'group': "D", 'variable': "S3", 'value': "background"},
        #     {'group': "D", 'variable': "S4", 'value': "method"},
        #     {'group': "D", 'variable': "S5", 'value': "method"},
        #     {'group': "D", 'variable': "S6", 'value': "purpose"},
        #     {'group': "D", 'variable': "S7", 'value': "purpose"},
        #     {'group': "D", 'variable': "S8", 'value': "result"},
        #     {'group': "D", 'variable': "S9", 'value': "result"},
        #     {'group': "D", 'variable': "S10", 'value': "conclusion"}
        # ],
        # [
        #     {'group': "D", 'variable': "S1", 'value': "background"},
        #     {'group': "D", 'variable': "S2", 'value': "background"},
        #     {'group': "D", 'variable': "S3", 'value': "method"},
        #     {'group': "D", 'variable': "S4", 'value': "method"},
        #     {'group': "D", 'variable': "S5", 'value': "purpose"},
        #     {'group': "D", 'variable': "S6", 'value': "result"},
        #     {'group': "D", 'variable': "S7", 'value': "conclusion"},
        #     {'group': "D", 'variable': "S8", 'value': "conclusion"},
        # ]
    ]
    text = {
        'radar': {
            'portrait': [
                {'key': 'school', 'value': random() * 100},
                {'key': 'grade', 'value': random() * 100},
                {'key': 'bindcash', 'value': random() * 100},
                {'key': 'deltatime', 'value': random() * 100},
                {'key': 'combatscore', 'value': random() * 100},
                {'key': 'sex', 'value': 2}
            ],
            'score': random() * 100
        },
        'class': classD[np.random.randint(0, 2)],  # 从 classD 中随机选取数据来模拟真实数据
        'bar': [
            {
                'index': 'index-0',
                'legend': ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'],
                'draft': ['Draft 1', 'Draft 2', 'Draft 3'],
                'series': [{
                    'name': 'S1',
                    'data': [320, 332, 301]
                },
                    {
                    'name': 'S2',
                    'data': [220, 182, 191]
                },
                    {
                    'name': 'S3',
                    'data': [150, 232, 201]
                },
                    {
                    'name': 'S4',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S5',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S6',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S7',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S8',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S9',
                    'data': [0, 98, 0]
                }]
            },
            {
                'index': 'index-1',
                'legend': ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'],
                'draft': ['Draft 1', 'Draft 2', 'Draft 3'],
                'series': [{
                    'name': 'S1',
                    'data': [320, 332, 301]
                },
                    {
                    'name': 'S2',
                    'data': [220, 182, 191]
                },
                    {
                    'name': 'S3',
                    'data': [150, 232, 201]
                },
                    {
                    'name': 'S4',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S5',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S6',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S7',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S8',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S9',
                    'data': [0, 98, 0]
                }]
            },
            {
                'index': 'index-2',
                'legend': ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'],
                'draft': ['Draft 1', 'Draft 2', 'Draft 3'],
                'series': [{
                    'name': 'S1',
                    'data': [320, 332, 301]
                },
                    {
                    'name': 'S2',
                    'data': [220, 182, 191]
                },
                    {
                    'name': 'S3',
                    'data': [150, 232, 201]
                },
                    {
                    'name': 'S4',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S5',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S6',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S7',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S8',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S9',
                    'data': [0, 98, 0]
                }]
            },
            {
                'index': 'index-3',
                'legend': ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'],
                'draft': ['Draft 1', 'Draft 2', 'Draft 3'],
                'series': [{
                    'name': 'S1',
                    'data': [320, 332, 301]
                },
                    {
                    'name': 'S2',
                    'data': [220, 182, 191]
                },
                    {
                    'name': 'S3',
                    'data': [150, 232, 201]
                },
                    {
                    'name': 'S4',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S5',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S6',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S7',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S8',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S9',
                    'data': [0, 98, 0]
                }]
            },
            {
                'index': 'index-4',
                'legend': ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'],
                'draft': ['Draft 1', 'Draft 2', 'Draft 3'],
                'series': [{
                    'name': 'S1',
                    'data': [320, 332, 301]
                },
                    {
                    'name': 'S2',
                    'data': [220, 182, 191]
                },
                    {
                    'name': 'S3',
                    'data': [150, 232, 201]
                },
                    {
                    'name': 'S4',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S5',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S6',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S7',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S8',
                    'data': [98, 77, 101]
                },
                    {
                    'name': 'S9',
                    'data': [0, 98, 0]
                }]
            }
        ]
    }
    return text


@app.route('/analyze', methods=["POST", "GET"])
def analyze():
    if request.method == 'POST':
        text = request.args.get('text')  # 获取前端传入的参数
        res = analyzeText(text)
    return jsonify(res)


if __name__ == '__main__':
    app.run(debug=True, port=5432)
