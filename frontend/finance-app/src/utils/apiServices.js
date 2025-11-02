import axios from 'axios'

// Cette fonction prendra en charge la gestion des appels API et la redirection
export async function apiCall(url, params = null, method = 'GET') {
  try {
    const config = {
      method,
      url: import.meta.env.VITE_API_URL + url,
      withCredentials: true,
    };

    // Détermine où mettre les données
    if (method === 'GET') {
      config.params = params;
    } else {
      config.data = params;
    }

    const response = await axios(config); 
    response.data.status = response?.status;
    return response.data;

  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data || {};

    if (status === 401) {
      console.log('Utilisateur non authentifié, redirection vers /login');
      // Redirige éventuellement ici
    } else {
      console.error('Erreur API:', data || err.message);
      console.error(err);
    }

    // Ajoute le statut à l'objet d'erreur renvoyé
    data.status = status || 500;
    return data; // Retourne l'objet d'erreur formaté
  }
}
