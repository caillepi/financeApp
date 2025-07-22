import emailjs from '@emailjs/browser';

export async function handleSendEmail(emailContent) {
    let now = new Date().toISOString();

    emailjs.init({publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY})
    emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,      // service_id
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,     // template_id
        {
            date: now,
            message: emailContent
        }
    ).then((result) => {
      console.log('Email envoyé !', result.text);
      alert("Email envoyé !");
    }, (error) => {
      console.error('Erreur :', error.text);
      alert("Problème lors de l'envoi de l'email : " + error.text);
    });
}