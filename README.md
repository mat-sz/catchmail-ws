# catchmail-ws

WebSockets server for [catchmail-web](https://github.com/mat-sz/catchmail-web).

More details about the project are available in the [catchmail-web](https://github.com/mat-sz/catchmail-web) repository.

**Check other TypeScript e-mail projects:**

| Rendering (React.js)                                   | Rendering (Vue.js)                                 | Parser                                                 | Inbound SMTP                                   |
| ------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------- |
| [react-letter](https://github.com/mat-sz/react-letter) | [vue-letter](https://github.com/mat-sz/vue-letter) | [letterparser](https://github.com/mat-sz/letterparser) | [microMTA](https://github.com/mat-sz/microMTA) |

## Installation

Run `yarn install`, `yarn build` and then simply run `yarn start`. For development you can also run catchmail-ws with live reload, `yarn dev`. A permission to use port 25 is required (running as superuser is not recommended though, an alternative is to use Docker or authbind/setcap).

## Configuration

`dotenv-flow` is used to manage the configuration.

The following variables are used for the configuration:

| Variable      | Default value | Description                                                                      |
| ------------- | ------------- | -------------------------------------------------------------------------------- |
| `WS_HOST`     | `127.0.0.1`   | IP address to bind to (WebSockets).                                              |
| `WS_PORT`     | `5000`        | Port to bind to (WebSockets).                                                    |
| `AUTH_MODE`   | `none`        | Set to `secret` if you'd like to protect your instance with a secret.            |
| `AUTH_SECRET` | undefined     | Authentication secret for `AUTH_MODE=secret`.                                    |
| `LOG_MODE`    | `none`        | Set to `file` if you'd like to save all incoming messages.                       |
| `CACHE_SIZE`  | `0`           | Set to any number above 0 to allow message caching and replaying to new clients. |
