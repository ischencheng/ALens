import numpy as np
from transformers import PegasusTokenizer, PegasusForConditionalGeneration
import torch
from datasets import load_dataset
import shap
import json

def shapely_explain(text):
    print("explaining...")
    explainer = shap.Explainer(model, tokenizer)
    shap_values=explainer(text)

    print("storing data...")
    values=shap_values.values
    #print(values)
    with open("/Users/anker/Viseer/systems/IntroLens-master/back-end/shapely/curr-shap.json","w",encoding="utf-8") as f:
        json.dump(values.tolist(),f)



# text=["Previous studies proposed to improve the feedback quality by asking tutors to check the samples of other tutors’ feedback before grading assignments. However, this process is tedious and involves privacy issues for a tutor to listen to the learner’s previous audio recordings or check other tutors’ feedback in online language tutoring platforms."]

# pegasus(text)
