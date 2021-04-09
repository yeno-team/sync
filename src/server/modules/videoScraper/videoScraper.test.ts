import { VideoScraperModule } from "./videoScraper";
import { IVideoSource } from "./types";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Video Scraper Module", () => {
  const mockSources = {
    MockVideoSource: ({
      hostname: "mock.com",
      execute: jest.fn(),
    } as any) as IVideoSource,
  };

  const scraper = new VideoScraperModule({ sources: mockSources });

  describe("#getVideoSource", () => {
    it('should run execute with the url on the module that matches the hostname for url "https://mock.com"', () => {
      expect.assertions(1);

      return scraper
        .getVideoSource("https://mock.com")
        .then(() =>
          expect(mockSources.MockVideoSource.execute).toHaveBeenCalledWith(
            "https://mock.com"
          )
        );
    });

    it('should reject if the hostname of url "https://nothing.com" does not match any of the sources', () => {
      expect.assertions(1);

      return scraper
        .getVideoSource("https://nothing.com")
        .catch((e) =>
          expect(e).toMatchInlineSnapshot(
            `"Unsupported website was requested!"`
          )
        );
    });
  });
});
