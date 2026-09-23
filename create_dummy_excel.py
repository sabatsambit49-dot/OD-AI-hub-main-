import pandas as pd
import numpy as np

# Create headers
header_row_1 = ["", "", "Bachelor Degrees", "", "", "", "", "Master Degrees", ""]
header_row_2 = ["Sl. No.", "College Name", "BA", "B.Sc", "B.Com", "BBA", "BCA", "MA English", "MBA"]

# Data from the provided OCR/screenshots
data = [
    [1, "Aaryan Gurukul Degree College, Berhampur", "No", "Yes", "No", "No", "No", "No", "No"],
    [2, "Anchalika Degree College, Jagannath Prasad", "Yes", "No", "No", "No", "No", "No", "No"],
    [3, "Anchalika Mahavidyalaya, Khetria Barapur", "Yes", "Yes", "No", "No", "No", "No", "No"],
    [4, "Anchalika Science College, Ballipadar", "Yes", "Yes", "No", "No", "No", "No", "No"],
    [5, "Aska Science College, Aska", "Yes", "Yes", "Yes", "No", "No", "No", "No"],
    [6, "Bellaguntha Science College, Bellaguntha", "Yes", "Yes", "Yes", "No", "No", "No", "No"],
    [7, "Biju Patnaik Science Degree College, Badagada", "Yes", "Yes", "No", "No", "No", "No", "No"],
    [8, "Biju Patnaik Women's College, Digapahandi", "Yes", "No", "No", "No", "No", "No", "No"],
    [21, "Kalam Degree Science College, Govindapur", "No", "Yes", "No", "Yes", "Yes", "No", "No"],
    [30, "National Institute of Science and Technology, Palur Hills", "Yes", "Yes", "No", "Yes", "Yes", "No", "No"],
    [60, "Science Autonomous College, Hinjilicut", "Yes", "Yes", "Yes", "Yes", "Yes", "No", "No"],
    [68, "College of Advance Computing, Berhampur", "Yes", np.nan, np.nan, "Yes", "Yes", "No", "No"],
    [75, "Disha College of Management and Technology, Berhampur", np.nan, np.nan, np.nan, "Yes", "Yes", "No", "Yes"],
    [76, "Gayatri Institute of Computer and Management, Hinjilicut", "Yes", "Yes", "Yes", "Yes", "Yes", "No", "Yes"],
]

# Create DataFrame
df = pd.DataFrame([header_row_1, header_row_2] + data)

# Save to Excel
with pd.ExcelWriter("Internship_related_institute.xlsx", engine="openpyxl") as writer:
    df.to_excel(writer, sheet_name="Course Matrix", header=False, index=False)
    
print("Created dummy Excel file: Internship_related_institute.xlsx")
