import {
  fixtureRuntimeServices,
  type RuntimeMode,
  type RuntimeServices,
} from '@/lib/runtime/service-ports';
import { createSandboxApiRuntimeServices } from '@/lib/runtime/sandbox-api-client';

function readRuntimeMode(): RuntimeMode {
  const mode = import.meta.env.VITE_SOPHEX_RUNTIME_MODE;
  return mode === 'api' ? 'api' : 'fixture';
}

export function createRuntimeServices(): RuntimeServices {
  if (readRuntimeMode() === 'api') {
    return createSandboxApiRuntimeServices({
      baseUrl: import.meta.env.VITE_SOPHEX_API_BASE_URL,
    });
  }
  return fixtureRuntimeServices;
}

export const runtimeServices = createRuntimeServices();
