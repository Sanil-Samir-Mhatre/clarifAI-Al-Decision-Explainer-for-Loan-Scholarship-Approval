import random

names = ["Arjun Patel", "Sneha Rao", "Vikram Singh", "Priya Sharma", "Rahul Verma"]

for i in range(5, 8):
    name = random.choice(names)
    age = random.randint(18, 35)
    score = random.randint(40, 95)
    income = random.randint(100000, 1000000)
    emp_years = round(random.uniform(0, 10), 1)
    credit_score = random.randint(300, 850)
    credit_hist = round(random.uniform(0, 15), 1)
    amount = random.randint(10000, 500000)
    debt_ratio = round(random.uniform(0, 0.8), 2)
    prior_default = random.choice(["Y", "N"])
    
    content = f"""====================================================
        VERIDICT — LOAN/SCHOLARSHIP APPLICATION
====================================================
Case Reference: VER-APP-00{i} (Random Case)

Applicant Name        : {name}
Age                    : {age}
Academic Score         : {score} / 100
Annual Income          : Rs. {income:,}
Employment Years       : {emp_years}
Credit Score           : {credit_score}
Credit History (years) : {credit_hist}
Amount Requested       : Rs. {amount:,}
Existing Debt Ratio    : {debt_ratio}
Prior Default          : {prior_default}
Documents Attached     :
   [x] Identity Proof
   [x] Income Proof
   [x] Academic Transcript
   [x] Bank Statement
Eligibility Criteria Met: Y

Applicant Declaration: I confirm the above details are accurate to the
best of my knowledge.

Signature: {name.split()[0][0]}. {name.split()[-1]}                    Date: 04-09-2026
====================================================
"""
    with open(f"case{i}_random.txt", "w") as f:
        f.write(content)
