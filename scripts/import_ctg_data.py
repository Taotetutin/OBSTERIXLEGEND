import csv
import os
from datetime import datetime

def read_ctg_data():
    data = []
    with open('attached_assets/CTG_Raw Data.csv', 'r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            # Convert empty strings to 0
            for key in row:
                if row[key] == '':
                    row[key] = '0'
            data.append(row)
    return data

def generate_sql_insert(row):
    return f"""
    INSERT INTO ctg_data (
        file_name, date, seg_file, b, e, lbe, lb, ac, fm, uc, 
        astv, mstv, altv, mltv, dl, ds, dp, dr, width, min, 
        max, nmax, nzeros, mode, mean, median, variance, tendency,
        a, b_class, c, d, e_class, ad, de, ld, fs, susp, class, nsp
    ) VALUES (
        '{row['FileName']}', '{row['Date']}', '{row['SegFile']}',
        {row['b']}, {row['e']}, {row['LBE']}, {row['LB']}, {row['AC']},
        {row['FM']}, {row['UC']}, {row['ASTV']}, {row['MSTV']}, {row['ALTV']},
        {row['MLTV']}, {row['DL']}, {row['DS']}, {row['DP']}, {row['DR']},
        {row['Width']}, {row['Min']}, {row['Max']}, {row['Nmax']}, {row['Nzeros']},
        {row['Mode']}, {row['Mean']}, {row['Median']}, {row['Variance']},
        {row['Tendency']}, {row['A']}, {row['B']}, {row['C']}, {row['D']},
        {row['E']}, {row['AD']}, {row['DE']}, {row['LD']}, {row['FS']},
        {row['SUSP']}, {row['CLASS']}, {row['NSP']}
    );
    """

# Read the data
ctg_data = read_ctg_data()

# Generate and execute SQL statements
for row in ctg_data:
    sql_insert = generate_sql_insert(row)
    print(f"Importing record from file: {row['FileName']}")
    # Here you would execute the SQL statement
