import {SourceNetworkEnum} from '@utility/domain/enum/source.network.enum';
import {environment} from '@environments/environment';

/**
 * Don't touch the file!
 * The file will be updated at runtime, any static data will be changed after run the project!
 */
export const RuntimeEnvironment: {
  window: typeof window & {
    env: {
      apiUrls: string;
      replaceApiUrls: (json: string) => void;
    };
  };
  apiUrls: {
    [key in keyof typeof SourceNetworkEnum]: string | undefined;
  };
} = {
  window: (window || {}) as any,
  apiUrls: {
    client: undefined,
    identity: undefined,
  },
};

export function initRuntimeEnvironment(): void {
  if ('env' in RuntimeEnvironment.window) {
    if (environment.apiUrls) {
      RuntimeEnvironment.window.env.replaceApiUrls(
        JSON.stringify(environment.apiUrls),
      );
    }

    // Set runtimeEnvironment
    RuntimeEnvironment.apiUrls = JSON.parse(
      RuntimeEnvironment.window.env.apiUrls,
    );
  } else {
    RuntimeEnvironment.apiUrls =
      environment.apiUrls ?? RuntimeEnvironment.apiUrls;
  }
}
