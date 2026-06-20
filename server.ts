import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // In-memory rate limiter to prevent API spam and control NVIDIA token usage safely
  const ipRequests: Record<string, { count: number; firstRequestTime: number }> = {};

  // Periodically clean up old IP logs every 5 minutes to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const key in ipRequests) {
      if (now - ipRequests[key].firstRequestTime > 5 * 60 * 1000) {
        delete ipRequests[key];
      }
    }
  }, 5 * 60 * 1000);

  app.use('/api/', (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const key = `${ip}:${req.path}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1-minute window limit

    // Strict limits: 5 generated planning meals/min, 20 assistant messages/min
    const requestLimit = req.path === '/generate-plan' ? 5 : 20;

    if (!ipRequests[key]) {
      ipRequests[key] = { count: 1, firstRequestTime: now };
      return next();
    }

    const usage = ipRequests[key];
    if (now - usage.firstRequestTime > windowMs) {
      // Reset the window
      usage.count = 1;
      usage.firstRequestTime = now;
      return next();
    }

    usage.count += 1;
    if (usage.count > requestLimit) {
      return res.status(429).json({
        error: "Too many cooking requests! Please let Chef PlanBot catch their breath and try again in 1 minute."
      });
    }

    next();
  });

  app.use(express.json());

  // Safe API key extraction with fallback to the provided token
  function getNvidiaApiKey(): string {
    const key = process.env.NVIDIA_API_KEY || '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';
    return key;
  }

  // Regex JSON cleaner
  function cleanAndParseJSON(text: string) {
    try {
      return JSON.parse(text);
    } catch (e) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (match && match[1]) {
        try {
          return JSON.parse(match[1].trim());
        } catch (innerError) {
          throw new Error("Unable to parse extracted JSON block: " + innerError);
        }
      }
      throw e;
    }
  }

  // Meal planning API
  app.post('/api/generate-plan', async (req, res) => {
    try {
      const { budget, diet, people, time, ingredients } = req.body;

      if (!budget || !diet || !people || !time) {
         return res.status(400).json({ error: "Missing required fields" });
      }

      const apiKey = getNvidiaApiKey();
      const prompt = `
You are an expert, highly precise AI professional chef and meal planner who is extremely budget-friendly. Generate a 1-day meal plan based on the following inputs:
- Budget: INR ₹${budget}
- Diet: ${diet}
- Number of people: ${people}
- Available Cooking Time: ${time} minutes
- Available Ingredients at home: ${ingredients || "None specified"}

Important guidelines:
1. Act like a professional, resource-conscious chef. Create realistic, delicious, budget-friendly meals.
2. Accommodate the dietary preference strictly (Diet: ${diet}).
3. Estimate cost in INR (₹) realistically for ${people} people. Attempt to stay within or under the budget of ₹${budget}.
4. Provide practical, precise substitutions for key ingredients (e.g. "Paneer -> Tofu").
5. Return ONLY a structured, compact JSON block containing exactly these property keys:
{
  "breakfast": "Brief description of breakfast (e.g., Oats Banana Bowl)",
  "lunch": "Brief description of lunch (e.g., Vegetable Pulao)",
  "dinner": "Brief description of dinner (e.g., Paneer Wrap)",
  "groceryList": ["item 1", "item 2", ...],
  "substitutions": ["item -> substitution 1", "item -> substitution 2", ...],
  "estimatedCost": 420,
  "budgetStatus": "Within Budget"
}

The "budgetStatus" value MUST be exactly one of: "Within Budget", "Near Budget", or "Over Budget".
      `;

      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'moonshotai/kimi-k2.6',
          messages: [
            { role: 'system', content: 'You are a professional chef. You always reply in raw JSON format.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 1536
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
         throw new Error(`NVIDIA API response error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const text = result?.choices?.[0]?.message?.content || "";
      const jsonResponse = cleanAndParseJSON(text);

      res.json(jsonResponse);
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Failed to generate plan";
      res.status(500).json({ error: msg });
    }
  });

  // Chatbot Assistant API
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, currentPlan } = req.body;

      if (!messages || !Array.isArray(messages)) {
         return res.status(400).json({ error: "Missing or invalid messages parameter" });
      }

      const apiKey = getNvidiaApiKey();
      
      const systemContext = `You are "Chef PlanBot", a highly precise, budget-friendly professional chef and AI Cooking Assistant for CookPlan AI.
Your character rules:
1. Speak like a veteran professional chef — highly resource-conscious, smart, and budget-friendly.
2. Be precise and concise. Keep your responses compact, direct, and meaningful (avoid wordiness or fluff).
3. Provide rapid, clear step-by-step cooking instructions, ingredient options/substitutions, or money-saving kitchen hacks.
Use brief bold keywords, short bullet lists, and compact numbered steps to keep reading fast.
${currentPlan ? `\nActive Meal Plan context for the current user:\n- Breakfast: ${currentPlan.breakfast}\n- Lunch: ${currentPlan.lunch}\n- Dinner: ${currentPlan.dinner}\n- Grocery List: ${currentPlan.groceryList.join(', ')}\n- Estimated budget: ₹${currentPlan.estimatedCost} / Status: ${currentPlan.budgetStatus}` : ''}`;

      const apiMessages = [
        { role: 'system', content: systemContext },
        ...messages.map((m: any) => ({ role: m.role, content: m.content }))
      ];

      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'moonshotai/kimi-k2.6',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
         const errorText = await response.text();
         throw new Error(`NVIDIA API response error in chat: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const botMessage = result?.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";
      res.json({ message: botMessage });
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Failed to get chatbot response";
      res.status(500).json({ error: msg });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
