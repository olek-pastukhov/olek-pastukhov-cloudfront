env.json file should be created in the root directory of the project with the following content:
```json
{
"DB_HOST": "cart-database.c9cqagyeygp8.eu-west-1.rds.amazonaws.com",
"DB_PORT": "5432",
"DB_NAME": "cart_api_data",
"DB_USER": "postgres",
"DB_PASSWORD": "******************"
}
```

### Installation

```bash
$ npm install
```

### Deployment

```bash
$ npm run cloudfront:setup
```

Endpoint:  https://oyujdq1hui.execute-api.eu-west-1.amazonaws.com/dev

### Testing the DB API is any available sandbox tool. i.e. https://codepen.io

```javascript
console.clear();

const userId = '899c6255-3ad0-4454-b7ce-b7749d791f43';
const url = `https://oyujdq1hui.execute-api.eu-west-1.amazonaws.com/dev/profile/cart?userId=${userId}`;

const headers = {
    'Content-Type': 'application/json'
};

const updateCartData = {
    product_id: crypto.randomUUID(),
    count: Math.floor(Math.random() * 100)
};

const handleResponse = async (response) => {
    try {
        const data = await response.json();
        console.info(data);
    } catch (error) {
        console.error(error);
    }
};

const handleError = (error) => {
    console.error(error);
};

const fetchUserData = async () => {
    try {
        const response = await fetch(url);
        await handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

const updateUserCart = async () => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updateCartData)
        });
        await handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

const deleteUserCart = async () => {
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });
        await handleResponse(response);
    } catch (error) {
        handleError(error);
    }
};

(async () => {
    await fetchUserData();
    await updateUserCart();
    await deleteUserCart();
})();
```


