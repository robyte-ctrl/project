import { configure, addLayout, CustomLayout, LoggingEvent } from 'log4js';

import type { LogConfig } from './config';

interface JsonLayout extends CustomLayout {
  type: 'json';
  separator: string;
}

function createJsonLayout(layout: JsonLayout): (event: LoggingEvent) => string {
  return function formatLogEvent(event) {
    const {
      categoryName,
      context,
      data,
      level,
      pid,
      startTime,
      cluster,
    } = event;

    const output = {
      level: level.levelStr.toLowerCase(),
      category: categoryName,
      time: startTime,
      message: data
        .map(e => typeof e === 'object' ? JSON.stringify(e) : e)
        .join(' | '),
    };

    return `${ JSON.stringify(output) }${ layout.separator }`;
  };
}

export function setupLogger(config: LogConfig): void {
  const { level } = config;

  const layout: JsonLayout = {
    type: 'json',
    separator: '\n',
  };

  addLayout('json', createJsonLayout);

  configure({
    appenders: {
      out: { type: 'stdout', layout },
    },
    categories: {
      default: { appenders: ['out'], level },
    },
  });
}
