import os
import random
import json
from openai import AsyncOpenAI

# Load keys
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
PERPLEXITY_API_KEY = os.environ.get("PERPLEXITY_API_KEY")

def get_client_and_model():
    """Returns the best available client and model name, prioritizing Perplexity."""
    if PERPLEXITY_API_KEY and PERPLEXITY_API_KEY != "":
        return AsyncOpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai"), "llama-3.1-sonar-large-128k-online"
    if OPENAI_API_KEY and OPENAI_API_KEY != "mock-key":
        return AsyncOpenAI(api_key=OPENAI_API_KEY), "gpt-3.5-turbo"
    return None, None

def get_sydney_system_prompt():
    return """You are 'Sydney', a friendly, professional, and charismatic technical recruiter. 
    Your personality is inspired by Sydney Sweeney—engaging, articulate, and encouraging.
    You use a professional yet 'cool' tone. You always keep the interview focused but make the candidate feel heard."""

async def generate_question(role: str, difficulty: str) -> str:
    client, model = get_client_and_model()
    if not client:
        mock_questions = {
            "Frontend Developer": f"Explain the concept of React Hooks and how they differ from Class component lifecycles in {difficulty} detail.",
            "Backend Developer": f"How would you design a scalable microservices architecture for a high-traffic system on {difficulty} level?",
            "Data Scientist": f"Explain the bias-variance tradeoff and how you'd handle it in a {difficulty} problem.",
            "DevOps Engineer": f"Describe a robust CI/CD pipeline strategy for a multi-cloud environment on {difficulty} level.",
            "Cloud Architect": f"How would you design a multi-region highly available system for a global enterprise on {difficulty} level?",
            "Cybersecurity Analyst": f"Explain the concept of Zero Trust architecture and how to implement it in a legacy network for {difficulty} level.",
            "Product Manager": f"How do you prioritize a product roadmap when faced with competing technical debt and business feature requests on {difficulty} level?"
        }
        return mock_questions.get(role, f"Tell me about your experience in {role} and a challenging {difficulty} problem you've solved in this specialized field.")
    
    prompt = f"""
    As Sydney, generate an initial {difficulty} level technical interview question for a {role} position.
    
    Technical Context:
    - Target Role: {role}
    - Seniority/Complexity: {difficulty}
    
    Evaluation Criteria for the Question:
    - Must focus on real-world system architecture or core logical foundations.
    - Avoid generic "what is" questions; focus on "how would you design/solve" scenarios.
    - Reference specific industry-standard tools or patterns relevant to {role} if applicable.
    - Ensure the question is open-ended to allow candidate technical deep diving.
    
    Return ONLY the question.
    """
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": get_sydney_system_prompt()},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200
        )
        return response.choices[0].message.content.strip().strip('"')
    except Exception as e:
        print(f"Error generating question: {e}")
        return f"Hey, could you tell me about your most challenging {difficulty} project as a {role}?"

async def generate_resume_based_question(role: str, difficulty: str, resume_context: str) -> str:
    client, model = get_client_and_model()
    if not client:
        return f"Looking at your background, what would you say was the most technically challenging part of your latest project as a {role}?"
         
    prompt = f"""
    Role: {role}
    Difficulty: {difficulty}
    Candidate Resume Summary: {resume_context[:2000]}
    
    Task: As Sydney, generate ONE specific, challenging interview question that directly references a project or skill from their resume.
    Response format: Return ONLY the question text.
    """
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": get_sydney_system_prompt()},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200
        )
        return response.choices[0].message.content.strip().strip('"')
    except Exception as e:
        print(f"AI Error: {e}")
        return f"Based on your experience, how would you design a scalable solution for {role}?"

async def evaluate_answer(question: str, answer: str, difficulty: str = "medium") -> dict:
    client, model = get_client_and_model()
    if not client:
        return {
            "overallScore": random.randint(5, 8) if len(answer) > 50 else random.randint(2, 4),
            "strengths": ["Clear communication", "Good technical overview"],
            "improvements": ["Provide more specific examples"],
            "dimensions": [{"metric": "Communication", "value": 7}, {"metric": "Technical Accuracy", "value": 6}, {"metric": "Problem Solving", "value": 5}],
            "detailed_feedback": "Good attempt, but lacked depth in technical implementation details."
        }
    
    prompt = f"""
    Difficulty Context: {difficulty}
    Question: {question}
    Answer: {answer}
    
    Instructions:
    Grade the answer strictly as a Senior Technical Recruiter.
    1. Assess Technical Accuracy (0-10): Did they get the core concept right?
    2. Assess Communication (0-10): Was it structured and clear?
    3. Assess Problem Solving (0-10): Did they show logical steps?
    
    Return ONLY a JSON object:
    {{
      "overallScore": 0-10 (Weighted average),
      "strengths": ["string", "string"],
      "improvements": ["string", "string"],
      "dimensions": [
        {{"metric": "Technical Accuracy", "value": 0-10}},
        {{"metric": "Communication", "value": 0-10}},
        {{"metric": "Problem Solving", "value": 0-10}}
      ],
      "detailed_feedback": "string"
    }}
    """
    try:
        response = await client.chat.completions.create(
            model=model, 
            messages=[
                {"role": "system", "content": "You are a senior evaluator. Return strictly valid JSON."},
                {"role": "user", "content": prompt}
            ]
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```"):
             content = content.replace("```json", "").replace("```", "")
        return json.loads(content)
    except Exception as e:
        print(f"Error evaluating answer: {e}")
        return {"overallScore": 5, "strengths": ["Response recorded"], "improvements": ["Analysis failed partially"], "dimensions": []}

async def generate_quiz_questions(role: str, difficulty: str, resume_context: str) -> list[str]:
    client, model = get_client_and_model()
    if not client:
        return [f"As a {role}, how do you handle state management?", f"Explain your experience with the tech stack."]

    prompt = f"""
    Generate 5 high-quality interview questions for a {role} ({difficulty} level).
    Resume Context: {resume_context[:1000]}
    Format: Return ONLY a JSON array of 5 strings.
    """
    try:
        response = await client.chat.completions.create(
            model=model, 
            messages=[
                {"role": "system", "content": get_sydney_system_prompt()},
                {"role": "user", "content": prompt}
            ]
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```"):
            content = content.replace("```json", "").replace("```", "")
        return json.loads(content)[:5]
    except Exception as e:
        print(f"Error generating quiz: {e}")
        return [f"Technical Question {i+1} for {role}" for i in range(5)]

async def generate_followup_question(role: str, previous_question: str, previous_answer: str) -> str:
    client, model = get_client_and_model()
    
    # Analyze if the user wants to skip or change topic
    lower_ans = previous_answer.lower()
    is_clueless = any(x in lower_ans for x in ["don't know", "dont know", "no idea", "not sure", "don't have much experience"])
    is_changing_topic = any(x in lower_ans for x in ["change the topic", "another topic", "next question", "skip this", "something else"])
    
    intent_instruction = ""
    if is_clueless:
        intent_instruction = "The candidate doesn't know the answer. Kindly acknowledge this and pivot to a DIFFERENT fundamental technical concept in the same domain."
    elif is_changing_topic:
        intent_instruction = "The candidate wants to change the topic. Pivot to a new technical area within the same role."
    else:
        intent_instruction = "The candidate answered. You must CRITICALLY UPDATE them: If the answer is vague/wrong, correcting them briefly ('Actually, we usually use X...'). If good, validate specifically ('Spot on about X...'). If IRRELEVANT (e.g. complaining/off-topic), acknowledge it firmly but steer back to technical assessment. Then ask a deeper follow-up."

    prompt = f"""
    Context:
    - Role: {role}
    - Previous Question: {previous_question}
    - Candidate's Answer: {previous_answer}
    
    Your Goal as Sydney (Technical Recruiter):
    1. ANALYZE the accuracy and depth of the candidate's answer.
    2. FEEDBACK (Crucial): Start by evaluating their response.
       - If they were WRONG or SHALLOW: politely correct them or point out the gap.
       - If they were RIGHT: confirm the specific strong point.
    3. CHALLENGE: Ask a follow-up question that digs deeper into the specific topic they just discussed, or challenges an assumption they made.
    
    Constraints:
    - {intent_instruction}
    - Keep the total response under 3 sentences.
    - Be professional but demanding (like a real tech interview).
    
    Return ONLY the text of your response (Feedback + New Question).
    """
    
    if not client:
        if is_clueless or is_changing_topic:
            return f"No worries! Let's switch gears. In {role}, how do you approach API security?"
        return f"That covers the basics, but you missed the scalability aspect. How would you handle state management if this application scales to 1M users?"

    try:
        response = await client.chat.completions.create(
            model=model, 
            messages=[
                {"role": "system", "content": get_sydney_system_prompt()},
                {"role": "user", "content": prompt}
            ], 
            max_tokens=250
        )
        return response.choices[0].message.content.strip().strip('"')
    except Exception as e:
        print(f"Followup Error: {e}")
        return "I see. To dig a bit deeper, could you explain the trade-offs of that approach in a high-latency network?"
