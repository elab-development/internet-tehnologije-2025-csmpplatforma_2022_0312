const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6c6e995206185c", 
    pass: "80c2edb5a32cfd" 
  }
});

/**
 * Funkcija za slanje pozdravnog mejla studentu ili nastavniku
 * @param {string} userEmail - Adresa na koju se šalje
 * @param {string} userName - Ime korisnika koje će pisati u mejlu
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const info = await transporter.sendMail({
      from: '"CSMP Platforma" <info@csmp.com>', 
      to: userEmail,
      subject: "Vaš nalog je kreiran - CSMP Platforma",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
            <h1>Dobrodošli!</h1>
          </div>
          <div style="padding: 20px; color: #333; line-height: 1.6;">
            <p>Poštovani/a <strong>${userName}</strong>,</p>
            <p>Administrator vam je upravo kreirao nalog na <strong>CSMP Platformi</strong>.</p>
            <p>Sada se možete ulogovati koristeći svoje korisničko ime i lozinku.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:5173" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Pristupi Platformi</a>
            </div>
          </div>
          <div style="background-color: #f8f9fa; color: #777; padding: 15px; text-align: center; font-size: 12px;">
            <p>Ovo je automatska poruka, molimo ne odgovarajte na nju.</p>
          </div>
        </div>
      `
    });

    console.log("Email uspešno poslat: %s", info.messageId);
  } catch (error) {
    console.error("Greška prilikom slanja email-a:", error);
  }
};

module.exports = { sendWelcomeEmail };