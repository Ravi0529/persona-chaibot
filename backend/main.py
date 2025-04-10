from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from dotenv import load_dotenv
from google import genai
from google.genai import types
import os
import ast

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

@app.post("/chat")
def chat(prompt: Prompt):
    response = client.models.generate_content(
        model="gemini-2.0-flash-001",
        config=types.GenerateContentConfig(system_instruction=system_prompt),
        contents=prompt.text,
    )
    return {"response": response.text}
