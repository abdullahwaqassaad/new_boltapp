import streamlit as st

# Load your HTML file
with open("index.html", "r", encoding="utf-8") as file:
    html_content = file.read()

# Display the HTML
st.components.v1.html(html_content, height=800, scrolling=True)
