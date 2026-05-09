import os
import json
from dotenv import load_dotenv
load_dotenv(dotenv_path="c:\\Users\\bhavesh kumar\\OneDrive\\Documents\\surprice_planer\\backend\\.env")
from supabase import create_client, Client

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    res = supabase.table("mystery_events").select("*").limit(1).execute()
    print("mystery_events exists:", res.data)
except Exception as e:
    print("Error:", e)
