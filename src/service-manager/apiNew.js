import axios from 'axios';
import swal from 'sweetalert';

const instance = axios.create({
    headers:[{"Content-Type" : "application/json"},
             {"Access-Control-Allow-Origin" : "*"},
             {"Access-Control-Allow-Methods" : "DELETE, POST, GET, OPTIONS"},
             {"Access-Control-Allow-Headers" : "Content-Type, Access-Control-Allow-Heade"}
            ]
});

const instanceForm = axios.create({
    headers:{"Content-Type" : "multipart/form-data"}
});



/*const instanceAuth = (token) => {
    const currentToken = token || localStorage.getItem("token")
    return axios.create({
        headers: {"Content-Type" : "application/json", "Authorization": `Bearer ${currentToken}`}
    })
} */

/*const multipartInstanceAuth = (token) => {
    const currentToken = token || localStorage.getItem("token")
    return axios.create({
        headers: {"Content-Type" : "multipart/form-data", "Authorization": `Bearer ${currentToken}`}
    })
}*/

class ApiManager{

    loginUser(path, data){
        return new Promise((resolve, reject) => {
            instance.post(path,data)
                .then(response => {
                    resolve(response.data.token)
                })
                .catch(error => {
                    reject(error)
                }).finally(function () {

                });
        })
    }

    getData(path){
        return new Promise((resolve, reject) => {
            instance.get(path,{timeout: 30000})
                .then(response => {resolve(response)})
                .catch(error => { 
                  resolve(error)
                  swal("Ocurrio un Error", "Existe un problema con el servidor,intentelo otra vez.\n\n" + error, "error");
                 })
                .finally(function () {

                });
            })
    }

    postData(path,data) {
        return new Promise((resolve, reject) => {
            instance.post(path, data,{timeout: 30000})
            .then(response => {resolve(response.data)})
            .catch(
              error => {
                resolve(error)
                swal("Ocurrio un Error", "Existe un problema con el servidor,intentelo otra vez.\n\n" + error, "error");
                })
            .finally(function () {

          });
        })
    }

    postDataForm(path, data) {
      return new Promise((resolve, reject) => {
          instanceForm.post(path, data)
          .then(response => {resolve(response.data)})
          .catch(error => {
              resolve(error)
              swal("Ocurrio un Error", "Existe un problema con el servidor,intentelo otra vez.\n\n" + error, "error");
          })
          .finally(function () {
            
          });
      });
    }
}

export default new ApiManager()

/*async function callApi(endpoint, options = {}) {
  await simulateNetworkLatency();

  options.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const url = BASE_URL + endpoint;
  const response = await fetch(url, options);
  const data = await response.json();

  return data;
}


    postPromise(parameters){
        return new Promise((resolve, reject) => {
            instanceAuth(this.token).post(parameters, {})
                .then(response => {resolve(response.data)})
                .catch(error => reject(error.response.data))
        })
    }

const api = {
  badges: {
    list() {
      return callApi('/badges');
    },
    create(badge) {
      return callApi(`/badges`, {
        method: 'POST',
        body: JSON.stringify(badge),
      });
    },
    read(badgeId) {
      return callApi(`/badges/${badgeId}`);
    },
    update(badgeId, updates) {
      return callApi(`/badges/${badgeId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    // Lo hubiera llamado `delete`, pero `delete` es un keyword en JavaScript asi que no es buena idea :P
    remove(badgeId) {
      return callApi(`/badges/${badgeId}`, {
        method: 'DELETE',
      });
    },
  },
};

export default api;*/