"""
streamlit_app.py (Root entrypoint)
Forwards execution cleanly to app/streamlit_app.py.
"""
import os
import sys

# Ensure app directory is in path and execute
app_file = os.path.join(os.path.dirname(__file__), "app", "streamlit_app.py")
with open(app_file, encoding="utf-8") as f:
    code = f.read()
exec(compile(code, app_file, 'exec'))
