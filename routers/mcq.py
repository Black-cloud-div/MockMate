from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
import random
from sqlalchemy.orm import Session
from .. import models, database, auth

router = APIRouter(
    prefix="/test",
    tags=["test"]
)

# --- Questions Data ---

DATA_SCIENCE_QUESTIONS = [
    {"id": 101, "question": "Which of the following creates a new array from an existing array and a boolean mask?", "options": ["arr[mask]", "arr.filter(mask)", "arr.select(mask)", "arr.where(mask)"], "correct": 0},
    {"id": 102, "question": "In pandas, what is the correct way to handle missing values by filling them with a specific value?", "options": ["df.dropna()", "df.fillna(value)", "df.replace(NaN, value)", "df.interpolate()"], "correct": 1},
    {"id": 103, "question": "Which algorithm is an example of an ensemble method?", "options": ["Linear Regression", "Decision Tree", "Random Forest", "K-Means"], "correct": 2},
    {"id": 104, "question": "What is the primary purpose of regularization in machine learning?", "options": ["To increase model complexity", "To prevent overfitting", "To speed up training", "To handle missing data"], "correct": 1},
    {"id": 105, "question": "Which metric is most appropriate for a dataset with highly imbalanced classes?", "options": ["Accuracy", "F1-Score", "MSE", "R-Squared"], "correct": 1},
    {"id": 106, "question": "What is the vanishing gradient problem primarily associated with?", "options": ["SVMs", "Deep Neural Networks", "Random Forests", "K-Nearest Neighbors"], "correct": 1},
    {"id": 107, "question": "Which of these is a dimensionality reduction technique?", "options": ["PCA", "KNN", "Gradient Boosting", "LSTM"], "correct": 0},
    {"id": 108, "question": "In SQL, which clause is used to filter the result set of an aggregate function?", "options": ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], "correct": 1},
    {"id": 109, "question": "What is 'overfitting' in the context of supervised learning?", "options": ["Model performs poorly on training data", "Model performs well on training data but poorly on test data", "Model is too simple", "Model has high bias"], "correct": 1},
    {"id": 110, "question": "Which library is standard for tensor computations in Deep Learning?", "options": ["NumPy", "Pandas", "PyTorch/TensorFlow", "Scikit-learn"], "correct": 2}
]

FRONTEND_QUESTIONS = [
    {"id": 201, "question": "What is the purpose of 'useEffect' in React?", "options": ["To manage state", "To handle side effects", "To create context", "To optimize rendering"], "correct": 1},
    {"id": 202, "question": "Which CSS property is used to change the text color of an element?", "options": ["text-color", "fg-color", "color", "font-color"], "correct": 2},
    {"id": 203, "question": "What does the 'z-index' property do?", "options": ["Sets the transparency", "Sets the stack order of elements", "Sets the zoom level", "Sets the horizontal position"], "correct": 1},
    {"id": 204, "question": "Which of the following is NOT a JavaScript data type?", "options": ["Undefined", "Number", "Boolean", "Float"], "correct": 3},
    {"id": 205, "question": "What is the virtual DOM?", "options": ["A direct copy of the real DOM", "A lightweight copy of the DOM kept in memory", "A browser extension", "A new HTML standard"], "correct": 1},
    {"id": 206, "question": "Which HTML tag is used to define an internal style sheet?", "options": ["<script>", "<style>", "<css>", "<link>"], "correct": 1},
    {"id": 207, "question": "In Redux, what is the only way to change the state?", "options": ["Directly modifying it", "Emitting an action", "Calling a component", "Using setState"], "correct": 1},
    {"id": 208, "question": "What does CSS Grid 'fr' unit stand for?", "options": ["Frame Rate", "Fraction", "Free Space", "Fragment"], "correct": 1},
    {"id": 209, "question": "Which method turns a JSON string into a JavaScript object?", "options": ["JSON.stringify()", "JSON.parse()", "JSON.toObj()", "JSON.convert()"], "correct": 1},
    {"id": 210, "question": "What is the difference between 'let' and 'var'?", "options": ["No difference", "var is block scoped, let is function scoped", "let is block scoped, var is function scoped", "let cannot be reassigned"], "correct": 2}
]

BACKEND_QUESTIONS = [
    {"id": 301, "question": "What does ACID stand for in databases?", "options": ["Atomicity, Consistency, Isolation, Durability", "Association, Consistency, Isolation, Data", "Atomicity, Connection, Integrity, Durability", "Access, Control, Interface, Design"], "correct": 0},
    {"id": 302, "question": "Which HTTP method is typically used to update a resource?", "options": ["GET", "POST", "PUT", "DELETE"], "correct": 2},
    {"id": 303, "question": "What is the main difference between SQL and NoSQL?", "options": ["SQL is faster", "NoSQL is relational", "SQL uses structured schemas, NoSQL is schema-less/flexible", "NoSQL cannot handle large data"], "correct": 2},
    {"id": 304, "question": "What is a 'foreign key'?", "options": ["A primary key of another table", "A unique identifier", "A password for the database", "A key used for encryption"], "correct": 0},
    {"id": 305, "question": "What is middleware in the context of web frameworks?", "options": ["Hardware that sites between client and server", "Software that connects the OS to the database", "Code that executes between the request and the response", "The frontend application"], "correct": 2},
    {"id": 306, "question": "Which of these is a message broker?", "options": ["PostgreSQL", "Redis", "RabbitMQ", "Nginx"], "correct": 2},
    {"id": 307, "question": "What is the purpose of an index in a database?", "options": ["To store more data", "To speed up data retrieval", "To encrypt data", "To validate data types"], "correct": 1},
    {"id": 308, "question": "What does CAP theorem imply?", "options": ["Consistency, Availability, and Partition tolerance can all be achieved simultaneously", "You can only choose two out of Consistency, Availability, and Partition tolerance", "Databases cannot be partitioned", "Availability is the most important factor"], "correct": 1},
    {"id": 309, "question": "Which protocol is WebSocket based on?", "options": ["UDP", "TCP", "ICMP", "HTTP/2"], "correct": 1},
    {"id": 310, "question": "What is a JWT used for?", "options": ["Encrypting the database", "Stateless authentication", "Routing requests", "Compressing images"], "correct": 1}
]

DSA_QUESTIONS = [
    {"id": 401, "question": "What is the time complexity of Binary Search?", "options": ["O(n)", "O(n log n)", "O(log n)", "O(1)"], "correct": 2},
    {"id": 402, "question": "Which data structure follows LIFO (Last In First Out)?", "options": ["Queue", "Stack", "Tree", "Graph"], "correct": 1},
    {"id": 403, "question": "Which sorting algorithm has the best average case time complexity?", "options": ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], "correct": 2},
    {"id": 404, "question": "What is the worst-case time complexity of QuickSort?", "options": ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"], "correct": 1},
    {"id": 405, "question": "Which data structure is used for Breadth-First Search (BFS)?", "options": ["Stack", "Queue", "Heap", "Hash Map"], "correct": 1},
    {"id": 406, "question": "In a hash table, what is a collision?", "options": ["Two keys hashing to the same index", "Table becoming full", "Deleting a key that doesn't exist", "Hashing a null value"], "correct": 0},
    {"id": 407, "question": "What is the space complexity of a recursive Depth-First Search (DFS) on a tree with depth D?", "options": ["O(1)", "O(D)", "O(n)", "O(log n)"], "correct": 1},
    {"id": 408, "question": "Which of these is a Dynamic Programming problem?", "options": ["Binary Search", "Fibonacci Sequence", "Linear Search", "Selection Sort"], "correct": 1}
]

QUESTION_BANK = {
    "Data Scientist": DATA_SCIENCE_QUESTIONS + DSA_QUESTIONS[:3],
    "Frontend Developer": FRONTEND_QUESTIONS + DSA_QUESTIONS[:3],
    "Backend Developer": BACKEND_QUESTIONS + DSA_QUESTIONS,
    "Full-Stack Developer": FRONTEND_QUESTIONS + BACKEND_QUESTIONS + DSA_QUESTIONS,
    "AI/ML Engineer": DATA_SCIENCE_QUESTIONS + DSA_QUESTIONS,
}

def get_questions_for_role(role: str):
    return QUESTION_BANK.get(role, FRONTEND_QUESTIONS + BACKEND_QUESTIONS + DATA_SCIENCE_QUESTIONS + DSA_QUESTIONS)

# --- Schemas ---

class SubmitRequest(BaseModel):
    role: str
    answers: Dict[str, int]

# --- Endpoints ---

@router.get("/{role}")
def get_test(role: str, count: int = 10):
    all_questions = get_questions_for_role(role)
    num_to_pick = min(count, len(all_questions))
    selected_questions = random.sample(all_questions, num_to_pick)
    return [{"id": q["id"], "question": q["question"], "options": q["options"]} for q in selected_questions]

@router.post("/submit")
def submit_test(
    submission: SubmitRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    user_answers = submission.answers
    
    # Global lookup map for all possible questions
    all_qs = FRONTEND_QUESTIONS + BACKEND_QUESTIONS + DATA_SCIENCE_QUESTIONS + DSA_QUESTIONS
    q_lookup = {q["id"]: q for q in all_qs}
    
    score = 0
    total_answered = 0
    for q_id_str, selected_idx in user_answers.items():
        try:
            qid_int = int(q_id_str)
            if qid_int in q_lookup:
                total_answered += 1
                if q_lookup[qid_int]["correct"] == selected_idx:
                    score += 1
        except (ValueError, TypeError):
            continue
                
    total_questions = len(user_answers) if user_answers else 10
    normalized_score = round((score / total_questions) * 10) if total_questions > 0 else 0
    
    # Save as Interview record
    test_record = models.Interview(
        userId=current_user.id,
        role=submission.role,
        difficulty="MCQ Test",
        question=f"MCQ Assessment ({total_questions} questions)",
        answerText=f"Scored {score}/{total_questions}",
        overallScore=normalized_score,
        strengths_str="[]",
        improvements_str="[]",
        dimensions_str="[]"
    )
    
    db.add(test_record)
    db.commit()
    db.refresh(test_record)
    
    return {
        "score": score,
        "total": total_questions,
        "resultId": test_record.id,
        "message": "Test evaluated and saved successfully"
    }
