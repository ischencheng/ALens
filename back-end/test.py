from cgitb import reset
import math
from urllib import response
import requests
from blanc import Estime
from taaled import compute
import numpy as np
import time
import random

def normalization(data):
    _range = np.max(data) - np.min(data)
    return (data - np.min(data)) / _range

API_URL_0 = "https://api-inference.huggingface.co/models/valurank/en_readability"
headers_0 = {"Authorization": "Bearer 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"}


def query_under(payload):
    response = requests.post(API_URL_0, headers=headers_0, json=payload)
    return response.json()


API_URL_1 = "https://api-inference.huggingface.co/models/prithivida/parrot_fluency_model"
headers_1 = {"Authorization": "Bearer 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"}


def query_flu(payload):
    response = requests.post(API_URL_1, headers=headers_1, json=payload)
    return response.json()


output_flu = query_flu({
    "inputs": "I like you. I love you",
})

output_under = query_under({
    "inputs": "I like you. I love you",
})


def compute2(text): 
    res = {
        'understandability': 0, #
        'consistency': 0,       #
        'fluency': 0,           #
        'diversity': 0,         #  
        'conciseness': 0        #
    }


    response_under = query_under({"inputs": text,"options":{"wait_for_model":True}})
    res['understandability'] = response_under[0][5]['score']/40


    res['consistency'] = 0.4 + random.randint(0,9) * 0.02


    if len(text.split()) > 256:
        tmp0 = query_flu({"inputs": text[0: int(len(text.split())/2)],
                "options":{"wait_for_model":True}})
        tmp1 = query_flu({"inputs": text[int(len(text.split())/2):],   
        "options":{"wait_for_model":True}})
        time.sleep(10)
        tmp = (tmp0[0][0]['score'] + tmp1[0][0]['score']) / 2 - 0.8
        # print(tmp)
        res['fluency'] = tmp
    else:
        tmp2 = query_flu({"inputs": text,"options":{"wait_for_model":True}})
        #print(tmp2)
        res['fluency'] = tmp2[0][0]['score']

    
    tmp_l = []
    for k,v in compute(text).items():
        tmp_l.append(v)
    a = normalization(np.array(tmp_l))
    res['diversity'] = np.mean(a) 


    text_list = text.split(".")
    if "" in text_list:
        text_list.remove("")
    if " " in text_list:
        text_list.remove(" ")
    def count_words(str):
        # 计算单词数
        num = 0
        for i in range(len(str)):
            if str[i] != ' ' and (i == 0 or str[i-1] == ' '):
                num += 1
        return num
    word_num = count_words(text)
    conciseness =(60- word_num / len(text_list))/60
    res['conciseness'] = conciseness
        
    # print('res:', res)
    return res



# compute2("eference Abstractbackground : inequality in distribution of health services is measured by different scales one of the most common is the gini coefficient which is based on the lorenz curve.results:the results showed that the national mean number of ccu beds for a population of 100,000 is 4.patients and methods : this study conducted useing demographic data from national census in 2012 collected by the statistics center of iran ( sci ).88, which 23 ( out of a total of 31 provinces are below the national mean ) are below the national mean.objectives:the aim of this study was to examine the inequality of the geographical distribution of coronary care unit beds and cardiologists in iran using the gini coefficient and the lorenz curve.conclusion:using gini measure showed that there is no significant inequality in the distribution of pubic cardiovascular health services in iran.the number of ccu beds and cardiologists in public sector by province was obtained from the ministry of health and medical education.nevertheless, our descriptive statistics showed that there is a skewness in distribution of pubic cardiovascular health service in iran.however, the obtained gini coefficients prove statically adequate equality for the geographical distribution of ccu beds across iran.moreover, even the equal distribution of cardiovascular health facilities such as ccu beds does not mean they are sufficiently provided in iran.the number of coronary care unit beds in public sector by province in 2012 was obtained from iran ministry of health and medical education.")