import requests
import json

BASE_URL = "http://localhost:5000/api/auth/register"

payload = {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
}

try:
    print(f"Testing registration against {BASE_URL}...")
    response = requests.post(BASE_URL, json=payload)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        print("SUCCESS: Backend is working correctly.")
    elif response.status_code == 400 and "already registered" in response.text:
         print("SUCCESS: Backend is reachable (User already exists).")
    else:
        print("FAILURE: Backend returned an unexpected error.")

except Exception as e:
    print(f"CRITICAL FAILURE: Could not connect to backend. {e}")
