const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `You are an expert technical recruiter. Carefully read the FULL resume and cross-reference it against the job description before generating the report.

Job Description:
${jobDescription}

Resume (extracted text):
${resume}

Self Description:
${selfDescription}

CRITICAL RULES:
- matchScore: Give an honest score 0-100. Read the resume carefully first.
  * 80-100: Candidate meets most required AND preferred skills
  * 60-79: Meets core requirements but lacks some preferred skills
  * 40-59: Meets some requirements but has notable gaps
  * 0-39: Lacks several core required skills
- skillGaps: ONLY list skills that are genuinely absent from the resume. If the resume mentions a skill, it is NOT a gap. Read the resume fully before listing gaps.
- technicalQuestions: Generate 4-5 questions relevant to the JD and the candidate's background
- behavioralQuestions: Generate 2-3 questions relevant to the role
- preparationPlan: Create a 5-day plan focusing on the actual gaps identified

Return ONLY a valid JSON object with exactly this structure:
{
  "matchScore": <number between 0 and 100>,
  "title": "<job title from the JD>",
  "technicalQuestions": [
    {
      "question": "<question string>",
      "intention": "<why interviewer asks this>",
      "answer": "<how to answer, what points to cover>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<question string>",
      "intention": "<why interviewer asks this>",
      "answer": "<how to answer using STAR method>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<skill name>",
      "severity": "<high or medium or low>"
    }
  ],
  "preparationPlan": [
    {
      "day": <day number starting from 1>,
      "focus": "<main topic for the day>",
      "tasks": ["<task 1>", "<task 2>"]
    }
  ]
}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { generateInterviewReport };
