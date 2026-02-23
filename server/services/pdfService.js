const axios = require('axios');

const generateProjectPDF = async (naziv, opis, studentIme) => {
    
    const apiKey = 'sk_e6723288008b1857b46c8338ddacfd43f5906f6f'; 
    
    const htmlContent = `
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 50px; color: #2d3748; }
                    .header { border-bottom: 2px solid #3182ce; padding-bottom: 10px; margin-bottom: 20px; }
                    h1 { color: #3182ce; margin: 0; }
                    .info { font-size: 14px; color: #718096; margin-bottom: 30px; }
                    .content { line-height: 1.6; }
                    h3 { color: #4a5568; border-left: 4px solid #3182ce; padding-left: 10px; }
                    .footer { margin-top: 50px; font-size: 12px; color: #a0aec0; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Dokumentacija Projekta: ${naziv}</h1>
                    <p>CSMP Platforma - Zvanični izveštaj</p>
                </div>
                
                <div class="info">
                    <p><strong>Student:</strong> ${studentIme}</p>
                    <p><strong>Datum generisanja:</strong> ${new Date().toLocaleDateString('sr-RS')}</p>
                </div>
                
                <div class="content">
                    <h3>Opis i detalji rada:</h3>
                    <p>${opis}</p>
                </div>

                <div class="footer">
                    
                </div>
            </body>
        </html>
    `;

    try {
        const response = await axios.post('https://api.pdfshift.io/v3/convert/pdf', 
        {
            source: htmlContent,
            
        }, 
        {
            headers: {
                // Koristimo X-API-Key format koji je PDFShift preporučio u mejlu
                'X-API-Key': apiKey, 
                'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer' 
        });

        console.log("PDF uspešno generisan preko PDFShift servisa.");
        return response.data; 

    } catch (error) {
        console.error("PDFShift Greška Status:", error.response?.status);
        
        if (error.response?.status === 401) {
            console.error("Greška 401: API ključ i dalje nije aktivan ili prepoznat.");
        } else if (error.response?.status === 402) {
            console.error("Greška 402: Ostali ste bez kredita na PDFShift-u.");
        }

        // Bacamo grešku dalje da bi Controller mogao da je obradi
        throw error;
    }
};

module.exports = { generateProjectPDF };

