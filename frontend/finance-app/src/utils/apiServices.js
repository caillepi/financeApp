import axios from 'axios'

// Cette fonction prendra en charge la gestion des appels API et la redirection
export async function apiCall(url, params = null, method = 'GET') {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const config = {
      method,
      url: apiBaseUrl + url,
      withCredentials: true,
    };

    // Détermine où mettre les données
    if (method === 'GET') {
      config.params = params;
    } else {
      config.data = params;
    }

    const response = await axios(config);
    const responseData = response?.data;

    if (responseData && typeof responseData === 'object') {
      responseData.status = response?.status;
      return responseData;
    }

    return {
      status: response?.status,
      data: responseData
    };

  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;
    const responseData = data && typeof data === 'object' ? data : {};

    if (status === 401) {
      console.log('Utilisateur non authentifié, redirection vers /login');
      // Redirige éventuellement ici
    } else {
      console.error('Erreur API:', err.message);
      throw err;
    }

    // Ajoute le statut à l'objet d'erreur renvoyé
    responseData.status = status || 500;
    responseData.data = responseData.data ?? data;
    return responseData; // Retourne l'objet d'erreur formaté
  }
}
