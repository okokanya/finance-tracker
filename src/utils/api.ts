const checkResponse = async (res: Response) => {
    if (res.ok) {
      return res.json();
    }
    const err = await res.json();
    return Promise.reject(err);
  };

  const headersWithContentType: HeadersInit = { "Content-Type": "application/json" };

  const headersWithAuthorizeFn = (): HeadersInit => ({
    "Content-Type": "application/json",
    authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
  });

  interface UserData {
    name: string;
    surname: string;
    email: string;
    password: string;
    [key: string]: any; // Для поддержки дополнительных полей
  }

  export const registerUser = (userData: UserData): Promise<any> => {
    return fetch(`${URL}/signup/`, {
      method: "POST",
      headers: headersWithContentType,
      body: JSON.stringify(userData),
    }).then(checkResponse);
  };

  export const loginUser = (email: string, password: string): Promise<any> => {
    return fetch(`${URL}/signin/`, {
      method: "POST",
      headers: headersWithContentType,
      body: JSON.stringify({ email, password }),
    })
      .then(checkResponse)
      .then((data) => {
        if (data.access_token) {
          sessionStorage.setItem("auth_token", data.access_token);
          return data;
        }
        return Promise.reject("No access token received");
      });
  };
