# catchmail-ws

WebSockets server for [catchmail-web](https://github.com/mat-sz/catchmail-web).

More details about the project are available in the [catchmail-web](https://github.com/mat-sz/catchmail-web) repository.

## Installation

Run `yarn install`, `yarn build` and then simply run `yarn start`. For development you can also run catchmail-ws with live reload, `yarn dev`. A permission to use port 25 is required (running as superuser is not recommended though, an alternative is to use Docker or authbind/setcap).

## Configuration

`dotenv-flow` is used to manage the configuration.

The following variables are used for the configuration:

| Variable      | Default value | Description                                                           |
| ------------- | ------------- | --------------------------------------------------------------------- |
| `WS_HOST`     | `127.0.0.1`   | IP address to bind to.                                                |
| `WS_PORT`     | `5000`        | Port to bind to.                                                      |
| `AUTH_MODE`   | `none`        | Set to `secret` if you'd like to protect your instance with a secret. |
| `AUTH_SECRET` | undefined     | Authentication secret for `AUTH_MODE=secret`.                         |
| `LOG_MODE`    | `none`        | Set to `file` if you'd like to save all incoming messages.            |
