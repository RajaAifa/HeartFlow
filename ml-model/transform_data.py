import pandas as pd
import numpy as np

df = pd.read_csv("cardio_train.csv", sep=';')


df['age_years'] = (df['age'] / 365).astype(int)


df['height'] = df['height']
df['weight'] = df['weight']


df['bmi'] = df['weight'] / ((df['height'] / 100) ** 2)

def bmi_category(bmi):
    if bmi < 18.5:
        return 0  
    elif bmi < 25:
        return 1  
    elif bmi < 30:
        return 2  
    else:
        return 3 

df['bmi_category'] = df['bmi'].apply(bmi_category)


def bp_category(ap_hi):
    if ap_hi < 120:
        return 0  
    elif ap_hi < 140:
        return 1 
    else:
        return 2 

df['bp_category'] = df['ap_hi'].apply(bp_category)


df['cholesterol_level'] = df['cholesterol']
df['glucose_level'] = df['gluc']
df['alcohol'] = df['alco']
df['physical_activity'] = df['active']


df_final = df[[
    'age_years',
    'gender',
    'height',
    'weight',
    'bmi_category',
    'bp_category',
    'cholesterol_level',
    'glucose_level',
    'smoke',
    'alcohol',
    'physical_activity',
    'cardio'
]]

df_final.to_csv("patient_heart.csv", index=False)

print(" Updated questionnaire dataset created!")
