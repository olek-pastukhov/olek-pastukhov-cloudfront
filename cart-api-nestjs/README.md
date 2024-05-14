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


