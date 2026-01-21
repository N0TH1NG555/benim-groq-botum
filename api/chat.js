export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği atabilirsin.' });
    }

    const { mesaj } = req.body;

    if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ error: 'API Key eklenmemiş!' });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "Sen Türkçe konuşan samimi bir asistansın." },
                    { role: "user", content: mesaj }
                ]
            })
        });

        const data = await response.json();
        
        // Eğer Groq hata döndürdüyse
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        return res.status(200).json({ cevap: data.choices[0].message.content });

    } catch (error) {
        return res.status(500).json({ error: 'Sunucu hatası oluştu.' });
    }
}
