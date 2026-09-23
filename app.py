# pyrefly: ignore [missing-import]
import streamlit as st
import pandas as pd
import os

st.set_page_config(page_title="College Course Finder", layout="wide")

@st.cache_data
def load_data(file_path):
    # Read the Excel file, ignoring the first row (which is merged headers)
    # We read without header to manually parse it
    df = pd.read_excel(file_path, sheet_name="Course Matrix", header=None)
    
    # Row index 1 (second row in Excel) contains the actual column headers
    headers = df.iloc[1].tolist()
    
    # Forward-fill any NaN in the first two columns (Sl. No. and College Name)
    headers[0] = "Sl. No." if pd.isna(headers[0]) else headers[0]
    headers[1] = "College Name" if pd.isna(headers[1]) else headers[1]
    
    # Assign the new headers to the dataframe
    df.columns = headers
    
    # Drop the first two rows (which were the merged header and the actual header)
    df = df.iloc[2:].reset_index(drop=True)
    
    # Drop any empty columns or rows if completely NA
    df = df.dropna(how='all', subset=["College Name"])
    
    return df, headers[2:]

def main():
    st.title("🎓 College Course Finder")
    st.markdown("Find colleges that offer specific courses.")
    
    file_path = "Internship_related_institute.xlsx"
    
    if not os.path.exists(file_path):
        st.error(f"File '{file_path}' not found. Please ensure it is placed in the same directory as the app.")
        return
        
    try:
        df, course_columns = load_data(file_path)
    except Exception as e:
        st.error(f"Error loading the Excel file: {e}")
        return

    # Clean course columns to get unique valid course names
    unique_courses = []
    for col in course_columns:
        if pd.notna(col) and str(col).strip():
            unique_courses.append(str(col).strip())
            
    # Deduplicate and sort
    unique_courses = sorted(list(set(unique_courses)))
    
    st.sidebar.header("Filter Options")
    
    # 2. Course selection box
    selected_course = st.sidebar.selectbox("Select a Course:", options=["-- Select a Course --"] + unique_courses)
    
    # 4. Search box for college name
    search_term = st.sidebar.text_input("Search College Name (optional):", "")
    
    st.markdown("### Results")
    
    if selected_course == "-- Select a Course --":
        st.info("Please select a course from the sidebar to view colleges.")
    else:
        # Filter logic
        # 3. Filtered results on selection
        # Check if the column exists in df
        if selected_course in df.columns:
            # We want cases where the cell is 'Yes' (case-insensitive)
            # Edge case handling for 'Yes' values
            filtered_df = df.copy()
            
            # Ensure the column is treated as string and filter
            is_yes = filtered_df[selected_course].astype(str).str.strip().str.lower() == 'yes'
            filtered_df = filtered_df[is_yes]
            
            if search_term:
                # Further filter by college name
                name_match = filtered_df["College Name"].astype(str).str.contains(search_term, case=False, na=False)
                filtered_df = filtered_df[name_match]
                
            if filtered_df.empty:
                st.warning(f"No colleges found offering **{selected_course}**.")
            else:
                st.success(f"Found {len(filtered_df)} college(s) offering **{selected_course}**:")
                
                # Display as a clean table or list
                # For presentation, we'll extract just the relevant columns
                display_df = filtered_df[["Sl. No.", "College Name", selected_course]].reset_index(drop=True)
                # Ensure Sl. No. is integer if possible
                try:
                    display_df["Sl. No."] = display_df["Sl. No."].astype(float).astype(int)
                except:
                    pass
                
                st.dataframe(display_df, use_container_width=True, hide_index=True)
        else:
            st.error("Course column not found in data.")

if __name__ == "__main__":
    main()
