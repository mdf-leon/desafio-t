import { ConfigService } from '@nestjs/config';

export function formatError(
  configService: ConfigService,
  message: string,
  error?: { message?: string; stack?: string },
): { failed: string; error?: { message?: string; stack?: string } } {
  if (configService.get<string>('NODE_ENV') !== 'production') {
    return {
      failed: message,
      error: {
        message: error?.message,
        stack: error?.stack,
      },
    };
  } else {
    return {
      failed: message,
    };
  }
}
