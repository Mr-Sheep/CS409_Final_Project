# EventLawnchair

backend deployment guide:

have your mongo config stored in `/etc/secrets/secrets.js`:

```
module.exports = {
  mongo_connection:
    "mongodb+srv://username:password@something.c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true",
};
```
