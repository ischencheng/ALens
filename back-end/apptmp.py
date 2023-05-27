from cgitb import reset, text
from crypt import methods
from optparse import Option
from random import randint, random
from tokenize import group
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import json
import os
import numpy as np
import requests
import nltk.data

from taaled import compute
# tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')


API_URL = "https://api-inference.huggingface.co/models/epiphacc/pubmed-20k-sign-sentence-classification"
headers = {"Authorization": "Bearer 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"}


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

    # class_res = []
    # label2type = {'LABEL_0': 'background', 'LABEL_1': 'method', 'LABEL_2': 'purpose', 'LABEL_3': 'result', 'LABEL_4': 'conclusion'}
    # for s in text_list:
    #     tmp = query_class({"inputs": s})
    #     print(label2type[tmp[0][0]['label']])
    #     class_res.append(label2type[tmp[0][0]['label']])
    # # print(class_res)

    # class_res_ = []
    # for i, el in enumerate(class_res):
    #     # print(el)
    #     class_res_.append(
    #         {
    #             'group': 'D',
    #             'variable': 'S' + str(i),
    #             'value': el
    #         }
    #     )
    # # print(class_res_)
    # res['class'] = class_res_

    # radar
    index_res = (compute(text))
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
        idx['draft'].append('Draft ' + str(draft_num + 1))
    # print('draft_num:', draft_num)
    for i, s in enumerate(text_list):
        s_res = compute(s)
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


def main():
    text = "background : inequality in distribution of health services is measured by different scales one of the most common is the gini coefficient which is based on the lorenz curve.objectives:the aim of this study was to examine the inequality of the geographical distribution of coronary care unit beds and cardiologists in iran using the gini coefficient and the lorenz curve.patients and methods : this study conducted useing demographic data from national census in 2012 collected by the statistics center of iran ( sci ).the number of coronary care unit beds in public sector by province in 2012 was obtained from iran ministry of health and medical education.the number of ccu beds and cardiologists in public sector by province was obtained from the ministry of health and medical education.results:the results showed that the national mean number of ccu beds for a population of 100,000 is 4.88, which 23 ( out of a total of 31 provinces are below the national mean ) are below the national mean."
    # however, the obtained gini coefficients prove statically adequate equality for the geographical distribution of ccu beds across iran.conclusion:using gini measure showed that there is no significant inequality in the distribution of pubic cardiovascular health services in iran.nevertheless, our descriptive statistics showed that there is a skewness in distribution of pubic cardiovascular health service in iran.moreover, even the equal distribution of cardiovascular health facilities such as ccu beds does not mean they are sufficiently provided in iran."
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
    res, bar = analyzeText(text, bar)
    print('returned bar: ', bar)
    
main()
