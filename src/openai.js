const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    organization:"org-ByL6sABigDdpaEdBaalY0AYx",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
export async function sendMsgToOpenAI(message,model){
    
    try {
        const response = await openai.createCompletion({
            model: model,
            prompt: message,
            max_tokens: 1000,
            temperature: 0.5,
        });
        return response.data.choices[0].text
    } catch (error) {
        console.error("Error:", error.message);
    }
    
};
export async function getEngines() {
    try {
        const response = await openai.listEngines();
    
        return response.data.data;
    } catch (error) {
        console.error("Error fetching engines:", error);
        throw error;
    }
}