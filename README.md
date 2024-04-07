# NKOSL Counter App

## Running
The application uses NodeJS, Redis, and Postgres.

To run the application:

```sh
npm ic
npm start
```

## Docker

A dockerfile is provided for the application.

A sample `docker-compose.yaml` is also provided to start the application.

To run the application with docker-compose:

1. Copy the `.env.example` file to `.env` and change the required values.
2. Edit the `docker-compose.override.yaml` file to expose the ports and change whatever you need to do.
3. Run the following command:
    ```sh
    docker compose up --build
    ```

## Usage

The application is a simple counter app.
You can add counters and increment them.

There are 4 endpoints:

- `GET /` - Get list of all counters
  - Response:
    ```json
    {
      "counters": [
        {
          "name": "a-counter",
          "count": 1
        },
        {
          "name": "another-counter",
          "count": 42
        }
      ]
    }
    ```
- `POST /` - Add a new counter
  - Request:
    - Content-Type: application/json
    - Body: 
          ```json
          {
            "name": "a-name-for-the-counter",
          }
          ```
  - Response:
    ```json
    {
      "name": "a-name-for-the-counter",
      "count": 0
    }
    ```
- `GET /:name` - Get a specific counter by name
  - Response:
    ```json
    {
      "name": "a-name-for-the-counter",
      "count": 1
    }
    ```
- `POST /:name` - Increment a specific counter by name
  - Request: 
    - No body is required
  - Response:
    ```json
    {
      "name": "a-name-for-the-counter",
      "count": 2
    }
    ```

All error responses are of format:
```json
{
  "error": "a-name-for-the-counter already exists"
}
```

All requests contain special headers:
- `X-Request-Count` - Total request count for that instance. All requests are counted.
- `X-Request-Id` - A unique request id for that instance. Will be reflected in the logs.
- `X-Instance-Id` - A unique instance id generated at boot. Will be reflected in the logs.

### Example usage

##### GET /
```sh
curl -sL -v http://$APPLICATION_INSTANCE/
```
```
> GET / HTTP/1.1
> Host: $APPLICATION_INSTANCE
> User-Agent: curl/8.7.1
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< X-Request-Count: 1
< X-Request-Id: lupv9zmo-24osryu5k
< X-Instance-Id: lupv2g6p-fcci7o683
< Content-Type: application/json; charset=utf-8
< Content-Length: 43
< ETag: W/"2b-AfxlJ6swYwUAObR/CvN8/kq70bs"
< Date: Sun, 07 Apr 2024 18:38:24 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{
  "counters": [
    {
      "name": "a-counter",
      "count": 3
    }
  ]
}
```

##### POST /
```sh
curl -sL -v --header 'content-type: application/json' --data '{"name": "another-counter"}' http://$APPLICATION_INSTANCE/
```
```
> POST / HTTP/1.1
> Host: $APPLICATION_INSTANCE
> User-Agent: curl/8.7.1
> Accept: */*
> content-type: application/json
> Content-Length: 27
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< X-Request-Count: 2
< X-Request-Id: lupvdapb-qhgjgf73p
< X-Instance-Id: lupv2g6p-fcci7o683
< Content-Type: application/json; charset=utf-8
< Content-Length: 36
< ETag: W/"24-ndFGb0aJNAQ3gj7T5CFG/kxRKCk"
< Date: Sun, 07 Apr 2024 18:40:58 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{
  "name": "another-counter",
  "count": 0
}
```
##### POST /another-counter
```sh
curl -sL -v -X POST http://$APPLICATION_INSTANCE/another-counter
```
```
> POST /another-counter HTTP/1.1
> Host: $APPLICATION_INSTANCE
> User-Agent: curl/8.7.1
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< X-Request-Count: 3
< X-Request-Id: lupvfm0j-1mqqf5hgs
< X-Instance-Id: lupv2g6p-fcci7o683
< Content-Type: application/json; charset=utf-8
< Content-Length: 36
< ETag: W/"24-9fUk8d/x2CZDUJFRlVCIyQ/T21I"
< Date: Sun, 07 Apr 2024 18:42:46 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{
  "name": "another-counter",
  "count": 1
}
```

##### GET /another-counter
```sh
curl -sL -v http://$APPLICATION_INSTANCE/another-counter
```
```
> GET /another-counter HTTP/1.1
> Host: $APPLICATION_INSTANCE
> User-Agent: curl/8.7.1
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< X-Request-Count: 4
< X-Request-Id: lupvgrz0-k2hg9mov0
< X-Instance-Id: lupv2g6p-fcci7o683
< Content-Type: application/json; charset=utf-8
< Content-Length: 36
< ETag: W/"24-9fUk8d/x2CZDUJFRlVCIyQ/T21I"
< Date: Sun, 07 Apr 2024 18:43:41 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{
  "name": "another-counter",
  "count": 1
}
```