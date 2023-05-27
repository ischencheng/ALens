

from __future__ import division
import sys

#import spacy #this is for if spaCy is used
import tkinter as tk
import tkinter.font
import tkinter.filedialog
import tkinter.constants
import queue
from tkinter import messagebox

import os
import sys
import re
import platform
#import shutil
#import subprocess
import glob
import math
from collections import Counter
try:
	import xml.etree.cElementTree as ET
except ImportError:
	import xml.etree.ElementTree as ET

#V1.2 includes a number of lemmatization fixes
#v4 fixes a bug that excluded all upper-case words

###THIS IS NEW IN V1.3.py ###
from threading import Thread
from fileinput import filename 

import spacy
from spacy.util import set_data_path

def compute(raw_text):
    def resource_path(relative):
        if hasattr(sys, "_MEIPASS"):
            return os.path.join(sys._MEIPASS, relative)
        return os.path.join(relative)
    set_data_path(resource_path('en_core_web_sm'))
    nlp = spacy.load(resource_path('en_core_web_sm'))

    # filename='/Users/anker/Desktop/3202IHC/NLP-tools/text/test.txt'
    # raw_text= open(filename, "r", errors = 'ignore').read()
    raw_text = re.sub('\s+',' ',raw_text)


    #thus begins the text analysis portion of the program
    adj_word_list = open(resource_path("dep_files/adj_lem_list.txt"), "r",errors = 'ignore').read().split("\n")[:-1]
    real_word_list = open(resource_path("dep_files/real_words.txt"), "r",errors = 'ignore').read().split("\n")[:-1] #these are lowered

    noun_tags = ["NN", "NNS", "NNP", "NNPS"] #consider whether to identify gerunds
    proper_n = ["NNP", "NNPS"]
    no_proper = ["NN", "NNS"]
    pronouns = ["PRP", "PRP$"]
    adjectives = ["JJ", "JJR", "JJS"]
    verbs = ["VB", "VBD", "VBG", "VBN", "VBP", "VBZ", "MD"]
    adverbs = ["RB", "RBR", "RBS"]
    content = ["NN", "NNS", "NNP", "NNPS","JJ", "JJR", "JJS"] #note that this is a preliminary list
    prelim_not_function = ["NN", "NNS", "NNP", "NNPS","JJ", "JJR", "JJS", "RB", "RBR", "RBS", "VB", "VBD", "VBG", "VBN", "VBP", "VBZ", "MD"]
    pronoun_dict = {"me":"i","him":"he","her":"she"}
    punctuation = "`` '' ' . , ? ! ) ( % / - _ -LRB- -RRB- SYM : ;".split(" ")
    punctuation.append('"')


    #print(raw_text)
    def safe_divide(numerator, denominator):
        if denominator == 0 or denominator == 0.0:
            index = 0
        else: index = numerator/denominator
        return index
    def tag_processor_spaCy(raw_text): #uses default spaCy 2.016
        
        lemma_list = []
        content_list = []
        function_list = []

        tagged_text = nlp(raw_text)
        
        for sent in tagged_text.sents:
            for token in sent:			
                if token.tag_ in punctuation:
                    continue
                if token.text.lower() not in real_word_list: #lowered because real_word_list is lowered
                    continue
            
            
                if token.tag_ in content:
                    if token.tag_ in noun_tags:
                        content_list.append(token.lemma_ + "_cw_nn")
                        lemma_list.append(token.lemma_ + "_cw_nn")
                    else:
                        content_list.append(token.lemma_ + "_cw")
                        lemma_list.append(token.lemma_ + "_cw")
            
                if token.tag_ not in prelim_not_function:
                    if token.tag_ in pronouns:
                        if token.text.lower() in pronoun_dict:
                            function_list.append(pronoun_dict[token.text.lower()] + "_fw")
                            lemma_list.append(pronoun_dict[token.text.lower()] + "_fw")
                        else:
                            function_list.append(token.text.lower() + "_fw")
                            lemma_list.append(token.text.lower() + "_fw")
                    else:
                        function_list.append(token.lemma_ + "_fw")
                        lemma_list.append(token.lemma_ + "_fw")
                
                if token.tag_ in verbs:						
                    if token.dep_ == "aux":
                        function_list.append(token.lemma_ + "_fw")
                        lemma_list.append(token.lemma_ + "_fw")
                    
                    elif token.lemma_ == "be":
                        function_list.append(token.lemma_ + "_fw")
                        lemma_list.append(token.lemma_ + "_fw")

                    else:
                        content_list.append(token.lemma_ + "_cw_vb")
                        lemma_list.append(token.lemma_ + "_cw_vb")				
            
                if token.tag_ in adverbs:
                    if (token.lemma_[-2:] == "ly" and token.lemma_[:-2] in adj_word_list) or (token.lemma_[-4:] == "ally" and token.lemma_[:-4] in adj_word_list):
                        content_list.append(token.lemma_ + "_cw")
                        lemma_list.append(token.lemma_ + "_cw")				
                    else:
                        function_list.append(token.lemma_ + "_fw")
                        lemma_list.append(token.lemma_ + "_fw")				
                #print(raw_token, lemma_list[-1])
                    
        return {"lemma" : lemma_list, "content" : content_list, "function" : function_list}

    refined_lemma_dict = tag_processor_spaCy(raw_text)
    lemma_text_aw = refined_lemma_dict["lemma"]
            
    lemma_text_cw = refined_lemma_dict["content"]
    lemma_text_fw = refined_lemma_dict["function"]

    #print(lemma_text_fw)
    def ttr(text):
            ntokens = len(text)
            ntypes = len(set(text))

            simple_ttr = safe_divide(ntypes,ntokens)
            root_ttr = safe_divide(ntypes, math.sqrt(ntokens))
            log_ttr = safe_divide(math.log10(ntypes), math.log10(ntokens))
            maas_ttr = safe_divide((math.log10(ntokens)-math.log10(ntypes)), math.pow(math.log10(ntokens),2))

            return [simple_ttr,root_ttr,log_ttr,maas_ttr]

    def mattr(text, window_length = 50): #from TAACO 2.0.4
        #print(text)
        if len(text) < (window_length + 1):
            ma_ttr = safe_divide(len(set(text)),len(text))

        else:
            sum_ttr = 0
            denom = 0
            for x in range(len(text)):
                small_text = text[x:(x + window_length)]
                if len(small_text) < window_length:
                    break
                denom += 1
                sum_ttr+= safe_divide(len(set(small_text)),float(window_length)) 
            ma_ttr = safe_divide(sum_ttr,denom)

        return ma_ttr


    def mtld_original(input, min = 10):
        def mtlder(text):
            factor = 0
            factor_lengths = 0
            start = 0
            for x in range(len(text)):
                factor_text = text[start:x+1]
                if x+1 == len(text):
                    factor += safe_divide((1 - ttr(factor_text)[0]),(1 - .72))
                    factor_lengths += len(factor_text)
                else:
                    if ttr(factor_text)[0] < .720 and len(factor_text) >= min:
                        factor += 1
                        factor_lengths += len(factor_text)
                        start = x+1
                    else:
                        continue

            mtld = safe_divide(factor_lengths,factor)
            return mtld
        input_reversed = list(reversed(input))
        mtld_full = safe_divide((mtlder(input)+mtlder(input_reversed)),2)
        return mtld_full

    def mtld_bi_directional_ma(text, min = 10):
            def mtld_ma(text, min = 10):
                factor = 0
                factor_lengths = 0
                for x in range(len(text)):
                    sub_text = text[x:]
                    breaker = 0
                    for y in range(len(sub_text)):
                        if breaker == 0:
                            factor_text = sub_text[:y+1]	
                            if ttr(factor_text)[0] < .720 and len(factor_text) >= min:
                                factor += 1
                                factor_lengths += len(factor_text)
                                breaker = 1
                            else:
                                continue
                mtld = safe_divide(factor_lengths,factor)
                return mtld

            forward = mtld_ma(text)
            backward = mtld_ma(list(reversed(text)))

            mtld_bi = safe_divide((forward + backward), 2) #average of forward and backward mtld

            return mtld_bi

    res = {
        'mattr50_fw': mattr(lemma_text_fw,50),
        'NumTokens': len(lemma_text_cw),
        'mtld_fw': mtld_original(lemma_text_fw),
        'MTLD_bi_fw': mtld_bi_directional_ma(lemma_text_fw),
        'MTLD_aw': mtld_original(lemma_text_aw)
    }
    # print(res)
    return res
    
# compute('Summarization is an effective strategy to promote and enhance learning and deep comprehension of texts. However, summarization is seldom implemented by teachers in classrooms because the manual evaluation of stu- dents’ summaries requires time and effort. This problem has led to the devel- opment of automated models of summarization quality. However, these models often rely on features derived from expert ratings of student summarizations of specific source texts and are therefore not generalizable to summarizations of new texts. Further, many of the models rely of proprietary tools that are not freely or publicly available, rendering replications difficult. In this study, we introduce an automated summarization evaluation (ASE) model that depends strictly on features of the source text or the summary, allowing for a purely text- based model of quality. This model effectively classifies summaries as either low or high quality with an accuracy above 80%. Importantly, the model was developed on a large number of source texts allowing for generalizability across texts. Further, the features used in this study are freely and publicly available affording replication.')
