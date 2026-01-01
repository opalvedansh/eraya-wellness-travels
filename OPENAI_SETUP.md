# OpenAI API Configuration

To enable the AI chatbot functionality, you need to add your OpenAI API key to the environment variables.

## Quick Setup

1. **Get an OpenAI API Key:**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Sign up or log in
   - Navigate to API Keys section
   - Create a new API key and copy it

2. **Add to your environment:**

   Create a `.env` file in the project root (if it doesn't exist) and add:

   ```bash
   # OpenAI Configuration
   OPENAI_API_KEY=your-api-key-here
   OPENAI_MODEL=gpt-4o-mini
   ```

   Replace `your-api-key-here` with your actual OpenAI API key.

3. **Model Options:**
   - `gpt-4o-mini` - Recommended, cost-effective, fast responses
   - `gpt-4o` - More capable, higher quality, higher cost

4. **Restart the server** after adding the environment variables:

   ```bash
   npm run dev
   ```

## Security Notes

- ✅ API key is stored securely on the backend only
- ✅ Never exposed to the frontend/client
- ✅ Rate limiting is enabled on the chat endpoint
- ⚠️ Add `.env` to `.gitignore` to prevent committing secrets

## Testing Without API Key

If you try to use the chatbot without configuring the API key, users will see a friendly error message:
"AI service not properly configured. Please contact support."
