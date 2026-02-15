# Eraya Chat Backend

AI chatbot backend for Nepal Travel Assistant powered by **Google Gemini** (FREE!).

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your Gemini API key (FREE - No credit card required!):**
   - Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   - Click **"Create API Key"**
   - Copy your API key immediately

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Gemini API key to `.env`:
     ```
     GEMINI_API_KEY=your-actual-gemini-key-here
     PORT=3000
     ```

4. **Run the server:**
   ```bash
   npm start
   ```

The server will run on `http://localhost:3000`

## API Endpoints

### POST /api/chat
Send a message to the AI travel assistant.

**Request:**
```json
{
  "message": "What are the best trekking routes in Nepal?"
}
```

**Response:**
```json
{
  "reply": "Nepal offers incredible trekking routes! Some of the most popular include..."
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "ai_provider": "Google Gemini",
  "timestamp": "2025-12-23T06:17:00.000Z"
}
```

## Testing

Test the API using curl:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about Everest Base Camp trek"}'
```

## Railway Deployment

1. Push your code to GitHub
2. Connect your repository to Railway
3. Add the `GEMINI_API_KEY` environment variable in Railway dashboard
4. Railway will automatically:
   - Install dependencies
   - Run `npm start`
   - Deploy your backend

No code changes needed for deployment!

## Why Google Gemini?

- ✅ **FREE** for development (60 requests/minute)
- ✅ **No credit card required**
- ✅ **Works perfectly in India**
- ✅ **Powerful AI** (comparable to GPT-3.5/4)
- ✅ **Easy setup** - just one API key!
