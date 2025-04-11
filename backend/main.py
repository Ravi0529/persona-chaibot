from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from dotenv import load_dotenv
from google import genai
from google.genai import types
import os
import re
import html

load_dotenv()

app = FastAPI()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Prompt(BaseModel):
    text: str

with open("system-prompt.txt", "r", encoding="utf-8") as file:
    system_prompt = file.read()

# chat_history = []

def clean_response(text: str) -> str:
    cleaned = re.sub(r"^```[\w]*\n", "", text.strip())
    cleaned = re.sub(r"\n?```$", "", cleaned)
    cleaned = html.unescape(cleaned)
    if cleaned.startswith('"') and cleaned.endswith('"'):
        cleaned = cleaned[1:-1]
    cleaned = cleaned.replace("\\n", "\n").replace("\\t", "\t")
    cleaned = re.sub(r"\*\*(.*?)\*\*", r"\1", cleaned)
    cleaned = re.sub(r"^\* ", "- ", cleaned, flags=re.MULTILINE)

    return cleaned.strip()

@app.post("/chat")
def chat(prompt: Prompt):
    # chat_history.append({"user": prompt.text})

    response = client.models.generate_content(
        model="gemini-2.0-flash-001",
        config=types.GenerateContentConfig(system_instruction=system_prompt),
        contents=prompt.text,
    )
    cleaned_text = clean_response(response.text)
    # chat_history.append({"bot": cleaned_text})

    return {"response": cleaned_text}
