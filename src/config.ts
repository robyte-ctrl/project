import initConvict, * as convict from 'convict';

export interface LogConfig {
  level: 'debug' | 'error' | 'info';
}

interface Values {
  log: LogConfig;
  port: string;
}

export type Config = convict.Config<Values>;

export function initConfig(): Config {
  const config = initConvict<Values>({
    log: {
      level: {
        format: ['debug', 'info', 'error'],
        default: 'info',
        env: 'LOG_LEVEL',
      },
    },
    port: {
      format: String,
      default: '8080',
      env: 'PORT',
    },
  });

  return config;
}
