import json
import difflib

def string_similar(s1, s2):
    return difflib.SequenceMatcher(None, s1, s2).quick_ratio()

def main():
    with open('rstData.json') as f: # rst 数据
        rstData = json.load(f)

    with open('source_txt_arr.json', 'r') as f: # 原文数据
        textData = json.load(f)

    for p in rstData:
        for s in p['text']:
            # s 是每个段落对象中的 text 部分中的句子对象
            for i,s_t in enumerate(textData):
                # print(s_t, s['content'])
                if string_similar(s_t, s['content']) > 0.9:
                    print(s_t)
                    print(s['content'])
                    print('==========================')
                    s['sentence-index'] = i
                else:
                    s['sentence-index'] = -1
    
    with open('rstDataNew.json', 'w') as f:
        json.dump(rstData, f)

    
    
    
    # print(string_similar('Introduction: Cardiovascular diseases account for the highest mortality rate worldwide and are expected to be the major cause of death by 2020 (1).', 'Cardiovascular diseases account for the highest mortality rate worldwide and are expected to be the major cause of death by 2020 ( 1 ) .'))
    
if __name__ == '__main__':
    main()