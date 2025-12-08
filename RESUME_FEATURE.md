# 📄 Resume-Based Interview Feature

## ✅ Feature Complete!

### What's New:

**Resume Upload & Personalized Questions**
- Upload your resume (PDF format)
- AI generates questions based on YOUR experience
- Questions are personalized to your skills and projects
- Drag & drop or click to upload
- Max 5MB file size

### How It Works:

1. **Upload Resume**
   - Go to Mock Interview page
   - See "Upload Resume (Optional)" section
   - Drag & drop PDF or click to browse
   - Resume is automatically processed

2. **AI Analyzes Resume**
   - Backend extracts text from PDF
   - Sends to Perplexity AI
   - AI reads your experience, skills, projects
   - Generates personalized questions

3. **Get Personalized Questions**
   - Questions reference YOUR specific experience
   - Tailored to YOUR skill level
   - Based on YOUR projects and achievements
   - Much more relevant than generic questions

### Features:

✅ **Drag & Drop Upload**
- Beautiful UI with drag & drop
- Visual feedback on hover
- Shows file name and size
- Easy remove button

✅ **PDF Text Extraction**
- Automatic text extraction from PDF
- Handles multi-page resumes
- Cleans and formats text
- Limits to 2000 characters for API efficiency

✅ **Smart Question Generation**
- AI analyzes resume content
- Generates role-specific questions
- Personalizes based on experience
- Falls back to regular questions if needed

✅ **Seamless Integration**
- Works with existing interview flow
- Optional feature (can skip)
- No changes to submit/evaluate flow
- Same beautiful UI

### Technical Details:

**Frontend:**
- Resume upload UI in MockInterview.jsx
- Drag & drop support
- File validation (PDF only, max 5MB)
- Visual feedback and status

**Backend:**
- pdf-parse library for text extraction
- multer for file upload handling
- Perplexity AI for resume analysis
- New endpoint: /interview/extract-resume

**AI Integration:**
- New function: generateResumeBasedQuestion()
- Sends resume context to AI
- AI generates personalized questions
- Fallback to regular questions if fails

### Example Flow:

**Without Resume:**
```
Question: "Explain the concept of React Hooks."
```

**With Resume (if you have React experience):**
```
Question: "I see you built a React dashboard with hooks. 
Can you explain how you used useEffect for data fetching 
and what challenges you faced with dependency arrays?"
```

### Files Modified:

**Frontend:**
- `frontend/src/pages/MockInterview.jsx`
  - Added resume state
  - Added upload UI
  - Added handleResumeUpload function
  - Updated handleGenerate to send resume context

**Backend:**
- `backend/controllers/interviewController.js`
  - Added extractResume function
  - Updated generateInterviewQuestion for resume context
  - Added multer configuration
  - Exported new functions

- `backend/utils/ai.js`
  - Added generateResumeBasedQuestion function
  - Handles resume-based question generation
  - Truncates long resumes

- `backend/routes/interviewRoutes.js`
  - Added /extract-resume route
  - Added upload middleware

**Dependencies:**
- `pdf-parse` - Extract text from PDF
- `multer` - Handle file uploads

### Usage:

1. **Start Interview**
   - Select role (e.g., Frontend Developer)
   - Upload resume (optional)
   - Select difficulty
   - Click "Start Interview Session"

2. **With Resume:**
   - Questions will be personalized
   - References your specific experience
   - More relevant and challenging

3. **Without Resume:**
   - Generic questions for the role
   - Still high quality
   - Works perfectly fine

### Benefits:

**For Candidates:**
- More realistic interview experience
- Questions match your background
- Better preparation for real interviews
- Identifies gaps in your experience

**For Practice:**
- Tailored difficulty
- Relevant to your skills
- Helps improve specific areas
- More engaging experience

### Security:

✅ Resume is processed in memory
✅ Not permanently stored
✅ Only text is extracted
✅ Protected by authentication
✅ 5MB file size limit
✅ PDF format only

### Future Enhancements:

- Support for DOCX format
- Resume storage for multiple sessions
- Resume analysis report
- Skill gap identification
- Project-specific questions

---

**Now your interviews are truly personalized! 🎯**
