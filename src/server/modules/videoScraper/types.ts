export interface IVideoScraper {
     getVideoSource(url: string): Promise<string[]>
}

export interface IVideoSource {
     hostname: string;

     execute(url: string): Promise<string[]>;
}